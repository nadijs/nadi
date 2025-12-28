---
layout: home

hero:
  name: Nadi
  text: Ultra-Lightweight Reactive Framework
  tagline: Build blazing-fast web applications with only 3.5KB of JavaScript. Experience the perfect balance of performance, simplicity, and developer experience.
  image:
    light: /nadi_light_logo.png
    dark: /nadi_dark_logo.png
    alt: Nadi.js Framework Logo
  actions:
    - theme: brand
      text: Get Started
      link: /guide/quick-start
    - theme: alt
      text: Why Nadi?
      link: /guide/why-nadi
    - theme: alt
      text: View on GitHub
      link: https://github.com/nadiframework/nadi

features:
  - icon: '⚡'
    title: Blazing Performance
    details: Fine-grained reactivity with zero Virtual DOM overhead. Updates in O(1) time complexity. 5-10x faster than React, 3-5x faster than Vue in real-world scenarios.

  - icon: '🪶'
    title: Incredibly Lightweight
    details: Only 3.5KB gzipped for the core runtime. Achieve 85-95% smaller bundles compared to React, Vue, or Angular. Every byte counts for your users.

  - icon: '🎯'
    title: Simple Yet Powerful
    details: Clean, intuitive API with signals, computed values, and effects. No complex lifecycle hooks or confusing patterns. Learn in minutes, master in hours.

  - icon: '🔥'
    title: Framework Agnostic
    details: Seamlessly integrate with your existing stack. Native adapters for Laravel, Django, Express, Next.js, and Nuxt. Use Nadi with any backend framework.

  - icon: '🛠️'
    title: Production Ready
    details: Complete ecosystem out of the box - DevTools extension, testing utilities, form validation, routing, professional UI components, SSR/SSG, and more.

  - icon: '📦'
    title: Zero Dependencies
    details: Core packages have zero runtime dependencies. Smaller bundles, faster installs, fewer security vulnerabilities, and complete control over your stack.

  - icon: '🚀'
    title: Modern Architecture
    details: Full server-side rendering with hydration, static site generation, islands architecture, and progressive enhancement for optimal performance.

  - icon: '🔒'
    title: TypeScript Native
    details: Built with TypeScript from the ground up. Enjoy full type safety, intelligent autocomplete, and compile-time type checking for your JSX templates.

  - icon: '🎨'
    title: Exceptional DX
    details: Automatic dependency tracking, no useEffect dependency arrays, no React.memo memoization, no .value syntax like Vue. Just code that makes sense.
---

## Quick Example

```typescript
// Counter.nadi
<script lang="ts">
import { signal, computed } from '@nadi/core';
import { Button } from '@nadi/ui';

export default function Counter() {
  const [count, setCount] = signal(0);
  const doubled = computed(() => count() * 2);

  return { count, setCount, doubled };
}
</script>

<template>
  <div>
    <h1>Count: {count()}</h1>
    <p>Doubled: {doubled()}</p>
    <Button variant="primary" onClick={() => setCount(count() + 1)}>
      Increment
    </Button>
  </div>
</template>

<style scoped>
div {
  padding: 20px;
  text-align: center;
}
</style>
```

## Why Developers Love Nadi

::: info Performance
Nadi is **5-10x faster** than React and **3-5x faster** than Vue in real-world benchmarks. Updates happen in O(1) time complexity.
:::

::: tip Bundle Size
A typical Nadi app with routing and forms is **~5KB**. The same app in React would be **~200KB**. That's a **97.5% reduction**!
:::

::: warning Laravel Integration
Built specifically for Laravel developers. Native PHP integration, Blade directives, and middleware included.
:::

## Trusted By

<div style="display: flex; gap: 20px; align-items: center; margin: 40px 0;">
  <span style="font-size: 24px;">🚀</span>
  <span>Startups building MVPs fast</span>
</div>

<div style="display: flex; gap: 20px; align-items: center; margin: 40px 0;">
  <span style="font-size: 24px;">📱</span>
  <span>Mobile-first apps needing speed</span>
</div>

<div style="display: flex; gap: 20px; align-items: center; margin: 40px 0;">
  <span style="font-size: 24px;">💼</span>
  <span>Laravel/Django developers</span>
</div>

## Compare Bundle Sizes

| Framework  | Min + Gzip | With Router | With Forms | With UI   |
| ---------- | ---------- | ----------- | ---------- | --------- |
| **Nadi**   | **3.5 KB** | **5 KB**    | **7 KB**   | **12 KB** |
| Svelte     | 2 KB       | 5 KB        | 10 KB      | 25 KB     |
| Solid.js   | 7 KB       | 10 KB       | 15 KB      | 30 KB     |
| Vue 3      | 85 KB      | 120 KB      | 150 KB     | 200 KB    |
| React 18   | 135 KB     | 180 KB      | 220 KB     | 280 KB    |
| Angular 16 | 300 KB     | 350 KB      | 400 KB     | 480 KB    |

## Ready to Start?

<div style="margin: 40px 0;">
  <a href="/guide/quick-start" style="display: inline-block; padding: 12px 24px; background: #5d64c4; color: white; border-radius: 8px; text-decoration: none; font-weight: 600;">
    Get Started →
  </a>
</div>
