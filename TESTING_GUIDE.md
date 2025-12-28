# Testing the Counter Example - Quick Start Guide

## 🚀 Quick Setup (3 steps)

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Build All Packages

```bash
pnpm build
```

This will build:

- `@nadi/core` - Signals runtime
- `@nadi/compiler` - SFC compiler
- `@nadi/vite-plugin` - Vite integration

### 3. Start the Playground

```bash
pnpm playground
```

The playground will automatically open at **http://localhost:3000** 🎉

## What You'll See

- **Live Counter**: Working example with increment/decrement buttons
- **Reactive State**: Count and doubled values update automatically
- **Hot Module Replacement**: Edit code and see changes instantly
- **Console Logs**: Framework info in the browser console

## Project Structure

```
Nadi/
├── playground/              # 👈 Development playground
│   ├── index.html          # Main HTML file
│   ├── src/
│   │   └── main.ts         # Counter example
│   └── vite.config.ts      # Vite configuration
│
├── packages/
│   ├── core/               # Signals runtime
│   ├── compiler/           # SFC compiler
│   └── vite-plugin/        # 👈 NEW: Vite plugin
│
└── examples/
    ├── Counter.nadi        # Original .nadi file
    └── TodoApp.nadi        # Todo example
```

## Testing Different Examples

### Option 1: Current Setup (Vanilla JS)

The playground currently uses vanilla TypeScript with Nadi's signals API. This is the fastest way to test reactivity.

**File**: `playground/src/main.ts`

```typescript
import { signal, computed, effect } from '@nadi/core';

const [count, setCount] = signal(0);
const doubled = computed(() => count() * 2);

// Reactive UI updates
effect(() => {
  countDisplay.textContent = `Count: ${count()}`;
});
```

### Option 2: Future .nadi Support (Coming Soon)

Once the compiler is fully integrated, you'll import `.nadi` files directly:

```typescript
// This will work soon!
import Counter from '../examples/Counter.nadi';

const app = new Counter();
app.mount('#counter-root');
```

## Making Changes

### Test Reactivity

Try modifying `playground/src/main.ts`:

```typescript
// Add a new computed value
const tripled = computed(() => count() * 3);

effect(() => {
  console.log('Tripled:', tripled());
});
```

Save the file and watch it update instantly with HMR! ⚡

### Customize Styles

Edit the styles in `playground/src/main.ts` or add a separate CSS file.

### Add More Examples

Create new examples following the same pattern:

```typescript
import { signal } from '@nadi/core';

const [name, setName] = signal('World');

effect(() => {
  console.log(`Hello, ${name()}!`);
});
```

## Available Scripts

| Command           | Description                    |
| ----------------- | ------------------------------ |
| `pnpm playground` | Start playground dev server    |
| `pnpm build`      | Build all packages             |
| `pnpm dev`        | Run all packages in watch mode |
| `pnpm test`       | Run all tests                  |

## Troubleshooting

### Port 3000 Already in Use

Edit `playground/vite.config.ts`:

```typescript
server: {
  port: 3001, // Change port
}
```

### Build Errors

Clean and rebuild:

```bash
pnpm clean
pnpm install
pnpm build
```

### Changes Not Showing

Make sure the playground is running and packages are built:

```bash
pnpm build      # First build packages
pnpm playground # Then start playground
```

## What's Next?

1. ✅ **Core signals working** - Test reactivity
2. ✅ **Vite plugin created** - HMR support
3. 🚧 **Full .nadi support** - Coming next
4. 📋 **Laravel integration** - Planned

## Performance Metrics

Check the browser console to see:

- 📦 Bundle size: ~3.5KB
- ⚡ HMR updates: <50ms
- 🚀 Initial load: Instant

## Need Help?

- Check `playground/README.md` for more details
- View `QUICK_REFERENCE.md` for API documentation
- See examples in `examples/` folder

---

**Enjoy testing Nadi!** 🎊
