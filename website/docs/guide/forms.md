# Forms & Validation

The Nadi Forms package provides reactive form handling with built-in validation, error messages, and seamless integration with backend APIs.

## Installation

```bash
npm install @nadi/forms
```

## Quick Start

```typescript
import { createForm } from '@nadi/forms'

function LoginForm() {
  const form = createForm({
    initialValues: {
      email: '',
      password: ''
    },
    validationRules: {
      email: ['required', 'email'],
      password: ['required', 'min:8']
    },
    onSubmit: async (values) => {
      const response = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify(values)
      })
      return response.json()
    }
  })

  return (
    <form onsubmit={form.handleSubmit}>
      <input
        type="email"
        value={form.values.email()}
        oninput={(e) => form.setFieldValue('email', (e.target as HTMLInputElement).value)}
      />
      {form.errors.email() && <span class="error">{form.errors.email()}</span>}

      <input
        type="password"
        value={form.values.password()}
        oninput={(e) => form.setFieldValue('password', (e.target as HTMLInputElement).value)}
      />
      {form.errors.password() && <span class="error">{form.errors.password()}</span>}

      <button type="submit" disabled={form.isSubmitting()}>
        {form.isSubmitting() ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )
}
```

## Creating Forms

### Basic Form

```typescript
import { createForm } from '@nadi/forms';

const form = createForm({
  initialValues: {
    username: '',
    email: '',
    age: 0,
  },
});
```

### With Validation

```typescript
const form = createForm({
  initialValues: {
    email: '',
    password: '',
    confirmPassword: '',
  },
  validationRules: {
    email: ['required', 'email'],
    password: ['required', 'min:8'],
    confirmPassword: ['required', 'same:password'],
  },
});
```

### With Submit Handler

```typescript
const form = createForm({
  initialValues: {
    name: '',
    email: '',
  },
  onSubmit: async (values) => {
    console.log('Submitting:', values);

    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      throw new Error('Failed to create user');
    }

    return response.json();
  },
});
```

## Form State

### Values

```typescript
// Get all values
const allValues = form.values();

// Get single value
const email = form.values.email();

// Set single value
form.setFieldValue('email', 'john@example.com');

// Set multiple values
form.setValues({
  email: 'john@example.com',
  name: 'John Doe',
});

// Reset to initial values
form.reset();
```

### Errors

```typescript
// Get all errors
const allErrors = form.errors();

// Get field error
const emailError = form.errors.email();

// Set field error
form.setFieldError('email', 'Email is invalid');

// Clear field error
form.setFieldError('email', '');

// Clear all errors
form.clearErrors();
```

### Touched Fields

```typescript
// Check if field was touched
const wasEmailTouched = form.touched.email();

// Mark field as touched
form.setFieldTouched('email', true);

// Mark all fields as touched
form.setTouched({
  email: true,
  password: true,
});
```

### Submission State

```typescript
// Check if submitting
const isSubmitting = form.isSubmitting();

// Check if submitted
const wasSubmitted = form.isSubmitted();

// Get submission count
const submitCount = form.submitCount();
```

## Validation

### Built-in Rules

```typescript
const form = createForm({
  initialValues: {
    username: '',
    email: '',
    age: 0,
    website: '',
    password: '',
    confirmPassword: '',
    terms: false,
  },
  validationRules: {
    username: ['required', 'min:3', 'max:20', 'alpha_dash'],
    email: ['required', 'email'],
    age: ['required', 'numeric', 'min:18', 'max:100'],
    website: ['url'],
    password: ['required', 'min:8', 'regex:/^(?=.*[A-Za-z])(?=.*\\d)/'],
    confirmPassword: ['required', 'same:password'],
    terms: ['accepted'],
  },
});
```

### Available Rules

