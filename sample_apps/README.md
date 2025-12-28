# Nadi Sample Applications

Complete example applications demonstrating all Nadi framework features across different backend frameworks.

## Applications

### 1. Laravel Todo (`laravel-todo/`)

**Stack**: Laravel + Nadi + MySQL
**Features**:

- CRUD operations with reactive forms
- Real-time updates via Laravel Echo
- Server-side rendering
- Form validation with backend error mapping
- Authentication with Laravel Sanctum

**Setup**:

```bash
cd laravel-todo
composer install
npm install
cp .env.example .env
php artisan key:generate
php artisan migrate
npm run dev
php artisan serve
```

### 2. Django Blog (`django-blog/`)

**Stack**: Django + Nadi + PostgreSQL
**Features**:

- Blog post management
- Markdown editor with live preview
- SEO optimization with @nadi/meta
- Static site generation for blog posts
- Django REST API integration

**Setup**:

```bash
cd django-blog
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
npm install
npm run dev
python manage.py runserver
```

### 3. Express Dashboard (`express-dashboard/`)

**Stack**: Express + Nadi + MongoDB
**Features**:

- Real-time analytics dashboard
- WebSocket integration
- Chart visualizations with signals
- API authentication with JWT
- Server-side rendering

**Setup**:

```bash
cd express-dashboard
npm install
cp .env.example .env
npm run dev
```

### 4. Next.js E-commerce (`nextjs-ecommerce/`)

**Stack**: Next.js + Nadi + Stripe
**Features**:

- Product catalog with SSG
- Shopping cart with reactive state
- Stripe checkout integration
- SEO-optimized product pages
- Nadi components in Next.js App Router

**Setup**:

```bash
cd nextjs-ecommerce
npm install
cp .env.example .env.local
npm run dev
```

### 5. Nuxt Portfolio (`nuxt-portfolio/`)

**Stack**: Nuxt 3 + Nadi + Contentful
**Features**:

- Portfolio showcase with animations
- CMS integration with Contentful
- Static site generation
- Contact form with validation
- Dark mode with reactive theming

**Setup**:

```bash
cd nuxt-portfolio
npm install
cp .env.example .env
npm run dev
```

## Common Features Demonstrated

All apps showcase:

- ✅ Reactive forms with `@nadi/forms`
- ✅ SEO management with `@nadi/meta`
- ✅ Testing with `@nadi/testing`
- ✅ SSR/SSG support
- ✅ TypeScript integration
- ✅ Responsive design
- ✅ DevTools integration

## Directory Structure

Each app follows this structure:

```
app-name/
├── src/
│   ├── components/        # Nadi components (.nadi files)
│   ├── pages/            # Page components
│   ├── layouts/          # Layout components
│   ├── lib/              # Utilities and helpers
│   └── main.ts           # Entry point
├── public/               # Static assets
├── tests/                # Test files
├── README.md             # App-specific README
└── package.json          # Dependencies
```

## Running All Apps

Use the provided script to run all apps simultaneously:

```bash
./run-all.sh
```

This will start:

- Laravel on http://localhost:8000
- Django on http://localhost:8001
- Express on http://localhost:3000
- Next.js on http://localhost:3001
- Nuxt on http://localhost:3002

## Testing

Each app includes comprehensive tests:

```bash
# Run tests for specific app
cd <app-name>
npm test

# Run all tests
npm run test:all
```

## Deployment

See individual app READMEs for deployment instructions to:

- Laravel: Laravel Forge, Vapor
- Django: Heroku, Railway
- Express: Vercel, Render
- Next.js: Vercel, Netlify
- Nuxt: Vercel, Netlify

## Learn More

- [Nadi Documentation](https://github.com/yourusername/nadi)
- [Laravel Adapter Docs](../packages/adapter-laravel/README.md)
- [Django Adapter Docs](../packages/adapter-django/README.md)
- [Express Adapter Docs](../packages/adapter-express/README.md)
- [Next.js Adapter Docs](../packages/adapter-nextjs/README.md)
- [Nuxt Adapter Docs](../packages/adapter-nuxt/README.md)

## License

MIT
