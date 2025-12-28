/**
 * Main compiler entry point
 */

import { parse } from './parser';
import { transform } from './transform';
import { compileStyleBlock } from './style-compiler';
import type { CompileOptions, CompileResult, SFCDescriptor } from './types';

/**
 * Compile a .nadi file to JavaScript
 */
export function compile(source: string, options: CompileOptions = {}): CompileResult {
  const errors: CompileResult['errors'] = [];
  const warnings: CompileResult['warnings'] = [];

  try {
    // Parse SFC
    const descriptor = parse(source, options.filename);

    // Generate scope ID for scoped styles
    const scopeId = options.scopeId || generateScopeId(options.filename || 'anonymous');

    // Compile template
    const templateCode = descriptor.template
      ? compileTemplate(descriptor.template.content, { scopeId, ...options })
      : 'return null;';

    // Compile script
    const scriptCode = descriptor.script ? compileScript(descriptor.script.content, options) : '';

    // Compile styles
    const stylesCode = descriptor.styles.map((style) => compileStyle(style, scopeId)).join('\n\n');

    // Combine all parts
    const code = generateComponent({
      script: scriptCode,
      template: templateCode,
      styles: stylesCode,
      scopeId,
    });

    return {
      code,
      errors,
      warnings,
    };
  } catch (error) {
    errors.push({
      message: error instanceof Error ? error.message : String(error),
    });

    return {
      code: '',
      errors,
      warnings,
    };
  }
}

/**
 * Compile template block (JSX)
 */
export function compileTemplate(source: string, options: CompileOptions = {}): string {
  // Template is already JSX, just return it with scope ID injection if needed
  if (options.scopeId) {
    return transform(source, {
      scopeId: options.scopeId,
      isProd: options.isProduction ?? undefined,
    });
  }
  return source;
}

/**
 * Compile script block
 */
export function compileScript(source: string, _options: CompileOptions = {}): string {
  // For now, pass through TypeScript/JavaScript as-is
  // In production, this would use Babel to transform
  return source;
}

/**
 * Compile style block
 */
export function compileStyle(block: SFCDescriptor['styles'][0], scopeId: string): string {
  const isScoped = block.attrs.scoped !== undefined;

  if (isScoped) {
    return compileStyleBlock(block.content, scopeId);
  }

  return wrapStyle(block.content);
}

/**
 * Generate component code from compiled parts
 */
function generateComponent(parts: {
  script: string;
  template: string;
  styles: string;
  scopeId: string;
}): string {
  return `
import { jsx, Fragment } from '@nadi/core/jsx-runtime';

${parts.script}

${parts.styles}

export default function Component(props) {
  ${parts.template}
}

Component._scopeId = '${parts.scopeId}';
  `.trim();
}

/**
 * Generate a unique scope ID
 */
function generateScopeId(filename: string): string {
  // Simple hash function for scope ID
  let hash = 0;
  for (let i = 0; i < filename.length; i++) {
    const char = filename.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return `data-v-${Math.abs(hash).toString(36)}`;
}

/**
 * Wrap CSS in a style tag injection
 */
function wrapStyle(css: string): string {
  return `
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = ${JSON.stringify(css)};
  document.head.appendChild(style);
}
  `.trim();
}
