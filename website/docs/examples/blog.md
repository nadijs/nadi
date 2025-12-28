# Blog with SSR Example

Build a blog with server-side rendering, dynamic routes, and SEO optimization.

## Complete Blog Application

Full-featured blog with SSR, routing, and meta tags.

```typescript
import { signal, computed } from '@nadi/core'
import { createRouter, useRoute, useRouter } from '@nadi/router'
import { useMeta } from '@nadi/meta'

// Types
type Post = {
  id: number
  slug: string
  title: string
  excerpt: string
  content: string
  author: string
  date: string
  tags: string[]
  coverImage?: string
}

// API Client
class BlogAPI {
  static async fetchPosts(page = 1, limit = 10): Promise<Post[]> {
    const response = await fetch(`/api/posts?page=${page}&limit=${limit}`)
    return response.json()
  }

  static async fetchPost(slug: string): Promise<Post> {
    const response = await fetch(`/api/posts/${slug}`)
    return response.json()
  }

  static async fetchPostsByTag(tag: string): Promise<Post[]> {
    const response = await fetch(`/api/posts/tag/${tag}`)
    return response.json()
  }

  static async searchPosts(query: string): Promise<Post[]> {
    const response = await fetch(`/api/posts/search?q=${encodeURIComponent(query)}`)
    return response.json()
  }
}

// Router Setup
const router = createRouter({
  routes: [
    { path: '/', component: Home },
    { path: '/blog', component: BlogList },
    { path: '/blog/:slug', component: BlogPost },
    { path: '/tag/:tag', component: TagPage },
    { path: '/search', component: SearchPage }
  ]
})

// Home Page
function Home() {
  const recentPosts = signal<Post[]>([])
  const loading = signal(true)

  // Fetch recent posts
  effect(() => {
    BlogAPI.fetchPosts(1, 5).then(posts => {
      recentPosts.set(posts)
      loading.set(false)
    })
  })

  // SEO
  useMeta({
    title: 'My Blog - Web Development & Programming',
    meta: [
      { name: 'description', content: 'Tutorials, articles, and insights about web development' },
      { property: 'og:title', content: 'My Blog' },
      { property: 'og:description', content: 'Web development tutorials and articles' },
      { property: 'og:type', content: 'website' }
    ]
  })

  if (loading()) return <Loading />

  return (
    <div class="home">
      <Hero />

      <section class="recent-posts">
        <h2>Recent Posts</h2>
        <div class="posts-grid">
          {recentPosts().map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
        <a href="/blog" class="view-all">View All Posts →</a>
      </section>
    </div>
  )
}

function Hero() {
  return (
    <section class="hero">
      <h1>Welcome to My Blog</h1>
      <p>Exploring web development, one post at a time</p>
      <div class="cta">
        <a href="/blog" class="btn-primary">Read Articles</a>
        <a href="/search" class="btn-secondary">Search</a>
      </div>
    </section>
  )
}

// Blog List Page
function BlogList() {
  const posts = signal<Post[]>([])
  const page = signal(1)
  const loading = signal(true)
  const hasMore = signal(true)

  const route = useRoute()
  const currentPage = computed(() => Number(route().query.page) || 1)

  effect(() => {
    const pageNum = currentPage()
    loading.set(true)

    BlogAPI.fetchPosts(pageNum).then(result => {
      posts.set(result)
      hasMore.set(result.length === 10)
      loading.set(false)
    })
  })

  useMeta({
    title: `Blog Posts - Page ${currentPage()}`,
    meta: [
      { name: 'description', content: 'Browse all blog posts' }
    ]
  })

  return (
    <div class="blog-list">
      <header>
        <h1>All Posts</h1>
        <SearchBox />
      </header>

      {loading() ? (
        <Loading />
      ) : (
        <>
          <div class="posts">
            {posts().map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          <Pagination
            current={currentPage()}
            hasMore={hasMore()}
          />
        </>
      )}
    </div>
  )
}

// Blog Post Page
function BlogPost() {
  const post = signal<Post | null>(null)
  const loading = signal(true)
  const route = useRoute()

  const slug = computed(() => route().params.slug)

  effect(() => {
    loading.set(true)

    BlogAPI.fetchPost(slug()).then(data => {
      post.set(data)
      loading.set(false)
    })
  })

  // Dynamic SEO based on post
  effect(() => {
    const p = post()
    if (!p) return

    useMeta({
      title: p.title,
      meta: [
        { name: 'description', content: p.excerpt },
        { name: 'author', content: p.author },
        { property: 'og:title', content: p.title },
        { property: 'og:description', content: p.excerpt },
        { property: 'og:type', content: 'article' },
        { property: 'og:image', content: p.coverImage },
        { property: 'article:published_time', content: p.date },
        { property: 'article:author', content: p.author },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: p.title },
        { name: 'twitter:description', content: p.excerpt }
      ],
      link: [
        { rel: 'canonical', href: `https://myblog.com/blog/${p.slug}` }
      ],
      script: [
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: p.title,
            description: p.excerpt,
            author: {
              '@type': 'Person',
              name: p.author
            },
            datePublished: p.date,
            image: p.coverImage
          })
        }
      ]
    })
  })

  if (loading()) return <Loading />
  if (!post()) return <NotFound />

  const p = post()!

  return (
    <article class="blog-post">
      {p.coverImage && (
        <img src={p.coverImage} alt={p.title} class="cover-image" />
      )}

      <header class="post-header">
        <h1>{p.title}</h1>
        <div class="post-meta">
          <span class="author">By {p.author}</span>
          <span class="date">{formatDate(p.date)}</span>
        </div>
        <div class="tags">
          {p.tags.map(tag => (
            <a key={tag} href={`/tag/${tag}`} class="tag">
              #{tag}
            </a>
          ))}
        </div>
      </header>

      <div class="post-content" innerHTML={renderMarkdown(p.content)} />

      <footer class="post-footer">
        <ShareButtons post={p} />
        <RelatedPosts tags={p.tags} currentSlug={p.slug} />
      </footer>
    </article>
  )
}

