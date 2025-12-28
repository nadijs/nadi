/**
 * Style compiler with scoped CSS support
 */

import postcss from 'postcss';
import selectorParser from 'postcss-selector-parser';

/**
 * Compile scoped styles
 */
export function compileStyleBlock(css: string, scopeId: string): string {
  const scopedCss = scopeStyles(css, scopeId);

  return `
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.setAttribute('data-nadi-style', '${scopeId}');
  style.textContent = ${JSON.stringify(scopedCss)};
  document.head.appendChild(style);
}
  `.trim();
}

/**
 * Scope CSS selectors with attribute selector
 */
function scopeStyles(css: string, scopeId: string): string {
  try {
    const result = postcss([scopedPlugin(scopeId)]).process(css, { from: undefined });

    return result.css;
  } catch (error) {
    console.error('Error scoping styles:', error);
    return css;
  }
}

/**
 * PostCSS plugin to scope selectors
 */
function scopedPlugin(scopeId: string) {
  return {
    postcssPlugin: 'nadi-scoped',
    Rule(rule: any) {
      rule.selector = selectorParser((selectors: any) => {
        selectors.each((selector: any) => {
          // Add scope attribute to the last part of each selector
          let lastNode: any;
          selector.each((node: any) => {
            if (node.type !== 'pseudo' && node.type !== 'combinator') {
              lastNode = node;
            }
          });

          if (lastNode) {
            // Insert attribute selector after the last node
            const attribute = selectorParser.attribute({
              attribute: scopeId,
            });

            selector.insertAfter(lastNode, attribute);
          }
        });
      }).processSync(rule.selector);
    },
  };
}

scopedPlugin.postcss = true;
