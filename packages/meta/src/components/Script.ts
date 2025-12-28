/**
 * Script component - Adds script tags to document head
 */

import { onCleanup } from '@nadi/core';
import { addMetaTag, isServerEnvironment } from '../context';
import type { ScriptProps } from '../types';

export function Script(props: ScriptProps) {
  if (isServerEnvironment()) {
    // SSR: Collect for later serialization
    const scriptProps: any = {};
    if (props.src) scriptProps.src = props.src;
    if (props.async) scriptProps.async = true;
    if (props.defer) scriptProps.defer = true;
    if (props.type) scriptProps.type = props.type;
    if (props.crossorigin) scriptProps.crossorigin = props.crossorigin;
    if (props.integrity) scriptProps.integrity = props.integrity;

    addMetaTag({
      type: 'script',
      props: scriptProps,
      content: props.children || '',
    });
  } else {
    // Client: Add script tag to document.head
    const script = document.createElement('script');

    if (props.src) script.src = props.src;
    if (props.async) script.async = true;
    if (props.defer) script.defer = true;
    if (props.type) script.type = props.type;
    if (props.crossorigin) script.crossOrigin = props.crossorigin;
    if (props.integrity) script.integrity = props.integrity;
    if (props.children) script.textContent = props.children;

    document.head.appendChild(script);

    onCleanup(() => {
      document.head.removeChild(script);
    });
  }

  return null;
}
