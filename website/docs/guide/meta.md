# Meta & SEO

The Nadi Meta package provides reactive head management for dynamically updating page titles, meta tags, Open Graph tags, and more for better SEO and social sharing.

## Installation

```bash
npm install @nadi/meta
```

## Quick Start

```typescript
import { useMeta, Title, Meta } from '@nadi/meta'

function BlogPost({ post }: { post: Post }) {
  return (
    <div>
      <Title>{post.title} | My Blog</Title>
      <Meta name="description" content={post.excerpt} />
      <Meta property="og:title" content={post.title} />
      <Meta property="og:image" content={post.image} />

      <article>
        <h1>{post.title}</h1>
        <p>{post.content}</p>
      </article>
    </div>
  )
}
```

## Setting Page Title

### Using Title Component

```typescript
import { Title } from '@nadi/meta'

function HomePage() {
  return (
    <div>
      <Title>Home | My Website</Title>
      <h1>Welcome Home</h1>
    </div>
  )
}
```

### Using useMeta Hook

```typescript
import { useMeta } from '@nadi/meta'

function AboutPage() {
  const meta = useMeta()

  effect(() => {
    meta.setTitle('About Us | My Website')
  })

  return <div>...</div>
}
```

### Dynamic Title

```typescript
function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = signal<User | null>(null)

  effect(() => {
    fetchUser(userId).then(setUser)
  })

  const pageTitle = computed(() =>
    user() ? `${user()!.name} | User Profile` : 'Loading...'
  )

  return (
    <div>
      <Title>{pageTitle()}</Title>
      {user() && <h1>{user()!.name}</h1>}
    </div>
  )
}
```

## Meta Tags

### Basic Meta Tags

```typescript
import { Meta } from '@nadi/meta'

function Page() {
  return (
    <div>
      <Meta name="description" content="Page description for SEO" />
      <Meta name="keywords" content="keyword1, keyword2, keyword3" />
      <Meta name="author" content="John Doe" />
      <Meta name="viewport" content="width=device-width, initial-scale=1" />
      <Meta name="robots" content="index, follow" />

      <h1>Page Content</h1>
    </div>
  )
}
```

### HTTP-Equiv Meta Tags

```typescript
<Meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
<Meta httpEquiv="X-UA-Compatible" content="IE=edge" />
<Meta httpEquiv="refresh" content="300" />
```

### Charset Meta Tag

```typescript
<Meta charset="UTF-8" />
```

## Open Graph Tags

### Basic Open Graph

```typescript
function BlogPost({ post }: { post: Post }) {
  return (
    <div>
      <Meta property="og:type" content="article" />
      <Meta property="og:title" content={post.title} />
      <Meta property="og:description" content={post.excerpt} />
      <Meta property="og:image" content={post.coverImage} />
      <Meta property="og:url" content={`https://myblog.com/posts/${post.slug}`} />
      <Meta property="og:site_name" content="My Blog" />

      <article>{/* content */}</article>
    </div>
  )
}
```

### Article-Specific Tags

```typescript
<Meta property="article:published_time" content={post.publishedAt} />
<Meta property="article:author" content={post.author.name} />
<Meta property="article:section" content={post.category} />
<Meta property="article:tag" content={post.tags.join(', ')} />
```

### Multiple Images

```typescript
<Meta property="og:image" content={post.coverImage} />
<Meta property="og:image:width" content="1200" />
<Meta property="og:image:height" content="630" />
<Meta property="og:image:alt" content={post.imageAlt} />
<Meta property="og:image" content={post.thumbnail} />
```

## Twitter Cards

### Summary Card

```typescript
<Meta name="twitter:card" content="summary" />
<Meta name="twitter:site" content="@mywebsite" />
<Meta name="twitter:title" content={post.title} />
<Meta name="twitter:description" content={post.excerpt} />
<Meta name="twitter:image" content={post.thumbnail} />
```

### Large Image Card

```typescript
<Meta name="twitter:card" content="summary_large_image" />
<Meta name="twitter:site" content="@mywebsite" />
<Meta name="twitter:creator" content="@author" />
<Meta name="twitter:title" content={post.title} />
<Meta name="twitter:description" content={post.excerpt} />
<Meta name="twitter:image" content={post.coverImage} />
<Meta name="twitter:image:alt" content={post.imageAlt} />
```

## Link Tags

### Canonical URL

```typescript
import { Link } from '@nadi/meta'

