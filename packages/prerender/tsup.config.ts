import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: {
    preset: 'smallest',
    propertyReadSideEffects: false,
  },
  esbuildOptions(options) {
    options.mangleProps = /^_/;
    options.pure = ['console.log'];
  },
  external: ['@nadi.js/core', '@nadi.js/compiler', 'vite'],
});
