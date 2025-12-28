# Django Integration

Nadi integrates seamlessly with Django through the `@nadi/adapter-django` package, enabling server-side rendering, REST API integration, and WebSocket communication.

## Installation

### Backend (Django)

```bash
pip install nadi-django
```

### Frontend (Nadi)

```bash
npm install @nadi/adapter-django
```

## Quick Start

### 1. Configure Django

Add to `settings.py`:

```python
INSTALLED_APPS = [
    # ...
    'nadi',
    'rest_framework',
    'channels',
]

NADI = {
    'SSR_ENABLED': True,
    'SSR_SERVER_URL': 'http://localhost:3001',
    'BUILD_DIR': BASE_DIR / 'frontend' / 'dist',
}

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]
```

### 2. Setup Views

```python
# views.py
from nadi.views import NadiView

class AppView(NadiView):
    def get_initial_state(self, request):
        return {
            'user': {
                'id': request.user.id,
                'username': request.user.username,
            } if request.user.is_authenticated else None,
            'csrf_token': get_token(request),
        }
```

### 3. Setup URLs

```python
# urls.py
from django.urls import path, re_path
from .views import AppView

urlpatterns = [
    path('api/', include('api.urls')),
    re_path(r'^.*$', AppView.as_view(), name='app'),
]
```

### 4. Create Template

```django
{# templates/app.html #}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token }}">
    <title>{% block title %}My App{% endblock %}</title>

    {% load static %}
    <link rel="stylesheet" href="{% static 'css/app.css' %}">
</head>
<body>
    <div id="app">{{ html|safe }}</div>

    <script>
        window.__INITIAL_STATE__ = {{ state|safe }};
        window.Django = {
            csrfToken: '{{ csrf_token }}',
            user: {{ user_json|safe }},
        };
    </script>

    <script type="module" src="{% static 'js/app.js' %}"></script>
</body>
</html>
```

### 5. Setup Frontend

```typescript
// src/app.ts
import { hydrate } from '@nadi/core'
import { DjangoAdapter } from '@nadi/adapter-django'
import App from './App'

const adapter = new DjangoAdapter({
  csrfToken: window.Django.csrfToken,
  apiUrl: '/api',
})

hydrate(
  () => <App adapter={adapter} />,
  document.getElementById('app')
)
```

## API Integration

### Django REST Framework

```python
# serializers.py
from rest_framework import serializers
from .models import Post

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'created_at', 'updated_at']

# views.py
from rest_framework import viewsets
from .models import Post
from .serializers import PostSerializer

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        # Filter by user if authenticated
        if self.request.user.is_authenticated:
            queryset = queryset.filter(author=self.request.user)
        return queryset

# urls.py
from rest_framework.routers import DefaultRouter
from .views import PostViewSet

router = DefaultRouter()
router.register(r'posts', PostViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
```

### Making Requests

