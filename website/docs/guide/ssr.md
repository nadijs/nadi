# Server-Side Rendering (SSR)

Nadi supports full server-side rendering with hydration, static site generation (SSG), and islands architecture for optimal performance and SEO.

## Installation

```bash
npm install @nadi/prerender
```

## Why SSR?

### Benefits

✅ **Better SEO** - Search engines can crawl fully rendered HTML
✅ **Faster First Paint** - Users see content immediately
✅ **Social Media** - Link previews work correctly
✅ **Accessibility** - Works without JavaScript
✅ **Performance** - Especially on slow devices/networks

### When to Use SSR

- **E-commerce** - Product pages, listings
- **Blogs** - Articles, documentation
- **Marketing** - Landing pages, homepages
- **Content Sites** - News, magazines
- **Dashboards** - Initial render only

### When Not to Use SSR

- **Highly Interactive Apps** - Real-time chat, games
- **Private Dashboards** - User-specific data
- **Tools** - Calculators, editors (unless SEO needed)

## Quick Start

### Server Setup

```typescript
import { renderToString, createServerApp } from '@nadi/prerender'
import express from 'express'

const app = express()

app.get('*', async (req, res) => {
  const html = await renderToString(() => (
    <App url={req.url} />
  ))

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>My App</title>
      </head>
      <body>
        <div id="app">${html}</div>
        <script src="/client.js"></script>
      </body>
    </html>
  `)
})

app.listen(3000)
```

### Client Hydration

```typescript
import { hydrate } from '@nadi/core'

// Client-side entry point
hydrate(() => <App />, document.getElementById('app'))
```

## Rendering Methods

### renderToString

Renders component to HTML string:

```typescript
import { renderToString } from '@nadi/prerender'

const html = await renderToString(() => (
  <HomePage />
))

console.log(html)
// <div><h1>Welcome</h1><p>Content</p></div>
```

### renderToStream

Streams HTML for faster TTFB:

```typescript
import { renderToStream } from '@nadi/prerender'

app.get('/stream', async (req, res) => {
  res.setHeader('Content-Type', 'text/html')

  const stream = renderToStream(() => <App />)

  stream.pipe(res)
})
```

### Static Generation

Pre-render pages at build time:

```typescript
import { renderToString } from '@nadi/prerender'
import fs from 'fs/promises'

async function generatePage(path: string, component: () => JSX.Element) {
  const html = await renderToString(component)

  const fullHTML = `
    <!DOCTYPE html>
    <html>
      <head><title>Static Page</title></head>
      <body>
        <div id="app">${html}</div>
      </body>
    </html>
  `

  await fs.writeFile(`dist${path}.html`, fullHTML)
}

// Generate static pages
await generatePage('/', () => <HomePage />)
await generatePage('/about', () => <AboutPage />)
await generatePage('/contact', () => <ContactPage />)
```

## Data Fetching

### Async Components

```typescript
async function BlogPost({ slug }: { slug: string }) {
  const post = await fetch(`https://api.blog.com/posts/${slug}`)
    .then(r => r.json())

  return (
    <article>
      <h1>{post.title}</h1>
      <div>{post.content}</div>
    </article>
  )
}

// Server renders with data
const html = await renderToString(() => (
  <BlogPost slug="hello-world" />
))
```

### Data Loading Hook

```typescript
import { createServerData } from '@nadi/prerender'

function UserProfile({ userId }: { userId: string }) {
  const user = createServerData(
    () => fetch(`/api/users/${userId}`).then(r => r.json()),
    { key: `user-${userId}` }
  )

  if (!user()) return <div>Loading...</div>

  return (
    <div>
      <h1>{user().name}</h1>
      <p>{user().email}</p>
    </div>
  )
}
```

### Cache Data Between Server and Client

```typescript
// Server
const cache = new Map()

const html = await renderToString(() => (
  <App />
), { cache })

// Serialize cache
const serializedCache = JSON.stringify(Array.from(cache.entries()))

const fullHTML = `
  <!DOCTYPE html>
  <html>
    <body>
      <div id="app">${html}</div>
      <script>
        window.__INITIAL_DATA__ = ${serializedCache}
      </script>
      <script src="/client.js"></script>
    </body>
  </html>
`

// Client
hydrate(() => <App />, document.getElementById('app'), {
  initialData: new Map(window.__INITIAL_DATA__)
})
```

## Hydration

### Basic Hydration

```typescript
// Client entry point
import { hydrate } from '@nadi/core'

hydrate(
  () => <App />,
  document.getElementById('app')
)
```

### Selective Hydration

Only hydrate interactive components:

```typescript
import { Island } from '@nadi/prerender'

