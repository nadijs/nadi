/**
 * Title component - Sets document title
 */

import { effect, onCleanup } from '@nadi.js/core';
import { addMetaTag, isServerEnvironment } from '../context';
import type { TitleProps } from '../types';

export function Title(props: TitleProps) {
  const getTitle = () => {
    return typeof props.children === 'function' ? props.children() : props.children;
  };

  if (isServerEnvironment()) {
    // SSR: Collect for later serialization
    addMetaTag({
      type: 'title',
      props: {},
      content: getTitle(),
    });
  } else {
    // Client: Update document.title reactively
    const previousTitle = document.title;

    effect(() => {
      document.title = getTitle();
    });

    onCleanup(() => {
      document.title = previousTitle;
    });
  }

  return null;
}
