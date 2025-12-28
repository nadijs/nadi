# Laravel Integration

Nadi provides seamless integration with Laravel through the `@nadi/adapter-laravel` package, enabling server-side rendering, API integration, and real-time features.

## Installation

### Backend (Laravel)

```bash
composer require nadi/laravel-adapter
```

### Frontend (Nadi)

```bash
npm install @nadi/adapter-laravel
```

## Quick Start

### 1. Configure Laravel

Publish configuration:

```bash
php artisan vendor:publish --tag=nadi-config
```

Configure in `config/nadi.php`:

```php
<?php

return [
    'ssr' => [
        'enabled' => env('NADI_SSR_ENABLED', true),
        'server_url' => env('NADI_SSR_SERVER_URL', 'http://localhost:3001'),
    ],

    'routes' => [
        'prefix' => '',
        'middleware' => ['web'],
    ],
];
```

### 2. Setup Controller

```php
<?php

namespace App\Http\Controllers;

use Nadi\Laravel\NadiController;

class AppController extends NadiController
{
    public function show()
    {
        return $this->render('app', [
            'user' => auth()->user(),
            'config' => config('app'),
        ]);
    }
}
```

### 3. Setup Routes

```php
// routes/web.php
use App\Http\Controllers\AppController;

Route::get('/{any}', [AppController::class, 'show'])
    ->where('any', '.*');
```

### 4. Create Blade Template

```blade
{{-- resources/views/app.blade.php --}}
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ $title ?? config('app.name') }}</title>

    @vite(['resources/css/app.css', 'resources/js/app.ts'])
</head>
<body>
    <div id="app">{!! $html ?? '' !!}</div>

    <script>
        window.__INITIAL_STATE__ = @json($state ?? []);
        window.Laravel = {
            csrfToken: '{{ csrf_token() }}',
            user: @json(auth()->user()),
        };
    </script>
</body>
</html>
```

### 5. Setup Frontend

```typescript
// resources/js/app.ts
import { hydrate } from '@nadi/core'
import { LaravelAdapter } from '@nadi/adapter-laravel'
import App from './App'

const adapter = new LaravelAdapter({
  csrfToken: window.Laravel.csrfToken,
  apiUrl: '/api',
})

hydrate(
  () => <App adapter={adapter} />,
  document.getElementById('app')
)
```

## API Integration

### Making Requests

```typescript
import { useLaravel } from '@nadi/adapter-laravel'

function UserList() {
  const laravel = useLaravel()
  const [users, setUsers] = signal<User[]>([])
  const [loading, setLoading] = signal(true)

  effect(() => {
    laravel.get('/api/users')
      .then(response => {
        setUsers(response.data)
        setLoading(false)
      })
  })

  if (loading()) return <div>Loading...</div>

  return (
    <ul>
      {users().map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}
```

### POST Requests

```typescript
function CreateUser() {
  const laravel = useLaravel()
  const [name, setName] = signal('')
  const [email, setEmail] = signal('')

  const handleSubmit = async (e: Event) => {
    e.preventDefault()

    try {
      const response = await laravel.post('/api/users', {
        name: name(),
        email: email()
      })

      alert('User created!')
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <form onsubmit={handleSubmit}>
      <input
        value={name()}
        oninput={(e) => setName((e.target as HTMLInputElement).value)}
      />
      <input
        value={email()}
        oninput={(e) => setEmail((e.target as HTMLInputElement).value)}
      />
      <button type="submit">Create</button>
    </form>
  )
}
```

### File Upload

```typescript
function FileUpload() {
  const laravel = useLaravel()
  const [file, setFile] = signal<File | null>(null)

  const handleUpload = async () => {
    if (!file()) return

    const formData = new FormData()
    formData.append('file', file()!)

    await laravel.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }

  return (
    <div>
      <input
        type="file"
        onchange={(e) => {
          const files = (e.target as HTMLInputElement).files
          if (files && files[0]) setFile(files[0])
        }}
      />
      <button onclick={handleUpload}>Upload</button>
    </div>
  )
}
```

## Authentication

### Checking Auth State

