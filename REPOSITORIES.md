# Nadi.js Repositories

The Nadi.js framework is organized across multiple repositories for better maintainability and contribution workflows.

## Core Repository (This Repo)

**[nadijs/nadi](https://github.com/nadijs/nadi)** - Main monorepo containing all npm packages

Contains:
- `packages/core` - [@nadi/core](https://www.npmjs.com/package/@nadi/core) - Reactive signals runtime
- `packages/compiler` - [@nadi/compiler](https://www.npmjs.com/package/@nadi/compiler) - SFC compiler
- `packages/router` - [@nadi/router](https://www.npmjs.com/package/@nadi/router) - Client-side routing
- `packages/forms` - [@nadi/forms](https://www.npmjs.com/package/@nadi/forms) - Form management
- `packages/meta` - [@nadi/meta](https://www.npmjs.com/package/@nadi/meta) - SEO/meta tags
- `packages/ui` - [@nadi/ui](https://www.npmjs.com/package/@nadi/ui) - UI component library
- `packages/testing` - [@nadi/testing](https://www.npmjs.com/package/@nadi/testing) - Testing utilities
- `packages/prerender` - [@nadi/prerender](https://www.npmjs.com/package/@nadi/prerender) - SSR/SSG
- `packages/codemod` - [@nadi/codemod](https://www.npmjs.com/package/@nadi/codemod) - Migration tools
- `packages/echo` - [@nadi/echo](https://www.npmjs.com/package/@nadi/echo) - WebSocket support
- `packages/vite-plugin` - [@nadi/vite-plugin](https://www.npmjs.com/package/@nadi/vite-plugin) - Vite integration
- `packages/create-nadi` - [create-nadi](https://www.npmjs.com/package/@nadi/create-nadi) - Project scaffolding CLI
- `packages/adapter-*` - Backend framework adapters (Laravel, Django, Express, Next.js, Nuxt)
- `examples/` - Simple `.nadi` file examples

## Documentation

**[nadijs/docs](https://github.com/nadijs/docs)** - Documentation website

- Live site: [nadijs.org](https://nadijs.org)
- VitePress-powered documentation
- API reference, guides, tutorials, and examples
- Contribution: Submit PRs for docs improvements

## DevTools

**[nadijs/devtools](https://github.com/nadijs/devtools)** - Browser extension for debugging

- Chrome/Firefox extension
- Component tree inspector
- State debugging tools
- Performance profiling

## Sample Applications

**[nadijs/sample-apps](https://github.com/nadijs/sample-apps)** - Full example applications

- Django blog example
- Express dashboard example
- Laravel todo app
- Next.js ecommerce site
- Nuxt portfolio site
- Complete full-stack application examples

## Contributing

Each repository has its own contributing guidelines. Please refer to the specific repository's CONTRIBUTING.md file.

### Quick Links

- **Report bugs:** [Main repo issues](https://github.com/nadijs/nadi/issues)
- **Documentation issues:** [Docs repo issues](https://github.com/nadijs/docs/issues)
- **DevTools issues:** [DevTools repo issues](https://github.com/nadijs/devtools/issues)
- **Discussions:** [GitHub Discussions](https://github.com/nadijs/nadi/discussions)

## License

All repositories are MIT licensed. See individual repository LICENSE files for details.
