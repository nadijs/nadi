# Next.js Integration

Nadi integrates seamlessly with Next.js, combining Nadi's reactive primitives with Next.js's powerful App Router, Server Components, and deployment features.

## Installation

```bash
npm install @nadi/core @nadi/adapter-nextjs @nadi/router
```

## Quick Start

### 1. Configure Next.js

```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
```

### 2. Root Layout

```typescript
// app/layout.tsx
import { NadiProvider } from '@nadi/adapter-nextjs'
import './globals.css'

export const metadata = {
  title: 'My Nadi App',
  description: 'Built with Nadi and Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <NadiProvider>
          {children}
        </NadiProvider>
      </body>
    </html>
  )
}
```

### 3. Page Component

```typescript
// app/page.tsx
'use client'

import { signal } from '@nadi/core'

export default function Home() {
  const count = signal(0)

  return (
    <div>
      <h1>Count: {count()}</h1>
      <button onclick={() => count.set(count() + 1)}>
        Increment
      </button>
    </div>
  )
}
```

## App Router Integration

### Server Components

```typescript
// app/posts/page.tsx
import { getPosts } from '@/lib/api'
import { PostList } from '@/components/PostList'

export default async function PostsPage() {
  const posts = await getPosts()

  return (
    <div>
      <h1>Posts</h1>
      <PostList initialPosts={posts} />
    </div>
  )
}
```

### Client Components

```typescript
// components/PostList.tsx
'use client'

import { signal } from '@nadi/core'
import { Post } from '@/types'

export function PostList({ initialPosts }: { initialPosts: Post[] }) {
  const posts = signal(initialPosts)
  const filter = signal('')

  const filteredPosts = computed(() => {
    const term = filter().toLowerCase()
    return posts().filter(post =>
      post.title.toLowerCase().includes(term)
    )
  })

  return (
    <div>
      <input
        type="search"
        value={filter()}
        oninput={(e) => filter.set((e.target as HTMLInputElement).value)}
        placeholder="Filter posts..."
      />

      <ul>
        {filteredPosts().map(post => (
          <li key={post.id}>
            <a href={`/posts/${post.id}`}>{post.title}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

### Dynamic Routes

```typescript
// app/posts/[id]/page.tsx
import { getPost } from '@/lib/api'
import { PostDetail } from '@/components/PostDetail'

export async function generateStaticParams() {
  const posts = await getPosts()

  return posts.map((post) => ({
    id: String(post.id),
  }))
}

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await getPost(params.id)

  return <PostDetail post={post} />
}
```

## API Routes

### Route Handlers

```typescript
// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  const posts = await db.posts.findAll();
  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const post = await db.posts.create(body);
  return NextResponse.json(post, { status: 201 });
}
```

### Dynamic API Routes

```typescript
// app/api/posts/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const post = await db.posts.findById(params.id);

  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  return NextResponse.json(post);
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json();
  const post = await db.posts.update(params.id, body);

  return NextResponse.json(post);
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  await db.posts.delete(params.id);
  return new NextResponse(null, { status: 204 });
}
```

### Frontend API Calls

```typescript
'use client'

import { signal, effect } from '@nadi/core'