```typescript
function Navigation() {
  const laravel = useLaravel()
  const user = laravel.user()

  return (
    <nav>
      {user ? (
        <>
          <span>Welcome, {user.name}</span>
          <button onclick={() => laravel.logout()}>Logout</button>
        </>
      ) : (
        <a href="/login">Login</a>
      )}
    </nav>
  )
}
```

### Login

```typescript
function LoginForm() {
  const laravel = useLaravel()
  const [email, setEmail] = signal('')
  const [password, setPassword] = signal('')
  const [error, setError] = signal('')

  const handleLogin = async (e: Event) => {
    e.preventDefault()

    try {
      await laravel.login({
        email: email(),
        password: password()
      })

      window.location.href = '/dashboard'
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <form onsubmit={handleLogin}>
      {error() && <div class="error">{error()}</div>}

      <input
        type="email"
        value={email()}
        oninput={(e) => setEmail((e.target as HTMLInputElement).value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password()}
        oninput={(e) => setPassword((e.target as HTMLInputElement).value)}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  )
}
```

### Protected Routes

```typescript
import { useRouter } from '@nadi/router'
import { useLaravel } from '@nadi/adapter-laravel'

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const laravel = useLaravel()
  const router = useRouter()

  effect(() => {
    if (!laravel.user()) {
      router.push('/login')
    }
  })

  if (!laravel.user()) {
    return <div>Loading...</div>
  }

  return children
}

// Usage
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```

## Form Validation

### Laravel Validation

```php
// app/Http/Controllers/UserController.php
public function store(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|min:3|max:255',
        'email' => 'required|email|unique:users',
        'password' => 'required|min:8',
    ]);

    $user = User::create($validated);

    return response()->json($user, 201);
}
```

### Frontend Integration

```typescript
import { createForm } from '@nadi/forms'
import { useLaravel } from '@nadi/adapter-laravel'

function UserForm() {
  const laravel = useLaravel()

  const form = createForm({
    initialValues: {
      name: '',
      email: '',
      password: ''
    },
    onSubmit: async (values) => {
      try {
        const response = await laravel.post('/api/users', values)
        alert('User created!')
        form.reset()
      } catch (error: any) {
        // Laravel returns validation errors
        if (error.response?.status === 422) {
          const errors = error.response.data.errors

          Object.entries(errors).forEach(([field, messages]) => {
            form.setFieldError(field, (messages as string[])[0])
          })
        }
      }
    }
  })

  return (
    <form onsubmit={form.handleSubmit}>
      <input
        value={form.values.name()}
        oninput={(e) => form.setFieldValue('name', (e.target as HTMLInputElement).value)}
      />
      {form.errors.name() && <span>{form.errors.name()}</span>}

      <input
        type="email"
        value={form.values.email()}
        oninput={(e) => form.setFieldValue('email', (e.target as HTMLInputElement).value)}
      />
      {form.errors.email() && <span>{form.errors.email()}</span>}

      <input
        type="password"
        value={form.values.password()}
        oninput={(e) => form.setFieldValue('password', (e.target as HTMLInputElement).value)}
      />
      {form.errors.password() && <span>{form.errors.password()}</span>}

      <button type="submit" disabled={form.isSubmitting()}>
        {form.isSubmitting() ? 'Creating...' : 'Create User'}
      </button>
    </form>
  )
}
```

## Laravel Echo Integration

### Backend Setup

```php
// config/broadcasting.php
'connections' => [
    'pusher' => [
        'driver' => 'pusher',
        'key' => env('PUSHER_APP_KEY'),
        'secret' => env('PUSHER_APP_SECRET'),
        'app_id' => env('PUSHER_APP_ID'),
        'options' => [
            'cluster' => env('PUSHER_APP_CLUSTER'),
            'useTLS' => true,
        ],
    ],
],
```

### Frontend Setup

```typescript
import { createEcho } from '@nadi/echo'
import { useLaravel } from '@nadi/adapter-laravel'

function App() {
  const laravel = useLaravel()

  const echo = createEcho({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    forceTLS: true,
    authEndpoint: '/broadcasting/auth',
    auth: {
      headers: {
        'X-CSRF-TOKEN': laravel.csrfToken(),
      }
    }
  })

  return <Main echo={echo} />
}
```

## Resource Controllers

### Laravel Resource API

