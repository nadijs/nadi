/**
 * Hydration utilities for client-side activation of SSR content
 */

import { effect, batch } from './reactive/signals';
import { jsx as clientJsx } from './jsx-runtime';

interface HydrationNode {
  id: number;
  type: string;
  props: any;
}

/**
 * Hydrate server-rendered content with reactivity
 */
export function hydrate(component: () => any, container: HTMLElement | null): () => void {
  if (!container) {
    throw new Error('Container element not found');
  }

  // Get hydration data from server
  const hydrationData = ((window as any).__NADI_HYDRATION__ as HydrationNode[]) || [];

  // Map of hydration markers to reactive expressions
  const hydrationMap = new Map<number, () => any>();

  // Find and replace hydration markers
  const processNode = (node: Node) => {
    if (node.nodeType === Node.COMMENT_NODE) {
      const comment = node as Comment;
      const match = comment.data.match(/^h-(\d+)$/);

      if (match) {
        const id = parseInt(match[1], 10);
        const endMarker = findEndMarker(node, id);

        if (endMarker) {
          // Create text node for reactive content
          const textNode = document.createTextNode('');
          node.parentNode?.insertBefore(textNode, node);

          // Register effect to update text node
          const hydrationNode = hydrationData.find((h) => h.id === id);
          if (hydrationNode) {
            // Store for later activation
            hydrationMap.set(id, () => {
              // This will be replaced with actual reactive expression during hydration
              return '';
            });
          }
        }
      }
    }

    // Process children
    const children = Array.from(node.childNodes);
    children.forEach(processNode);
  };

  // Find end marker for hydration block
  const findEndMarker = (startNode: Node, id: number): Comment | null => {
    let current: Node | null = startNode.nextSibling;

    while (current) {
      if (current.nodeType === Node.COMMENT_NODE) {
        const comment = current as Comment;
        if (comment.data === `/h-${id}`) {
          return comment;
        }
      }
      current = current.nextSibling;
    }

    return null;
  };

  // Process the container
  processNode(container);

  // Render the component with effects
  let dispose: (() => void) | undefined;

  batch(() => {
    const result = component();

    if (result instanceof Node) {
      // Replace container content while preserving hydrated nodes
      const fragment = document.createDocumentFragment();
      fragment.appendChild(result);

      // Merge with existing content (simplified - real implementation would be more sophisticated)
      container.innerHTML = '';
      container.appendChild(fragment);
    }
  });

  return () => {
    if (dispose) {
      dispose();
    }
  };
}

/**
 * Check if we're in a browser environment with hydration data
 */
export function isHydrating(): boolean {
  return typeof window !== 'undefined' && '__NADI_HYDRATION__' in window;
}

/**
 * Clear hydration data after hydration is complete
 */
export function clearHydrationData(): void {
  if (typeof window !== 'undefined') {
    delete (window as any).__NADI_HYDRATION__;
  }
}
