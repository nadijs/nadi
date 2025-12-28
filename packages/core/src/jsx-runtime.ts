/**
 * JSX Runtime for Nadi
 *
 * Provides JSX transformation functions for TypeScript
 */

export type { JSX } from './jsx-types';

type Props = Record<string, any> & { children?: any };

/**
 * Creates a DOM element from JSX
 */
export function jsx(type: string | Function, props: Props, _key?: string): any {
  // Handle component functions
  if (typeof type === 'function') {
    return type(props);
  }

  // Handle intrinsic elements (DOM nodes)
  const element = document.createElement(type);

  // Apply props
  Object.entries(props).forEach(([name, value]) => {
    if (name === 'children') {
      // Handle children separately
      return;
    }

    if (name.startsWith('on') && typeof value === 'function') {
      // Event handlers
      const eventName = name.substring(2).toLowerCase();
      element.addEventListener(eventName, value);
    } else if (name === 'className' || name === 'class') {
      element.className = value;
    } else if (name === 'style' && typeof value === 'object') {
      Object.assign(element.style, value);
    } else if (name === 'ref' && typeof value === 'function') {
      value(element);
    } else if (typeof value !== 'function') {
      element.setAttribute(name, value);
    }
  });

  // Append children
  if (props.children) {
    appendChildren(element, props.children);
  }

  return element;
}

/**
 * JSX fragment
 */
export function Fragment(props: { children?: any }): any {
  return props.children;
}

/**
 * Helper to append children to a DOM node
 */
function appendChildren(parent: HTMLElement, children: any): void {
  if (Array.isArray(children)) {
    children.forEach((child) => appendChild(parent, child));
  } else {
    appendChild(parent, children);
  }
}

function appendChild(parent: HTMLElement, child: any): void {
  if (child == null || child === false || child === true) {
    return;
  }

  if (typeof child === 'string' || typeof child === 'number') {
    parent.appendChild(document.createTextNode(String(child)));
  } else if (child instanceof Node) {
    parent.appendChild(child);
  } else if (typeof child === 'function') {
    // Reactive expression
    const textNode = document.createTextNode('');
    parent.appendChild(textNode);

    // Import effect dynamically to avoid circular dependency
    import('./reactive/signals').then(({ effect }) => {
      effect(() => {
        const value = child();
        textNode.textContent = value == null ? '' : String(value);
      });
    });
  }
}

// Export jsxs as alias for jsx (no difference in runtime)
export const jsxs = jsx;
export const jsxDEV = jsx;
