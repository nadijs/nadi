/** @jsxImportSource @nadi/core */
/**
 * @file Toast.ts
 * @description Toast notification system with automatic stacking and dismissal
 * 
 * @example
 * ```tsx
 * import { showToast, ToastContainer } from '@nadi/ui';
 * 
 * // In your app root
 * function App() {
 *   return (
 *     <>
 *       <ToastContainer position="top-right" />
 *       <YourApp />
 *     </>
 *   );
 * }
 * 
 * // Anywhere in your app
 * showToast({
 *   title: 'Success!',
 *   message: 'Your changes have been saved.',
 *   variant: 'success',
 *   duration: 3000,
 * });
 * 
 * // Or simple version
 * showToast({ message: 'Hello!' });
 * ```
 */

import { signal, For, type JSX } from '@nadi/core';

export interface ToastOptions {
  /**
   * Toast variant/type
   * @default 'info'
   */
  variant?: 'success' | 'error' | 'warning' | 'info';
  
  /**
   * Toast title (optional)
   */
  title?: string;
  
  /**
   * Toast message (required)
   */
  message: string;
  
  /**
   * Auto-dismiss duration in ms (0 for persistent)
   * @default 5000
   */
  duration?: number;
  
  /**
   * Show close button
   * @default true
   */
  closable?: boolean;
}

interface Toast extends ToastOptions {
  id: string;
  closing: boolean;
}

export type ToastPosition = 
  | 'top-left' 
  | 'top-center' 
  | 'top-right' 
  | 'bottom-left' 
  | 'bottom-center' 
  | 'bottom-right';

// Global toast state
const [toasts, setToasts] = signal<Toast[]>([]);
let toastIdCounter = 0;

/**
 * Show a toast notification.
 * 
 * **Why this is amazing:**
 * - React: Need Context provider, useState, complex state management
 * - Vue: Need plugin registration, store, or provide/inject
 * - Nadi: Just import and call! Global signal handles everything
 * 
 * No context wrapping needed. Just drop <ToastContainer /> anywhere
 * and call showToast() from any component.
 */
export function showToast(options: ToastOptions): string {
  const id = `toast-${toastIdCounter++}`;
  const duration = options.duration ?? 5000;
  
  const toast: Toast = {
    id,
    variant: options.variant || 'info',
    title: options.title,
    message: options.message,
    duration,
    closable: options.closable !== false,
    closing: false,
  };
  
  setToasts([...toasts(), toast]);
  
  // Auto-dismiss after duration
  if (duration > 0) {
    setTimeout(() => {
      dismissToast(id);
    }, duration);
  }
  
  return id;
}

/**
 * Dismiss a specific toast by ID
 */
export function dismissToast(id: string): void {
  // Mark as closing for animation
  setToasts(toasts().map(t => 
    t.id === id ? { ...t, closing: true } : t
  ));
  
  // Remove after animation
  setTimeout(() => {
    setToasts(toasts().filter(t => t.id !== id));
  }, 200);
}

/**
 * Clear all toasts
 */
export function clearToasts(): void {
  setToasts([]);
}

/**
 * Toast Container Component
 * Place this once in your app root.
 */
export function ToastContainer(props: {
  position?: ToastPosition;
}): JSX.Element {
  const position = props.position || 'top-right';
  
  return (
    <div
      data-nadi-component="toast-container"
      data-nadi-toast-container
      data-position={position}
      role="region"
      aria-label="Notifications"
    >
      <For each={toasts()}>
        {(toast) => (
          <div
            data-nadi-component="toast"
            data-nadi-toast
            data-variant={toast.variant}
            data-closing={toast.closing}
            role="alert"
            aria-live="polite"
          >
            {/* Icon based on variant */}
            <div class="nadi-toast-icon">
              {toast.variant === 'success' && <SuccessIcon />}
              {toast.variant === 'error' && <ErrorIcon />}
              {toast.variant === 'warning' && <WarningIcon />}
              {toast.variant === 'info' && <InfoIcon />}
            </div>
            
            {/* Content */}
            <div class="nadi-toast-content">
              {toast.title && (
                <div class="nadi-toast-title">{toast.title}</div>
              )}
              <div class="nadi-toast-message">{toast.message}</div>
            </div>
            
            {/* Close button */}
            {toast.closable && (
              <button
                class="nadi-toast-close"
                onClick={() => dismissToast(toast.id)}
                aria-label="Close notification"
              >
                <CloseIcon />
              </button>
            )}
          </div>
        )}
      </For>
    </div>
  );
}

// Simple SVG icons (can be replaced with icon library)
function SuccessIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" style={{ color: 'var(--nadi-color-success)' }}>
      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" style={{ color: 'var(--nadi-color-error)' }}>
      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" style={{ color: 'var(--nadi-color-warning)' }}>
      <path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" style={{ color: 'var(--nadi-color-info)' }}>
      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor">
      <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
    </svg>
  );
}
