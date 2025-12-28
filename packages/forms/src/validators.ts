/**
 * Built-in validators for @nadi/forms
 */

import type { ValidationRule } from './types';

export function required<T>(message = 'This field is required'): ValidationRule<T> {
  return {
    validator: (value: T) => {
      if (value === null || value === undefined) return false;
      if (typeof value === 'string' && value.trim() === '') return false;
      if (Array.isArray(value) && value.length === 0) return false;
      return true;
    },
    message,
  };
}

export function email(message = 'Invalid email address'): ValidationRule<string> {
  return {
    validator: (value: string) => {
      if (!value) return true; // Use required() for required validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    },
    message,
  };
}

export function minLength(length: number, message?: string): ValidationRule<string> {
  return {
    validator: (value: string) => {
      if (!value) return true;
      return value.length >= length;
    },
    message: message || `Must be at least ${length} characters`,
  };
}

export function maxLength(length: number, message?: string): ValidationRule<string> {
  return {
    validator: (value: string) => {
      if (!value) return true;
      return value.length <= length;
    },
    message: message || `Must be at most ${length} characters`,
  };
}

export function min(minValue: number, message?: string): ValidationRule<number> {
  return {
    validator: (value: number) => {
      if (value === null || value === undefined) return true;
      return value >= minValue;
    },
    message: message || `Must be at least ${minValue}`,
  };
}

export function max(maxValue: number, message?: string): ValidationRule<number> {
  return {
    validator: (value: number) => {
      if (value === null || value === undefined) return true;
      return value <= maxValue;
    },
    message: message || `Must be at most ${maxValue}`,
  };
}

export function pattern(regex: RegExp, message = 'Invalid format'): ValidationRule<string> {
  return {
    validator: (value: string) => {
      if (!value) return true;
      return regex.test(value);
    },
    message,
  };
}

export function url(message = 'Invalid URL'): ValidationRule<string> {
  return {
    validator: (value: string) => {
      if (!value) return true;
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    },
    message,
  };
}

export function custom<T>(
  validator: (value: T, allValues?: any) => boolean,
  message = 'Validation failed'
): ValidationRule<T> {
  return {
    validator,
    message,
  };
}

export function asyncValidator<T>(
  validator: (value: T, allValues?: any) => Promise<boolean>,
  message = 'Validation failed',
  options: { debounce?: number } = {}
): ValidationRule<T> {
  const { debounce = 0 } = options;
  let timeoutId: NodeJS.Timeout | null = null;

  return {
    validator: async (value: T, allValues?: any) => {
      if (debounce > 0) {
        return new Promise((resolve) => {
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
          timeoutId = setTimeout(async () => {
            const result = await validator(value, allValues);
            resolve(result);
          }, debounce);
        });
      }
      return validator(value, allValues);
    },
    message,
  };
}

export function oneOf<T>(validValues: T[], message?: string): ValidationRule<T> {
  return {
    validator: (value: T) => {
      if (!value) return true;
      return validValues.includes(value);
    },
    message: message || `Must be one of: ${validValues.join(', ')}`,
  };
}

export function matches<T>(fieldName: string, message?: string): ValidationRule<T> {
  return {
    validator: (value: T, allValues?: any) => {
      if (!value || !allValues) return true;
      return value === allValues[fieldName];
    },
    message: message || `Must match ${fieldName}`,
  };
}
