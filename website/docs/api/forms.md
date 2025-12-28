# @nadi/forms API Reference

Complete API reference for `@nadi/forms` - powerful form management with validation.

## Installation

```bash
npm install @nadi/forms
```

## Form Creation

### createForm()

Create a form instance with validation and state management.

```typescript
function createForm<T>(config: FormConfig<T>): Form<T>;
```

**Parameters:**

```typescript
interface FormConfig<T> {
  initialValues: T;
  validationSchema?: ValidationSchema<T>;
  validate?: (values: T) => ValidationErrors<T>;
  onSubmit: (values: T) => void | Promise<void>;
  validateOnChange?: boolean; // Default: true
  validateOnBlur?: boolean; // Default: true
}
```

**Returns:** `Form<T>` instance

**Example:**

```typescript
import { createForm } from '@nadi/forms';

const form = createForm({
  initialValues: {
    email: '',
    password: '',
  },
  onSubmit: async (values) => {
    await login(values);
  },
});
```

## Form Instance

### form.values

Signal containing current form values.

```typescript
form.values: Signal<T>
```

**Example:**

```typescript
const form = createForm({ initialValues: { name: '' }, onSubmit: () => {} });

console.log(form.values().name); // ''
```

### form.errors

Signal containing form errors.

```typescript
form.errors: Signal<ValidationErrors<T>>
```

**Example:**

```typescript
effect(() => {
  console.log(form.errors());
});
```

### form.touched

Signal containing touched field states.

```typescript
form.touched: Signal<Record<keyof T, boolean>>
```

**Example:**

```typescript
if (form.touched().email) {
  // Email field has been touched
}
```

### form.isSubmitting

Signal indicating if form is submitting.

```typescript
form.isSubmitting: Signal<boolean>
```

**Example:**

```typescript
<button disabled={form.isSubmitting()}>
  {form.isSubmitting() ? 'Submitting...' : 'Submit'}
</button>
```

### form.isValid

Signal indicating if form is valid.

```typescript
form.isValid: Signal<boolean>
```

**Example:**

```typescript
<button disabled={!form.isValid()}>Submit</button>
```

### form.isDirty

Signal indicating if form has been modified.

```typescript
form.isDirty: Signal<boolean>
```

**Example:**

```typescript
if (form.isDirty()) {
  console.log('Form has unsaved changes');
}
```

## Form Methods

### form.handleSubmit()

Submit form with validation.

```typescript
form.handleSubmit(event?: Event): Promise<void>
```

**Parameters:**

- `event`: Optional form submit event

**Example:**

```typescript
<form onsubmit={form.handleSubmit}>
  {/* form fields */}
  <button type="submit">Submit</button>
</form>
```

### form.setFieldValue()

Set value of a specific field.

```typescript
form.setFieldValue<K extends keyof T>(
  field: K,
  value: T[K],
  validate?: boolean
): void
```

**Parameters:**

- `field`: Field name
- `value`: New value
- `validate`: Whether to validate (default: true)

**Example:**

```typescript
form.setFieldValue('email', 'user@example.com');
```

### form.setFieldError()

Set error for a specific field.

```typescript
form.setFieldError<K extends keyof T>(
  field: K,
  error: string
): void
```

**Example:**

```typescript
form.setFieldError('email', 'Email already exists');
```

### form.setFieldTouched()

Mark field as touched.

```typescript
form.setFieldTouched<K extends keyof T>(
  field: K,
  touched?: boolean
): void
```

**Example:**

```typescript
form.setFieldTouched('email', true);
```

### form.setValues()

Set multiple form values.

```typescript
form.setValues(values: Partial<T>, validate?: boolean): void
```

**Example:**

```typescript
form.setValues({
  email: 'user@example.com',
  name: 'John Doe',
});
```

### form.setErrors()

Set multiple form errors.

```typescript
form.setErrors(errors: ValidationErrors<T>): void
```

**Example:**

```typescript
form.setErrors({
  email: 'Invalid email',
  password: 'Password too short',
});
```

### form.validateField()

Validate specific field.

```typescript
form.validateField<K extends keyof T>(field: K): Promise<void>
```

**Example:**

```typescript
await form.validateField('email');
```

### form.validate()

Validate entire form.

```typescript
form.validate(): Promise<boolean>
```