// Post Card Component
function PostCard({ post }: { post: Post }) {
  return (
    <article class="post-card">
      {post.coverImage && (
        <a href={`/blog/${post.slug}`}>
          <img src={post.coverImage} alt={post.title} />
        </a>
      )}

      <div class="post-card-content">
        <h3>
          <a href={`/blog/${post.slug}`}>{post.title}</a>
        </h3>

        <p class="excerpt">{post.excerpt}</p>

        <div class="post-card-meta">
          <span class="date">{formatDate(post.date)}</span>
          <div class="tags">
            {post.tags.slice(0, 3).map(tag => (
              <a key={tag} href={`/tag/${tag}`} class="tag">
                #{tag}
              </a>
            ))}
          </div>
        </div>

        <a href={`/blog/${post.slug}`} class="read-more">
          Read More →
        </a>
      </div>
    </article>
  )
}

// Tag Page
function TagPage() {
  const posts = signal<Post[]>([])
  const loading = signal(true)
  const route = useRoute()

  const tag = computed(() => route().params.tag)

  effect(() => {
    loading.set(true)

    BlogAPI.fetchPostsByTag(tag()).then(result => {
      posts.set(result)
      loading.set(false)
    })
  })

  useMeta({
    title: `Posts tagged "${tag()}"`,
    meta: [
      { name: 'description', content: `All posts about ${tag()}` }
    ]
  })

  return (
    <div class="tag-page">
      <header>
        <h1>Posts tagged #{tag()}</h1>
        <p>{posts().length} posts found</p>
      </header>

      {loading() ? (
        <Loading />
      ) : (
        <div class="posts">
          {posts().map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}

// Search Page
function SearchPage() {
  const query = signal('')
  const results = signal<Post[]>([])
  const loading = signal(false)
  const searched = signal(false)

  const route = useRoute()

  effect(() => {
    const q = route().query.q as string
    if (q) {
      query.set(q)
      performSearch(q)
    }
  })

  const performSearch = (q: string) => {
    if (!q.trim()) return

    loading.set(true)
    searched.set(true)

    BlogAPI.searchPosts(q).then(posts => {
      results.set(posts)
      loading.set(false)
    })
  }

  const handleSubmit = (e: Event) => {
    e.preventDefault()
    const router = useRouter()
    router.push(`/search?q=${encodeURIComponent(query())}`)
  }

  return (
    <div class="search-page">
      <header>
        <h1>Search Posts</h1>
        <form onsubmit={handleSubmit}>
          <input
            type="search"
            value={query()}
            oninput={e => query.set((e.target as HTMLInputElement).value)}
            placeholder="Search articles..."
            autofocus
          />
          <button type="submit">Search</button>
        </form>
      </header>

      {loading() && <Loading />}

      {!loading() && searched() && (
        <div class="search-results">
          <p>{results().length} results found</p>

          {results().length > 0 ? (
            <div class="posts">
              {results().map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <p class="no-results">No posts found. Try a different search term.</p>
          )}
        </div>
      )}
    </div>
  )
}

// Components
function SearchBox() {
  const query = signal('')
  const router = useRouter()

  const handleSubmit = (e: Event) => {
    e.preventDefault()
    router.push(`/search?q=${encodeURIComponent(query())}`)
  }

  return (
    <form class="search-box" onsubmit={handleSubmit}>
      <input
        type="search"
        value={query()}
        oninput={e => query.set((e.target as HTMLInputElement).value)}
        placeholder="Search..."
      />
    </form>
  )
}

function Pagination({ current, hasMore }: { current: number; hasMore: boolean }) {
  const router = useRouter()

  return (
    <nav class="pagination">
      {current > 1 && (
        <a href={`/blog?page=${current - 1}`} class="btn">
          ← Previous
        </a>
      )}

      <span class="current-page">Page {current}</span>

      {hasMore && (
        <a href={`/blog?page=${current + 1}`} class="btn">
          Next →
        </a>
      )}
    </nav>
  )
}

function ShareButtons({ post }: { post: Post }) {
  const url = `https://myblog.com/blog/${post.slug}`
  const text = post.title

  return (
    <div class="share-buttons">
      <h4>Share this post</h4>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener"
        class="share-btn twitter"
      >
        Twitter
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener"
        class="share-btn facebook"
      >
        Facebook
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener"
        class="share-btn linkedin"
      >
        LinkedIn
      </a>
    </div>
  )
}

function RelatedPosts({ tags, currentSlug }: { tags: string[]; currentSlug: string }) {
  const posts = signal<Post[]>([])

  effect(() => {
    // Fetch posts with similar tags
    Promise.all(tags.map(tag => BlogAPI.fetchPostsByTag(tag)))
      .then(results => {
        const allPosts = results.flat()
        const unique = Array.from(new Map(allPosts.map(p => [p.id, p])).values())
        const filtered = unique.filter(p => p.slug !== currentSlug).slice(0, 3)
        posts.set(filtered)
      })
  })

  if (posts().length === 0) return null

  return (
    <section class="related-posts">
      <h4>Related Posts</h4>
      <div class="posts-list">
        {posts().map(post => (
          <article key={post.id}>
            <a href={`/blog/${post.slug}`}>
              <h5>{post.title}</h5>
              <p>{post.excerpt}</p>
            </a>
          </article>
        ))}
      </div>
    </section>
  )
}

function Loading() {
  return (
    <div class="loading">
      <div class="spinner"></div>
      <p>Loading...</p>
    </div>
  )
}

function NotFound() {
  return (
    <div class="not-found">
      <h1>404 - Post Not Found</h1>
      <p>The post you're looking for doesn't exist.</p>
      <a href="/blog" class="btn-primary">Back to Blog</a>
    </div>
  )
}

// Utilities
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function renderMarkdown(markdown: string): string {
  // Simple markdown rendering (use a library like marked.js in production)
  return markdown
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    .replace(/\n/g, '<br>')
}
```

## Laravel Backend

```php
// app/Http/Controllers/BlogController.php
namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;

class BlogController extends Controller
{
    public function index(Request $request)
    {
        $posts = Post::with('author')
            ->published()
            ->orderBy('published_at', 'desc')
            ->paginate($request->input('limit', 10));

        return response()->json($posts);
    }

    public function show($slug)
    {
        $post = Post::with('author', 'tags')
            ->where('slug', $slug)
            ->published()
            ->firstOrFail();

        return response()->json($post);
    }

    public function byTag($tag)
    {
        $posts = Post::whereHas('tags', function($query) use ($tag) {
            $query->where('name', $tag);
        })
        ->published()
        ->orderBy('published_at', 'desc')
        ->get();

        return response()->json($posts);
    }

    public function search(Request $request)
    {
        $query = $request->input('q');

        $posts = Post::where('title', 'LIKE', "%{$query}%")
            ->orWhere('content', 'LIKE', "%{$query}%")
            ->published()
            ->orderBy('published_at', 'desc')
            ->get();

        return response()->json($posts);
    }
}

// routes/api.php
Route::get('/posts', [BlogController::class, 'index']);
Route::get('/posts/{slug}', [BlogController::class, 'show']);
Route::get('/posts/tag/{tag}', [BlogController::class, 'byTag']);
Route::get('/posts/search', [BlogController::class, 'search']);
```

## SSR Setup

```typescript
// server.ts
import express from 'express'
import { renderToString } from '@nadi/core'
import { collectMeta } from '@nadi/meta'

const app = express()

app.get('/blog/:slug', async (req, res) => {
  const { slug } = req.params

  // Fetch data server-side
  const post = await fetch(`http://localhost/api/posts/${slug}`).then(r => r.json())

  // Render component
  const html = renderToString(() => <BlogPost initialPost={post} />)

  // Collect meta tags
  const meta = collectMeta()

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        ${meta}
        <link rel="stylesheet" href="/styles.css">
      </head>
      <body>
        <div id="app">${html}</div>
        <script>window.__INITIAL_DATA__ = ${JSON.stringify({ post })}</script>
        <script src="/bundle.js"></script>
      </body>
    </html>
  `)
})

app.listen(3000)
```

## Styling

```css
.blog-list {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
}

.post-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.post-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.post-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.post-card-content {
  padding: 1.5rem;
}

.post-card h3 {
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
}

.post-card h3 a {
  color: #333;
  text-decoration: none;
}

.post-card .excerpt {
  color: #666;
  line-height: 1.6;
  margin: 0 0 1rem;
}

.post-card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  color: #888;
  margin-bottom: 1rem;
}

.tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  background: #f0f0f0;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  text-decoration: none;
  color: #666;
}

.tag:hover {
  background: #e0e0e0;
}

.blog-post {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.cover-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.post-header {
  margin-bottom: 2rem;
}

.post-header h1 {
  font-size: 2.5rem;
  margin: 0 0 1rem;
}

.post-meta {
  display: flex;
  gap: 1rem;
  color: #666;
  margin-bottom: 1rem;
}

.post-content {
  line-height: 1.8;
  font-size: 1.125rem;
}

.post-content h2 {
  margin: 2rem 0 1rem;
}

.post-content img {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
}

.share-buttons {
  margin: 3rem 0;
  padding: 2rem 0;
  border-top: 1px solid #eee;
}

.share-btn {
  display: inline-block;
  padding: 0.5rem 1rem;
  margin-right: 0.5rem;
  border-radius: 4px;
  text-decoration: none;
  color: white;
}

.share-btn.twitter {
  background: #1da1f2;
}
.share-btn.facebook {
  background: #4267b2;
}
.share-btn.linkedin {
  background: #0077b5;
}
```

## Key Concepts

- **Dynamic Routes**: Use router params for post slugs
- **SEO Optimization**: Meta tags, Open Graph, structured data
- **SSR**: Server-side rendering for better SEO and performance
- **Data Fetching**: Load data based on routes
- **Markdown Rendering**: Convert markdown to HTML
- **Social Sharing**: Share buttons for social media

## Next Steps

- Learn about [Routing](/guide/routing)
- Explore [Meta Tags](/guide/meta)
- Understand [SSR](/guide/ssr)
- Read [Laravel Integration](/guide/laravel)
