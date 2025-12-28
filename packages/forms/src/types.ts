/**
 * Type definitions for @nadi/forms
 */

export type Validator<T = any> = (value: T, allValues?: any) => boolean | string;

export type AsyncValidator<T = any> = (value: T, allValues?: any) => Promise<boolean | string>;

export interface ValidationRule<T = any> {
  validator: Validator<T> | AsyncValidator<T>;
  message?: string;
}

export type ValidationRules<T> = {
  [K in keyof T]?: ValidationRule<T[K]>[];
};

export interface FieldConfig<T = any> {
  initialValue: T;
  validationRules?: ValidationRule<T>[];
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

export interface Field<T = any> {
  value: () => T;
  setValue: (value: T | ((prev: T) => T)) => void;
  error: () => string | null;
  setError: (error: string | null) => void;
  touched: () => boolean;
  setTouched: (touched: boolean) => void;
  dirty: () => boolean;
  validating: () => boolean;
  validate: () => Promise<boolean>;
  reset: () => void;
}

export type Fields<T> = {
  [K in keyof T]: Field<T[K]>;
};

export interface FormConfig<T> {
  initialValues: T;
  validationRules?: ValidationRules<T>;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  onSubmit?: (values: T) => Promise<any> | any;
}

export interface Form<T> {
  fields: Fields<T>;
  values: () => T;
  errors: () => Partial<Record<keyof T, string>>;
  isValid: () => boolean;
  isSubmitting: () => boolean;
  isDirty: () => boolean;
  handleSubmit: (e?: Event) => Promise<void>;
  reset: () => void;
  setFieldValue: <K extends keyof T>(field: K, value: T[K]) => void;
  setFieldError: <K extends keyof T>(field: K, error: string | null) => void;
  setErrors: (errors: Partial<Record<keyof T, string>>) => void;
  validateField: <K extends keyof T>(field: K) => Promise<boolean>;
  validateForm: () => Promise<boolean>;
}
