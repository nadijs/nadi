# Nadi UI Example

Simple example demonstrating the @nadi/ui component library.

## Usage

```tsx
import { Button, Input, Grid, Card, showToast, ToastContainer } from '@nadi/ui';
import '@nadi/ui/styles.css';
import { signal } from '@nadi.js/core';

function App() {
  const [name, setName] = signal('');
  const [loading, setLoading] = signal(false);

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast({
        message: `Hello, ${name()}!`,
        variant: 'success',
      });
    }, 1000);
  };

  return (
    <>
      <ToastContainer position="top-right" />

      <Grid cols={1} colsMd={2} gap="lg">
        <Card>
          <h2>Welcome to Nadi UI</h2>
          <Input
            value={name()}
            onInput={(e) => setName(e.target.value)}
            label="Your Name"
            placeholder="Enter your name..."
          />
          <Button
            variant="primary"
            loading={loading()}
            onClick={handleSubmit}
            style={{ marginTop: '1rem' }}
          >
            Submit
          </Button>
        </Card>
      </Grid>
    </>
  );
}
```

## Features Demonstrated

- **Reactive State**: Using signals for automatic UI updates
- **Form Components**: Input with controlled state
- **Layout**: Responsive Grid layout
- **Feedback**: Toast notifications
- **Loading States**: Button loading indicator
- **Styling**: CSS variables for theming
