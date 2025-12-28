/**
 * Nuxt module for Nadi framework
 */

import { defineNuxtModule, addVitePlugin } from '@nuxt/kit';
import { compile } from '@nadi.js/compiler';
import type { Plugin } from 'vite';

export interface ModuleOptions {
  include?: RegExp | string[];
  exclude?: RegExp | string[];
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@nadi/adapter-nuxt',
    configKey: 'nadi',
    compatibility: {
      nuxt: '^3.0.0',
    },
  },
  defaults: {
    include: /\.nadi$/,
    exclude: /node_modules/,
  },
  setup(options, nuxt) {
    // Add Vite plugin for .nadi files
    addVitePlugin(nadiPlugin(options));

    // Auto-import Nadi composables
    nuxt.options.imports = {
      ...nuxt.options.imports,
      imports: [
        {
          from: '@nadi.js/core',
          name: 'signal',
        },
        {
          from: '@nadi.js/core',
          name: 'computed',
        },
        {
          from: '@nadi.js/core',
          name: 'effect',
        },
        {
          from: '@nadi.js/core',
          name: 'batch',
        },
      ],
    };
  },
});

function nadiPlugin(options: ModuleOptions): Plugin {
  return {
    name: 'vite-plugin-nadi-nuxt',
    enforce: 'pre',

    transform(code, id) {
      const include = options.include || /\.nadi$/;
      const exclude = options.exclude || /node_modules/;

      if (exclude instanceof RegExp && exclude.test(id)) {
        return null;
      }

      if (include instanceof RegExp && !include.test(id)) {
        return null;
      }

      try {
        const result = compile(code, {
          filename: id,
          ssr: this.environment?.name === 'ssr',
        });

        if (result.errors.length > 0) {
          this.error(result.errors[0].message);
          return null;
        }

        return {
          code: result.code,
          map: result.map,
        };
      } catch (error: any) {
        this.error(error.message);
        return null;
      }
    },
  };
}
