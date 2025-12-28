/**
 * Field implementation for @nadi/forms
 */

import { signal, computed } from '@nadi/core';
import type { Field, FieldConfig, ValidationRule } from './types';

export function createField<T>(config: FieldConfig<T>): Field<T> {
  const {
    initialValue,
    validationRules = [],
    validateOnChange = true,
    validateOnBlur = true,
  } = config;

  const [value, setValue] = signal<T>(initialValue);
  const [error, setError] = signal<string | null>(null);
  const [touched, setTouched] = signal(false);
  const [validating, setValidating] = signal(false);

  const dirty = computed(() => value() !== initialValue);

  const validate = async (allValues?: any): Promise<boolean> => {
    if (validationRules.length === 0) return true;

    setValidating(true);
    setError(null);

    try {
      for (const rule of validationRules) {
        const result = await rule.validator(value(), allValues);

        if (result === false) {
          setError(rule.message || 'Validation failed');
          setValidating(false);
          return false;
        }

        if (typeof result === 'string') {
          setError(result);
          setValidating(false);
          return false;
        }
      }

      setError(null);
      setValidating(false);
      return true;
    } catch (err) {
      setError('Validation error');
      setValidating(false);
      return false;
    }
  };

  const handleSetValue = (newValue: T | ((prev: T) => T)) => {
    setValue(newValue);
    if (validateOnChange && touched()) {
      validate();
    }
  };

  const handleSetTouched = (isTouched: boolean) => {
    setTouched(isTouched);
    if (isTouched && validateOnBlur) {
      validate();
    }
  };

  const reset = () => {
    setValue(initialValue);
    setError(null);
    setTouched(false);
  };

  return {
    value,
    setValue: handleSetValue,
    error,
    setError,
    touched,
    setTouched: handleSetTouched,
    dirty,
    validating,
    validate,
    reset,
  };
}
