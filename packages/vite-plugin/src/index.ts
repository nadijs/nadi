/**
 * Vite plugin for Nadi framework
 */

import { compile } from '@nadi/compiler';
import type { Plugin } from 'vite';

export interface NadiPluginOptions {
  include?: string | RegExp | Array<string | RegExp>;
  exclude?: string | RegExp | Array<string | RegExp>;
  sourceMap?: boolean;
}

/**
 * Vite plugin for compiling .nadi files
 */
export function nadiPlugin(options: NadiPluginOptions = {}): Plugin {
  const { include = /\.nadi$/, exclude, sourceMap = true } = options;

  return {
    name: 'vite-plugin-nadi',

    // Handle .nadi files
    async transform(code: string, id: string) {
      // Check if file matches include/exclude patterns
      if (!shouldTransform(id, include, exclude)) {
        return null;
      }

      try {
        const result = compile(code, {
          filename: id,
          sourceMap,
          isProduction: process.env.NODE_ENV === 'production',
        });

        if (result.errors.length > 0) {
          const errorMsg = result.errors.map((err) => `${err.message}`).join('\n');
          throw new Error(`Nadi compilation error:\n${errorMsg}`);
        }

        return {
          code: result.code,
          map: result.map,
        };
      } catch (error) {
        this.error(`Failed to compile ${id}: ${error}`);
        return null;
      }
    },

    // Enable HMR for .nadi files
    handleHotUpdate({ file, server }) {
      if (file.endsWith('.nadi')) {
        server.ws.send({
          type: 'full-reload',
          path: '*',
        });
      }
    },
  };
}

/**
 * Check if file should be transformed
 */
function shouldTransform(
  id: string,
  include: string | RegExp | Array<string | RegExp>,
  exclude?: string | RegExp | Array<string | RegExp>
): boolean {
  // Check exclude first
  if (exclude) {
    const excludePatterns = Array.isArray(exclude) ? exclude : [exclude];
    for (const pattern of excludePatterns) {
      if (matches(id, pattern)) {
        return false;
      }
    }
  }

  // Check include
  const includePatterns = Array.isArray(include) ? include : [include];
  for (const pattern of includePatterns) {
    if (matches(id, pattern)) {
      return true;
    }
  }

  return false;
}

/**
 * Check if string matches pattern
 */
function matches(str: string, pattern: string | RegExp): boolean {
  if (typeof pattern === 'string') {
    return str.includes(pattern);
  }
  return pattern.test(str);
}

export default nadiPlugin;