function Page() {
  return (
    <div>
      {/* Static content - no hydration */}
      <header>
        <h1>Welcome</h1>
      </header>

      {/* Interactive - will hydrate */}
      <Island>
        <SearchBar />
      </Island>

      {/* Static */}
      <article>
        <p>Content...</p>
      </article>

      {/* Interactive */}
      <Island>
        <Comments />
      </Island>
    </div>
  )
}
```

### Lazy Hydration

Hydrate on interaction or visibility:

```typescript
import { LazyIsland } from '@nadi/prerender'

function Page() {
  return (
    <div>
      {/* Hydrate when visible */}
      <LazyIsland threshold={0.5}>
        <ImageGallery />
      </LazyIsland>

      {/* Hydrate on click */}
      <LazyIsland trigger="click">
        <Modal />
      </LazyIsland>

      {/* Hydrate when idle */}
      <LazyIsland trigger="idle">
        <Newsletter />
      </LazyIsland>
    </div>
  )
}
```

## SEO Optimization

### Meta Tags

```typescript
import { Meta, Title } from '@nadi/meta'

function BlogPost({ post }: { post: Post }) {
  return (
    <div>
      <Title>{post.title} | Blog</Title>
      <Meta name="description" content={post.excerpt} />
      <Meta property="og:title" content={post.title} />
      <Meta property="og:image" content={post.image} />

      <article>
        <h1>{post.title}</h1>
        <div>{post.content}</div>
      </article>
    </div>
  )
}
```

### Structured Data

```typescript
import { Script } from '@nadi/meta'

function ProductPage({ product }: { product: Product }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.image,
    "description": product.description,
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "USD"
    }
  }

  return (
    <div>
      <Script type="application/ld+json">
        {JSON.stringify(schema)}
      </Script>

      <div class="product">
        <h1>{product.name}</h1>
        <img src={product.image} alt={product.name} />
        <p>${product.price}</p>
      </div>
    </div>
  )
}
```

## Static Site Generation (SSG)

### Build Script

```typescript
import { renderToString } from '@nadi/prerender'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

interface Route {
  path: string
  component: () => JSX.Element
}

async function buildSite(routes: Route[]) {
  for (const route of routes) {
    const html = await renderToString(route.component)

    const fullHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>My Site</title>
          <link rel="stylesheet" href="/styles.css">
        </head>
        <body>
          <div id="app">${html}</div>
          <script src="/client.js"></script>
        </body>
      </html>
    `

    const filePath = path.join('dist', route.path, 'index.html')
    await mkdir(path.dirname(filePath), { recursive: true })
    await writeFile(filePath, fullHTML)

    console.log(`Generated: ${route.path}`)
  }
}

// Generate site
await buildSite([
  { path: '/', component: () => <HomePage /> },
  { path: '/about', component: () => <AboutPage /> },
  { path: '/contact', component: () => <ContactPage /> },
])
```

### Dynamic Routes

```typescript
// Fetch all blog posts
const posts = await fetch('https://api.blog.com/posts')
  .then(r => r.json())

// Generate route for each post
const routes = posts.map(post => ({
  path: `/blog/${post.slug}`,
  component: () => <BlogPost post={post} />
}))

await buildSite([
  { path: '/', component: () => <HomePage /> },
  { path: '/blog', component: () => <BlogIndex posts={posts} /> },
  ...routes
])
```

## Islands Architecture

### What are Islands?

Islands are interactive components that "hydrate" in a sea of static HTML. This reduces JavaScript bundle size and improves performance.

### Creating Islands

```typescript
import { Island } from '@nadi/prerender'

function BlogPost({ post }: { post: Post }) {
  return (
    <article>
      {/* Static HTML */}
      <header>
        <h1>{post.title}</h1>
        <time>{post.date}</time>
      </header>

      {/* Static content */}
      <div class="content">
        {post.content}
      </div>

      {/* Interactive island */}
      <Island>
        <LikeButton postId={post.id} />
      </Island>

      {/* Interactive island */}
      <Island>
        <CommentSection postId={post.id} />
      </Island>
    </article>
  )
}
```

### Benefits

- **Smaller Bundles** - Only hydrate interactive parts
- **Faster Hydration** - Less JavaScript to execute
- **Better Performance** - Especially on mobile
- **Progressive Enhancement** - Works without JS

## Express Integration

```typescript
import express from 'express'
import { renderToString } from '@nadi/prerender'
import { collectMeta } from '@nadi/meta'

const app = express()

// Serve static files
app.use(express.static('public'))

// SSR handler
app.get('*', async (req, res) => {
  const metaCollector = collectMeta()

  try {
    const html = await renderToString(
      () => <App url={req.url} />,
      { metaCollector }
    )

    const { title, meta, links } = metaCollector.getTags()

    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>${title}</title>
          ${meta.map(m => `<meta ${Object.entries(m).map(([k, v]) => `${k}="${v}"`).join(' ')} />`).join('\n')}
          ${links.map(l => `<link ${Object.entries(l).map(([k, v]) => `${k}="${v}"`).join(' ')} />`).join('\n')}
        </head>
        <body>
          <div id="app">${html}</div>
          <script src="/client.js"></script>
        </body>
      </html>
    `)
  } catch (error) {
    res.status(500).send('Server Error')
  }
})

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000')
})
```

## Laravel Integration

### Blade Template

```blade
{{-- resources/views/app.blade.php --}}
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $title ?? 'My App' }}</title>
    {!! $meta ?? '' !!}
    @vite(['resources/css/app.css', 'resources/js/app.ts'])