| Rule              | Description              | Example                   |
| ----------------- | ------------------------ | ------------------------- |
| `required`        | Field must have a value  | `['required']`            |
| `email`           | Must be valid email      | `['email']`               |
| `numeric`         | Must be a number         | `['numeric']`             |
| `integer`         | Must be an integer       | `['integer']`             |
| `min:n`           | Minimum value/length     | `['min:3']`               |
| `max:n`           | Maximum value/length     | `['max:100']`             |
| `between:min,max` | Between two values       | `['between:18,65']`       |
| `alpha`           | Only letters             | `['alpha']`               |
| `alpha_num`       | Letters and numbers      | `['alpha_num']`           |
| `alpha_dash`      | Letters, numbers, dashes | `['alpha_dash']`          |
| `url`             | Valid URL                | `['url']`                 |
| `regex:pattern`   | Matches regex            | `['regex:/^[A-Z]/']`      |
| `same:field`      | Matches another field    | `['same:password']`       |
| `different:field` | Different from field     | `['different:username']`  |
| `accepted`        | Must be true/yes/1       | `['accepted']`            |
| `in:a,b,c`        | Must be in list          | `['in:admin,user,guest']` |
| `not_in:a,b,c`    | Must not be in list      | `['not_in:banned,spam']`  |

### Custom Validation Rules

```typescript
const form = createForm({
  initialValues: {
    username: '',
  },
  validationRules: {
    username: [
      'required',
      {
        rule: (value) => {
          // Custom synchronous validation
          return value.length >= 3 && value.length <= 20;
        },
        message: 'Username must be between 3 and 20 characters',
      },
    ],
  },
});
```

### Async Validation

```typescript
const form = createForm({
  initialValues: {
    username: '',
  },
  validationRules: {
    username: [
      'required',
      {
        rule: async (value) => {
          // Check if username is available
          const response = await fetch(`/api/check-username?username=${value}`);
          const { available } = await response.json();
          return available;
        },
        message: 'Username is already taken',
      },
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
      {
        rule: (value, values) => {
          // Only require if hasCompany is true
          if (values.hasCompany) {
            return value.length > 0;
          }
          return true;
        },
        message: 'Company name is required',
      },
    ],
  },
});
```

### Field-Level Validation

```typescript
function EmailField() {
  const field = createField({
    name: 'email',
    initialValue: '',
    validationRules: ['required', 'email'],
    validateOnChange: true,
    validateOnBlur: true
  })

  return (
    <div>
      <input
        type="email"
        value={field.value()}
        oninput={(e) => field.setValue((e.target as HTMLInputElement).value)}
        onblur={() => field.setTouched(true)}
      />
      {field.error() && <span class="error">{field.error()}</span>}
    </div>
  )
}
```

## Form Submission

### Basic Submission

```typescript
const form = createForm({
  initialValues: {
    email: '',
    message: ''
  },
  onSubmit: async (values) => {
    console.log('Submitting:', values)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    alert('Form submitted!')
  }
})

function ContactForm() {
  return (
    <form onsubmit={form.handleSubmit}>
      {/* form fields */}
      <button type="submit" disabled={form.isSubmitting()}>
        {form.isSubmitting() ? 'Sending...' : 'Send'}
      </button>
    </form>
  )
}
```

### With Error Handling

```typescript
const form = createForm({
  initialValues: { email: '' },
  onSubmit: async (values) => {
    const response = await fetch('/api/submit', {
      method: 'POST',
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const errors = await response.json();

      // Set server-side validation errors
      Object.entries(errors).forEach(([field, message]) => {
        form.setFieldError(field, message as string);
      });

      throw new Error('Validation failed');
    }

    return response.json();
  },
  onError: (error) => {
    console.error('Submission failed:', error);
    alert('Failed to submit form');
  },
  onSuccess: (result) => {
    console.log('Success:', result);
    alert('Form submitted successfully!');
    form.reset();
  },
});
```

### Manual Submission

```typescript
function Component() {
  const handleClick = async () => {
    // Validate before submitting
    const isValid = await form.validate()

    if (isValid) {
      await form.submit()
    }
  }

  return (
    <button onclick={handleClick}>
      Submit
    </button>
  )
}
```

## Form Components

### Input Component

```typescript
function Input({
  form,
  name,
  label,
  type = 'text'
}: {
  form: Form
  name: string
  label: string
  type?: string
}) {
  return (
    <div class="form-group">
      <label>{label}</label>
      <input
        type={type}
        value={form.values[name]()}
        oninput={(e) => form.setFieldValue(name, (e.target as HTMLInputElement).value)}
        onblur={() => form.setFieldTouched(name, true)}
        class={form.errors[name]() ? 'error' : ''}
      />
      {form.touched[name]() && form.errors[name]() && (
        <span class="error-message">{form.errors[name]()}</span>
      )}
    </div>
  )
}

// Usage
<Input form={form} name="email" label="Email" type="email" />
<Input form={form} name="password" label="Password" type="password" />
```

