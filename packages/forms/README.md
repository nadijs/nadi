# @nadi/forms

Reactive form validation library for Nadi framework with field-level signals and async validation.

## Features

- 🎯 Fine-grained reactivity at field level
- ⚡ Async validation with debouncing
- 🔄 Backend error mapping (Laravel/Django)
- 📝 Type-safe field definitions
- 🎨 Flexible validation rules
- 🧹 Automatic cleanup
- 🪶 Lightweight (~1.5KB gzipped)

## Installation

```bash
npm install @nadi/forms
```

## Quick Start

```typescript
import { createForm } from '@nadi/forms';
import { required, email, minLength } from '@nadi/forms/validators';

const form = createForm({
  initialValues: {
    email: '',
    password: '',
    name: ''
  },
  validationRules: {
    email: [required(), email()],
    password: [required(), minLength(8)],
    name: [required()]
  },
  onSubmit: async (values) => {
    const response = await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify(values)
    });
    return response.json();
  }
});

// In your component
<form onSubmit={form.handleSubmit}>
  <input
    value={form.fields.email.value()}
    onInput={(e) => form.fields.email.setValue(e.target.value)}
    onBlur={() => form.fields.email.setTouched(true)}
  />
  {form.fields.email.error() && (
    <span>{form.fields.email.error()}</span>
  )}

  <button type="submit" disabled={form.isSubmitting()}>
    Submit
  </button>
</form>
```

## API Reference

### `createForm(config)`

Creates a reactive form instance.

**Config:**

```typescript
interface FormConfig<T> {
  initialValues: T;
  validationRules?: ValidationRules<T>;
  validateOnChange?: boolean; // default: true
  validateOnBlur?: boolean; // default: true
  onSubmit?: (values: T) => Promise<any> | any;
}
```

**Returns:**

```typescript
interface Form<T> {
  fields: Fields<T>;
  values: () => T;
  errors: () => Partial<Record<keyof T, string>>;
  isValid: () => boolean;
  isSubmitting: () => boolean;
  isDirty: () => boolean;
  handleSubmit: (e?: Event) => Promise<void>;
  reset: () => void;
  setFieldValue: <K extends keyof T>(field: K, value: T[K]) => void;
  setFieldError: <K extends keyof T>(field: K, error: string) => void;
  setErrors: (errors: Partial<Record<keyof T, string>>) => void;
  validateField: <K extends keyof T>(field: K) => Promise<boolean>;
  validateForm: () => Promise<boolean>;
}
```

### Built-in Validators

```typescript
import {
  required,
  email,
  minLength,
  maxLength,
  min,
  max,
  pattern,
  url,
  custom,
} from '@nadi/forms/validators';

// Usage
const rules = {
  email: [required('Email is required'), email()],
  age: [required(), min(18, 'Must be 18+'), max(120)],
  username: [required(), minLength(3), maxLength(20)],
  website: [url('Invalid URL')],
  password: [required(), pattern(/^(?=.*[A-Z])(?=.*[0-9])/, 'Must contain uppercase and number')],
  terms: [custom((value) => value === true, 'Must accept terms')],
};
```

### Async Validation

```typescript
import { asyncValidator } from '@nadi/forms/validators';

const form = createForm({
  initialValues: { username: '' },
  validationRules: {
    username: [
      required(),
      asyncValidator(
        async (value) => {
          const response = await fetch(`/api/check-username?name=${value}`);
          const data = await response.json();
          return data.available;
        },
        'Username already taken',
        { debounce: 500 } // Wait 500ms after typing stops
      ),
    ],
  },
});
```

### Backend Error Mapping

#### Laravel

```typescript
try {
  await form.handleSubmit();
} catch (error) {
  if (error.response?.data?.errors) {
    // Laravel validation errors format
    form.setErrors(error.response.data.errors);
  }
}
```

#### Django

