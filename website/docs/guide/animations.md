# Animations

Learn how to create smooth, performant animations in Nadi using the `@nadi/ui` animation system.

## Installation

The animation system is included with `@nadi/ui`:

```bash
npm install @nadi/ui
```

## Animation Primitives

### useSpring

Create physics-based spring animations:

```tsx
import { signal } from '@nadi/core';
import { useSpring } from '@nadi/ui/animations';

function AnimatedBox() {
  const x = signal(0);
  const springX = useSpring(x);

  return (
    <>
      <button onClick={() => x.set(x() + 100)}>Move Right</button>

      <div style={{ transform: `translateX(${springX()}px)` }}>I animate smoothly!</div>
    </>
  );
}
```

### Spring Presets

Use pre-configured spring behaviors:

```tsx
import { useSpring, springPresets } from '@nadi/ui/animations';

// Available presets
const gentle = useSpring(value, springPresets.gentle); // Soft, slow
const wobbly = useSpring(value, springPresets.wobbly); // Bouncy
const stiff = useSpring(value, springPresets.stiff); // Quick, snappy
const slow = useSpring(value, springPresets.slow); // Very slow
const molasses = useSpring(value, springPresets.molasses); // Extremely slow
```

### Custom Spring Configuration

Create your own spring physics:

```tsx
import { useSpring } from '@nadi/ui/animations';

const customSpring = useSpring(value, {
  stiffness: 100, // Higher = faster animation
  damping: 10, // Higher = less bouncy
  mass: 1, // Higher = more inertia
  precision: 0.01, // Stop when change < precision
});
```

## Spring Physics Explained

Springs simulate real physics using the **damped harmonic oscillator** equation:

```
F = -k * x - c * v
```

Where:

- `k` = **stiffness** (spring constant)
- `x` = displacement from target
- `c` = **damping** (friction coefficient)
- `v` = velocity

**Parameters:**

- **Stiffness (k)**: How "tight" the spring is (10-300)
- **Damping (c)**: How much friction slows it down (1-50)
- **Mass (m)**: How heavy the object is (0.1-10)

**Examples:**

- Gentle: `{ stiffness: 120, damping: 14, mass: 1 }`
- Wobbly: `{ stiffness: 180, damping: 12, mass: 1 }`
- Stiff: `{ stiffness: 210, damping: 20, mass: 1 }`

## Gesture Handling

### useGesture

Handle drag, swipe, and pan gestures:

```tsx
import { signal } from '@nadi/core';
import { useGesture } from '@nadi/ui/animations';

function DraggableCard() {
  const position = signal({ x: 0, y: 0 });

  const gesture = useGesture({
    onDrag: ({ x, y, deltaX, deltaY }) => {
      position.set({ x, y });
    },
    onDragEnd: ({ velocityX, velocityY }) => {
      console.log('Released with velocity:', velocityX, velocityY);
    },
  });

  return (
    <div
      {...gesture.bind()}
      style={{
        transform: `translate(${position().x}px, ${position().y}px)`,
        cursor: 'grab',
      }}
    >
      Drag me!
    </div>
  );
}
```

### Gesture Events

Available gesture callbacks:

```tsx
useGesture({
  onDragStart: ({ x, y }) => {},
  onDrag: ({ x, y, deltaX, deltaY }) => {},
  onDragEnd: ({ velocityX, velocityY }) => {},

  onSwipe: ({ direction, velocity }) => {},

  onPinch: ({ scale, distance }) => {},
  onPinchEnd: ({ scale }) => {},
});
```

### Swipe Detection

Detect swipe gestures:

```tsx
import { signal } from '@nadi/core';
import { useGesture } from '@nadi/ui/animations';

function SwipeCard() {
  const [direction, setDirection] = signal<string | null>(null);

  const gesture = useGesture({
    onSwipe: ({ direction: dir }) => {
      setDirection(dir); // 'left', 'right', 'up', 'down'
      setTimeout(() => setDirection(null), 1000);
    },
  });

  return <div {...gesture.bind()}>{direction() ? `Swiped ${direction()}!` : 'Swipe me'}</div>;
}
```

### Constrained Dragging

Limit drag boundaries:

```tsx
import { signal } from '@nadi/core';
import { useGesture } from '@nadi/ui/animations';

function ConstrainedDrag() {
  const position = signal({ x: 0, y: 0 });

  const gesture = useGesture({
    onDrag: ({ x, y }) => {
      // Constrain to 0-200px range
      const constrainedX = Math.max(0, Math.min(200, x));
      const constrainedY = Math.max(0, Math.min(200, y));
      position.set({ x: constrainedX, y: constrainedY });
    },
  });

  return (
    <div
      {...gesture.bind()}
      style={{ transform: `translate(${position().x}px, ${position().y}px)` }}
    />
  );
}
```

## Scroll Animations

### useFadeIn

Fade elements in when scrolled into view:

```tsx
import { useFadeIn } from '@nadi/ui/animations';
import { Card } from '@nadi/ui';

function FadeInCards() {
  const ref1 = useFadeIn({ threshold: 0.3 });
  const ref2 = useFadeIn({ threshold: 0.3, delay: 100 });
  const ref3 = useFadeIn({ threshold: 0.3, delay: 200 });

  return (
    <>
      <Card ref={ref1}>Fades in first</Card>
      <Card ref={ref2}>Fades in second</Card>
      <Card ref={ref3}>Fades in third</Card>
    </>
  );
}
```

**Options:**

- `threshold`: Visibility percentage to trigger (0-1)
- `delay`: Delay before animation starts (ms)
- `duration`: Animation duration (ms)

### useParallax

Create parallax scrolling effects:

```tsx
import { useParallax } from '@nadi/ui/animations';

function ParallaxSection() {
  const slowRef = useParallax({ speed: 0.3 }); // Moves slowly
  const mediumRef = useParallax({ speed: 0.5 }); // Medium speed
  const fastRef = useParallax({ speed: 0.8 }); // Moves fast

  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      <div ref={slowRef}>Background layer</div>
      <div ref={mediumRef}>Middle layer</div>
      <div ref={fastRef}>Foreground layer</div>
    </div>
  );
}
```

**Parameters:**

- `speed`: Parallax speed multiplier (0-1)
  - 0 = no movement
  - 0.5 = half scroll speed
  - 1 = full scroll speed

### useStagger

Animate children with staggered delays:

```tsx
import { useStagger } from '@nadi/ui/animations';
import { Card } from '@nadi/ui';

function StaggeredList() {
  const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];
  const containerRef = useStagger({ delay: 100 });

  return (
    <div ref={containerRef}>
      {items.map((item) => (
        <Card key={item} className="stagger-item">
          {item}
        </Card>
      ))}
    </div>
  );
}
```

### Scroll-Triggered Animations

Combine scroll detection with springs:

```tsx
import { signal, effect } from '@nadi/core';
import { useSpring } from '@nadi/ui/animations';

function ScrollProgress() {
  const scrollProgress = signal(0);
  const springProgress = useSpring(scrollProgress);

  effect(() => {
    const updateScroll = () => {
      const winScroll = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (winScroll / height) * 100;
      scrollProgress.set(progress);
    };

    window.addEventListener('scroll', updateScroll);
    return () => window.removeEventListener('scroll', updateScroll);
  });

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: `${springProgress()}%`,
        height: '4px',
        background: '#ff952d',
      }}
    />
  );
}
```

## Complex Animation Examples

### Animated Modal

Modal with spring-based enter/exit:

```tsx
import { signal } from '@nadi/core';
import { useSpring, springPresets } from '@nadi/ui/animations';
import { Button, Card } from '@nadi/ui';

function AnimatedModal() {
  const [isOpen, setIsOpen] = signal(false);
  const scale = signal(0);
  const springScale = useSpring(scale, springPresets.wobbly);

  const open = () => {
    setIsOpen(true);
    scale.set(1);
  };

  const close = () => {
    scale.set(0);
    setTimeout(() => setIsOpen(false), 300);
  };

  return (
    <>
      <Button onClick={open}>Open Modal</Button>

      {isOpen() && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={close}
        >
          <Card
            padding="lg"
            style={{
              transform: `scale(${springScale()})`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Animated Modal</h2>
            <p>This modal animates in with a spring!</p>
            <Button onClick={close}>Close</Button>
          </Card>
        </div>
      )}
    </>
  );
}
```

### Magnetic Button

Button that follows cursor:

```tsx
import { signal } from '@nadi/core';
import { useSpring, springPresets } from '@nadi/ui/animations';
import { Button } from '@nadi/ui';

function MagneticButton() {
  const mouseX = signal(0);
  const mouseY = signal(0);
  const springX = useSpring(mouseX, springPresets.gentle);
  const springY = useSpring(mouseY, springPresets.gentle);

  const handleMouseMove = (e: MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * 0.3;
    const deltaY = (e.clientY - centerY) * 0.3;

    mouseX.set(deltaX);
    mouseY.set(deltaY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <Button
      variant="primary"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `translate(${springX()}px, ${springY()}px)`,
      }}
    >
      Magnetic Button
    </Button>
  );
}
```

### Elastic Drawer

Side drawer with elastic open/close:

```tsx
import { signal } from '@nadi/core';
import { useSpring, springPresets } from '@nadi/ui/animations';
import { Button } from '@nadi/ui';

function ElasticDrawer() {
  const [isOpen, setIsOpen] = signal(false);
  const x = signal(-300);
  const springX = useSpring(x, springPresets.wobbly);

  const toggle = () => {
    x.set(isOpen() ? -300 : 0);
    setIsOpen(!isOpen());
  };

  return (
    <>
      <Button onClick={toggle}>Toggle Drawer</Button>

      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: '300px',
          background: 'white',
          boxShadow: '2px 0 8px rgba(0,0,0,0.15)',
          transform: `translateX(${springX()}px)`,
        }}
      >
        <div style={{ padding: '20px' }}>
          <h3>Drawer Content</h3>
          <p>This drawer opens with elastic animation</p>
        </div>
      </div>
    </>
  );
}
```

