/**
 * Style component - Adds inline styles to document head
 */

import { onCleanup } from '@nadi/core';
import { addMetaTag, isServerEnvironment } from '../context';
import type { StyleProps } from '../types';

export function Style(props: StyleProps) {
  if (isServerEnvironment()) {
    // SSR: Collect for later serialization
    const styleProps: any = {};
    if (props.media) styleProps.media = props.media;

    addMetaTag({
      type: 'style',
      props: styleProps,
      content: props.children,
    });
  } else {
    // Client: Add style tag to document.head
    const style = document.createElement('style');

    if (props.media) style.media = props.media;
    style.textContent = props.children;

    document.head.appendChild(style);

    onCleanup(() => {
      document.head.removeChild(style);
    });
  }

  return null;
}