```typescript
try {
  await form.handleSubmit();
} catch (error) {
  if (error.response?.data) {
    // Django validation errors format
    const errors = Object.entries(error.response.data).reduce(
      (acc, [key, messages]) => ({
        ...acc,
        [key]: Array.isArray(messages) ? messages[0] : messages,
      }),
      {}
    );
    form.setErrors(errors);
  }
}
```

### Field-Level API

Each field exposes reactive signals:

```typescript
const field = form.fields.email;

field.value(); // Current value
field.setValue(newValue); // Update value
field.error(); // Current error message
field.setError(message); // Set error
field.touched(); // Has been blurred
field.setTouched(true); // Mark as touched
field.dirty(); // Has been changed
field.validating(); // Is validating (async)
```

## Advanced Examples

### Custom Validation with Dependencies

```typescript
const form = createForm({
  initialValues: {
    password: '',
    confirmPassword: '',
  },
  validationRules: {
    password: [required(), minLength(8)],
    confirmPassword: [
      required(),
      custom((value, allValues) => {
        return value === allValues.password;
      }, 'Passwords must match'),
    ],
  },
});
```

### Conditional Validation

```typescript
const form = createForm({
  initialValues: {
    hasCompany: false,
    companyName: '',
  },
  validationRules: {
    companyName: [
      custom((value, allValues) => {
        if (allValues.hasCompany && !value) {
          return false;
        }
        return true;
      }, 'Company name is required'),
    ],
  },
});
```

### Array Fields

```typescript
const form = createForm({
  initialValues: {
    tags: [''] as string[],
  },
  validationRules: {
    tags: [
      custom((tags) => tags.length > 0, 'At least one tag required'),
      custom((tags) => tags.every((t) => t.length > 2), 'Tags must be 3+ chars'),
    ],
  },
});

// Add tag
const addTag = () => {
  form.setFieldValue('tags', [...form.fields.tags.value(), '']);
};

// Remove tag
const removeTag = (index: number) => {
  const tags = form.fields.tags.value();
  form.setFieldValue(
    'tags',
    tags.filter((_, i) => i !== index)
  );
};
```

### Integration with @nadi/core

```typescript
import { signal, computed, effect } from '@nadi/core';
import { createForm } from '@nadi/forms';

export default function LoginForm() {
  const form = createForm({
    initialValues: {
      email: '',
      password: ''
    },
    validationRules: {
      email: [required(), email()],
      password: [required(), minLength(8)]
    },
    onSubmit: async (values) => {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });

      if (!response.ok) {
        const data = await response.json();
        throw { response: { data } };
      }

      return response.json();
    }
  });

  // Track submission state
  effect(() => {
    if (form.isSubmitting()) {
      console.log('Submitting form...');
    }
  });

  return (
    <form onSubmit={form.handleSubmit}>
      <div>
        <label>Email</label>
        <input
          type="email"
          value={form.fields.email.value()}
          onInput={(e) => form.fields.email.setValue(e.target.value)}
          onBlur={() => form.fields.email.setTouched(true)}
        />
        {form.fields.email.touched() && form.fields.email.error() && (
          <span class="error">{form.fields.email.error()}</span>
        )}
      </div>

      <div>
        <label>Password</label>
        <input
          type="password"
          value={form.fields.password.value()}
          onInput={(e) => form.fields.password.setValue(e.target.value)}
          onBlur={() => form.fields.password.setTouched(true)}
        />
        {form.fields.password.touched() && form.fields.password.error() && (
          <span class="error">{form.fields.password.error()}</span>
        )}
      </div>

      <button type="submit" disabled={form.isSubmitting() || !form.isValid()}>
        {form.isSubmitting() ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}
```

## Performance

- **Bundle Size**: ~1.5KB gzipped
- **Field-Level Reactivity**: Only re-renders affected fields
- **Debounced Validation**: Prevents excessive API calls
- **Tree-Shakeable**: Only import validators you use

## License

MIT
