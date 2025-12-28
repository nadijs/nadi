# @nadi/vite-plugin

> Vite plugin for Nadi framework

## Installation

```bash
npm install @nadi/vite-plugin
```

## Usage

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import nadi from '@nadi/vite-plugin';

export default defineConfig({
  plugins: [nadi()],
});
```

## Options

```typescript
interface NadiPluginOptions {
  // Files to include (default: /\.nadi$/)
  include?: string | RegExp | Array<string | RegExp>;

  // Files to exclude
  exclude?: string | RegExp | Array<string | RegExp>;

  // Generate source maps (default: true)
  sourceMap?: boolean;
}
```

## Features

- ✅ Compiles `.nadi` files to JavaScript
- ✅ Hot Module Replacement (HMR)
- ✅ Source map support
- ✅ TypeScript support

## License

MIT