<Link rel="canonical" href="https://myblog.com/posts/hello-world" />
```

### Alternate Languages

```typescript
<Link rel="alternate" hreflang="en" href="https://myblog.com/en/post" />
<Link rel="alternate" hreflang="es" href="https://myblog.com/es/post" />
<Link rel="alternate" hreflang="fr" href="https://myblog.com/fr/post" />
```

### RSS Feed

```typescript
<Link rel="alternate" type="application/rss+xml" title="RSS Feed" href="/feed.xml" />
```

### Favicon

```typescript
<Link rel="icon" type="image/x-icon" href="/favicon.ico" />
<Link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<Link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
<Link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
```

### Preload/Prefetch

```typescript
<Link rel="preload" href="/fonts/custom.woff2" as="font" type="font/woff2" crossorigin />
<Link rel="prefetch" href="/next-page" />
<Link rel="preconnect" href="https://api.example.com" />
<Link rel="dns-prefetch" href="https://api.example.com" />
```

## Structured Data (JSON-LD)

### Article Schema

```typescript
import { Script } from '@nadi/meta'

function BlogPost({ post }: { post: Post }) {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.coverImage,
    "datePublished": post.publishedAt,
    "dateModified": post.updatedAt,
    "author": {
      "@type": "Person",
      "name": post.author.name
    },
    "publisher": {
      "@type": "Organization",
      "name": "My Blog",
      "logo": {
        "@type": "ImageObject",
        "url": "https://myblog.com/logo.png"
      }
    }
  }

  return (
    <div>
      <Script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </Script>

      <article>{/* content */}</article>
    </div>
  )
}
```

### Product Schema

```typescript
const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": product.name,
  "image": product.images,
  "description": product.description,
  "brand": {
    "@type": "Brand",
    "name": product.brand
  },
  "offers": {
    "@type": "Offer",
    "url": `https://shop.com/products/${product.id}`,
    "priceCurrency": "USD",
    "price": product.price,
    "availability": "https://schema.org/InStock"
  }
}

<Script type="application/ld+json">
  {JSON.stringify(productSchema)}
</Script>
```

### Breadcrumb Schema

```typescript
const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://myblog.com',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Blog',
      item: 'https://myblog.com/blog',
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: post.title,
      item: `https://myblog.com/blog/${post.slug}`,
    },
  ],
};
```

## Dynamic Meta Tags

### Reactive Meta Tags

```typescript
function SearchResults() {
  const [query, setQuery] = signal('')
  const [results, setResults] = signal([])

  const pageTitle = computed(() =>
    query() ? `Search: ${query()} | My Site` : 'Search | My Site'
  )

  const pageDescription = computed(() =>
    `Found ${results().length} results for "${query()}"`
  )

  return (
    <div>
      <Title>{pageTitle()}</Title>
      <Meta name="description" content={pageDescription()} />

      <input
        value={query()}
        oninput={(e) => setQuery((e.target as HTMLInputElement).value)}
      />

      {results().map(result => (
        <div key={result.id}>{result.title}</div>
      ))}
    </div>
  )
}
```

### Meta from API Data

```typescript
function ProductPage({ productId }: { productId: string }) {
  const [product, setProduct] = signal<Product | null>(null)

  effect(() => {
    fetch(`/api/products/${productId}`)
      .then(r => r.json())
      .then(setProduct)
  })

  return (
    <div>
      {product() && (
        <>
          <Title>{product()!.name} | Shop</Title>
          <Meta name="description" content={product()!.description} />
          <Meta property="og:title" content={product()!.name} />
          <Meta property="og:image" content={product()!.image} />
          <Meta property="og:price:amount" content={product()!.price.toString()} />
          <Meta property="og:price:currency" content="USD" />
        </>
      )}

      {product() && <ProductDetails product={product()!} />}
    </div>
  )
}
```

## useMeta Hook

### Programmatic API

```typescript
import { useMeta } from '@nadi/meta'

function Component() {
  const meta = useMeta()

  // Set title
  meta.setTitle('My Page Title')

  // Add meta tag
  meta.addMeta({ name: 'description', content: 'Page description' })

  // Add link tag
  meta.addLink({ rel: 'canonical', href: 'https://example.com' })

  // Add script
  meta.addScript({ src: '/analytics.js', async: true })

  // Remove meta tag
  meta.removeMeta('description')

  // Clear all
  meta.clear()

  return <div>...</div>
}
```

### With Effects

```typescript
function Page() {
  const meta = useMeta()
  const [data, setData] = signal(null)

  effect(() => {
    if (data()) {
      meta.setTitle(`${data().title} | My Site`)
      meta.addMeta({
        name: 'description',
        content: data().description
      })
    }

    // Cleanup
    return () => {
      meta.clear()
    }
  })

  return <div>...</div>
}
```

## Server-Side Rendering

### Collecting Meta Tags

```typescript
import { collectMeta } from '@nadi/meta'

