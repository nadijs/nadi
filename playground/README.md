# Nadi Playground

Interactive playground for testing Nadi framework features.

## Getting Started

### 1. Install Dependencies

From the root of the monorepo:

```bash
pnpm install
```

### 2. Build Packages

```bash
pnpm build
```

### 3. Start Playground

```bash
cd playground
pnpm dev
```

Or from the root:

```bash
pnpm playground
```

The playground will open at `http://localhost:3000`

## Features

- ✅ Hot Module Replacement (HMR)
- ✅ TypeScript support
- ✅ Live counter example
- ✅ Reactive state demonstration

## What's Included

- **Counter Example**: Demonstrates signals, computed values, and effects
- **Live HMR**: Changes reflect instantly without page reload
- **Developer Console**: Check the console for framework logs

## Testing Your Own Components

1. Create a new `.nadi` file in the examples folder
2. Import and use it in `src/main.ts`
3. The Vite plugin will automatically compile it

## Next Steps

Once `@nadi/compiler` supports full SFC compilation, you'll be able to:

- Import `.nadi` files directly
- Use `<template>`, `<script>`, `<style>` blocks
- Get full HMR support for component changes

## Troubleshooting

### Port already in use

Change the port in `vite.config.ts`:

```typescript
server: {
  port: 3001, // Change this
}
```

### Build errors

Make sure all packages are built:

```bash
cd ..
pnpm build
```
