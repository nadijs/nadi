import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'src/index.ts',
    // Form Components
    'src/components/Input.tsx',
    'src/components/Textarea.tsx',
    'src/components/Checkbox.tsx',
    'src/components/Radio.tsx',
    'src/components/Select.tsx',
    'src/components/Switch.tsx',
    'src/components/Slider.tsx',
    // Button Components
    'src/components/Button.tsx',
    // Feedback Components
    'src/components/Toast.tsx',
    'src/components/Alert.tsx',
    'src/components/Progress.tsx',
    'src/components/Modal.tsx',
    'src/components/Drawer.tsx',
    // Data Display Components
    'src/components/Card.tsx',
    'src/components/Badge.tsx',
    'src/components/Avatar.tsx',
    'src/components/Timeline.tsx',
    'src/components/Skeleton.tsx',
    'src/components/Table.tsx',
    'src/components/Tooltip.tsx',
    'src/components/Accordion.tsx',
    // Navigation Components
    'src/components/Breadcrumb.tsx',
    'src/components/Pagination.tsx',
    'src/components/Steps.tsx',
    'src/components/Tabs.tsx',
    'src/components/Navbar.tsx',
    'src/components/Sidebar.tsx',
    // Overlay Components
    'src/components/Popover.tsx',
    'src/components/Dropdown.tsx',
    'src/components/Menu.tsx',
    // Utility Components
    'src/components/Divider.tsx',
    'src/components/Rating.tsx',
    // Layout Components
    'src/components/Grid.tsx',
    'src/components/Stack.tsx',
    'src/components/Container.tsx',
    'src/components/Flex.tsx',
    // Other
    'src/components/DatePicker.tsx',
    // Systems
    'src/theme/index.ts',
    'src/animations/index.ts',
  ],
  format: ['esm'],
  dts: false, // Disable for now due to @nadi/core jsx-runtime issue
  sourcemap: true,
  clean: true,
  target: 'es2022',
  treeshake: true,
  minify: true,
  splitting: false,
  esbuildOptions(options) {
    options.jsx = 'automatic';
    options.jsxImportSource = '@nadi/core';
  },
});
