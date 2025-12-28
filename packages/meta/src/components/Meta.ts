/**
 * Meta component - Adds meta tags to document head
 */

import { effect, onCleanup } from '@nadi.js/core';
import { addMetaTag, isServerEnvironment } from '../context';
import type { MetaProps } from '../types';

export function Meta(props: MetaProps) {
  const getContent = () => {
    return typeof props.content === 'function' ? props.content() : props.content;
  };

  if (isServerEnvironment()) {
    // SSR: Collect for later serialization
    const metaProps: any = {};
    if (props.name) metaProps.name = props.name;
    if (props.property) metaProps.property = props.property;
    if (props.httpEquiv) metaProps['http-equiv'] = props.httpEquiv;
    if (props.charset) metaProps.charset = props.charset;
    metaProps.content = getContent();

    addMetaTag({
      type: 'meta',
      props: metaProps,
    });
  } else {
    // Client: Add meta tag to document.head
    const meta = document.createElement('meta');

    if (props.name) meta.setAttribute('name', props.name);
    if (props.property) meta.setAttribute('property', props.property);
    if (props.httpEquiv) meta.setAttribute('http-equiv', props.httpEquiv);
    if (props.charset) meta.setAttribute('charset', props.charset);

    effect(() => {
      meta.setAttribute('content', getContent());
    });

    document.head.appendChild(meta);

    onCleanup(() => {
      document.head.removeChild(meta);
    });
  }

  return null;
}
