import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/jsx-runtime.ts', 'src/jsx-dev-runtime.ts', 'src/jsx-ssr-runtime.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  minify: true,
  splitting: false,
  treeshake: {
    preset: 'smallest',
    propertyReadSideEffects: false,
  },
  sourcemap: true,
  target: 'es2022',
  esbuildOptions(options) {
    options.mangleProps = /^_/;
    options.pure = ['console.log'];
  },
});
