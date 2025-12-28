# Nadi.js

<p align="center">
  <img src="https://nadijs.org/logo.svg" alt="Nadi.js" width="200"/>
</p>

<p align="center">
  <strong>Ultra-Lightweight Reactive Framework</strong>
  <br>
  Build blazing-fast web apps with only 3.5KB of JavaScript
</p>

<p align="center">
  <a href="https://nadijs.org"><strong>Documentation</strong></a> ·
  <a href="https://nadijs.org/guide/quick-start"><strong>Quick Start</strong></a> ·
  <a href="https://nadijs.org/examples"><strong>Examples</strong></a> ·
  <a href="https://github.com/nadijs/nadi/discussions"><strong>Discussions</strong></a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@nadi.js/core"><img src="https://img.shields.io/npm/v/@nadi.js/core.svg?label=@nadi.js/core" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/@nadi.js/core"><img src="https://img.shields.io/npm/dm/@nadi.js/core.svg" alt="npm downloads"></a>
  <a href="https://github.com/nadijs/nadi/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="license"></a>
</p>

---

## ⚡ Why Nadi?

Nadi.js is a modern reactive framework that's **85-95% smaller** than React, Vue, or Angular while being **5-10x faster**. Built on fine-grained signals with zero Virtual DOM overhead

Nadi.js is a modern reactive framework that's **85-95% smaller** than React, Vue, or Angular while being **5-10x faster**. Built on fine-grained signals with zero Virtual DOM overhead.

### Key Features

- 🪶 **Ultra Lightweight** - Only 3.5KB gzipped for core runtime
- ⚡ **Lightning Fast** - Fine-grained reactivity, updates only what changed
- 🎯 **Simple & Intuitive** - No complex concepts, just signals and computed values
- 🔥 **Framework Agnostic** - Native adapters for Laravel, Django, Express, Next.js, Nuxt
- 🛠️ **Complete Tooling** - DevTools, testing utilities, forms, routing, UI components, SSR/SSG
- 📦 **Zero Dependencies** - Core packages have no runtime dependencies
- 🔒 **TypeScript First** - Full type safety with JSX templates

## 📦 Packages

This monorepo contains the following packages:

| Package                                  | Version                                                                                                       | Description                                     |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| [@nadi.js/core](./packages/core)         | [![npm](https://img.shields.io/npm/v/@nadi.js/core.svg)](https://www.npmjs.com/package/@nadi.js/core)         | Signals runtime with reactive primitives (~2KB) |
| [@nadi.js/compiler](./packages/compiler) | [![npm](https://img.shields.io/npm/v/@nadi.js/compiler.svg)](https://www.npmjs.com/package/@nadi.js/compiler) | Single-file component compiler                  |
| [@nadi/router](./packages/router)        | [![npm](https://img.shields.io/npm/v/@nadi/router.svg)](https://www.npmjs.com/package/@nadi/router)           | Lightweight client-side router (~1.3KB)         |
| [@nadi/forms](./packages/forms)          | [![npm](https://img.shields.io/npm/v/@nadi/forms.svg)](https://www.npmjs.com/package/@nadi/forms)             | Form validation and state management            |
| [@nadi/meta](./packages/meta)            | [![npm](https://img.shields.io/npm/v/@nadi/meta.svg)](https://www.npmjs.com/package/@nadi/meta)               | SEO and meta tags management                    |
| [@nadi/ui](./packages/ui)                | [![npm](https://img.shields.io/npm/v/@nadi/ui.svg)](https://www.npmjs.com/package/@nadi/ui)                   | Professional UI component library               |
| [@nadi/testing](./packages/testing)      | [![npm](https://img.shields.io/npm/v/@nadi/testing.svg)](https://www.npmjs.com/package/@nadi/testing)         | Testing utilities for Nadi apps                 |
| [create-nadi](./packages/create-nadi)    | [![npm](https://img.shields.io/npm/v/create-nadi.svg)](https://www.npmjs.com/package/create-nadi)             | Project scaffolding CLI                         |

### Backend Adapters

| Package                                             | Description            |
| --------------------------------------------------- | ---------------------- |
| [@nadi/adapter-laravel](./packages/adapter-laravel) | Laravel integration    |
| [@nadi/adapter-django](./packages/adapter-django)   | Django integration     |
| [@nadi/adapter-express](./packages/adapter-express) | Express.js integration |
| [@nadi/adapter-nextjs](./packages/adapter-nextjs)   | Next.js integration    |
| [@nadi/adapter-nuxt](./packages/adapter-nuxt)       | Nuxt integration       |

## 🎯 Quick Start

### Create New Project

```bash
npm create nadi@alpha my-app
cd my-app
npm install
npm run dev
```

### Manual Installation

```bash
npm install @nadi.js/core@alpha @nadi.js/compiler@alpha
```

### Basic Example

```typescript
import { signal, computed } from '@nadi.js/core';

// Create reactive state
const [count, setCount] = signal(0);
const doubled = computed(() => count() * 2);

// Automatic updates - no virtual DOM!
document.getElementById('count').textContent = count();
document.getElementById('doubled').textContent = doubled();

// Update state
setCount(count() + 1); // UI updates automatically
```

### Single-File Component (.nadi)

```html
<!-- Counter.nadi -->
<script lang="ts">
  import { signal, computed } from '@nadi.js/core';
  import { Button } from '@nadi/ui';

  export default function Counter() {
    const [count, setCount] = signal(0);
    const doubled = computed(() => count() * 2);

    return { count, setCount, doubled };
  }
</script>

<template>
  <div class="counter">
    <h1>Count: {count()}</h1>
    <p>Doubled: {doubled()}</p>
    <button variant="primary" onClick="{()" ="">setCount(count() + 1)}> Increment</button>
  </div>
</template>

<style scoped>
  .counter {
    padding: 20px;
    text-align: center;
  }
</style>
```

## 🚀 Features

### Reactivity System

```typescript
import { signal, computed, effect, batch } from '@nadi.js/core';

// Signals - writable reactive values
const [count, setCount] = signal(0);

// Computed - derived reactive values
const doubled = computed(() => count() * 2);

// Effects - side effects that run when dependencies change
effect(() => {
  console.log(`Count: ${count()}, Doubled: ${doubled()}`);
});

// Batch updates for optimal performance
batch(() => {
  setCount(1);
  setCount(2);
  setCount(3); // Only one effect run
});
```

### Routing

```typescript
import { createRouter } from '@nadi/router';

const router = createRouter({
  routes: [
    { path: '/', component: Home },
    { path: '/about', component: About },
    { path: '/users/:id', component: UserProfile },
  ],
});

// Access route params
const userId = router.params.id;
```

### Forms

```typescript
import { useForm } from '@nadi/forms';

const form = useForm({
  initialValues: { email: '', password: '' },
  validate: (values) => ({
    email: !values.email ? 'Required' : undefined,
    password: values.password.length < 8 ? 'Too short' : undefined,
  }),
  onSubmit: async (values) => {
    await api.login(values);
  },
});
```

## 🗂️ Repository Structure

Nadi.js is organized across multiple repositories for better maintainability:

- **[nadijs/nadi](https://github.com/nadijs/nadi)** (this repo) - Core framework packages
- **[nadijs/docs](https://github.com/nadijs/docs)** - Documentation website ([nadijs.org](https://nadijs.org))
- **[nadijs/devtools](https://github.com/nadijs/devtools)** - Browser extension for debugging
- **[nadijs/sample-apps](https://github.com/nadijs/sample-apps)** - Full application examples

See [REPOSITORIES.md](./REPOSITORIES.md) for detailed information.

## 🏗️ Development

### Prerequisites

- Node.js 18+
- pnpm 8+

### Setup

```bash
# Clone repository
git clone https://github.com/nadijs/nadi.git
cd nadi

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Start playground
pnpm playground
```

### Project Structure

```
nadi/
├── packages/          # Core packages
│   ├── core/         # Reactive runtime
│   ├── compiler/     # SFC compiler
│   ├── router/       # Client-side routing
│   ├── forms/        # Form management
│   ├── meta/         # SEO/meta tags
│   ├── ui/           # UI components
│   ├── testing/      # Testing utilities
│   ├── prerender/    # SSR/SSG
│   ├── codemod/      # Migration tools
│   ├── echo/         # WebSocket support
│   ├── vite-plugin/  # Vite integration
│   ├── create-nadi/  # Project scaffolding
│   └── adapter-*/    # Backend adapters
├── examples/         # Simple .nadi examples
└── README.md
```

**Other repositories:**

- **docs** → [nadijs/docs](https://github.com/nadijs/docs)
- **devtools** → [nadijs/devtools](https://github.com/nadijs/devtools)
- **sample-apps** → [nadijs/sample-apps](https://github.com/nadijs/sample-apps)

## 📚 Documentation

Visit **[nadijs.org](https://nadijs.org)** for comprehensive documentation:

- [Getting Started](https://nadijs.org/guide/quick-start)
- [Core Concepts](https://nadijs.org/guide/signals)
- [API Reference](https://nadijs.org/api/core)
- [Examples](https://nadijs.org/examples)
- [Migration Guides](https://nadijs.org/guide/migration)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Ensure tests pass: `pnpm test`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to your fork: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 💬 Community

- [GitHub Discussions](https://github.com/nadijs/nadi/discussions) - Ask questions and share ideas
- [Discord](https://discord.gg/nadijs) - Chat with the community
- [Twitter](https://twitter.com/nadijs) - Follow for updates

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

Copyright (c) 2025 Nadi Framework

---

<p align="center">
  Made with ❤️ by the Nadi.js team
</p>