### Select Component

```typescript
function Select({
  form,
  name,
  label,
  options
}: {
  form: Form
  name: string
  label: string
  options: Array<{ value: string; label: string }>
}) {
  return (
    <div class="form-group">
      <label>{label}</label>
      <select
        value={form.values[name]()}
        onchange={(e) => form.setFieldValue(name, (e.target as HTMLSelectElement).value)}
        onblur={() => form.setFieldTouched(name, true)}
      >
        <option value="">Select...</option>
        {options.map(opt => (
          <option value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {form.touched[name]() && form.errors[name]() && (
        <span class="error-message">{form.errors[name]()}</span>
      )}
    </div>
  )
}

// Usage
<Select
  form={form}
  name="country"
  label="Country"
  options={[
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'ca', label: 'Canada' }
  ]}
/>
```

### Checkbox Component

```typescript
function Checkbox({
  form,
  name,
  label
}: {
  form: Form
  name: string
  label: string
}) {
  return (
    <div class="form-group">
      <label>
        <input
          type="checkbox"
          checked={form.values[name]()}
          onchange={(e) => form.setFieldValue(name, (e.target as HTMLInputElement).checked)}
        />
        {label}
      </label>
      {form.errors[name]() && (
        <span class="error-message">{form.errors[name]()}</span>
      )}
    </div>
  )
}

// Usage
<Checkbox form={form} name="terms" label="I agree to the terms" />
```

## Advanced Patterns

### Dynamic Fields

```typescript
function DynamicForm() {
  const [fields, setFields] = signal([''])

  const form = createForm({
    initialValues: {
      items: ['']
    }
  })

  const addField = () => {
    const current = form.values.items()
    form.setFieldValue('items', [...current, ''])
  }

  const removeField = (index: number) => {
    const current = form.values.items()
    form.setFieldValue('items', current.filter((_, i) => i !== index))
  }

  return (
    <form onsubmit={form.handleSubmit}>
      {form.values.items().map((item, index) => (
        <div key={index}>
          <input
            value={item}
            oninput={(e) => {
              const items = [...form.values.items()]
              items[index] = (e.target as HTMLInputElement).value
              form.setFieldValue('items', items)
            }}
          />
          <button type="button" onclick={() => removeField(index)}>
            Remove
          </button>
        </div>
      ))}
      <button type="button" onclick={addField}>Add Field</button>
      <button type="submit">Submit</button>
    </form>
  )
}
```

### Multi-Step Form

```typescript
function MultiStepForm() {
  const [step, setStep] = signal(1)

  const form = createForm({
    initialValues: {
      // Step 1
      email: '',
      password: '',
      // Step 2
      firstName: '',
      lastName: '',
      // Step 3
      address: '',
      city: '',
      country: ''
    },
    onSubmit: async (values) => {
      console.log('Final submission:', values)
    }
  })

  const nextStep = async () => {
    const isValid = await form.validate()
    if (isValid) {
      setStep(step() + 1)
    }
  }

  const prevStep = () => {
    setStep(step() - 1)
  }

  return (
    <form onsubmit={form.handleSubmit}>
      {step() === 1 && (
        <div>
          <h2>Step 1: Account</h2>
          <Input form={form} name="email" label="Email" />
          <Input form={form} name="password" label="Password" type="password" />
          <button type="button" onclick={nextStep}>Next</button>
        </div>
      )}

      {step() === 2 && (
        <div>
          <h2>Step 2: Personal Info</h2>
          <Input form={form} name="firstName" label="First Name" />
          <Input form={form} name="lastName" label="Last Name" />
          <button type="button" onclick={prevStep}>Back</button>
          <button type="button" onclick={nextStep}>Next</button>
        </div>
      )}

      {step() === 3 && (
        <div>
          <h2>Step 3: Address</h2>
          <Input form={form} name="address" label="Address" />
          <Input form={form} name="city" label="City" />
          <Input form={form} name="country" label="Country" />
          <button type="button" onclick={prevStep}>Back</button>
          <button type="submit">Submit</button>
        </div>
      )}
    </form>
  )
}
```

