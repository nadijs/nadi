# Theming

Customize the look and feel of `@nadi/ui` components with the powerful theming system.

## Installation

Theming is included with `@nadi/ui`:

```bash
npm install @nadi/ui
```

## Theme Provider

### Basic Setup

Wrap your app with `ThemeProvider`:

```tsx
import { ThemeProvider } from '@nadi/ui';
import '@nadi/ui/styles.css';

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <YourApp />
    </ThemeProvider>
  );
}
```

### Default Theme

Set the initial theme:

```tsx
<ThemeProvider defaultTheme="dark">
  <App />
</ThemeProvider>
```

**Options:** `'light'`, `'dark'`, `'system'`

### useTheme Hook

Access and control the theme from any component:

```tsx
import { useTheme } from '@nadi/ui';
import { Button } from '@nadi/ui';

function ThemeToggle() {
  const { theme, setTheme, toggleTheme } = useTheme();

  return (
    <div>
      <p>Current theme: {theme()}</p>

      <Button onClick={toggleTheme}>Toggle Theme</Button>

      <Button onClick={() => setTheme('light')}>Light Mode</Button>

      <Button onClick={() => setTheme('dark')}>Dark Mode</Button>
    </div>
  );
}
```

## CSS Variables

All `@nadi/ui` components use CSS custom properties (CSS variables) for styling. Override them to customize the theme.

### Color Variables

#### Primary Colors

```css
:root {
  --nadi-color-primary-50: #eff6ff;
  --nadi-color-primary-100: #dbeafe;
  --nadi-color-primary-200: #bfdbfe;
  --nadi-color-primary-300: #93c5fd;
  --nadi-color-primary-400: #60a5fa;
  --nadi-color-primary-500: #3b82f6;
  --nadi-color-primary-600: #2563eb;
  --nadi-color-primary-700: #1d4ed8;
  --nadi-color-primary-800: #1e40af;
  --nadi-color-primary-900: #1e3a8a;
}
```

#### Semantic Colors

```css
:root {
  --nadi-color-success: #10b981;
  --nadi-color-warning: #f59e0b;
  --nadi-color-danger: #ef4444;
  --nadi-color-info: #3b82f6;
}
```

#### Grayscale

```css
:root {
  --nadi-color-gray-50: #f9fafb;
  --nadi-color-gray-100: #f3f4f6;
  --nadi-color-gray-200: #e5e7eb;
  --nadi-color-gray-300: #d1d5db;
  --nadi-color-gray-400: #9ca3af;
  --nadi-color-gray-500: #6b7280;
  --nadi-color-gray-600: #4b5563;
  --nadi-color-gray-700: #374151;
  --nadi-color-gray-800: #1f2937;
  --nadi-color-gray-900: #111827;
}
```

#### Background & Text

```css
:root {
  --nadi-color-bg: #ffffff;
  --nadi-color-bg-secondary: #f9fafb;
  --nadi-color-text: #111827;
  --nadi-color-text-secondary: #6b7280;
  --nadi-color-border: #e5e7eb;
}

[data-theme='dark'] {
  --nadi-color-bg: #111827;
  --nadi-color-bg-secondary: #1f2937;
  --nadi-color-text: #f9fafb;
  --nadi-color-text-secondary: #9ca3af;
  --nadi-color-border: #374151;
}
```

### Spacing Variables

```css
:root {
  --nadi-spacing-xs: 0.25rem; /* 4px */
  --nadi-spacing-sm: 0.5rem; /* 8px */
  --nadi-spacing-md: 1rem; /* 16px */
  --nadi-spacing-lg: 1.5rem; /* 24px */
  --nadi-spacing-xl: 2rem; /* 32px */
  --nadi-spacing-2xl: 3rem; /* 48px */
}
```

### Border Radius

```css
:root {
  --nadi-radius-sm: 0.25rem; /* 4px */
  --nadi-radius-base: 0.375rem; /* 6px */
  --nadi-radius-md: 0.5rem; /* 8px */
  --nadi-radius-lg: 0.75rem; /* 12px */
  --nadi-radius-xl: 1rem; /* 16px */
  --nadi-radius-full: 9999px; /* Fully rounded */
}
```

### Typography

```css
:root {
  --nadi-font-sans: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --nadi-font-mono: 'Courier New', Courier, monospace;

  --nadi-font-size-xs: 0.75rem; /* 12px */
  --nadi-font-size-sm: 0.875rem; /* 14px */
  --nadi-font-size-base: 1rem; /* 16px */
  --nadi-font-size-lg: 1.125rem; /* 18px */
  --nadi-font-size-xl: 1.25rem; /* 20px */
  --nadi-font-size-2xl: 1.5rem; /* 24px */

  --nadi-font-weight-normal: 400;
  --nadi-font-weight-medium: 500;
  --nadi-font-weight-semibold: 600;
  --nadi-font-weight-bold: 700;

  --nadi-line-height-tight: 1.25;
  --nadi-line-height-normal: 1.5;
  --nadi-line-height-loose: 1.75;
}
```

