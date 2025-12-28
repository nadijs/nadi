/**
 * Next.js plugin for Nadi framework
 */

import { compile } from '@nadi/compiler';
import type { NextConfig } from 'next';

export interface NadiNextOptions {
  include?: RegExp | string[];
  exclude?: RegExp | string[];
}

export function withNadi(nextConfig: NextConfig = {}, options: NadiNextOptions = {}): NextConfig {
  const { include = /\.nadi$/, exclude } = options;

  return {
    ...nextConfig,
    webpack(config: any, context: any) {
      // Add .nadi extension
      config.resolve.extensions.push('.nadi');

      // Add loader for .nadi files
      config.module.rules.push({
        test: include,
        exclude: exclude || /node_modules/,
        use: [
          {
            loader: require.resolve('./loader.js'),
            options: {
              isServer: context.isServer,
              dev: context.dev,
            },
          },
        ],
      });

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, context);
      }

      return config;
    },
  };
}

export default withNadi;