```php
// app/Http/Controllers/Api/PostController.php
namespace App\Http\Controllers\Api;

use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function index()
    {
        return Post::paginate(20);
    }

    public function show(Post $post)
    {
        return $post;
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required',
            'content' => 'required',
        ]);

        return Post::create($validated);
    }

    public function update(Request $request, Post $post)
    {
        $validated = $request->validate([
            'title' => 'required',
            'content' => 'required',
        ]);

        $post->update($validated);

        return $post;
    }

    public function destroy(Post $post)
    {
        $post->delete();

        return response()->noContent();
    }
}
```

### Frontend CRUD

```typescript
function PostManager() {
  const laravel = useLaravel()
  const [posts, setPosts] = signal<Post[]>([])

  // List
  const fetchPosts = async () => {
    const response = await laravel.get('/api/posts')
    setPosts(response.data.data)
  }

  // Create
  const createPost = async (post: Partial<Post>) => {
    const response = await laravel.post('/api/posts', post)
    setPosts([...posts(), response.data])
  }

  // Update
  const updatePost = async (id: number, post: Partial<Post>) => {
    const response = await laravel.put(`/api/posts/${id}`, post)
    setPosts(posts().map(p => p.id === id ? response.data : p))
  }

  // Delete
  const deletePost = async (id: number) => {
    await laravel.delete(`/api/posts/${id}`)
    setPosts(posts().filter(p => p.id !== id))
  }

  effect(() => {
    fetchPosts()
  })

  return (
    <div>
      {posts().map(post => (
        <PostItem
          key={post.id}
          post={post}
          onUpdate={(updated) => updatePost(post.id, updated)}
          onDelete={() => deletePost(post.id)}
        />
      ))}
    </div>
  )
}
```

## Pagination

```typescript
function PostList() {
  const laravel = useLaravel()
  const [posts, setPosts] = signal<Post[]>([])
  const [currentPage, setCurrentPage] = signal(1)
  const [lastPage, setLastPage] = signal(1)

  const fetchPosts = async (page: number) => {
    const response = await laravel.get(`/api/posts?page=${page}`)
    setPosts(response.data.data)
    setCurrentPage(response.data.current_page)
    setLastPage(response.data.last_page)
  }

  effect(() => {
    fetchPosts(currentPage())
  })

  return (
    <div>
      <div class="posts">
        {posts().map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      <div class="pagination">
        <button
          disabled={currentPage() === 1}
          onclick={() => setCurrentPage(currentPage() - 1)}
        >
          Previous
        </button>

        <span>Page {currentPage()} of {lastPage()}</span>

        <button
          disabled={currentPage() === lastPage()}
          onclick={() => setCurrentPage(currentPage() + 1)}
        >
          Next
        </button>
      </div>
    </div>
  )
}
```

## Middleware

### Laravel Middleware

```php
// app/Http/Middleware/NadiMiddleware.php
namespace App\Http\Middleware;

use Closure;

class NadiMiddleware
{
    public function handle($request, Closure $next)
    {
        // Add custom headers
        $response = $next($request);

        $response->header('X-Nadi-Version', '0.2.0');

        return $response;
    }
}
```

### Apply Middleware

```php
// routes/api.php
Route::middleware(['api', 'nadi'])->group(function () {
    Route::apiResource('posts', PostController::class);
});
```

## Best Practices

✅ **Do:**

- Use Laravel's validation
- Implement proper authentication
- Cache API responses
- Use resource controllers
- Handle CSRF tokens
- Use API versioning

❌ **Don't:**

- Expose sensitive data
- Skip validation
- Ignore error handling
- Mix SPA and blade views
- Forget rate limiting
- Hardcode API URLs

## Deployment

### Build Frontend

```bash
npm run build
```

### Laravel Configuration

```php
// config/app.php
'asset_url' => env('ASSET_URL', null),

// .env
ASSET_URL=https://cdn.example.com
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name example.com;
    root /var/www/html/public;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

## Next Steps

- Learn about [Forms](/guide/forms) integration
- Understand [Echo](/guide/echo) for real-time features
- Explore [SSR](/guide/ssr) with Laravel
- Read the [Laravel Adapter API](/api/adapter-laravel)
