# Laravel Todo App - Nadi Example

A full-featured todo application demonstrating Nadi framework integration with Laravel.

## Features

- ✅ Reactive todo management with signals
- ✅ Form validation with `@nadi/forms`
- ✅ Real-time updates with Laravel Echo
- ✅ Server-side rendering
- ✅ SEO optimization with `@nadi/meta`
- ✅ Authentication with Laravel Sanctum
- ✅ RESTful API
- ✅ Comprehensive testing

## Tech Stack

- **Backend**: Laravel 10.x
- **Frontend**: Nadi 0.2.0
- **Database**: MySQL
- **Real-time**: Laravel Echo + Pusher
- **Styling**: Scoped CSS in .nadi files

## Prerequisites

- PHP 8.1+
- Composer
- Node.js 18+
- MySQL

## Installation

1. **Install PHP dependencies**:

```bash
composer install
```

2. **Install Node dependencies**:

```bash
npm install
```

3. **Setup environment**:

```bash
cp .env.example .env
php artisan key:generate
```

4. **Configure database** in `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nadi_todo
DB_USERNAME=root
DB_PASSWORD=
```

5. **Run migrations**:

```bash
php artisan migrate
```

6. **Configure Pusher** in `.env` (optional, for real-time):

```env
PUSHER_APP_ID=your_app_id
PUSHER_APP_KEY=your_app_key
PUSHER_APP_SECRET=your_app_secret
PUSHER_APP_CLUSTER=mt1
```

## Development

1. **Start the backend**:

```bash
php artisan serve
```

2. **Start Vite dev server**:

```bash
npm run dev
```

3. **Start SSR server** (optional):

```bash
npm run ssr
```

Visit http://localhost:8000

## Building for Production

```bash
npm run build
php artisan optimize
```

## Testing

```bash
# PHP tests
php artisan test

# JavaScript tests
npm test

# E2E tests
npm run test:e2e
```

## API Endpoints

- `GET /api/todos` - List all todos
- `POST /api/todos` - Create todo
- `PATCH /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo

## Project Structure

```
laravel-todo/
├── app/
│   ├── Http/Controllers/
│   │   └── TodoController.php
│   └── Models/
│       └── Todo.php
├── resources/
│   ├── js/
│   │   ├── components/
│   │   │   └── TodoApp.nadi
│   │   └── app.ts
│   └── views/
│       └── app.blade.php
├── routes/
│   ├── api.php
│   └── web.php
└── tests/
    └── Feature/
        └── TodoTest.php
```

## License

MIT
