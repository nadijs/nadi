# @nadi/meta API Reference

Complete API reference for `@nadi/meta` - head management and SEO optimization.

## Installation

```bash
npm install @nadi/meta
```

## Meta Management

### useMeta()

Manage document head metadata.

```typescript
function useMeta(meta: MetaConfig): void;
```

**Parameters:**

```typescript
interface MetaConfig {
  title?: string | Signal<string>;
  titleTemplate?: string;
  meta?: MetaTag[];
  link?: LinkTag[];
  script?: ScriptTag[];
  htmlAttrs?: HtmlAttributes;
  bodyAttrs?: BodyAttributes;
}
```

**Example:**

```typescript
import { useMeta } from '@nadi/meta'

function BlogPost({ post }) {
  useMeta({
    title: post.title,
    meta: [
      { name: 'description', content: post.excerpt },
      { property: 'og:title', content: post.title },
      { property: 'og:image', content: post.imageUrl }
    ]
  })

  return <article>{/* content */}</article>
}
```

## Meta Tags

### MetaTag

Define meta tag configuration.

```typescript
interface MetaTag {
  name?: string;
  property?: string;
  content: string;
  httpEquiv?: string;
  charset?: string;
}
```

**Common Meta Tags:**

```typescript
// Description
{ name: 'description', content: 'Page description' }

// Keywords
{ name: 'keywords', content: 'nadi, framework, javascript' }

// Viewport
{ name: 'viewport', content: 'width=device-width, initial-scale=1' }

// Author
{ name: 'author', content: 'John Doe' }

// Robots
{ name: 'robots', content: 'index, follow' }

// HTTP Equiv
{ httpEquiv: 'Content-Type', content: 'text/html; charset=UTF-8' }

// Charset
{ charset: 'UTF-8' }
```

### Open Graph Tags

```typescript
useMeta({
  meta: [
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: 'Page Title' },
    { property: 'og:description', content: 'Page description' },
    { property: 'og:image', content: 'https://example.com/image.jpg' },
    { property: 'og:url', content: 'https://example.com/page' },
    { property: 'og:site_name', content: 'Site Name' },
  ],
});
```

### Twitter Card Tags

```typescript
useMeta({
  meta: [
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:site', content: '@username' },
    { name: 'twitter:creator', content: '@username' },
    { name: 'twitter:title', content: 'Page Title' },
    { name: 'twitter:description', content: 'Page description' },
    { name: 'twitter:image', content: 'https://example.com/image.jpg' },
  ],
});
```

## Link Tags

### LinkTag

Define link tag configuration.

```typescript
interface LinkTag {
  rel: string;
  href: string;
  type?: string;
  sizes?: string;
  media?: string;
  hreflang?: string;
  as?: string;
  crossorigin?: 'anonymous' | 'use-credentials';
}
```

**Common Link Tags:**

```typescript
useMeta({
  link: [
    // Canonical URL
    { rel: 'canonical', href: 'https://example.com/page' },

    // Favicon
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },

    // Apple Touch Icon
    { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },

    // Manifest
    { rel: 'manifest', href: '/manifest.json' },

    // Stylesheet
    { rel: 'stylesheet', href: '/styles.css' },

    // Preload
    {
      rel: 'preload',
      href: '/font.woff2',
      as: 'font',
      type: 'font/woff2',
      crossorigin: 'anonymous',
    },

    // Prefetch
    { rel: 'prefetch', href: '/next-page' },

    // Alternate
    { rel: 'alternate', hreflang: 'es', href: 'https://example.com/es/page' },

    // RSS
    { rel: 'alternate', type: 'application/rss+xml', href: '/feed.xml' },
  ],
});
```

## Script Tags

### ScriptTag

Define script tag configuration.

```typescript
interface ScriptTag {
  src?: string;
  type?: string;
  async?: boolean;
  defer?: boolean;
  innerHTML?: string;
  crossorigin?: 'anonymous' | 'use-credentials';
}
```

**Example:**

```typescript
useMeta({
  script: [
    // External script
    { src: 'https://example.com/script.js', async: true },

    // Inline script
    {
      innerHTML: 'console.log("Hello World")',
      type: 'text/javascript',
    },

    // JSON-LD
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'Article Title',
        author: {
          '@type': 'Person',
          name: 'John Doe',
        },
      }),
    },
  ],
});
```

## HTML Attributes

### HtmlAttributes

Set attributes on `<html>` element.

```typescript
interface HtmlAttributes {
  lang?: string;
  dir?: 'ltr' | 'rtl';
  class?: string;
  [key: string]: any;
}
```

**Example:**

```typescript
useMeta({
  htmlAttrs: {
    lang: 'en',
    dir: 'ltr',
    class: 'dark-mode',
  },
});
```

## Body Attributes

### BodyAttributes

Set attributes on `<body>` element.

```typescript
interface BodyAttributes {
  class?: string;
  [key: string]: any;
}
```

**Example:**

```typescript
useMeta({
  bodyAttrs: {
    class: 'page-home',
  },
});
```

