import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: false, // Temporarily disabled for alpha - will be enabled after workspace deps are published
  clean: true,
  minify: true,
  splitting: false,
  treeshake: true,
  sourcemap: false,
  target: 'es2022',
});
