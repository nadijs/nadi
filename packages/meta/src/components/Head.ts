/**
 * Head component - Container for meta tags
 */

import { onCleanup } from '@nadi/core';

export interface HeadProps {
  children?: any;
}

export function Head(props: HeadProps) {
  // Head is just a container, children handle themselves
  // In client mode, children will manipulate document.head
  // In SSR mode, children will collect meta tags
  return props.children;
}