</head>
<body>
    <div id="app">{!! $html !!}</div>
    <script>
        window.__INITIAL_DATA__ = @json($initialData ?? []);
    </script>
</body>
</html>
```

### Controller

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AppController extends Controller
{
    public function show(Request $request)
    {
        // Node.js subprocess for SSR
        $html = $this->renderApp($request->url());

        return view('app', [
            'html' => $html,
            'title' => 'My App',
        ]);
    }

    private function renderApp($url)
    {
        // Call Node.js SSR server
        $ch = curl_init('http://localhost:3001/render');
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['url' => $url]));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $html = curl_exec($ch);
        curl_close($ch);

        return $html;
    }
}
```

## Performance Optimization

### Streaming

```typescript
import { renderToStream } from '@nadi/prerender'

app.get('*', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' })

  res.write(`
    <!DOCTYPE html>
    <html>
      <head><title>My App</title></head>
      <body><div id="app">
  `)

  const stream = renderToStream(() => <App url={req.url} />)

  stream.on('data', chunk => res.write(chunk))
  stream.on('end', () => {
    res.write(`</div><script src="/client.js"></script></body></html>`)
    res.end()
  })
})
```

### Caching

```typescript
import NodeCache from 'node-cache'

const cache = new NodeCache({ stdTTL: 600 }) // 10 minutes

app.get('*', async (req, res) => {
  const cacheKey = req.url

  // Check cache
  let html = cache.get(cacheKey)

  if (!html) {
    html = await renderToString(() => <App url={req.url} />)
    cache.set(cacheKey, html)
  }

  res.send(wrapHTML(html))
})
```

### Code Splitting

```typescript
// Lazy load components
const BlogPost = lazy(() => import('./components/BlogPost'))

function App() {
  return (
    <Router>
      <Route path="/" component={HomePage} />
      <Route path="/blog/:slug" component={BlogPost} />
    </Router>
  )
}
```

## Error Handling

### Error Boundaries

```typescript
import { ErrorBoundary } from '@nadi/prerender'

function App() {
  return (
    <ErrorBoundary fallback={(error) => (
      <div>
        <h1>Something went wrong</h1>
        <pre>{error.message}</pre>
      </div>
    )}>
      <Router>
        <Routes />
      </Router>
    </ErrorBoundary>
  )
}
```

### Server Errors

```typescript
app.get('*', async (req, res) => {
  try {
    const html = await renderToString(() => <App url={req.url} />)
    res.send(wrapHTML(html))
  } catch (error) {
    console.error('SSR Error:', error)

    // Fallback to client-side rendering
    res.send(`
      <!DOCTYPE html>
      <html>
        <body>
          <div id="app"></div>
          <script src="/client.js"></script>
        </body>
      </html>
    `)
  }
})
```

## Testing SSR

```typescript
import { renderToString } from '@nadi/prerender'

test('renders component to string', async () => {
  const html = await renderToString(() => (
    <div>
      <h1>Hello</h1>
      <p>World</p>
    </div>
  ))

  expect(html).toContain('<h1>Hello</h1>')
  expect(html).toContain('<p>World</p>')
})

test('includes meta tags', async () => {
  const html = await renderToString(() => (
    <div>
      <Title>Test Page</Title>
      <Meta name="description" content="Test" />
      <h1>Content</h1>
    </div>
  ))

  expect(html).toContain('Test Page')
  expect(html).toContain('description')
})
```

## Best Practices

✅ **Do:**

- Use SSR for public content
- Cache rendered pages
- Implement error boundaries
- Stream for large pages
- Use islands for interactivity

❌ **Don't:**

- SSR private/user-specific data
- Forget hydration
- Block render on slow APIs
- Render entire app as island
- Ignore SEO meta tags

## Next Steps

- Learn about [Prerendering](/guide/prerender) static sites
- Understand [Performance](/guide/performance) optimization
- Explore [Laravel Integration](/guide/laravel)
- Read the [SSR API Reference](/api/prerender)
