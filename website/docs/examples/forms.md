# Form Examples

Comprehensive form examples demonstrating validation, dynamic fields, multi-step forms, and file uploads.

## Basic Login Form

Simple login form with validation.

```typescript
import { createForm } from '@nadi/forms'
import { required, email, minLength } from '@nadi/forms/rules'

function LoginForm() {
  const form = createForm({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: {
      email: [
        required('Email is required'),
        email('Invalid email format')
      ],
      password: [
        required('Password is required'),
        minLength(8, 'Password must be at least 8 characters')
      ]
    },
    onSubmit: async (values) => {
      try {
        await login(values.email, values.password)
        alert('Login successful!')
      } catch (error) {
        form.setFieldError('email', 'Invalid credentials')
      }
    }
  })

  return (
    <form onsubmit={form.handleSubmit} class="login-form">
      <h2>Login</h2>

      <div class="form-group">
        <label for="email">Email</label>
        <input
          id="email"
          type="email"
          value={form.values().email}
          oninput={(e) => form.setFieldValue('email', (e.target as HTMLInputElement).value)}
          onblur={() => form.setFieldTouched('email', true)}
          class={form.touched().email && form.errors().email ? 'error' : ''}
        />
        {form.touched().email && form.errors().email && (
          <span class="error-message">{form.errors().email}</span>
        )}
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input
          id="password"
          type="password"
          value={form.values().password}
          oninput={(e) => form.setFieldValue('password', (e.target as HTMLInputElement).value)}
          onblur={() => form.setFieldTouched('password', true)}
          class={form.touched().password && form.errors().password ? 'error' : ''}
        />
        {form.touched().password && form.errors().password && (
          <span class="error-message">{form.errors().password}</span>
        )}
      </div>

      <button type="submit" disabled={form.isSubmitting() || !form.isValid()}>
        {form.isSubmitting() ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )
}
```

## Registration Form

Complete registration form with password confirmation.

```typescript
import { createForm } from '@nadi/forms'
import { required, email, minLength, custom } from '@nadi/forms/rules'

function RegistrationForm() {
  const form = createForm({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false
    },
    validationSchema: {
      username: [
        required('Username is required'),
        minLength(3, 'Username must be at least 3 characters'),
        custom(async (value) => {
          const available = await checkUsername(value)
          return available || 'Username already taken'
        })
      ],
      email: [
        required('Email is required'),
        email('Invalid email format')
      ],
      password: [
        required('Password is required'),
        minLength(8, 'Password must be at least 8 characters'),
        custom((value) => {
          const hasUpperCase = /[A-Z]/.test(value)
          const hasLowerCase = /[a-z]/.test(value)
          const hasNumber = /\d/.test(value)

          if (!hasUpperCase || !hasLowerCase || !hasNumber) {
            return 'Password must contain uppercase, lowercase, and number'
          }
          return true
        })
      ],
      confirmPassword: [
        required('Please confirm password'),
        custom((value, values) => {
          return value === values.password || 'Passwords must match'
        })
      ],
      agreeToTerms: [
        custom((value) => value || 'You must agree to the terms')
      ]
    },
    onSubmit: async (values) => {
      await register(values)
      alert('Registration successful!')
    }
  })

  return (
    <form onsubmit={form.handleSubmit} class="registration-form">
      <h2>Create Account</h2>

      <div class="form-group">
        <label>Username</label>
        <input
          value={form.values().username}
          oninput={(e) => form.setFieldValue('username', (e.target as HTMLInputElement).value)}
        />
        {form.errors().username && (
          <span class="error-message">{form.errors().username}</span>
        )}
      </div>

      <div class="form-group">
        <label>Email</label>
        <input
          type="email"
          value={form.values().email}
          oninput={(e) => form.setFieldValue('email', (e.target as HTMLInputElement).value)}
        />
        {form.errors().email && (
          <span class="error-message">{form.errors().email}</span>
        )}
      </div>

      <div class="form-group">
        <label>Password</label>
        <input
          type="password"
          value={form.values().password}
          oninput={(e) => form.setFieldValue('password', (e.target as HTMLInputElement).value)}
        />
        {form.errors().password && (
          <span class="error-message">{form.errors().password}</span>
        )}

        <div class="password-strength">
          <PasswordStrength password={form.values().password} />
        </div>
      </div>

      <div class="form-group">
        <label>Confirm Password</label>
        <input
          type="password"
          value={form.values().confirmPassword}
          oninput={(e) => form.setFieldValue('confirmPassword', (e.target as HTMLInputElement).value)}
        />
        {form.errors().confirmPassword && (
          <span class="error-message">{form.errors().confirmPassword}</span>
        )}
      </div>

      <div class="form-group checkbox">
        <label>
          <input
            type="checkbox"
            checked={form.values().agreeToTerms}
            onchange={(e) => form.setFieldValue('agreeToTerms', (e.target as HTMLInputElement).checked)}
          />
          I agree to the <a href="/terms">Terms and Conditions</a>
        </label>
        {form.errors().agreeToTerms && (
          <span class="error-message">{form.errors().agreeToTerms}</span>
        )}
      </div>

      <button type="submit" disabled={form.isSubmitting() || !form.isValid()}>
        {form.isSubmitting() ? 'Creating Account...' : 'Sign Up'}
      </button>
    </form>
  )
}

function PasswordStrength({ password }: { password: string }) {
  const strength = computed(() => {
    let score = 0
    if (password.length >= 8) score++
    if (password.length >= 12) score++
    if (/[A-Z]/.test(password)) score++
    if (/[a-z]/.test(password)) score++
    if (/\d/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    return score
  })

  const label = computed(() => {
    const s = strength()
    if (s <= 2) return 'Weak'
    if (s <= 4) return 'Medium'
    return 'Strong'
  })

  return (
    <div class={`strength-meter strength-${label().toLowerCase()}`}>
      <div class="strength-bar" style={`width: ${(strength() / 6) * 100}%`}></div>
      <span>{label()}</span>
    </div>
  )
}
```

