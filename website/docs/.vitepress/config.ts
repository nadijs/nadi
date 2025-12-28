import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'Nadi.js',
  description: 'Ultra-lightweight reactive framework for modern web development',

  appearance: 'dark',

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#5d64c4' }],
    ['meta', { property: 'og:title', content: 'Nadi.js Framework' }],
    [
      'meta',
      { property: 'og:description', content: 'Ultra-lightweight reactive framework - Only 3.5KB' },
    ],
  ],

  themeConfig: {
    logo: {
      light: '/nadi_light_logo.png',
      dark: '/nadi_dark_logo.png',
    },
    siteTitle: false,

    nav: [
      { text: 'Guide', link: '/guide/introduction' },
      { text: 'Quick Start', link: '/guide/quick-start' },
      { text: 'API', link: '/api/core' },
      { text: 'Examples', link: '/examples/counter' },
      {
        text: 'v0.2.0',
        items: [
          { text: 'Changelog', link: '/changelog' },
          { text: 'Migration Guide', link: '/guide/migration' },
        ],
      },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          items: [
            { text: 'What is Nadi?', link: '/guide/introduction' },
            { text: 'Why Nadi?', link: '/guide/why-nadi' },
            { text: 'Quick Start', link: '/guide/quick-start' },
            { text: 'Installation', link: '/guide/installation' },
          ],
        },
        {
          text: 'Core Concepts',
          items: [
            { text: 'Signals', link: '/guide/signals' },
            { text: 'Computed Values', link: '/guide/computed' },
            { text: 'Effects', link: '/guide/effects' },
            { text: 'Components', link: '/guide/components' },
            { text: 'JSX Templates', link: '/guide/jsx' },
          ],
        },
        {
          text: 'Features',
          items: [
            { text: 'UI Components', link: '/guide/ui-components' },
            { text: 'Routing', link: '/guide/routing' },
            { text: 'Forms & Validation', link: '/guide/forms' },
            { text: 'Head & SEO', link: '/guide/meta' },
            { text: 'Real-time (Echo)', link: '/guide/echo' },
            { text: 'SSR & SSG', link: '/guide/ssr' },
            { text: 'Testing', link: '/guide/testing' },
            { text: 'DevTools', link: '/guide/devtools' },
          ],
        },
        {
          text: 'Framework Integration',
          items: [
            { text: 'Laravel', link: '/guide/laravel' },
            { text: 'Django', link: '/guide/django' },
            { text: 'Express', link: '/guide/express' },
            { text: 'Next.js', link: '/guide/nextjs' },
            { text: 'Nuxt', link: '/guide/nuxt' },
          ],
        },
        {
          text: 'Advanced',
          items: [
            { text: 'Animations', link: '/guide/animations' },
            { text: 'Theming', link: '/guide/theming' },
            { text: 'Performance', link: '/guide/performance' },
            { text: 'Bundle Size', link: '/guide/bundle-size' },
            { text: 'Pre-rendering', link: '/guide/prerender' },
            { text: 'Context API', link: '/guide/context' },
            { text: 'Lifecycle', link: '/guide/lifecycle' },
          ],
        },
        {
          text: 'Migration',
          items: [
            { text: 'From Vue', link: '/guide/migration-vue' },
            { text: 'From React', link: '/guide/migration-react' },
            { text: 'From Svelte', link: '/guide/migration-svelte' },
          ],
        },
      ],
      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'Core', link: '/api/core' },
            { text: 'UI Components', link: '/api/ui' },
            { text: 'Router', link: '/api/router' },
            { text: 'Forms', link: '/api/forms' },
            { text: 'Meta', link: '/api/meta' },
            { text: 'Echo', link: '/api/echo' },
            { text: 'Testing', link: '/api/testing' },
            { text: 'Prerender', link: '/api/prerender' },
          ],
        },
      ],
      '/examples/': [
        {
          text: 'Examples',
          items: [
            { text: 'UI Showcase', link: '/examples/ui-showcase' },
            { text: 'Counter', link: '/examples/counter' },
            { text: 'Todo App', link: '/examples/todo' },
            { text: 'Form Validation', link: '/examples/forms' },
            { text: 'Real-time Chat', link: '/examples/chat' },
            { text: 'Blog with SSR', link: '/examples/blog' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/nadiframework/nadi' },
      { icon: 'discord', link: 'https://discord.gg/nadi' },
      { icon: 'twitter', link: 'https://twitter.com/nadiframework' },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025 Nadi Team',
    },

    search: {
      provider: 'local',
    },

    editLink: {
      pattern: 'https://github.com/nadiframework/nadi/edit/main/website/docs/:path',
      text: 'Edit this page on GitHub',
    },
  },
});
