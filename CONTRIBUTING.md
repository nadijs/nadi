# Contributing to Nadi

Thank you for your interest in contributing to Nadi! This document provides guidelines and instructions for contributing.

## Development Setup

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 9.0.0 (recommended) or npm >= 9.0.0
- Git

### Getting Started

1. **Clone the repository**

```bash
git clone https://github.com/your-org/nadi.git
cd nadi
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Build all packages**

```bash
pnpm build
```

4. **Run tests**

```bash
pnpm test
```

5. **Start development mode**

```bash
pnpm dev
```

## Project Structure

```
nadi/
├── packages/
│   ├── core/           # Signals runtime (~2KB)
│   ├── compiler/       # .nadi SFC compiler
│   ├── laravel/        # Laravel integration (coming soon)
│   ├── router/         # Client router (coming soon)
│   ├── forms/          # Form utilities (coming soon)
│   ├── echo/           # Laravel Echo (coming soon)
│   └── testing/        # Testing utilities (coming soon)
├── docs/               # Documentation site (coming soon)
├── examples/           # Example .nadi components
└── scripts/            # Build and automation scripts
```

## Development Workflow

### Making Changes

1. **Create a new branch**

```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes**

- Write code following our style guide
- Add tests for new functionality
- Update documentation as needed

3. **Test your changes**

```bash
# Run tests
pnpm test

# Type check
pnpm typecheck

# Lint code
pnpm lint
```

4. **Commit your changes**

We use conventional commits:

```bash
git commit -m "feat(core): add new signal feature"
git commit -m "fix(compiler): resolve scoped CSS issue"
git commit -m "docs: update getting started guide"
```

**Commit types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

5. **Push and create a pull request**

```bash
git push origin feature/your-feature-name
```

Then open a pull request on GitHub.

## Package Development

### Working on @nadi/core

```bash
cd packages/core
pnpm dev     # Watch mode
pnpm test    # Run tests
pnpm build   # Build for production
```

### Working on @nadi/compiler

```bash
cd packages/compiler
pnpm dev     # Watch mode
pnpm test    # Run tests
```

### Adding a New Package

1. Create package directory:

```bash
mkdir packages/my-package
cd packages/my-package
```

2. Create `package.json`:

```json
{
  "name": "@nadi/my-package",
  "version": "0.1.0",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts"
}
```

3. Add to workspace and build configuration

## Testing Guidelines

### Unit Tests

- Use Vitest for all unit tests
- Place tests in `__tests__` or `*.test.ts` files
- Aim for >80% code coverage
- Test both happy paths and edge cases

Example:

```typescript
import { describe, it, expect } from 'vitest';
import { signal } from '../src';

describe('signal', () => {
  it('should create a signal', () => {
    const count = signal(0);
    expect(count()).toBe(0);
  });
});
```

### Integration Tests

- Test package interactions
- Place in `tests/integration/`
- Use realistic scenarios

## Code Style

### TypeScript

- Use strict mode
- Prefer explicit types over `any`
- Document public APIs with JSDoc comments
- Use meaningful variable names

Example:

```typescript
/**
 * Creates a reactive signal
 *
 * @param initialValue - The initial value for the signal
 * @returns Signal getter/setter function
 */
export function signal<T>(initialValue: T): Signal<T> {
  // Implementation
}
```

### Formatting

We use Prettier for code formatting:

```bash
pnpm format
```

## Documentation

### API Documentation

- Add JSDoc comments to all public APIs
- Include examples in documentation
- Update README.md files when adding features

### Examples

- Add practical examples to `/examples`
- Include comments explaining key concepts
- Keep examples focused and simple

## Release Process

Releases are handled by maintainers using changesets:

```bash
# Create a changeset
pnpm changeset

# Version packages
pnpm changeset version

# Publish to npm
pnpm changeset publish
```

## Community Guidelines

### Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Provide constructive feedback
- Focus on the code, not the person

### Getting Help

- GitHub Issues: Bug reports and feature requests
- GitHub Discussions: Questions and community help
- Discord: Real-time chat (coming soon)

### Reporting Issues

When reporting bugs, include:

1. Nadi version
2. Node.js version
3. Operating system
4. Minimal reproduction example
5. Expected vs actual behavior

## License

By contributing to Nadi, you agree that your contributions will be licensed under the MIT License.

## Questions?

Feel free to open a discussion on GitHub or reach out to the maintainers.

Thank you for contributing to Nadi! 🚀
