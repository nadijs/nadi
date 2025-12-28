# @nadi/meta

Reactive head and meta tag management for Nadi with SSR support.

## Features

- 🎯 Reactive title, meta tags, and links
- 🔄 SSR-compatible with hydration
- 📱 Automatic cleanup on unmount
- 🎨 TypeScript support
- 🪶 Lightweight (~800 bytes gzipped)
- 🔍 SEO-friendly

## Installation

```bash
npm install @nadi/meta
```

## Quick Start

```typescript
import { Head, Title, Meta, Link } from '@nadi/meta';
import { signal } from '@nadi.js/core';

export default function Page() {
  const [pageTitle] = signal('My Page');

  return (
    <>
      <Head>
        <Title>{pageTitle()}</Title>
        <Meta name="description" content="Page description" />
        <Meta property="og:title" content={pageTitle()} />
        <Link rel="canonical" href="https://example.com/page" />
      </Head>

      <div>
        <h1>{pageTitle()}</h1>
      </div>
    </>
  );
}
```

## API Reference

### `<Head>`

Container for meta tags. All children are rendered into document `<head>`.

```typescript
<Head>
  <Title>My App</Title>
  <Meta name="description" content="..." />
</Head>
```

### `<Title>`

Sets the document title.

```typescript
const [title] = signal('Dynamic Title');

<Title>{title()}</Title>
```

**Props:**

- `children`: string | (() => string)

### `<Meta>`

Adds meta tags to the document head.

```typescript
<Meta name="description" content="Page description" />
<Meta property="og:title" content="Social Title" />
<Meta httpEquiv="content-type" content="text/html" />
<Meta charset="utf-8" />
```

**Props:**

- `name?: string` - Meta name attribute
- `property?: string` - Meta property attribute (Open Graph)
- `content: string` - Meta content
- `httpEquiv?: string` - HTTP equiv attribute
- `charset?: string` - Character encoding

### `<Link>`

Adds link tags to the document head.

```typescript
<Link rel="canonical" href="https://example.com" />
<Link rel="icon" type="image/png" href="/favicon.png" />
<Link rel="stylesheet" href="/styles.css" />
<Link rel="preconnect" href="https://fonts.googleapis.com" />
```

**Props:**

- `rel: string` - Link relationship
- `href: string` - Link URL
- `type?: string` - MIME type
- `sizes?: string` - Icon sizes
- `media?: string` - Media query
- `as?: string` - Resource type for preload
- `crossorigin?: string` - CORS setting

### `<Style>`

Adds inline styles to the document head.

```typescript
<Style>{`
  body {
    background: #000;
    color: #fff;
  }
`}</Style>
```

### `<Script>`

Adds scripts to the document head.

```typescript
<Script src="https://analytics.example.com/script.js" async />
<Script type="application/ld+json">
  {JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebPage"
  })}
</Script>
```

**Props:**

- `src?: string` - Script source URL
- `async?: boolean` - Load asynchronously
- `defer?: boolean` - Defer execution
- `type?: string` - Script type
- `children?: string` - Inline script content

### `<Base>`

Sets the base URL for relative links.

```typescript
<Base href="https://example.com/" target="_blank" />
```

## Examples

### Reactive SEO

```typescript
import { Head, Title, Meta } from '@nadi/meta';
import { signal, computed } from '@nadi.js/core';

export default function BlogPost(props) {
  const [post] = signal(props.post);

  const metaDescription = computed(() =>
    post().excerpt.substring(0, 160)
  );

  return (
    <>
      <Head>
        <Title>{post().title} | My Blog</Title>
        <Meta name="description" content={metaDescription()} />

        {/* Open Graph */}
        <Meta property="og:type" content="article" />
        <Meta property="og:title" content={post().title} />
        <Meta property="og:description" content={metaDescription()} />
        <Meta property="og:image" content={post().featuredImage} />

        {/* Twitter Card */}
        <Meta name="twitter:card" content="summary_large_image" />
        <Meta name="twitter:title" content={post().title} />
        <Meta name="twitter:description" content={metaDescription()} />
        <Meta name="twitter:image" content={post().featuredImage} />

        {/* Canonical URL */}
        <Link rel="canonical" href={`https://myblog.com/${post().slug}`} />
      </Head>

      <article>
        <h1>{post().title}</h1>
        <div innerHTML={post().content}></div>
      </article>
    </>
  );
}
```

### Structured Data (JSON-LD)

```typescript
import { Head, Script } from '@nadi/meta';