## Title Template

### titleTemplate

Define template for page titles.

```typescript
useMeta({
  titleTemplate: '%s | My Site',
  title: 'Home',
});
// Results in: "Home | My Site"
```

**Example with Reactive Values:**

```typescript
function Page() {
  const title = signal('Dynamic Title')

  useMeta({
    titleTemplate: '%s - My App',
    title: title
  })

  return (
    <div>
      <button onclick={() => title.set('New Title')}>
        Change Title
      </button>
    </div>
  )
}
```

## Dynamic Meta

### Reactive Meta Tags

```typescript
function UserProfile({ userId }) {
  const user = signal<User | null>(null)

  effect(() => {
    fetchUser(userId).then(setUser)
  })

  const metaTitle = computed(() =>
    user() ? `${user()!.name}'s Profile` : 'Loading...'
  )

  const metaDescription = computed(() =>
    user() ? user()!.bio : ''
  )

  useMeta({
    title: metaTitle,
    meta: [
      { name: 'description', content: metaDescription }
    ]
  })

  return <div>{/* content */}</div>
}
```

## SEO Helpers

### createSEO()

Create reusable SEO configuration.

```typescript
function createSEO(config: SEOConfig): MetaConfig;
```

**Parameters:**

```typescript
interface SEOConfig {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  twitterCard?: 'summary' | 'summary_large_image';
}
```

**Returns:** `MetaConfig` object

**Example:**

```typescript
import { createSEO } from '@nadi/meta'

function BlogPost({ post }) {
  const seo = createSEO({
    title: post.title,
    description: post.excerpt,
    image: post.imageUrl,
    url: `https://example.com/posts/${post.slug}`,
    type: 'article',
    twitterCard: 'summary_large_image'
  })

  useMeta(seo)

  return <article>{/* content */}</article>
}
```

## Structured Data

### JSON-LD

Add structured data for search engines.

```typescript
function ArticlePage({ article }) {
  useMeta({
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: article.title,
          description: article.excerpt,
          image: article.imageUrl,
          datePublished: article.publishedAt,
          dateModified: article.updatedAt,
          author: {
            '@type': 'Person',
            name: article.author.name,
          },
          publisher: {
            '@type': 'Organization',
            name: 'My Blog',
            logo: {
              '@type': 'ImageObject',
              url: 'https://example.com/logo.png',
            },
          },
        }),
      },
    ],
  });
}
```

### Common Schema Types

```typescript
// Organization
{
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Company Name',
  url: 'https://example.com',
  logo: 'https://example.com/logo.png',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+1-555-555-5555',
    contactType: 'customer service'
  }
}

// Person
{
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'John Doe',
  jobTitle: 'Software Developer',
  url: 'https://johndoe.com',
  sameAs: [
    'https://twitter.com/johndoe',
    'https://linkedin.com/in/johndoe'
  ]
}

// Product
{
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Product Name',
  image: 'https://example.com/product.jpg',
  description: 'Product description',
  offers: {
    '@type': 'Offer',
    price: '99.99',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock'
  }
}
```

## Server-Side Rendering

### collectMeta()

Collect meta tags for SSR (server-only).

```typescript
function collectMeta(): {
  title: string;
  meta: MetaTag[];
  link: LinkTag[];
  script: ScriptTag[];
  htmlAttrs: HtmlAttributes;
  bodyAttrs: BodyAttributes;
};
```

**Example:**

```typescript
import { collectMeta } from '@nadi/meta/server'
import { renderToString } from '@nadi/core/server'

const html = renderToString(<App />)
const meta = collectMeta()

const fullHtml = `
<!DOCTYPE html>
<html ${renderAttrs(meta.htmlAttrs)}>
<head>
  <title>${meta.title}</title>
  ${meta.meta.map(renderMetaTag).join('\n')}
  ${meta.link.map(renderLinkTag).join('\n')}
  ${meta.script.map(renderScriptTag).join('\n')}
</head>
<body ${renderAttrs(meta.bodyAttrs)}>
  <div id="app">${html}</div>
</body>
</html>
`
```

## TypeScript

### Type Definitions

```typescript
import type {
  MetaConfig,
  MetaTag,
  LinkTag,
  ScriptTag,
  HtmlAttributes,
  BodyAttributes,
  SEOConfig,
} from '@nadi/meta';
```

## Best Practices

✅ **Do:**

- Set unique titles for each page
- Include meta descriptions
- Use Open Graph tags for social sharing
- Add structured data for SEO
- Set canonical URLs
- Use reactive values for dynamic content
- Test social media previews

❌ **Don't:**

- Duplicate meta tags
- Forget Open Graph images
- Skip Twitter Card tags
- Use same title/description everywhere
- Ignore structured data
- Forget canonical URLs
- Exceed meta description length (160 chars)

## Next Steps

- Learn about [Meta & SEO](/guide/meta)
- Explore [SSR](/guide/ssr) with meta tags
- Understand [Open Graph Protocol](https://ogp.me/)
- Read about [Schema.org](https://schema.org/)