### Flip Animation

Card flip with 3D transform:

```tsx
import { signal } from '@nadi/core';
import { useSpring } from '@nadi/ui/animations';
import { Card, Button } from '@nadi/ui';

function FlipCard() {
  const [isFlipped, setIsFlipped] = signal(false);
  const rotation = signal(0);
  const springRotation = useSpring(rotation, { stiffness: 200, damping: 20 });

  const flip = () => {
    rotation.set(isFlipped() ? 0 : 180);
    setIsFlipped(!isFlipped());
  };

  return (
    <div style={{ perspective: '1000px' }}>
      <Card
        onClick={flip}
        style={{
          transform: `rotateY(${springRotation()}deg)`,
          transformStyle: 'preserve-3d',
          cursor: 'pointer',
        }}
      >
        {isFlipped() ? 'Back Side' : 'Front Side'}
      </Card>
    </div>
  );
}
```

## Performance Tips

### 1. Use Transform and Opacity

Animate `transform` and `opacity` for 60fps performance:

```tsx
// ✅ Good - GPU accelerated
<div style={{ transform: `translateX(${x()}px)`, opacity: fade() }} />

// ❌ Bad - Triggers layout/paint
<div style={{ left: `${x()}px`, display: show() ? 'block' : 'none' }} />
```

### 2. Use will-change

Hint the browser about animations:

```tsx
<div
  style={{
    willChange: 'transform',
    transform: `translateX(${x()}px)`,
  }}
/>
```

### 3. Debounce Expensive Calculations

```tsx
import { signal, computed } from '@nadi/core';

const scrollY = signal(0);

// Debounce updates
let timeout: number;
window.addEventListener('scroll', () => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    scrollY.set(window.scrollY);
  }, 16); // ~60fps
});
```

### 4. Use requestAnimationFrame

For smooth animations tied to render cycles:

```tsx
import { signal, effect } from '@nadi/core';

const x = signal(0);

effect(() => {
  let frame: number;
  const animate = () => {
    x.set(x() + 1);
    frame = requestAnimationFrame(animate);
  };
  frame = requestAnimationFrame(animate);

  return () => cancelAnimationFrame(frame);
});
```

## Animation Recipes

### Loading Spinner

```tsx
import { signal, effect } from '@nadi/core';

function Spinner() {
  const rotation = signal(0);

  effect(() => {
    let frame: number;
    const spin = () => {
      rotation.set((rotation() + 5) % 360);
      frame = requestAnimationFrame(spin);
    };
    frame = requestAnimationFrame(spin);
    return () => cancelAnimationFrame(frame);
  });

  return (
    <div
      style={{
        width: '40px',
        height: '40px',
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #5d64c4',
        borderRadius: '50%',
        transform: `rotate(${rotation()}deg)`,
      }}
    />
  );
}
```

### Pulse Animation

```tsx
import { useSpring, springPresets } from '@nadi/ui/animations';
import { signal, effect } from '@nadi/core';

function PulseDot() {
  const scale = signal(1);
  const springScale = useSpring(scale, springPresets.gentle);

  effect(() => {
    const interval = setInterval(() => {
      scale.set(scale() === 1 ? 1.2 : 1);
    }, 1000);
    return () => clearInterval(interval);
  });

  return (
    <div
      style={{
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        background: '#5d64c4',
        transform: `scale(${springScale()})`,
      }}
    />
  );
}
```

### Shake Animation

```tsx
import { signal } from '@nadi/core';
import { useSpring } from '@nadi/ui/animations';

function ShakeButton() {
  const shake = signal(0);
  const springShake = useSpring(shake);

  const triggerShake = () => {
    shake.set(10);
    setTimeout(() => shake.set(-10), 50);
    setTimeout(() => shake.set(10), 100);
    setTimeout(() => shake.set(0), 150);
  };

  return (
    <button onClick={triggerShake} style={{ transform: `translateX(${springShake()}px)` }}>
      Shake Me
    </button>
  );
}
```

## Best Practices

✅ **Do:**

- Use `transform` and `opacity` for animations
- Set `will-change` for frequently animated properties
- Use spring presets for common behaviors
- Clean up effects and event listeners
- Test on lower-end devices

❌ **Don't:**

- Animate layout properties (width, height, top, left)
- Create too many simultaneous animations
- Forget to cancel `requestAnimationFrame`
- Use JavaScript when CSS transitions suffice
- Animate during scroll without throttling

## Next Steps

- [Theming Guide](/guide/theming) - Customize animation timings
- [UI Components](/guide/ui-components) - Components with built-in animations
- [Examples](/examples/ui-showcase) - See animations in action
- [API Reference](/api/ui#animations) - Complete animation API