### Shadows

```css
:root {
  --nadi-shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --nadi-shadow-base: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  --nadi-shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --nadi-shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --nadi-shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}
```

### Transitions

```css
:root {
  --nadi-transition-fast: 150ms ease;
  --nadi-transition-base: 200ms ease;
  --nadi-transition-slow: 300ms ease;
}
```

## Dark Mode

### Automatic Dark Mode

Dark mode is automatically applied when the system prefers dark:

```tsx
<ThemeProvider defaultTheme="system">
  <App />
</ThemeProvider>
```

### Manual Dark Mode Toggle

```tsx
import { useTheme } from '@nadi/ui';
import { Button } from '@nadi/ui';

function DarkModeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button onClick={toggleTheme}>
      {theme() === 'dark' ? '🌙' : '☀️'} {theme()}
    </Button>
  );
}
```

### Dark Mode CSS

Define dark mode colors using `[data-theme="dark"]`:

```css
[data-theme='dark'] {
  /* Background colors */
  --nadi-color-bg: #0a0a0a;
  --nadi-color-bg-secondary: #1a1a1a;

  /* Text colors */
  --nadi-color-text: #ffffff;
  --nadi-color-text-secondary: #a0a0a0;

  /* Border colors */
  --nadi-color-border: #2a2a2a;

  /* Primary colors (optional - can stay the same) */
  --nadi-color-primary-600: #4f9eff;
}
```

## Creating Custom Themes

### Method 1: CSS File

Create a custom theme CSS file:

```css
/* theme-ocean.css */
:root {
  --nadi-color-primary-600: #0891b2; /* Cyan */
  --nadi-color-success: #14b8a6; /* Teal */
  --nadi-color-warning: #f59e0b; /* Amber */
  --nadi-color-danger: #ef4444; /* Red */

  --nadi-radius-base: 0.75rem; /* More rounded */

  --nadi-font-sans: 'Inter', system-ui, sans-serif;
}

[data-theme='dark'] {
  --nadi-color-bg: #0c1922;
  --nadi-color-bg-secondary: #1a2832;
  --nadi-color-primary-600: #06b6d4;
}
```

Import it after the default styles:

```tsx
import '@nadi/ui/styles.css';
import './theme-ocean.css';
```

### Method 2: Inline Styles

Apply theme variables inline:

```tsx
function App() {
  return (
    <div
      style={
        {
          '--nadi-color-primary-600': '#8b5cf6',
          '--nadi-color-success': '#10b981',
          '--nadi-radius-base': '1rem',
        } as React.CSSProperties
      }
    >
      <ThemeProvider>
        <YourApp />
      </ThemeProvider>
    </div>
  );
}
```

### Method 3: Theme Presets

Create reusable theme presets:

```tsx
// themes.ts
export const themes = {
  ocean: {
    '--nadi-color-primary-600': '#0891b2',
    '--nadi-color-success': '#14b8a6',
    '--nadi-radius-base': '0.75rem',
  },
  purple: {
    '--nadi-color-primary-600': '#8b5cf6',
    '--nadi-color-success': '#a855f7',
    '--nadi-radius-base': '0.5rem',
  },
  earth: {
    '--nadi-color-primary-600': '#84cc16',
    '--nadi-color-success': '#22c55e',
    '--nadi-radius-base': '0.25rem',
  },
};

// App.tsx
import { signal } from '@nadi/core';
import { themes } from './themes';

function App() {
  const [themeName, setThemeName] = signal<keyof typeof themes>('ocean');

  return (
    <div style={themes[themeName()] as React.CSSProperties}>
      <select onChange={(e) => setThemeName(e.target.value as any)}>
        <option value="ocean">Ocean</option>
        <option value="purple">Purple</option>
        <option value="earth">Earth</option>
      </select>

      <YourApp />
    </div>
  );
}
```

## Component-Specific Styling

### Global Component Overrides

Override specific component styles:

```css
/* Custom button styles */
.nadi-button {
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Custom input styles */
.nadi-input {
  border-width: 2px;
}

/* Custom card styles */
.nadi-card {
  border-radius: var(--nadi-radius-xl);
}
```

### Scoped Overrides

Use CSS modules or scoped styles:

```tsx
// MyComponent.module.css
.customButton {
  --nadi-color-primary-600: #8b5cf6;
  border-radius: 9999px;
}

// MyComponent.tsx
import { Button } from '@nadi/ui';
import styles from './MyComponent.module.css';

function MyComponent() {
  return (
    <Button className={styles.customButton}>
      Custom Styled Button
    </Button>
  );
}
```

### Inline Overrides

Override variables inline:

```tsx
<Button
  style={
    {
      '--nadi-color-primary-600': '#8b5cf6',
    } as React.CSSProperties
  }
>
  Purple Button
</Button>
```

