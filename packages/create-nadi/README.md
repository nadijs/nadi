# create-nadi

Scaffolding tool for creating Nadi projects.

## Usage

With npm:

```bash
npm create nadi@latest
```

With pnpm:

```bash
pnpm create nadi
```

With yarn:

```bash
yarn create nadi
```

## Options

```bash
# Specify project name
npm create nadi@latest my-app

# Specify template
npm create nadi@latest my-app --template laravel

# Use TypeScript
npm create nadi@latest my-app --template vanilla --typescript

# Specify package manager
npm create nadi@latest my-app --package-manager pnpm

# Initialize git
npm create nadi@latest my-app --git
```

## Available Templates

- `vanilla` - Vanilla Nadi app
- `laravel` - Nadi with Laravel backend
- `django` - Nadi with Django backend
- `express` - Nadi with Express backend
- `nextjs` - Nadi with Next.js
- `nuxt` - Nadi with Nuxt

Each template is available in both TypeScript and JavaScript variants.

## License

MIT