export default function Product(props) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": props.product.name,
    "description": props.product.description,
    "image": props.product.image,
    "offers": {
      "@type": "Offer",
      "price": props.product.price,
      "priceCurrency": "USD"
    }
  };

  return (
    <>
      <Head>
        <Script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </Script>
      </Head>

      <div class="product">
        {/* Product content */}
      </div>
    </>
  );
}
```

### Dynamic Favicon

```typescript
import { Head, Link } from '@nadi/meta';
import { signal, effect } from '@nadi.js/core';

export default function App() {
  const [theme] = signal<'light' | 'dark'>('light');

  const faviconHref = () =>
    theme() === 'dark'
      ? '/favicon-dark.png'
      : '/favicon-light.png';

  return (
    <>
      <Head>
        <Link rel="icon" type="image/png" href={faviconHref()} />
      </Head>

      <div>
        <button onClick={() => theme() === 'light' ? 'dark' : 'light'}>
          Toggle Theme
        </button>
      </div>
    </>
  );
}
```

### Preload Resources

```typescript
import { Head, Link } from '@nadi/meta';

export default function App() {
  return (
    <>
      <Head>
        {/* Preconnect to external domains */}
        <Link rel="preconnect" href="https://fonts.googleapis.com" />
        <Link rel="preconnect" href="https://cdn.example.com" crossorigin="" />

        {/* Preload critical resources */}
        <Link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossorigin="" />
        <Link rel="preload" href="/hero.jpg" as="image" />

        {/* DNS prefetch */}
        <Link rel="dns-prefetch" href="https://analytics.example.com" />
      </Head>

      <div>App content</div>
    </>
  );
}
```

### Multiple Languages

```typescript
import { Head, Meta, Link } from '@nadi/meta';

export default function MultilingualPage(props) {
  const currentLang = props.lang || 'en';
  const alternateUrls = {
    en: 'https://example.com/en/page',
    es: 'https://example.com/es/page',
    fr: 'https://example.com/fr/page'
  };

  return (
    <>
      <Head>
        <Meta httpEquiv="content-language" content={currentLang} />
        <Link rel="canonical" href={alternateUrls[currentLang]} />

        {/* Alternate language versions */}
        {Object.entries(alternateUrls).map(([lang, url]) => (
          <Link rel="alternate" hreflang={lang} href={url} key={lang} />
        ))}

        {/* Default for unknown languages */}
        <Link rel="alternate" hreflang="x-default" href={alternateUrls.en} />
      </Head>

      <div>Content in {currentLang}</div>
    </>
  );
}
```

## SSR Usage

### Server-side

```typescript
import { renderToString } from '@nadi.js/core';
import { getMetaTags } from '@nadi/meta';
import App from './App';

const html = renderToString(() => <App />);
const { title, meta, links } = getMetaTags();

const fullHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  ${title ? `<title>${title}</title>` : ''}
  ${meta.join('\n  ')}
  ${links.join('\n  ')}
</head>
<body>
  <div id="app">${html}</div>
</body>
</html>
`;
```

### Client-side Hydration

```typescript
import { hydrate } from '@nadi.js/core';
import App from './App';

hydrate(() => <App />, document.getElementById('app'));
```

The meta tags will automatically sync with server-rendered content and update reactively.

## Best Practices

1. **Use reactive values**: Wrap dynamic content in signals for automatic updates
2. **Place `<Head>` at component level**: Each component can manage its own meta tags
3. **Avoid duplicates**: Later `<Head>` blocks override earlier ones for the same tag
4. **Structured data**: Use JSON-LD for rich search results
5. **Preload critical resources**: Improve loading performance with `rel="preload"`
6. **Set canonical URLs**: Prevent duplicate content issues

## Performance

- **Bundle Size**: ~800 bytes gzipped
- **Zero runtime overhead**: Uses native DOM APIs
- **Efficient updates**: Only modified tags are updated
- **SSR-friendly**: No hydration mismatches

## License

MIT
