# Nadi Framework - Setup Guide

## Quick Start

### 1. Install Dependencies

Using pnpm (recommended):
```bash
pnpm install
```

Using npm:
```bash
npm install
```

### 2. Build All Packages

```bash
pnpm build
```

This will build:
- `@nadi/core` - Signals runtime
- `@nadi/compiler` - SFC compiler

### 3. Run Tests

```bash
pnpm test
```

### 4. Development Mode

Start all packages in watch mode:

```bash
pnpm dev
```

## Package Commands

Each package supports these commands:

```bash
# Build for production
pnpm build

# Development watch mode
pnpm dev

# Run tests
pnpm test

# Type checking
pnpm typecheck

# Clean build artifacts
pnpm clean
```

## Workspace Commands

From the root directory:

```bash
# Build all packages
pnpm build

# Test all packages
pnpm test

# Run all packages in dev mode
pnpm dev

# Lint all code
pnpm lint

# Format all code
pnpm format

# Clean all packages
pnpm clean
```

## IDE Setup

### VS Code

Install recommended extensions:
- ESLint
- Prettier
- TypeScript and JavaScript Language Features

Settings are already configured in `.vscode/settings.json`.

### TypeScript

The project uses TypeScript 5.3+ with strict mode enabled. Make sure your IDE is using the workspace TypeScript version.

## Troubleshooting

### Build Errors

If you encounter build errors:

```bash
# Clean everything
pnpm clean
rm -rf node_modules
pnpm install
pnpm build
```

### Test Failures

Make sure all packages are built before running tests:

```bash
pnpm build
pnpm test
```

### Type Errors

Run type checking:

```bash
pnpm typecheck
```

## Next Steps

- Read [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines
- Check out [examples/](./examples/) for usage examples
- Visit the docs (coming soon) for full documentation

## Current Status (v0.1.0)

✅ Completed:
- Core signals runtime (`@nadi/core`)
- SFC compiler (`@nadi/compiler`)
- Monorepo setup with Turbo
- Example components
- Unit tests

🚧 In Progress:
- Laravel integration (`@nadi/laravel`)
- Client router (`@nadi/router`)
- Forms package (`@nadi/forms`)
- Documentation site

📋 Planned:
- Laravel Echo integration (`@nadi/echo`)
- Testing utilities (`@nadi/testing`)
- Official Laravel starter kit
- Interactive playground

## Questions?

Open an issue on GitHub or check [CONTRIBUTING.md](./CONTRIBUTING.md) for more information.
