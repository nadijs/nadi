# Changelog

All notable changes to the Nadi framework will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned

- Laravel integration package (@nadi/laravel)
- Client router package (@nadi/router)
- Forms utilities package (@nadi/forms)
- Documentation site
- Laravel starter kit

## [0.1.0] - 2025-12-25

### Added

- Initial monorepo setup with Turborepo
- `@nadi.js/core` package with signals-based reactivity (~2KB)
  - `signal()` - Reactive primitive
  - `computed()` - Derived state
  - `effect()` - Side effects with auto-cleanup
  - `batch()` - Batch updates
  - `untrack()` - Untracked reads
  - Lifecycle hooks: `onMount()`, `onCleanup()`
  - Context API: `createContext()`, `useContext()`
  - Control flow components: `Show`, `For`, `Portal`, `ErrorBoundary`
  - JSX runtime for direct DOM manipulation
  - Full TypeScript support with JSX types
- `@nadi.js/compiler` package for `.nadi` SFC compilation
  - Single-file component parser
  - JSX template compilation
  - Scoped CSS with PostCSS
  - TypeScript support in script blocks
  - Source map generation
- Example components (Counter, TodoApp)
- Comprehensive documentation
  - README with quick start
  - SETUP guide for development
  - CONTRIBUTING guidelines
  - IMPLEMENTATION summary
- Unit tests with Vitest
- ESLint and Prettier configuration
- MIT License

### Technical Details

- TypeScript 5.3+ with strict mode
- ES2022 target
- Vite for building and development
- pnpm workspace for monorepo management
- Turborepo for build optimization

---

## Version History

- **0.1.0** (2025-12-25) - Initial release with core reactivity and compiler
- **0.2.0** (Planned) - Laravel integration
- **0.3.0** (Planned) - Router and forms packages
- **0.4.0** (Planned) - Ecosystem packages (echo, testing)
- **0.5.0** (Planned) - SSR and documentation site
- **1.0.0** (Planned) - Production-ready stable release

---

## Migration Guides

### Upgrading to v0.2.0 (When Released)

Breaking changes will be documented here with migration guides.

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for how to contribute to this changelog.
