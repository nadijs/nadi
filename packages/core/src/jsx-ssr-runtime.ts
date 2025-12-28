/**
 * JSX SSR Runtime for Nadi - Server-side rendering without Virtual DOM
 * Converts JSX to HTML strings with hydration markers
 */

import type { JSX } from './jsx-types';

// Hydration marker counter
let hydrationId = 0;

// Track components that need hydration
const hydrationData: Array<{
  id: number;
  type: string;
  props: any;
}> = [];

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (char) => map[char as keyof typeof map] || char);
}

/**
 * Serialize props to HTML attributes
 */
function propsToAttributes(props: Record<string, any>): string {
  const attrs: string[] = [];

  for (const [key, value] of Object.entries(props)) {
    if (key === 'children' || key === 'key' || key === 'ref') continue;

    // Handle event handlers (skip on server)
    if (key.startsWith('on')) continue;

    // Handle className
    if (key === 'className') {
      attrs.push(`class="${escapeHtml(String(value))}"`);
      continue;
    }

    // Handle style object
    if (key === 'style' && typeof value === 'object') {
      const styleString = Object.entries(value)
        .map(([k, v]) => {
          const cssKey = k.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
          return `${cssKey}:${v}`;
        })
        .join(';');
      attrs.push(`style="${escapeHtml(styleString)}"`);
      continue;
    }

    // Handle boolean attributes
    if (typeof value === 'boolean') {
      if (value) {
        attrs.push(key);
      }
      continue;
    }

    // Handle regular attributes
    if (value != null) {
      attrs.push(`${key}="${escapeHtml(String(value))}"`);
    }
  }

  return attrs.length > 0 ? ' ' + attrs.join(' ') : '';
}

/**
 * Render children to string
 */
function renderChildren(children: any): string {
  if (children == null || children === false || children === true) {
    return '';
  }

  if (Array.isArray(children)) {
    return children.map(renderChildren).join('');
  }

  if (typeof children === 'function') {
    // Reactive expression - mark for hydration
    const id = hydrationId++;
    hydrationData.push({ id, type: 'reactive', props: {} });
    return `<!--h-${id}--><!--/h-${id}-->`;
  }

  if (typeof children === 'object' && children.type) {
    return renderToString(children);
  }

  return escapeHtml(String(children));
}

/**
 * JSX factory for SSR
 */
export function jsx(type: any, props: any): JSX.Element | string {
  const { children, ...restProps } = props || {};

  // Handle fragments
  if (type === Fragment) {
    if (Array.isArray(children)) {
      return children.map(renderChildren).join('');
    }
    return renderChildren(children);
  }

  // Handle function components
  if (typeof type === 'function') {
    const result = type({ ...restProps, children });
    return renderToString(result);
  }

  // Handle intrinsic elements
  const attrs = propsToAttributes(restProps);
  const childrenHtml = renderChildren(children);

  // Self-closing tags
  const voidElements = new Set([
    'area',
    'base',
    'br',
    'col',
    'embed',
    'hr',
    'img',
    'input',
    'link',
    'meta',
    'param',
    'source',
    'track',
    'wbr',
  ]);

  if (voidElements.has(type)) {
    return `<${type}${attrs} />`;
  }

  return `<${type}${attrs}>${childrenHtml}</${type}>`;
}

export const jsxs = jsx;
export const jsxDEV = jsx;

export function Fragment(props: { children?: any }): string {
  return renderChildren(props.children);
}

/**
 * Render a component tree to an HTML string
 */
export function renderToString(component: any): string {
  // Reset hydration tracking
  hydrationId = 0;
  hydrationData.length = 0;

  if (component == null || component === false || component === true) {
    return '';
  }

  if (typeof component === 'string') {
    return component;
  }

  if (typeof component === 'function') {
    const result = component();
    return renderToString(result);
  }

  if (typeof component === 'object' && component.type) {
    return jsx(component.type, component.props) as string;
  }

  return String(component);
}

/**
 * Render to static markup without hydration markers
 * Use for SSG (static site generation)
 */
export function renderToStaticMarkup(component: any): string {
  const html = renderToString(component);
  // Remove hydration markers
  return html.replace(/<!--h-\d+-->|<!--\/h-\d+-->/g, '');
}

/**
 * Get hydration data for client-side hydration
 */
export function getHydrationData(): string {
  return JSON.stringify(hydrationData);
}

/**
 * Create a complete HTML document with hydration script
 */
export function renderToHtml(
  component: any,
  options: {
    title?: string;
    head?: string;
    bodyAttributes?: Record<string, string>;
  } = {}
): string {
  const { title = '', head = '', bodyAttributes = {} } = options;
  const html = renderToString(component);
  const hydrationDataScript = `<script>window.__NADI_HYDRATION__=${getHydrationData()};</script>`;
  const bodyAttrs = propsToAttributes(bodyAttributes);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${title ? `<title>${escapeHtml(title)}</title>` : ''}
  ${head}
</head>
<body${bodyAttrs}>
  <div id="app">${html}</div>
  ${hydrationDataScript}
</body>
</html>`;
}
