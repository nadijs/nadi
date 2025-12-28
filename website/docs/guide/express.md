# Express Integration

Nadi provides seamless integration with Express.js through the `@nadi/adapter-express` package, enabling server-side rendering, API development, and real-time features.

## Installation

### Backend (Express)

```bash
npm install express @nadi/adapter-express
```

### Frontend (Nadi)

```bash
npm install @nadi/core @nadi/router
```

## Quick Start

### 1. Basic Setup

```typescript
// server.ts
import express from 'express'
import { createNadiMiddleware } from '@nadi/adapter-express'
import { renderToString } from '@nadi/core/server'
import App from './App'

const app = express()
const PORT = process.env.PORT || 3000

// Parse JSON bodies
app.use(express.json())

// Serve static files
app.use(express.static('public'))

// Nadi SSR middleware
app.use(createNadiMiddleware({
  render: (url, initialState) => renderToString(<App />, initialState),
  template: (html, state) => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>My App</title>
        <link rel="stylesheet" href="/styles.css">
      </head>
      <body>
        <div id="app">${html}</div>
        <script>
          window.__INITIAL_STATE__ = ${JSON.stringify(state)};
        </script>
        <script src="/app.js"></script>
      </body>
    </html>
  `
}))

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
```

### 2. Frontend Setup

```typescript
// app.ts
import { hydrate } from '@nadi/core'
import { createRouter } from '@nadi/router'
import App from './App'

const initialState = window.__INITIAL_STATE__ || {}

hydrate(
  () => <App />,
  document.getElementById('app'),
  initialState
)
```

## API Routes

### Basic REST API

```typescript
import express from 'express';

const app = express();
app.use(express.json());

// GET all items
app.get('/api/posts', async (req, res) => {
  const posts = await db.posts.findAll();
  res.json(posts);
});

// GET single item
app.get('/api/posts/:id', async (req, res) => {
  const post = await db.posts.findById(req.params.id);

  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }

  res.json(post);
});

// CREATE item
app.post('/api/posts', async (req, res) => {
  const { title, content } = req.body;

  const post = await db.posts.create({ title, content });
  res.status(201).json(post);
});

// UPDATE item
app.put('/api/posts/:id', async (req, res) => {
  const { title, content } = req.body;
  const post = await db.posts.update(req.params.id, { title, content });

  res.json(post);
});

// DELETE item
app.delete('/api/posts/:id', async (req, res) => {
  await db.posts.delete(req.params.id);
  res.status(204).send();
});
```

### Frontend Integration

```typescript
function PostList() {
  const [posts, setPosts] = signal<Post[]>([])
  const [loading, setLoading] = signal(true)

  effect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => {
        setPosts(data)
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
  const [title, setTitle] = signal('')
  const [content, setContent] = signal('')

  const handleSubmit = async (e: Event) => {
    e.preventDefault()

    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: title(),
        content: content()
      })
    })

    if (response.ok) {
      alert('Post created!')
      setTitle('')
      setContent('')
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
      <button type="submit">Create</button>
    </form>
  )
}
```

## Validation Middleware

### Express Validator

```typescript
import { body, validationResult } from 'express-validator';

app.post(
  '/api/posts',
  [body('title').isLength({ min: 3, max: 200 }).trim(), body('content').isLength({ min: 10 })],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const post = await db.posts.create(req.body);
    res.status(201).json(post);
  }
);
```

### Frontend Error Handling

```typescript
import { createForm } from '@nadi/forms'

function PostForm() {
  const form = createForm({
    initialValues: {
      title: '',
      content: ''
    },
    onSubmit: async (values) => {
      try {
        const response = await fetch('/api/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values)
        })

        if (!response.ok) {
          const data = await response.json()

          // Handle validation errors
          if (data.errors) {
            data.errors.forEach((error: any) => {
              form.setFieldError(error.param, error.msg)
            })
          }
          return
        }

        alert('Post created!')
        form.reset()
      } catch (error) {
        console.error('Error:', error)
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

      <button type="submit">Create</button>
    </form>
  )
}
```

## Authentication

### Session-Based Auth

```typescript
import session from 'express-session';
import bcrypt from 'bcrypt';

app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' },
  })
);

// Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await db.users.findByEmail(email);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  req.session.userId = user.id;
  res.json({ id: user.id, email: user.email, name: user.name });
});

// Logout
app.post('/api/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ message: 'Logged out' });
  });
});

// Get current user
app.get('/api/user', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const user = await db.users.findById(req.session.userId);
  res.json(user);
});

// Auth middleware
const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  next();
};