### Form with File Upload

```typescript
function UploadForm() {
  const [file, setFile] = signal<File | null>(null)

  const form = createForm({
    initialValues: {
      title: '',
      description: ''
    },
    onSubmit: async (values) => {
      const formData = new FormData()
      formData.append('title', values.title)
      formData.append('description', values.description)
      if (file()) {
        formData.append('file', file()!)
      }

      await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
    }
  })

  return (
    <form onsubmit={form.handleSubmit}>
      <Input form={form} name="title" label="Title" />
      <Input form={form} name="description" label="Description" />
      <input
        type="file"
        onchange={(e) => {
          const files = (e.target as HTMLInputElement).files
          if (files && files[0]) {
            setFile(files[0])
          }
        }}
      />
      <button type="submit">Upload</button>
    </form>
  )
}
```

## Laravel Integration

### Backend (Laravel)

```php
// app/Http/Controllers/UserController.php
public function store(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|min:3',
        'email' => 'required|email|unique:users',
        'password' => 'required|min:8',
    ]);

    $user = User::create($validated);

    return response()->json($user, 201);
}
```

### Frontend (Nadi)

```typescript
const form = createForm({
  initialValues: {
    name: '',
    email: '',
    password: '',
  },
  validationRules: {
    name: ['required', 'min:3'],
    email: ['required', 'email'],
    password: ['required', 'min:8'],
  },
  onSubmit: async (values) => {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const errors = await response.json();

      // Map Laravel errors to form
      Object.entries(errors.errors || {}).forEach(([field, messages]) => {
        form.setFieldError(field, (messages as string[])[0]);
      });

      throw new Error('Validation failed');
    }

    return response.json();
  },
});
```

## Testing

```typescript
import { createForm } from '@nadi/forms'
import { render, fireEvent, waitFor } from '@nadi/testing'

test('validates email field', async () => {
  const form = createForm({
    initialValues: { email: '' },
    validationRules: { email: ['required', 'email'] }
  })

  const { getByLabelText, getByText } = render(<FormComponent form={form} />)

  const input = getByLabelText('Email')
  fireEvent.input(input, { target: { value: 'invalid' } })
  fireEvent.blur(input)

  await waitFor(() => {
    expect(getByText('Email must be a valid email')).toBeInTheDocument()
  })
})
```

## Integration with @nadi/ui

The `@nadi/ui` package provides form components that integrate seamlessly with `@nadi/forms`:

### Automatic Field Binding

Instead of manually wiring up values and handlers, use the `field` prop:

```typescript
import { createForm } from '@nadi/forms';
import { Input, Textarea, Select, Checkbox, Button } from '@nadi/ui';
import '@nadi/ui/styles.css';

function SignupForm() {
  const form = createForm({
    initialValues: {
      email: '',
      password: '',
      bio: '',
      country: '',
      newsletter: false,
    },
    validationRules: {
      email: ['required', 'email'],
      password: ['required', 'min:8'],
      bio: ['max:500'],
    },
    onSubmit: async (values) => {
      const response = await fetch('/api/signup', {
        method: 'POST',
        body: JSON.stringify(values),
      });
      return response.json();
    },
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}>
      {/* field prop automatically handles value, errors, touched state */}
      <Input
        field={form.fields.email}
        type="email"
        label="Email"
        placeholder="you@example.com"
        required
      />

      <Input
        field={form.fields.password}
        type="password"
        label="Password"
        placeholder="Min 8 characters"
        required
      />

      <Textarea
        field={form.fields.bio}
        label="Bio"
        rows={4}
        maxLength={500}
        showCount
        autoResize
      />

      <Select
        field={form.fields.country}
        label="Country"
        options={[
          { value: 'us', label: 'United States' },
          { value: 'uk', label: 'United Kingdom' },
          { value: 'ca', label: 'Canada' },
        ]}
      />

      <Checkbox
        field={form.fields.newsletter}
        label="Subscribe to newsletter"
      />

      <Button
        type="submit"
        variant="primary"
        loading={form.isSubmitting()}
        disabled={!form.isValid()}
        fullWidth
      >
        Sign Up
      </Button>
    </form>
  );
}
```

