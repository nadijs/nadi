/**
 * Parser for .nadi single-file components
 *
 * Parses SFC into descriptor with template, script, and style blocks
 */

import type { SFCDescriptor, SFCBlock } from './types';

const SFC_BLOCK_RE = /<(template|script|style)([^>]*)>([\s\S]*?)<\/\1>/g;
const ATTR_RE = /(\w+)(?:="([^"]*)")?/g;

/**
 * Parse a .nadi file into its component parts
 */
export function parse(source: string, filename = 'anonymous.nadi'): SFCDescriptor {
  const descriptor: SFCDescriptor = {
    filename,
    template: null,
    script: null,
    styles: [],
    customBlocks: [],
  };

  let match: RegExpExecArray | null;

  while ((match = SFC_BLOCK_RE.exec(source)) !== null) {
    const [fullMatch, type, attrsString, content] = match;

    // Skip if required parts are missing
    if (!type || !attrsString || !content) continue;

    const attrs = parseAttrs(attrsString);

    const block: SFCBlock = {
      type,
      content: content.trim(),
      attrs,
      loc: {
        start: getPosition(source, match.index),
        end: getPosition(source, match.index + fullMatch.length),
      },
    };

    if (type === 'template') {
      descriptor.template = block;
    } else if (type === 'script') {
      descriptor.script = block;
    } else if (type === 'style') {
      descriptor.styles.push(block);
    } else {
      descriptor.customBlocks.push(block);
    }
  }

  return descriptor;
}

/**
 * Parse attributes from a tag string
 */
function parseAttrs(attrsString: string): Record<string, string | true> {
  const attrs: Record<string, string | true> = {};
  let match: RegExpExecArray | null;

  while ((match = ATTR_RE.exec(attrsString)) !== null) {
    const [, name, value] = match;
    if (name) {
      attrs[name] = value !== undefined ? value : true;
    }
  }

  return attrs;
}

/**
 * Get line and column from index
 */
function getPosition(source: string, index: number): { line: number; column: number } {
  const lines = source.slice(0, index).split('\n');
  return {
    line: lines.length,
    column: lines[lines.length - 1]?.length ?? 0,
  };
}
