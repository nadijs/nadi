/**
 * Meta tags context for SSR collection
 */

import type { MetaTag } from './types';

// Global context for SSR
let metaTags: MetaTag[] = [];
let isServer = typeof document === 'undefined';

/**
 * Add a meta tag to the collection (SSR)
 */
export function addMetaTag(tag: MetaTag): void {
  if (isServer) {
    metaTags.push(tag);
  }
}

/**
 * Get collected meta tags (SSR)
 */
export function getMetaTags(): {
  title: string | null;
  meta: string[];
  links: string[];
  scripts: string[];
  styles: string[];
  base: string | null;
} {
  const title = metaTags.find((t) => t.type === 'title');
  const meta = metaTags.filter((t) => t.type === 'meta').map(serializeMetaTag);
  const links = metaTags.filter((t) => t.type === 'link').map(serializeMetaTag);
  const scripts = metaTags.filter((t) => t.type === 'script').map(serializeMetaTag);
  const styles = metaTags.filter((t) => t.type === 'style').map(serializeMetaTag);
  const base = metaTags.find((t) => t.type === 'base');

  return {
    title: title ? String(title.content) : null,
    meta,
    links,
    scripts,
    styles,
    base: base ? serializeMetaTag(base) : null,
  };
}

/**
 * Clear collected meta tags (SSR)
 */
export function clearMetaTags(): void {
  metaTags = [];
}

/**
 * Serialize a meta tag to HTML string
 */
function serializeMetaTag(tag: MetaTag): string {
  const attrs = Object.entries(tag.props)
    .map(([key, value]) => {
      if (value === true) return key;
      if (value === false || value == null) return '';
      return `${key}="${escapeHtml(String(value))}"`;
    })
    .filter(Boolean)
    .join(' ');

  if (tag.type === 'script') {
    const content = tag.content || '';
    return `<script ${attrs}>${content}</script>`;
  }

  if (tag.type === 'style') {
    const content = tag.content || '';
    return `<style ${attrs}>${content}</style>`;
  }

  if (tag.type === 'meta' || tag.type === 'link' || tag.type === 'base') {
    return `<${tag.type} ${attrs}>`;
  }

  return '';
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}

/**
 * Check if running on server
 */
export function isServerEnvironment(): boolean {
  return isServer;
}
