/**
 * Type definitions for @nadi/meta
 */

export interface TitleProps {
  children: string | (() => string);
}

export interface MetaProps {
  name?: string;
  property?: string;
  content: string | (() => string);
  httpEquiv?: string;
  charset?: string;
}

export interface LinkProps {
  rel: string;
  href: string | (() => string);
  type?: string;
  sizes?: string;
  media?: string;
  as?: string;
  crossorigin?: string;
  hreflang?: string;
}

export interface ScriptProps {
  src?: string;
  async?: boolean;
  defer?: boolean;
  type?: string;
  crossorigin?: string;
  integrity?: string;
  children?: string;
}

export interface BaseProps {
  href: string;
  target?: string;
}

export interface StyleProps {
  children: string;
  media?: string;
}

export interface MetaTag {
  type: 'title' | 'meta' | 'link' | 'script' | 'style' | 'base';
  props: any;
  content?: string;
}
