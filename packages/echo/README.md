# @nadi/echo

Laravel Echo integration for Nadi with reactive signals for real-time features.

## Features

- 🎯 Reactive channel subscriptions using signals
- 📡 Auto-subscribe/unsubscribe with component lifecycle
- 🔄 Automatic batching for multiple updates
- 👥 Presence channels with reactive member lists
- 🔐 Private and presence channel support
- 🪶 Lightweight wrapper (~1KB gzipped)

## Installation

```bash
npm install @nadi/echo laravel-echo pusher-js
# or with Socket.io
npm install @nadi/echo laravel-echo socket.io-client
```

## Setup

### With Pusher

```typescript
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { createEcho } from '@nadi/echo';

window.Pusher = Pusher;

const echo = new Echo({
  broadcaster: 'pusher',
  key: process.env.PUSHER_APP_KEY,
  cluster: process.env.PUSHER_APP_CLUSTER,
  forceTLS: true,
  authEndpoint: '/broadcasting/auth',
});

// Create Nadi Echo instance
const nadiEcho = createEcho(echo);
```