### What `field` Prop Provides

When you pass `form.fields.fieldName` to a component:

- ✅ **Value binding**: Automatically syncs the input value
- ✅ **Change handlers**: Updates form state on input
- ✅ **Validation errors**: Shows error messages automatically
- ✅ **Touched state**: Only shows errors after user interaction
- ✅ **Accessibility**: Adds proper ARIA attributes

### Without @nadi/ui (Manual Wiring)

```typescript
// Without @nadi/ui - manual wiring
<input
  type="email"
  value={form.values.email()}
  oninput={(e) => form.setFieldValue('email', e.target.value)}
  onblur={() => form.setFieldTouched('email', true)}
  aria-invalid={!!form.errors.email()}
  aria-describedby={form.errors.email() ? 'email-error' : undefined}
/>
{form.errors.email() && form.touched.email() && (
  <span id="email-error" class="error">{form.errors.email()}</span>
)}
```

### With @nadi/ui (Automatic)

```typescript
// With @nadi/ui - automatic binding
<Input field={form.fields.email} type="email" label="Email" />
```

### Complex Form Example

```typescript
import { createForm } from '@nadi/forms';
import {
  Input, Textarea, Select, RadioGroup, Checkbox,
  Button, Card, Stack, Grid
} from '@nadi/ui';

function CompleteForm() {
  const form = createForm({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      country: '',
      accountType: 'personal',
      interests: [],
      agreeToTerms: false,
    },
    validationRules: {
      firstName: ['required', 'min:2'],
      lastName: ['required', 'min:2'],
      email: ['required', 'email'],
      phone: ['required', 'regex:/^\\+?[1-9]\\d{1,14}$/'],
      accountType: ['required'],
      agreeToTerms: ['accepted'],
    },
    onSubmit: async (values) => {
      console.log('Form submitted:', values);
    },
  });

  return (
    <Card padding="lg">
      <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}>
        <Stack spacing="lg">
          <h2>Create Account</h2>

          <Grid cols={2} gap="md">
            <Input
              field={form.fields.firstName}
              label="First Name"
              required
            />
            <Input
              field={form.fields.lastName}
              label="Last Name"
              required
            />
          </Grid>

          <Input
            field={form.fields.email}
            type="email"
            label="Email"
            required
          />

          <Input
            field={form.fields.phone}
            type="tel"
            label="Phone"
            placeholder="+1234567890"
            required
          />

          <Textarea
            field={form.fields.address}
            label="Address"
            rows={3}
          />

          <Grid cols={2} gap="md">
            <Input
              field={form.fields.city}
              label="City"
            />
            <Select
              field={form.fields.country}
              label="Country"
              options={[
                { value: 'us', label: 'United States' },
                { value: 'uk', label: 'United Kingdom' },
                { value: 'ca', label: 'Canada' },
              ]}
            />
          </Grid>

          <RadioGroup
            field={form.fields.accountType}
            label="Account Type"
            options={[
              { value: 'personal', label: 'Personal' },
              { value: 'business', label: 'Business' },
            ]}
          />

          <Checkbox
            field={form.fields.agreeToTerms}
            label="I agree to the terms and conditions"
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={form.isSubmitting()}
            disabled={!form.isValid()}
            fullWidth
          >
            Create Account
          </Button>
        </Stack>
      </form>
    </Card>
  );
}
```

## Best Practices

✅ **Do:**

- **Use @nadi/ui components** with `field` prop for automatic binding
- Validate on blur for better UX
- Show errors only after field is touched
- Disable submit while submitting
- Reset form after successful submission
- Use TypeScript for type safety

❌ **Don't:**

- Manually wire up values and handlers when using @nadi/ui
- Validate on every keystroke
- Show errors immediately
- Forget to handle server errors
- Submit invalid forms
- Mutate form values directly

## Next Steps

- Learn about [UI Components](/guide/ui-components) for better forms
- Explore [Meta](/guide/meta) for SEO
- Understand [Testing](/guide/testing) forms
- Explore [Laravel Integration](/guide/laravel)
- Read the [Forms API Reference](/api/forms)
