/**
 * JSX/Template transformer
 *
 * Transforms JSX templates and injects scope IDs
 */

import type { TransformOptions } from './types';

/**
 * Transform template code (add scope IDs, optimize, etc.)
 */
export function transform(source: string, options: TransformOptions = {}): string {
  let code = source;

  // Add scope ID to elements if needed
  if (options.scopeId) {
    code = injectScopeId(code, options.scopeId);
  }

  return code;
}

/**
 * Inject scope ID into JSX elements
 */
function injectScopeId(source: string, scopeId: string): string {
  // Simple regex-based injection for now
  // In production, would use proper AST transformation

  // Match JSX opening tags and add scope ID attribute
  return source.replace(
    /<(\w+)([^>]*?)>/g,
    (match, tagName, attrs) => {
      // Skip if already has scope ID
      if (attrs.includes(scopeId)) {
        return match;
      }

      // Add scope ID attribute
      return `<${tagName}${attrs} ${scopeId}>`;
    }
  );
}
