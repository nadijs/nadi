# Nadi Examples

This directory contains example `.nadi` components demonstrating framework features.

## Examples

### Counter.nadi

A simple counter demonstrating:

- Signal-based state management
- Computed values
- Event handlers
- Scoped CSS

### TodoApp.nadi

A todo list application demonstrating:

- List rendering with `<For>`
- Form handling
- Array state updates
- Conditional styling
- Multiple state signals

## Running Examples

These examples are meant to be compiled and integrated into a Laravel project. See the main documentation for setup instructions.

### Quick Test

You can test compilation:

```bash
cd packages/compiler
npm test
```

Or use the compiler directly:

```typescript
import { compile } from '@nadi.js/compiler';
import { readFileSync } from 'fs';

const source = readFileSync('./examples/Counter.nadi', 'utf-8');
const result = compile(source, { filename: 'Counter.nadi' });

console.log(result.code);
```