```typescript
import { useDjango } from '@nadi/adapter-django'

function PostList() {
  const django = useDjango()
  const [posts, setPosts] = signal<Post[]>([])
  const [loading, setLoading] = signal(true)

  effect(() => {
    django.get('/api/posts/')
      .then(response => {
        setPosts(response.data)
        setLoading(false)
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

### POST Requests

```typescript
function CreatePost() {
  const django = useDjango()
  const [title, setTitle] = signal('')
  const [content, setContent] = signal('')

  const handleSubmit = async (e: Event) => {
    e.preventDefault()

    try {
      const response = await django.post('/api/posts/', {
        title: title(),
        content: content()
      })

      alert('Post created!')
      setTitle('')
      setContent('')
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <form onsubmit={handleSubmit}>
      <input
        value={title()}
        oninput={(e) => setTitle((e.target as HTMLInputElement).value)}
        placeholder="Title"
      />
      <textarea
        value={content()}
        oninput={(e) => setContent((e.target as HTMLTextAreaElement).value)}
        placeholder="Content"
      />
      <button type="submit">Create Post</button>
    </form>
  )
}
```

### File Upload

```python
# views.py
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import api_view, parser_classes

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def upload_file(request):
    file = request.FILES['file']
    # Process file
    return Response({'filename': file.name})
```

```typescript
function FileUpload() {
  const django = useDjango()
  const [file, setFile] = signal<File | null>(null)

  const handleUpload = async () => {
    if (!file()) return

    const formData = new FormData()
    formData.append('file', file()!)

    await django.post('/api/upload/', formData, {
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

### Django Authentication

```python
# views.py
from django.contrib.auth import authenticate, login, logout
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)

    if user is not None:
        login(request, user)
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
        })

    return Response({'error': 'Invalid credentials'}, status=400)

@api_view(['POST'])
def logout_view(request):
    logout(request)
    return Response({'message': 'Logged out'})
```

### Frontend Login

```typescript
function LoginForm() {
  const django = useDjango()
  const [username, setUsername] = signal('')
  const [password, setPassword] = signal('')
  const [error, setError] = signal('')

  const handleLogin = async (e: Event) => {
    e.preventDefault()

    try {
      const response = await django.post('/api/login/', {
        username: username(),
        password: password()
      })

      // Update user state
      django.setUser(response.data)
      window.location.href = '/dashboard'
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed')
    }
  }

  return (
    <form onsubmit={handleLogin}>
      {error() && <div class="error">{error()}</div>}

      <input
        value={username()}
        oninput={(e) => setUsername((e.target as HTMLInputElement).value)}
        placeholder="Username"
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

### Protected Views

```python
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def protected_view(request):
    return Response({'message': 'You are authenticated'})
```

### Protected Routes (Frontend)

```typescript
import { useRouter } from '@nadi/router'
import { useDjango } from '@nadi/adapter-django'

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const django = useDjango()
  const router = useRouter()

  effect(() => {
    if (!django.user()) {
      router.push('/login')
    }
  })

  if (!django.user()) {
    return <div>Loading...</div>
  }

  return children
}
```

## Form Validation

### Django Form Validation

```python
# forms.py
from django import forms

class PostForm(forms.Form):
    title = forms.CharField(max_length=200, min_length=3)
    content = forms.CharField(widget=forms.Textarea)
    published = forms.BooleanField(required=False)

    def clean_title(self):
        title = self.cleaned_data['title']
        if 'spam' in title.lower():
            raise forms.ValidationError('Title cannot contain spam')
        return title

# views.py
@api_view(['POST'])
def create_post(request):
    form = PostForm(request.data)

    if form.is_valid():
        post = Post.objects.create(**form.cleaned_data)
        return Response({'id': post.id}, status=201)

    return Response({'errors': form.errors}, status=400)
```

### Frontend Integration

```typescript
import { createForm } from '@nadi/forms'
import { useDjango } from '@nadi/adapter-django'

function PostForm() {
  const django = useDjango()

  const form = createForm({
    initialValues: {
      title: '',
      content: '',
      published: false
    },
    onSubmit: async (values) => {
      try {
        await django.post('/api/posts/', values)
        alert('Post created!')
        form.reset()
      } catch (error: any) {
        if (error.response?.status === 400) {
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
        value={form.values.title()}
        oninput={(e) => form.setFieldValue('title', (e.target as HTMLInputElement).value)}
      />
      {form.errors.title() && <span>{form.errors.title()}</span>}

      <textarea
        value={form.values.content()}
        oninput={(e) => form.setFieldValue('content', (e.target as HTMLTextAreaElement).value)}
      />
      {form.errors.content() && <span>{form.errors.content()}</span>}

      <label>
        <input
          type="checkbox"
          checked={form.values.published()}
          onchange={(e) => form.setFieldValue('published', (e.target as HTMLInputElement).checked)}
        />
        Published
      </label>

      <button type="submit" disabled={form.isSubmitting()}>
        {form.isSubmitting() ? 'Creating...' : 'Create Post'}
      </button>
    </form>
  )
}
```

## WebSocket Integration (Django Channels)

### Backend Setup

```python
# routing.py
from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path('ws/chat/<str:room_name>/', consumers.ChatConsumer.as_asgi()),
]

# consumers.py
from channels.generic.websocket import AsyncJsonWebsocketConsumer

class ChatConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive_json(self, content):
        message = content['message']
        username = content['username']

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'username': username,
            }
        )

    async def chat_message(self, event):
        await self.send_json({
            'message': event['message'],
            'username': event['username'],
        })
```

### Frontend WebSocket

```typescript
function ChatRoom({ roomName }: { roomName: string }) {
  const django = useDjango()
  const [messages, setMessages] = signal<Message[]>([])
  const [input, setInput] = signal('')
  const [ws, setWs] = signal<WebSocket | null>(null)

  effect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const socket = new WebSocket(
      `${protocol}//${window.location.host}/ws/chat/${roomName}/`
    )

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setMessages([...messages(), data])
    }

    setWs(socket)

    return () => {
      socket.close()
    }
  })

  const sendMessage = () => {
    if (!ws() || !input().trim()) return

    ws()!.send(JSON.stringify({
      message: input(),
      username: django.user()?.username || 'Anonymous'
    }))

    setInput('')
  }

  return (
    <div>
      <div class="messages">
        {messages().map((msg, i) => (
          <div key={i}>
            <strong>{msg.username}:</strong> {msg.message}
          </div>
        ))}
      </div>

      <input
        value={input()}
        oninput={(e) => setInput((e.target as HTMLInputElement).value)}
        onkeypress={(e) => e.key === 'Enter' && sendMessage()}
      />
      <button onclick={sendMessage}>Send</button>
    </div>
  )
}
```

## Pagination

```python
# views.py
from rest_framework.pagination import PageNumberPagination

class StandardPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100

class PostViewSet(viewsets.ModelViewSet):
    pagination_class = StandardPagination
    # ...
```

```typescript
function PostList() {
  const django = useDjango()
  const [posts, setPosts] = signal<Post[]>([])
  const [page, setPage] = signal(1)
  const [totalPages, setTotalPages] = signal(1)

  const fetchPosts = async (pageNum: number) => {
    const response = await django.get(`/api/posts/?page=${pageNum}`)
    setPosts(response.data.results)
    setTotalPages(Math.ceil(response.data.count / 20))
  }

  effect(() => {
    fetchPosts(page())
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
          disabled={page() === 1}
          onclick={() => setPage(page() - 1)}
        >
          Previous
        </button>

        <span>Page {page()} of {totalPages()}</span>

        <button
          disabled={page() === totalPages()}
          onclick={() => setPage(page() + 1)}
        >
          Next
        </button>
      </div>
    </div>
  )
}
```

## Middleware

### Django Middleware

```python
# middleware.py
class NadiMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        # Add custom header
        response['X-Nadi-Version'] = '0.2.0'

        return response

# settings.py
MIDDLEWARE = [
    # ...
    'myapp.middleware.NadiMiddleware',
]
```

## Best Practices

✅ **Do:**

- Use Django REST Framework
- Implement proper authentication
- Cache API responses
- Use Django's ORM efficiently
- Handle CSRF tokens properly
- Use Django Channels for WebSockets

❌ **Don't:**

- Expose sensitive data
- Skip validation
- Ignore error handling
- Mix Django templates with SPA
- Forget rate limiting
- Hardcode API URLs

## Deployment

### Build Frontend

```bash
npm run build
```

### Django Settings

```python
# settings.py
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

STATICFILES_DIRS = [
    BASE_DIR / 'frontend' / 'dist',
]

# For production
DEBUG = False
ALLOWED_HOSTS = ['yourdomain.com']
```

### Collect Static Files

```bash
python manage.py collectstatic
```

### Gunicorn Configuration

```bash
gunicorn myproject.wsgi:application --bind 0.0.0.0:8000
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name example.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /static/ {
        alias /var/www/myapp/staticfiles/;
    }

    location /ws/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

## Next Steps

- Learn about [Forms](/guide/forms) integration
- Understand [WebSockets](/guide/websockets) with Channels
- Explore [SSR](/guide/ssr) with Django
- Read the [Django Adapter API](/api/adapter-django)
