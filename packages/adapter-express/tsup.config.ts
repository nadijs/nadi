import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  target: 'es2022',
  external: ['express', '@nadi.js/core', '@nadi.js/compiler'],
  esbuildOptions(options) {
    options.jsx = 'automatic';
    options.jsxImportSource = '@nadi.js/core';
  },
});
