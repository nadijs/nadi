/**
 * Link component - Adds link tags to document head
 */

import { effect, onCleanup } from '@nadi/core';
import { addMetaTag, isServerEnvironment } from '../context';
import type { LinkProps } from '../types';

export function Link(props: LinkProps) {
  const getHref = () => {
    return typeof props.href === 'function' ? props.href() : props.href;
  };

  if (isServerEnvironment()) {
    // SSR: Collect for later serialization
    const linkProps: any = { rel: props.rel };
    if (props.type) linkProps.type = props.type;
    if (props.sizes) linkProps.sizes = props.sizes;
    if (props.media) linkProps.media = props.media;
    if (props.as) linkProps.as = props.as;
    if (props.crossorigin !== undefined) linkProps.crossorigin = props.crossorigin;
    if (props.hreflang) linkProps.hreflang = props.hreflang;
    linkProps.href = getHref();

    addMetaTag({
      type: 'link',
      props: linkProps,
    });
  } else {
    // Client: Add link tag to document.head
    const link = document.createElement('link');

    link.setAttribute('rel', props.rel);
    if (props.type) link.setAttribute('type', props.type);
    if (props.sizes) link.setAttribute('sizes', props.sizes);
    if (props.media) link.setAttribute('media', props.media);
    if (props.as) link.setAttribute('as', props.as);
    if (props.crossorigin !== undefined) link.setAttribute('crossorigin', props.crossorigin);
    if (props.hreflang) link.setAttribute('hreflang', props.hreflang);

    effect(() => {
      link.setAttribute('href', getHref());
    });

    document.head.appendChild(link);

    onCleanup(() => {
      document.head.removeChild(link);
    });
  }

  return null;
}