**Returns:** `true` if valid, `false` if invalid

**Example:**

```typescript
const isValid = await form.validate();
if (isValid) {
  // Submit form
}
```

### form.reset()

Reset form to initial values.

```typescript
form.reset(values?: Partial<T>): void
```

**Parameters:**

- `values`: Optional new initial values

**Example:**

```typescript
form.reset();

// Or with new values
form.reset({ email: '', password: '' });
```

### form.resetField()

Reset specific field.

```typescript
form.resetField<K extends keyof T>(field: K): void
```

**Example:**

```typescript
form.resetField('password');
```

## Field Helpers

### createField()

Create field bindings for input elements.

```typescript
function createField<T, K extends keyof T>(form: Form<T>, name: K): Field<T[K]>;
```

**Returns:**

```typescript
interface Field<V> {
  value: Signal<V>;
  error: Signal<string | undefined>;
  touched: Signal<boolean>;
  onChange: (value: V) => void;
  onBlur: () => void;
}
```

**Example:**

```typescript
const emailField = createField(form, 'email')

<input
  value={emailField.value()}
  oninput={(e) => emailField.onChange((e.target as HTMLInputElement).value)}
  onblur={emailField.onBlur}
/>
{emailField.touched() && emailField.error() && (
  <span class="error">{emailField.error()}</span>
)}
```

## Validation

### Built-in Rules

```typescript
import { required, email, min, max, minLength, maxLength } from '@nadi/forms';
```

#### required()

Field is required.

```typescript
required(message?: string): ValidationRule
```

**Example:**

```typescript
validationSchema: {
  email: [required('Email is required')];
}
```

#### email()

Must be valid email format.

```typescript
email(message?: string): ValidationRule
```

**Example:**

```typescript
validationSchema: {
  email: [email('Invalid email format')];
}
```

#### min()

Minimum numeric value.

```typescript
min(value: number, message?: string): ValidationRule
```

**Example:**

```typescript
validationSchema: {
  age: [min(18, 'Must be at least 18')];
}
```

#### max()

Maximum numeric value.

```typescript
max(value: number, message?: string): ValidationRule
```

**Example:**

```typescript
validationSchema: {
  age: [max(100, 'Must be at most 100')];
}
```

#### minLength()

Minimum string length.

```typescript
minLength(length: number, message?: string): ValidationRule
```

**Example:**

```typescript
validationSchema: {
  password: [minLength(8, 'Password must be at least 8 characters')];
}
```

#### maxLength()

Maximum string length.

```typescript
maxLength(length: number, message?: string): ValidationRule
```

**Example:**

```typescript
validationSchema: {
  bio: [maxLength(500, 'Bio must not exceed 500 characters')];
}
```

#### pattern()

Must match regex pattern.

```typescript
pattern(regex: RegExp, message?: string): ValidationRule
```

**Example:**

```typescript
validationSchema: {
  phone: [pattern(/^\d{10}$/, 'Phone must be 10 digits')];
}
```

#### url()

Must be valid URL.

```typescript
url(message?: string): ValidationRule
```

**Example:**

```typescript
validationSchema: {
  website: [url('Invalid URL')];
}
```

#### oneOf()

Value must be one of allowed values.

```typescript
oneOf<T>(values: T[], message?: string): ValidationRule
```

**Example:**

```typescript
validationSchema: {
  role: [oneOf(['admin', 'user'], 'Invalid role')];
}
```

#### custom()

Custom validation function.

```typescript
custom<T>(
  validator: (value: T) => boolean | string | Promise<boolean | string>,
  message?: string
): ValidationRule
```

**Example:**

```typescript
validationSchema: {
  username: [
    custom(async (value) => {
      const exists = await checkUsername(value);
      return !exists || 'Username already taken';
    }),
  ];
}
```

### Validation Schema

Define validation rules for form fields.

```typescript
interface ValidationSchema<T> {
  [K in keyof T]?: ValidationRule[]
}

type ValidationRule = (value: any) => string | undefined | Promise<string | undefined>
```

**Example:**