function Posts() {
  const posts = signal<Post[]>([])
  const loading = signal(true)

  effect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => {
        posts.set(data)
        loading.set(false)
      })
  })

  if (loading()) return <div>Loading...</div>

  return (
    <ul>
      {posts().map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

## Server Actions

### Define Server Action

```typescript
// app/actions/posts.ts
'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  await db.posts.create({ title, content });

  revalidatePath('/posts');

  return { success: true };
}

export async function deletePost(id: string) {
  await db.posts.delete(id);

  revalidatePath('/posts');

  return { success: true };
}
```

### Use Server Action

```typescript
'use client'

import { signal } from '@nadi/core'
import { createPost } from '@/app/actions/posts'

export function CreatePostForm() {
  const title = signal('')
  const content = signal('')
  const pending = signal(false)

  const handleSubmit = async (e: Event) => {
    e.preventDefault()
    pending.set(true)

    const formData = new FormData()
    formData.append('title', title())
    formData.append('content', content())

    try {
      await createPost(formData)
      title.set('')
      content.set('')
      alert('Post created!')
    } finally {
      pending.set(false)
    }
  }

  return (
    <form onsubmit={handleSubmit}>
      <input
        value={title()}
        oninput={(e) => title.set((e.target as HTMLInputElement).value)}
        placeholder="Title"
      />
      <textarea
        value={content()}
        oninput={(e) => content.set((e.target as HTMLTextAreaElement).value)}
        placeholder="Content"
      />
      <button type="submit" disabled={pending()}>
        {pending() ? 'Creating...' : 'Create Post'}
      </button>
    </form>
  )
}
```

## Data Fetching

### Server-Side Fetching

```typescript
// app/posts/page.tsx
import { cache } from 'react'

const getPosts = cache(async () => {
  const res = await fetch('https://api.example.com/posts', {
    next: { revalidate: 60 } // Revalidate every 60 seconds
  })

  return res.json()
})

export default async function PostsPage() {
  const posts = await getPosts()

  return <PostList posts={posts} />
}
```

### Client-Side Fetching

```typescript
'use client'

import { signal, effect } from '@nadi/core'
import useSWR from 'swr'

function Posts() {
  const { data, error, isLoading } = useSWR('/api/posts', fetcher)

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading posts</div>

  return (
    <ul>
      {data.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}

const fetcher = (url: string) => fetch(url).then(res => res.json())
```

## Middleware

### Authentication Middleware

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');

  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/dashboard/:path*',
};
```

## Authentication

### NextAuth.js Integration

```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const user = await verifyCredentials(credentials);

        if (user) {
          return user;
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
```

### Using Auth in Components

```typescript
'use client'

import { useSession, signIn, signOut } from 'next-auth/react'

export function UserMenu() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session) {
    return <button onclick={() => signIn()}>Sign In</button>
  }

  return (
    <div>
      <span>Welcome, {session.user.name}</span>
      <button onclick={() => signOut()}>Sign Out</button>
    </div>
  )
}
```

## Static Site Generation (SSG)

### Static Pages

```typescript
// app/posts/[id]/page.tsx
export async function generateStaticParams() {
  const posts = await getPosts()

  return posts.map((post) => ({
    id: String(post.id),
  }))
}

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await getPost(params.id)

  return (
    <article>
      <h1>{post.title}</h1>
      <div>{post.content}</div>
    </article>
  )
}
```

### Incremental Static Regeneration (ISR)

```typescript
export const revalidate = 60 // Revalidate every 60 seconds

export default async function PostsPage() {
  const posts = await getPosts()

  return <PostList posts={posts} />
}
```

## Image Optimization

```typescript
import Image from 'next/image'

function PostCard({ post }: { post: Post }) {
  return (
    <div>
      <Image
        src={post.imageUrl}
        alt={post.title}
        width={600}
        height={400}
        priority
      />
      <h2>{post.title}</h2>
    </div>
  )
}
```

## Metadata

### Static Metadata

```typescript
// app/posts/[id]/page.tsx
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const post = await getPost(params.id);

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.imageUrl],
    },
  };
}
```

## Error Handling

### Error Boundary

```typescript
// app/posts/error.tsx
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <button onclick={reset}>Try again</button>
    </div>
  )
}
```

### Not Found

```typescript
// app/posts/[id]/not-found.tsx
export default function NotFound() {
  return (
    <div>
      <h2>Post Not Found</h2>
      <p>Could not find the requested post.</p>
    </div>
  )
}
```

## Loading States

```typescript
// app/posts/loading.tsx
export default function Loading() {
  return (
    <div>
      <div class="skeleton">Loading posts...</div>
    </div>
  )
}
```

## Best Practices

✅ **Do:**

- Use Server Components by default
- Add 'use client' only when needed
- Leverage ISR for dynamic content
- Use Server Actions for mutations
- Implement proper error boundaries
- Optimize images with next/image
- Use metadata API for SEO

❌ **Don't:**

- Make everything a Client Component
- Skip error handling
- Ignore loading states
- Fetch data in Client Components unnecessarily
- Skip image optimization
- Forget to revalidate cached data

## Deployment

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables

```bash
# .env.local
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000
```

### Build Command

```bash
npm run build
```

## Next Steps

- Learn about [SSR](/guide/ssr) concepts
- Explore [Routing](/guide/routing) in Nadi
- Understand [Forms](/guide/forms) handling
- Read the [Next.js Adapter API](/api/adapter-nextjs)
