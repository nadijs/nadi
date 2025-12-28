# @nadi/compiler

> Single-file component compiler for Nadi framework

## Features

- Parse `.nadi` files into descriptor
- Compile JSX templates to vanilla JavaScript
- Scoped CSS with automatic attribute injection
- TypeScript support in `<script>` blocks
- Source map generation

## Installation

```bash
npm install @nadi/compiler
```

## Usage

### Basic Compilation

```typescript
import { compile } from '@nadi/compiler';

const source = `
<template>
  <div class="hello">
    <h1>{props.message}</h1>
  </div>
</template>

<script lang="ts">
interface Props {
  message: string;
}

export default function Hello(props: Props) {
  return {};
}
</script>

<style scoped>
.hello {
  color: blue;
}
</style>
`;

const result = compile(source, {
  filename: 'Hello.nadi',
  sourceMap: true,
});

console.log(result.code);
```

### Parse Only

```typescript
import { parse } from '@nadi/compiler';

const descriptor = parse(source, 'Hello.nadi');

console.log(descriptor.template?.content);
console.log(descriptor.script?.content);
console.log(descriptor.styles[0]?.content);
```

## API

### `compile(source: string, options?: CompileOptions): CompileResult`

Compiles a `.nadi` file to JavaScript.

### `parse(source: string, filename?: string): SFCDescriptor`

Parses a `.nadi` file into its component parts.

### Types

See [types.ts](./src/types.ts) for full type definitions.

## License

MIT
