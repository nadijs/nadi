# Nadi Framework Documentation

This directory contains the official documentation website for Nadi, built with VitePress.

## 📁 Structure

```
website/
├── docs/
│   ├── .vitepress/
│   │   └── config.ts          # VitePress configuration
│   ├── guide/
│   │   ├── introduction.md    # What is Nadi?
│   │   ├── why-nadi.md        # Why choose Nadi?
│   │   ├── quick-start.md     # Get started guide
│   │   ├── installation.md    # Installation guide
│   │   ├── signals.md         # Signals documentation
│   │   ├── computed.md        # Computed values
│   │   ├── effects.md         # Effects
│   │   ├── components.md      # Components guide
│   │   ├── jsx.md             # JSX templates
│   │   ├── routing.md         # Router documentation
│   │   ├── forms.md           # Forms & validation
│   │   ├── meta.md            # Head & SEO
│   │   ├── echo.md            # Real-time with Laravel Echo
│   │   ├── ssr.md             # SSR & SSG
│   │   ├── testing.md         # Testing guide
│   │   ├── devtools.md        # DevTools extension
│   │   ├── laravel.md         # Laravel integration
│   │   ├── django.md          # Django integration
│   │   ├── express.md         # Express integration
│   │   ├── nextjs.md          # Next.js integration
│   │   ├── nuxt.md            # Nuxt integration
│   │   ├── performance.md     # Performance guide
│   │   ├── bundle-size.md     # Bundle optimization
│   │   ├── prerender.md       # Pre-rendering
│   │   ├── context.md         # Context API
│   │   ├── lifecycle.md       # Lifecycle hooks
│   │   ├── migration-vue.md   # Migrating from Vue
│   │   ├── migration-react.md # Migrating from React
│   │   └── migration-svelte.md# Migrating from Svelte
│   ├── api/
│   │   ├── core.md            # Core API reference
│   │   ├── router.md          # Router API
│   │   ├── forms.md           # Forms API
│   │   ├── meta.md            # Meta API
│   │   ├── echo.md            # Echo API
│   │   ├── testing.md         # Testing API
│   │   └── prerender.md       # Prerender API
│   ├── examples/
│   │   ├── counter.md         # Counter example
│   │   ├── todo.md            # Todo app example
│   │   ├── forms.md           # Form validation example
│   │   ├── chat.md            # Real-time chat
│   │   └── blog.md            # Blog with SSR
│   ├── index.md               # Home page
│   └── changelog.md           # Changelog
├── package.json
└── README.md
```

## 🚀 Development

### Prerequisites

- Node.js 18+
- npm, pnpm, or yarn

### Installation

```bash
cd website
npm install
```

### Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The dev server will start at [http://localhost:5173](http://localhost:5173)

## 📝 Writing Documentation

### Creating a New Page

1. Create a markdown file in the appropriate directory:
   - Guides → `docs/guide/`
   - API Reference → `docs/api/`
   - Examples → `docs/examples/`

2. Add frontmatter at the top:

```markdown
---
title: Your Page Title
description: A brief description
---

# Your Page Title

Your content here...
```

3. Add to sidebar in [`docs/.vitepress/config.ts`](docs/.vitepress/config.ts):

```typescript
sidebar: {
  '/guide/': [
    {
      text: 'Your Section',
      items: [
        { text: 'Your Page', link: '/guide/your-page' }
      ]
    }
  ]
}
```

### Markdown Features

VitePress supports:

#### Code Blocks with Syntax Highlighting

\`\`\`typescript
const [count, setCount] = signal(0);
\`\`\`

#### Line Highlighting

\`\`\`typescript{2,4-6}
const [count, setCount] = signal(0);
const doubled = computed(() => count() \* 2);

effect(() => {
console.log('Count:', count());
});
\`\`\`

#### Line Numbers

\`\`\`typescript:line-numbers
const [count, setCount] = signal(0);
\`\`\`

#### Custom Containers

```markdown
::: info
This is an info box
:::

::: tip
This is a tip
:::

::: warning
This is a warning
:::

::: danger
This is a danger warning
:::
```

#### Badges

```markdown
Badge <Badge type="tip" text="v0.2.0" />
```

## 🎨 Customization

### Theme Configuration

Edit [`docs/.vitepress/config.ts`](docs/.vitepress/config.ts):

```typescript
export default defineConfig({
  title: 'Nadi',
  description: 'Ultra-lightweight reactive framework',
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      /* navigation */
    ],
    sidebar: {
      /* sidebar */
    },
  },
});
```

### Custom CSS

Create `docs/.vitepress/theme/custom.css`:

```css
:root {
  --vp-c-brand: #5d64c4;
  --vp-c-brand-light: #747bff;
}
```

Import in `docs/.vitepress/theme/index.ts`:

```typescript
import DefaultTheme from 'vitepress/theme';
import './custom.css';

export default DefaultTheme;
```

## 📤 Deployment

### Netlify

1. Connect your GitHub repository
2. Build command: `npm run build`
3. Publish directory: `docs/.vitepress/dist`

### Vercel

1. Import your repository
2. Framework preset: VitePress
3. Build command: `npm run build`
4. Output directory: `docs/.vitepress/dist`

### GitHub Pages

```yaml
# .github/workflows/deploy.yml
name: Deploy Docs

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
        working-directory: website
      - run: npm run build
        working-directory: website
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: website/docs/.vitepress/dist
```

## 🔍 Search

Local search is enabled by default:

```typescript
themeConfig: {
  search: {
    provider: 'local';
  }
}
```

For Algolia search:

```typescript
themeConfig: {
  search: {
    provider: 'algolia',
    options: {
      appId: 'YOUR_APP_ID',
      apiKey: 'YOUR_API_KEY',
      indexName: 'nadi'
    }
  }
}
```

## 📖 Documentation Guidelines

### Writing Style

- ✅ Use clear, simple language
- ✅ Include code examples
- ✅ Add real-world use cases
- ✅ Link to related docs
- ✅ Keep sections focused
- ❌ Avoid jargon without explanation
- ❌ Don't assume prior knowledge

### Code Examples

- Show both ❌ wrong and ✅ correct ways
- Include TypeScript types
- Add comments for complex logic
- Test all examples before committing

### Structure

Each guide should have:

1. **Introduction** - What and why
2. **Prerequisites** - What you need to know
3. **Main Content** - Step-by-step guide
4. **Examples** - Practical use cases
5. **Advanced** - Deep dive (optional)
6. **Next Steps** - Related docs

## 🤝 Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

## 📝 License

MIT License - see [LICENSE](../../LICENSE)
