# Nadi DevTools Extension

Browser extension for debugging Nadi applications with component tree inspection and signal state management.

## Features

- 🌳 Component tree visualization
- 📊 Signal, computed, and effect inspection
- ✏️ Live state editing
- 🔄 Real-time updates
- 🎯 Component selection and highlighting

## Installation

### Development Mode

1. Build the extension:

```bash
# No build step needed for MVP - pure JavaScript
```

2. Load in Chrome:
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `devtools/extension` directory

3. Load in Firefox:
   - Open `about:debugging#/runtime/this-firefox`
   - Click "Load Temporary Add-on"
   - Select the `manifest.json` file

## Usage

1. Open DevTools in a page running a Nadi application
2. Navigate to the "Nadi" panel
3. Browse the component tree
4. Click on components to inspect their state
5. Edit signal values in real-time

## Adding DevTools Support to Your Nadi App

Add this to your application entry point:

```typescript
import { signal, computed, effect } from '@nadi/core';

// Enable DevTools in development
if (import.meta.env.DEV) {
  window.__NADI_DEVTOOLS__ = {
    version: '0.2.0',
    signals: new Map(),
    computed: new Map(),
    effects: new Map(),
    components: new Map(),

    // Hook into signal creation
    notifySignalCreated(id, name, initialValue) {
      this.signals.set(id, { id, name, value: initialValue });
      this.notifyUpdate();
    },

    // Hook into signal updates
    notifySignalUpdate(id, newValue) {
      const signal = this.signals.get(id);
      if (signal) {
        signal.value = newValue;
        this.notifyUpdate();
      }
    },

    // Notify DevTools of changes
    notifyUpdate() {
      window.postMessage(
        {
          type: 'NADI_STATE_UPDATE',
          data: {
            signals: Array.from(this.signals.values()),
            computed: Array.from(this.computed.values()),
            effects: Array.from(this.effects.values()),
          },
        },
        '*'
      );
    },
  };
}
```

## Architecture

- **manifest.json**: Extension configuration
- **devtools.html**: DevTools panel entry point
- **panel.html**: Main panel UI
- **src/content/detector.js**: Detects Nadi apps on page
- **src/background/service-worker.js**: Background communication
- **src/panels/main.js**: Panel logic and rendering

## Planned Features (Phase 2)

- Time-travel debugging
- Performance profiling
- Router inspection
- Form state visualization
- Component highlighting in page
- Network request tracking
- State export/import

## License

MIT