// Protected route
app.get('/api/profile', requireAuth, async (req, res) => {
  const user = await db.users.findById(req.session.userId);
  res.json(user);
});
```

### JWT Authentication

```typescript
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

// Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await db.users.findByEmail(email);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

  res.json({
    token,
    user: { id: user.id, email: user.email, name: user.name },
  });
});

// Auth middleware
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Protected route
app.get('/api/profile', authenticateJWT, async (req, res) => {
  const user = await db.users.findById(req.userId);
  res.json(user);
});
```

### Frontend Auth

```typescript
function LoginForm() {
  const [email, setEmail] = signal('')
  const [password, setPassword] = signal('')
  const [error, setError] = signal('')

  const handleLogin = async (e: Event) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email(),
          password: password()
        })
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error)
        return
      }

      const data = await response.json()

      // For JWT
      localStorage.setItem('token', data.token)

      window.location.href = '/dashboard'
    } catch (error) {
      setError('Login failed')
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

// API helper with JWT
async function apiRequest(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token')

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers
  }

  return fetch(url, { ...options, headers })
}
```

## File Upload

### Multer Setup

```typescript
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only images allowed'));
    }
  },
});

app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  res.json({
    filename: req.file.filename,
    path: `/uploads/${req.file.filename}`,
  });
});
```

### Frontend Upload

```typescript
function FileUpload() {
  const [file, setFile] = signal<File | null>(null)
  const [uploading, setUploading] = signal(false)
  const [uploadedUrl, setUploadedUrl] = signal('')

  const handleUpload = async () => {
    if (!file()) return

    setUploading(true)

    const formData = new FormData()
    formData.append('file', file()!)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()
      setUploadedUrl(data.path)
    } finally {
      setUploading(false)
    }
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
      <button onclick={handleUpload} disabled={uploading()}>
        {uploading() ? 'Uploading...' : 'Upload'}
      </button>

      {uploadedUrl() && (
        <img src={uploadedUrl()} alt="Uploaded" />
      )}
    </div>
  )
}
```

## WebSocket Integration

### Socket.io Setup

```typescript
import { Server } from 'socket.io';
import { createServer } from 'http';

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-joined', socket.id);
  });

  socket.on('send-message', (roomId, message) => {
    socket.to(roomId).emit('receive-message', {
      userId: socket.id,
      message,
      timestamp: Date.now(),
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

### Frontend WebSocket

```typescript
import { io, Socket } from 'socket.io-client'

function ChatRoom({ roomId }: { roomId: string }) {
  const [messages, setMessages] = signal<Message[]>([])
  const [input, setInput] = signal('')
  const [socket, setSocket] = signal<Socket | null>(null)

  effect(() => {
    const newSocket = io('http://localhost:3000')

    newSocket.emit('join-room', roomId)

    newSocket.on('receive-message', (data) => {
      setMessages([...messages(), data])
    })

    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
    }
  })

  const sendMessage = () => {
    if (!socket() || !input().trim()) return

    socket()!.emit('send-message', roomId, input())

    setMessages([...messages(), {
      userId: 'me',
      message: input(),
      timestamp: Date.now()
    }])

    setInput('')
  }

  return (
    <div>
      <div class="messages">
        {messages().map((msg, i) => (
          <div key={i} class={msg.userId === 'me' ? 'my-message' : 'other-message'}>
            {msg.message}
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

## Error Handling

### Global Error Handler

```typescript
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    error: {
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});
```

## Best Practices

✅ **Do:**

- Use environment variables
- Implement proper error handling
- Add request validation
- Use CORS correctly
- Implement rate limiting
- Log requests and errors
- Use compression middleware

❌ **Don't:**

- Expose sensitive data
- Skip input validation
- Ignore security headers
- Use blocking operations
- Store secrets in code
- Skip error handling

## Deployment

### Production Setup

```typescript
// server.ts
import compression from 'compression';
import helmet from 'helmet';
import morgan from 'morgan';

if (process.env.NODE_ENV === 'production') {
  app.use(helmet());
  app.use(compression());
  app.use(morgan('combined'));
}
```

### PM2 Configuration

```json
{
  "apps": [
    {
      "name": "nadi-app",
      "script": "./dist/server.js",
      "instances": "max",
      "exec_mode": "cluster",
      "env": {
        "NODE_ENV": "production"
      }
    }
  ]
}
```

### Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/server.js"]
```

### Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name example.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Next Steps

- Learn about [SSR](/guide/ssr) with Express
- Understand [WebSockets](/guide/websockets)
- Explore [Forms](/guide/forms) validation
- Read the [Express Adapter API](/api/adapter-express)