## Dynamic Form Fields

Add/remove fields dynamically.

```typescript
import { signal } from '@nadi/core'
import { createForm } from '@nadi/forms'

type Contact = {
  type: 'email' | 'phone'
  value: string
}

function DynamicForm() {
  const contacts = signal<Contact[]>([{ type: 'email', value: '' }])

  const addContact = () => {
    contacts.set([...contacts(), { type: 'email', value: '' }])
  }

  const removeContact = (index: number) => {
    contacts.set(contacts().filter((_, i) => i !== index))
  }

  const updateContact = (index: number, field: keyof Contact, value: any) => {
    contacts.set(contacts().map((c, i) =>
      i === index ? { ...c, [field]: value } : c
    ))
  }

  const handleSubmit = async (e: Event) => {
    e.preventDefault()
    await saveContacts(contacts())
  }

  return (
    <form onsubmit={handleSubmit} class="dynamic-form">
      <h2>Contact Information</h2>

      {contacts().map((contact, index) => (
        <div key={index} class="contact-row">
          <select
            value={contact.type}
            onchange={(e) => updateContact(index, 'type', (e.target as HTMLSelectElement).value)}
          >
            <option value="email">Email</option>
            <option value="phone">Phone</option>
          </select>

          <input
            type={contact.type === 'email' ? 'email' : 'tel'}
            value={contact.value}
            oninput={(e) => updateContact(index, 'value', (e.target as HTMLInputElement).value)}
            placeholder={contact.type === 'email' ? 'email@example.com' : '+1 (555) 000-0000'}
          />

          {contacts().length > 1 && (
            <button type="button" onclick={() => removeContact(index)}>
              Remove
            </button>
          )}
        </div>
      ))}

      <button type="button" onclick={addContact}>
        + Add Contact
      </button>

      <button type="submit">Save Contacts</button>
    </form>
  )
}
```

## Multi-Step Form

Wizard-style form with multiple steps.