// Server-side
async function renderPage(url: string) {
  const metaCollector = collectMeta()

  const html = renderToString(
    <App url={url} metaCollector={metaCollector} />
  )

  const { title, meta, links, scripts } = metaCollector.getTags()

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        ${meta.map(m => `<meta ${Object.entries(m).map(([k, v]) => `${k}="${v}"`).join(' ')} />`).join('\n')}
        ${links.map(l => `<link ${Object.entries(l).map(([k, v]) => `${k}="${v}"`).join(' ')} />`).join('\n')}
      </head>
      <body>
        <div id="app">${html}</div>
        ${scripts.map(s => `<script ${Object.entries(s).map(([k, v]) => k === 'children' ? `>${v}</script>` : `${k}="${v}"`).join(' ')}`).join('\n')}
      </body>
    </html>
  `
}
```

## Best Practices

### SEO Optimization

```typescript
function OptimizedPage({ page }: { page: Page }) {
  return (
    <div>
      {/* Essential meta tags */}
      <Title>{page.title} | Site Name</Title>
      <Meta name="description" content={page.description} />
      <Link rel="canonical" href={page.canonicalUrl} />

      {/* Open Graph */}
      <Meta property="og:type" content="website" />
      <Meta property="og:title" content={page.title} />
      <Meta property="og:description" content={page.description} />
      <Meta property="og:image" content={page.image} />
      <Meta property="og:url" content={page.canonicalUrl} />

      {/* Twitter */}
      <Meta name="twitter:card" content="summary_large_image" />
      <Meta name="twitter:title" content={page.title} />
      <Meta name="twitter:description" content={page.description} />
      <Meta name="twitter:image" content={page.image} />

      {/* Structured data */}
      <Script type="application/ld+json">
        {JSON.stringify(page.schema)}
      </Script>

      <article>{page.content}</article>
    </div>
  )
}
```

### Title Templates

```typescript
function useTitleTemplate(template: string) {
  return (title: string) => template.replace('%s', title)
}

function Page() {
  const formatTitle = useTitleTemplate('%s | My Blog')

  return (
    <div>
      <Title>{formatTitle('Blog Post Title')}</Title>
    </div>
  )
}
```

### Meta Tag Priority

```typescript
// Higher priority (more specific)
<Title>Specific Page Title</Title>

// Lower priority (general)
<Title>Default Site Title</Title>

// Nadi automatically uses the most specific one
```

## Common Patterns

### E-commerce Product

```typescript
<Title>{product.name} - ${product.price} | Shop</Title>
<Meta name="description" content={product.description} />
<Meta property="og:type" content="product" />
<Meta property="og:title" content={product.name} />
<Meta property="og:image" content={product.image} />
<Meta property="product:price:amount" content={product.price} />
<Meta property="product:price:currency" content="USD" />
```

### Blog Post

```typescript
<Title>{post.title} | Blog</Title>
<Meta name="description" content={post.excerpt} />
<Meta name="author" content={post.author} />
<Meta property="og:type" content="article" />
<Meta property="article:published_time" content={post.date} />
<Meta property="article:author" content={post.author} />
```

### Landing Page

```typescript
<Title>Landing Page - Special Offer</Title>
<Meta name="description" content="Get 50% off today only!" />
<Meta name="robots" content="index, follow" />
<Link rel="canonical" href="https://example.com/landing" />
```

## Testing

```typescript
import { render } from '@nadi/testing'
import { useMeta } from '@nadi/meta'

test('sets page title', () => {
  const { container } = render(
    <div>
      <Title>Test Page</Title>
    </div>
  )

  expect(document.title).toBe('Test Page')
})

test('adds meta tags', () => {
  render(
    <Meta name="description" content="Test description" />
  )

  const meta = document.querySelector('meta[name="description"]')
  expect(meta?.getAttribute('content')).toBe('Test description')
})
```

## Next Steps

- Learn about [SSR](/guide/ssr) for server-side rendering
- Understand [SEO](/guide/seo) best practices
- Explore [Laravel Integration](/guide/laravel)
- Read the [Meta API Reference](/api/meta)