```typescript
const form = createForm({
  initialValues: {
    email: '',
    password: '',
    age: 0,
  },
  validationSchema: {
    email: [required('Email is required'), email('Invalid email')],
    password: [
      required('Password is required'),
      minLength(8, 'Password must be at least 8 characters'),
    ],
    age: [
      required('Age is required'),
      min(18, 'Must be at least 18'),
      max(100, 'Must be at most 100'),
    ],
  },
  onSubmit: async (values) => {
    await submitForm(values);
  },
});
```

### Custom Validation Function

```typescript
const form = createForm({
  initialValues: { password: '', confirmPassword: '' },
  validate: (values) => {
    const errors: any = {};

    if (values.password !== values.confirmPassword) {
      errors.confirmPassword = 'Passwords must match';
    }

    return errors;
  },
  onSubmit: async (values) => {
    await submitForm(values);
  },
});
```

## Form Arrays

### createFieldArray()

Manage dynamic lists of fields.

```typescript
function createFieldArray<T, K extends keyof T>(form: Form<T>, name: K): FieldArray<T[K]>;
```

**Returns:**

```typescript
interface FieldArray<T extends any[]> {
  fields: Signal<T>;
  push: (value: T[number]) => void;
  remove: (index: number) => void;
  insert: (index: number, value: T[number]) => void;
  move: (from: number, to: number) => void;
  swap: (indexA: number, indexB: number) => void;
}
```

**Example:**

```typescript
type FormValues = {
  todos: Array<{ text: string; done: boolean }>
}

const form = createForm<FormValues>({
  initialValues: { todos: [] },
  onSubmit: () => {}
})

const todoArray = createFieldArray(form, 'todos')

// Add item
todoArray.push({ text: '', done: false })

// Remove item
todoArray.remove(0)

// Render items
{todoArray.fields().map((todo, index) => (
  <div key={index}>
    <input value={todo.text} />
    <button onclick={() => todoArray.remove(index)}>Remove</button>
  </div>
))}
```

## Components

### Form

Form wrapper component with built-in submit handling.

```typescript
function Form<T>(props: FormProps<T>): JSX.Element;
```

**Props:**

```typescript
interface FormProps<T> {
  form: Form<T>;
  children: ComponentChildren;
  class?: string;
}
```

**Example:**

```typescript
import { Form } from '@nadi/forms'

<Form form={form} class="my-form">
  {/* form fields */}
</Form>
```

### Field

Field component with automatic error display.

```typescript
function Field<T>(props: FieldProps<T>): JSX.Element;
```

**Props:**

```typescript
interface FieldProps<T> {
  form: Form<T>;
  name: keyof T;
  type?: string;
  label?: string;
  placeholder?: string;
  class?: string;
}
```

**Example:**

```typescript
import { Field } from '@nadi/forms'

<Field form={form} name="email" type="email" label="Email" />
```

### ErrorMessage

Display field error message.

```typescript
function ErrorMessage<T>(props: ErrorMessageProps<T>): JSX.Element;
```

**Props:**

```typescript
interface ErrorMessageProps<T> {
  form: Form<T>;
  name: keyof T;
  class?: string;
}
```

**Example:**

```typescript
import { ErrorMessage } from '@nadi/forms'

<ErrorMessage form={form} name="email" class="error" />
```

## TypeScript

### Type Definitions

```typescript
import type {
  Form,
  FormConfig,
  Field,
  FieldArray,
  ValidationSchema,
  ValidationRule,
  ValidationErrors,
} from '@nadi/forms';
```

### Generic Form Types

```typescript
type FormValues = {
  email: string;
  password: string;
  age: number;
};

const form = createForm<FormValues>({
  initialValues: {
    email: '',
    password: '',
    age: 0,
  },
  onSubmit: async (values) => {
    // values is typed as FormValues
  },
});
```

## Best Practices

✅ **Do:**

- Define validation schemas
- Use TypeScript for type safety
- Handle async validation
- Provide clear error messages
- Reset forms after submission
- Use field arrays for dynamic lists

❌ **Don't:**

- Mutate form values directly
- Skip validation on submit
- Forget to handle errors
- Create forms inside effects
- Ignore field touched state
- Submit invalid forms

## Next Steps

- Learn about [Forms](/guide/forms)
- Explore [Validation Rules](/guide/forms#validation)
- Understand [Dynamic Fields](/guide/forms#dynamic-fields)
- Read [Laravel Integration](/guide/laravel)