```typescript
import { signal, computed } from '@nadi/core'
import { createForm } from '@nadi/forms'

type FormData = {
  // Step 1
  firstName: string
  lastName: string
  email: string

  // Step 2
  address: string
  city: string
  zipCode: string

  // Step 3
  cardNumber: string
  expiryDate: string
  cvv: string
}

function MultiStepForm() {
  const currentStep = signal(1)
  const totalSteps = 3

  const form = createForm<FormData>({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      address: '',
      city: '',
      zipCode: '',
      cardNumber: '',
      expiryDate: '',
      cvv: ''
    },
    validationSchema: {
      firstName: [required('First name is required')],
      lastName: [required('Last name is required')],
      email: [required('Email is required'), email('Invalid email')],
      address: [required('Address is required')],
      city: [required('City is required')],
      zipCode: [required('ZIP code is required')],
      cardNumber: [required('Card number is required')],
      expiryDate: [required('Expiry date is required')],
      cvv: [required('CVV is required')]
    },
    onSubmit: async (values) => {
      await submitOrder(values)
      alert('Order submitted!')
    }
  })

  const validateCurrentStep = async () => {
    const step = currentStep()

    if (step === 1) {
      await form.validateField('firstName')
      await form.validateField('lastName')
      await form.validateField('email')

      return !form.errors().firstName && !form.errors().lastName && !form.errors().email
    }

    if (step === 2) {
      await form.validateField('address')
      await form.validateField('city')
      await form.validateField('zipCode')

      return !form.errors().address && !form.errors().city && !form.errors().zipCode
    }

    return true
  }

  const nextStep = async () => {
    const isValid = await validateCurrentStep()
    if (isValid && currentStep() < totalSteps) {
      currentStep.set(currentStep() + 1)
    }
  }

  const prevStep = () => {
    if (currentStep() > 1) {
      currentStep.set(currentStep() - 1)
    }
  }

  const progress = computed(() => (currentStep() / totalSteps) * 100)

  return (
    <div class="multi-step-form">
      <div class="progress-bar">
        <div class="progress" style={`width: ${progress()}%`}></div>
      </div>

      <div class="steps">
        <span class={currentStep() >= 1 ? 'active' : ''}>1. Personal</span>
        <span class={currentStep() >= 2 ? 'active' : ''}>2. Address</span>
        <span class={currentStep() >= 3 ? 'active' : ''}>3. Payment</span>
      </div>

      <form onsubmit={form.handleSubmit}>
        {currentStep() === 1 && (
          <div class="step">
            <h2>Personal Information</h2>

            <div class="form-group">
              <label>First Name</label>
              <input
                value={form.values().firstName}
                oninput={(e) => form.setFieldValue('firstName', (e.target as HTMLInputElement).value)}
              />
              {form.errors().firstName && <span class="error">{form.errors().firstName}</span>}
            </div>

            <div class="form-group">
              <label>Last Name</label>
              <input
                value={form.values().lastName}
                oninput={(e) => form.setFieldValue('lastName', (e.target as HTMLInputElement).value)}
              />
              {form.errors().lastName && <span class="error">{form.errors().lastName}</span>}
            </div>

            <div class="form-group">
              <label>Email</label>
              <input
                type="email"
                value={form.values().email}
                oninput={(e) => form.setFieldValue('email', (e.target as HTMLInputElement).value)}
              />
              {form.errors().email && <span class="error">{form.errors().email}</span>}
            </div>
          </div>
        )}

        {currentStep() === 2 && (
          <div class="step">
            <h2>Shipping Address</h2>

            <div class="form-group">
              <label>Address</label>
              <input
                value={form.values().address}
                oninput={(e) => form.setFieldValue('address', (e.target as HTMLInputElement).value)}
              />
              {form.errors().address && <span class="error">{form.errors().address}</span>}
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>City</label>
                <input
                  value={form.values().city}
                  oninput={(e) => form.setFieldValue('city', (e.target as HTMLInputElement).value)}
                />
                {form.errors().city && <span class="error">{form.errors().city}</span>}
              </div>

              <div class="form-group">
                <label>ZIP Code</label>
                <input
                  value={form.values().zipCode}
                  oninput={(e) => form.setFieldValue('zipCode', (e.target as HTMLInputElement).value)}
                />
                {form.errors().zipCode && <span class="error">{form.errors().zipCode}</span>}
              </div>
            </div>
          </div>
        )}

        {currentStep() === 3 && (
          <div class="step">
            <h2>Payment Information</h2>

            <div class="form-group">
              <label>Card Number</label>
              <input
                value={form.values().cardNumber}
                oninput={(e) => form.setFieldValue('cardNumber', (e.target as HTMLInputElement).value)}
                placeholder="1234 5678 9012 3456"
              />
              {form.errors().cardNumber && <span class="error">{form.errors().cardNumber}</span>}
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Expiry Date</label>
                <input
                  value={form.values().expiryDate}
                  oninput={(e) => form.setFieldValue('expiryDate', (e.target as HTMLInputElement).value)}
                  placeholder="MM/YY"
                />
                {form.errors().expiryDate && <span class="error">{form.errors().expiryDate}</span>}
              </div>

              <div class="form-group">
                <label>CVV</label>
                <input
                  value={form.values().cvv}
                  oninput={(e) => form.setFieldValue('cvv', (e.target as HTMLInputElement).value)}
                  placeholder="123"
                />
                {form.errors().cvv && <span class="error">{form.errors().cvv}</span>}
              </div>
            </div>
          </div>
        )}

        <div class="form-actions">
          {currentStep() > 1 && (
            <button type="button" onclick={prevStep}>
              Previous
            </button>
          )}

          {currentStep() < totalSteps ? (
            <button type="button" onclick={nextStep}>
              Next
            </button>
          ) : (
            <button type="submit" disabled={form.isSubmitting()}>
              {form.isSubmitting() ? 'Processing...' : 'Complete Order'}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
```