## Design Token System

### Accessing Tokens in JavaScript

```tsx
function getThemeValue(property: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(property).trim();
}

// Usage
const primaryColor = getThemeValue('--nadi-color-primary-600');
const spacing = getThemeValue('--nadi-spacing-md');
```

### Setting Tokens Programmatically

```tsx
function setThemeValue(property: string, value: string) {
  document.documentElement.style.setProperty(property, value);
}

// Usage
setThemeValue('--nadi-color-primary-600', '#8b5cf6');
setThemeValue('--nadi-radius-base', '1rem');
```

## Example Themes

### Corporate Theme

Professional, minimal design:

```css
:root {
  --nadi-color-primary-600: #1e40af;
  --nadi-color-success: #059669;
  --nadi-color-danger: #dc2626;

  --nadi-radius-base: 0.25rem;
  --nadi-font-sans: 'Roboto', sans-serif;
  --nadi-shadow-base: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}
```

### Playful Theme

Bright colors, high contrast:

```css
:root {
  --nadi-color-primary-600: #ec4899;
  --nadi-color-success: #10b981;
  --nadi-color-warning: #f59e0b;
  --nadi-color-danger: #ef4444;

  --nadi-radius-base: 1rem;
  --nadi-shadow-base: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
}
```

### Minimal Theme

Clean, subtle design:

```css
:root {
  --nadi-color-primary-600: #000000;
  --nadi-color-success: #4ade80;

  --nadi-radius-base: 0;
  --nadi-shadow-base: none;
  --nadi-color-border: #e5e7eb;
}
```

### Neon Theme

Bold, high-energy:

```css
:root {
  --nadi-color-primary-600: #06b6d4;
  --nadi-color-success: #10b981;
  --nadi-color-warning: #f59e0b;
  --nadi-color-danger: #f43f5e;

  --nadi-radius-base: 0.5rem;
}

[data-theme='dark'] {
  --nadi-color-bg: #000000;
  --nadi-color-bg-secondary: #0a0a0a;
  --nadi-color-border: #1a1a1a;

  --nadi-shadow-base: 0 0 20px rgba(6, 182, 212, 0.3);
}
```

## Advanced Theming

### Per-Component Themes

Apply different themes to different parts of your app:

```tsx
function App() {
  return (
    <>
      {/* Light theme header */}
      <div data-theme="light">
        <Header />
      </div>

      {/* Dark theme content */}
      <div data-theme="dark">
        <MainContent />
      </div>

      {/* Custom theme footer */}
      <div style={{ '--nadi-color-primary-600': '#8b5cf6' } as any}>
        <Footer />
      </div>
    </>
  );
}
```

### Dynamic Theme Generation

Generate themes from user input:

```tsx
import { signal } from '@nadi/core';

function ThemeCustomizer() {
  const [primaryColor, setPrimaryColor] = signal('#3b82f6');
  const [borderRadius, setBorderRadius] = signal(6);

  return (
    <div
      style={
        {
          '--nadi-color-primary-600': primaryColor(),
          '--nadi-radius-base': `${borderRadius()}px`,
        } as React.CSSProperties
      }
    >
      <input
        type="color"
        value={primaryColor()}
        onChange={(e) => setPrimaryColor(e.target.value)}
      />

      <input
        type="range"
        min="0"
        max="20"
        value={borderRadius()}
        onChange={(e) => setBorderRadius(Number(e.target.value))}
      />

      <Button variant="primary">Preview</Button>
    </div>
  );
}
```

### Theme Persistence

Save theme preference:

```tsx
import { signal, effect } from '@nadi/core';

function usePersistedTheme() {
  const [theme, setTheme] = signal(localStorage.getItem('theme') || 'light');

  effect(() => {
    localStorage.setItem('theme', theme());
    document.documentElement.setAttribute('data-theme', theme());
  });

  return { theme, setTheme };
}
```

## Best Practices

✅ **Do:**

- Use CSS variables for all customization
- Define dark mode variants for all colors
- Test themes for accessibility (contrast ratios)
- Provide a theme toggle in your UI
- Document your custom theme tokens

❌ **Don't:**

- Hardcode colors in component styles
- Override too many variables at once
- Forget to test dark mode
- Use !important to override theme styles
- Create inaccessible color combinations

## Accessibility

### Color Contrast

Ensure sufficient contrast ratios:

- **Normal text**: 4.5:1 minimum
- **Large text**: 3:1 minimum
- **UI components**: 3:1 minimum

Test with browser DevTools or online tools.

### Reduced Motion

Respect user's motion preferences:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

This is already included in `@nadi/ui`.

## Next Steps

- [UI Components](/guide/ui-components) - Apply themes to components
- [Animations](/guide/animations) - Animate theme transitions
- [Examples](/examples/ui-showcase) - See themed examples
- [API Reference](/api/ui) - Complete theming API
