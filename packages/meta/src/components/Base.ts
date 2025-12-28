/**
 * Base component - Sets base URL for relative links
 */

import { onCleanup } from '@nadi.js/core';
import { addMetaTag, isServerEnvironment } from '../context';
import type { BaseProps } from '../types';

export function Base(props: BaseProps) {
  if (isServerEnvironment()) {
    // SSR: Collect for later serialization
    const baseProps: any = { href: props.href };
    if (props.target) baseProps.target = props.target;

    addMetaTag({
      type: 'base',
      props: baseProps,
    });
  } else {
    // Client: Add base tag to document.head
    const base = document.createElement('base');

    base.href = props.href;
    if (props.target) base.target = props.target;

    document.head.appendChild(base);

    onCleanup(() => {
      document.head.removeChild(base);
    });
  }

  return null;
}