## File Upload Form

Handle file uploads with preview.

```typescript
import { signal } from '@nadi/core'

function FileUploadForm() {
  const selectedFile = signal<File | null>(null)
  const preview = signal<string>('')
  const uploading = signal(false)
  const progress = signal(0)

  const handleFileSelect = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return

    selectedFile.set(file)

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        preview.set(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpload = async (e: Event) => {
    e.preventDefault()

    const file = selectedFile()
    if (!file) return

    uploading.set(true)
    progress.set(0)

    const formData = new FormData()
    formData.append('file', file)

    try {
      await uploadFile(formData, (progressPercent) => {
        progress.set(progressPercent)
      })

      alert('File uploaded successfully!')
      selectedFile.set(null)
      preview.set('')
    } catch (error) {
      alert('Upload failed: ' + error.message)
    } finally {
      uploading.set(false)
      progress.set(0)
    }
  }

  return (
    <form onsubmit={handleUpload} class="file-upload-form">
      <h2>Upload File</h2>

      <div class="file-input">
        <input
          type="file"
          onchange={handleFileSelect}
          accept="image/*,.pdf,.doc,.docx"
        />
      </div>

      {selectedFile() && (
        <div class="file-info">
          <p>Selected: {selectedFile()!.name}</p>
          <p>Size: {(selectedFile()!.size / 1024).toFixed(2)} KB</p>

          {preview() && (
            <div class="preview">
              <img src={preview()} alt="Preview" />
            </div>
          )}
        </div>
      )}

      {uploading() && (
        <div class="progress-bar">
          <div class="progress" style={`width: ${progress()}%`}></div>
          <span>{progress()}%</span>
        </div>
      )}

      <button type="submit" disabled={!selectedFile() || uploading()}>
        {uploading() ? 'Uploading...' : 'Upload'}
      </button>
    </form>
  )
}
```

## Key Concepts

- **Validation**: Client-side validation with clear error messages
- **Async Validation**: Check username availability, validate emails
- **Dynamic Fields**: Add/remove form fields on the fly
- **Multi-Step**: Break long forms into manageable steps
- **File Upload**: Handle file selection, preview, and upload
- **Form State**: Track touched, dirty, valid, and submitting states

## Next Steps

- Learn about [Forms](/guide/forms)
- Explore [Validation Rules](/api/forms#validation)
- Build a [Contact Form](/examples/contact)
- Read [Form Best Practices](/guide/forms#best-practices)
