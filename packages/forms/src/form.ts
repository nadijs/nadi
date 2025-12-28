/**
 * Form implementation for @nadi/forms
 */

import { signal, computed, batch } from '@nadi.js/core';
import { createField } from './field';
import type { Form, FormConfig, Fields } from './types';

export function createForm<T extends Record<string, any>>(config: FormConfig<T>): Form<T> {
  const {
    initialValues,
    validationRules = {},
    validateOnChange = true,
    validateOnBlur = true,
    onSubmit,
  } = config;

  // Create fields
  const fields = Object.keys(initialValues).reduce((acc, key) => {
    const fieldKey = key as keyof T;
    acc[fieldKey] = createField({
      initialValue: initialValues[fieldKey],
      validationRules: validationRules[fieldKey],
      validateOnChange,
      validateOnBlur,
    });
    return acc;
  }, {} as Fields<T>);

  const [isSubmitting, setIsSubmitting] = signal(false);

  // Computed values
  const values = computed(() => {
    return Object.keys(fields).reduce((acc, key) => {
      const fieldKey = key as keyof T;
      acc[fieldKey] = fields[fieldKey].value();
      return acc;
    }, {} as T);
  });

  const errors = computed(() => {
    return Object.keys(fields).reduce(
      (acc, key) => {
        const fieldKey = key as keyof T;
        const err = fields[fieldKey].error();
        if (err) {
          acc[fieldKey] = err;
        }
        return acc;
      },
      {} as Partial<Record<keyof T, string>>
    );
  });

  const isValid = computed(() => {
    return Object.values(fields).every((field) => !field.error() && !field.validating());
  });

  const isDirty = computed(() => {
    return Object.values(fields).some((field) => field.dirty());
  });

  // Methods
  const validateField = async <K extends keyof T>(field: K): Promise<boolean> => {
    const allValues = values();
    return await fields[field].validate(allValues);
  };

  const validateForm = async (): Promise<boolean> => {
    const allValues = values();
    const results = await Promise.all(
      Object.values(fields).map((field) => field.validate(allValues))
    );
    return results.every((result) => result === true);
  };

  const setFieldValue = <K extends keyof T>(field: K, value: T[K]) => {
    fields[field].setValue(value);
  };

  const setFieldError = <K extends keyof T>(field: K, error: string | null) => {
    fields[field].setError(error);
  };

  const setErrors = (errs: Partial<Record<keyof T, string>>) => {
    batch(() => {
      Object.entries(errs).forEach(([key, error]) => {
        const fieldKey = key as keyof T;
        if (fields[fieldKey]) {
          fields[fieldKey].setError(error as string);
        }
      });
    });
  };

  const reset = () => {
    batch(() => {
      Object.values(fields).forEach((field) => field.reset());
    });
  };

  const handleSubmit = async (e?: Event) => {
    if (e) {
      e.preventDefault();
    }

    // Mark all fields as touched
    batch(() => {
      Object.values(fields).forEach((field) => field.setTouched(true));
    });

    // Validate all fields
    const valid = await validateForm();

    if (!valid) {
      return;
    }

    if (!onSubmit) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(values());
    } catch (error: any) {
      // Handle backend validation errors
      if (error?.response?.data?.errors) {
        // Laravel format
        setErrors(error.response.data.errors);
      } else if (error?.response?.data) {
        // Django format or other
        const backendErrors = Object.entries(error.response.data).reduce(
          (acc, [key, messages]) => {
            acc[key as keyof T] = Array.isArray(messages)
              ? (messages as string[])[0]
              : (messages as string);
            return acc;
          },
          {} as Partial<Record<keyof T, string>>
        );
        setErrors(backendErrors);
      }
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    fields,
    values,
    errors,
    isValid,
    isSubmitting,
    isDirty,
    handleSubmit,
    reset,
    setFieldValue,
    setFieldError,
    setErrors,
    validateField,
    validateForm,
  };
}
