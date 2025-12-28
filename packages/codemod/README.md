# Nadi Codemod

Automated migration tools for converting components from other frameworks to Nadi.

## Installation

```bash
npm install -g @nadi/codemod
```

## Usage

### Vue to Nadi

```bash
npx @nadi/codemod vue-to-nadi src/**/*.vue
```

### React to Nadi

```bash
npx @nadi/codemod react-to-nadi src/**/*.{jsx,tsx}
```

### Svelte to Nadi

```bash
npx @nadi/codemod svelte-to-nadi src/**/*.svelte
```

## Options

```bash
npx @nadi/codemod [command] [glob] [options]

Options:
  --dry-run          Preview changes without writing
  --force            Overwrite existing .nadi files
  --typescript       Generate TypeScript
  --keep-original    Keep original files after conversion
```

## Example

```bash
# Dry run to see changes
npx @nadi/codemod vue-to-nadi src/Counter.vue --dry-run

# Actually convert
npx @nadi/codemod vue-to-nadi src/Counter.vue

# Convert all components
npx @nadi/codemod vue-to-nadi "src/**/*.vue" --typescript
```

## Transformations

### Vue → Nadi

- `ref()` → `signal()`
- `computed()` → `computed()` (no change)
- `watch()` → `effect()`
- `<template>` → JSX
- `@event` → `onEvent`
- `v-if` → `<Show>`
- `v-for` → `<For>` or `.map()`

### React → Nadi

- `useState()` → `signal()`
- `useMemo()` → `computed()`
- `useEffect()` → `effect()` (removes deps array)
- `useCallback()` → removed (not needed)
- JSX → JSX (minimal changes)

### Svelte → Nadi

- `let x = 0` → `signal(0)`
- `$: y = x * 2` → `computed(() => x() * 2)`
- `$: { ... }` → `effect(() => { ... })`
- `{#if}` → `<Show>`
- `{#each}` → `<For>`

## API

```typescript
import { migrate } from '@nadi/codemod';

migrate('src/Counter.vue', {
  from: 'vue',
  to: 'nadi',
  typescript: true,
  dryRun: false,
});
```

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md)

## License

MIT
