/**
 * @file ThemeProvider.ts
 * @description Provides theme management for Nadi UI components with signal-based reactivity
 *
 * @example
 * ```ts
 * import { ThemeProvider } from '@nadi/ui/theme';
 *
 * // In your app root
 * const { theme, setTheme, toggleTheme } = ThemeProvider();
 *
 * // Theme is reactive - components auto-update when changed
 * console.log(theme()); // 'light' or 'dark'
 * setTheme('dark');
 * toggleTheme();
 * ```
 */

import { signal, effect, onCleanup } from '@nadi/core';

export type Theme = 'light' | 'dark' | 'system';

export interface ThemeConfig {
  /**
   * Initial theme mode. Defaults to 'system' which respects user's OS preference.
   */
  defaultTheme?: Theme;

  /**
   * Storage key for persisting theme preference. Set to null to disable persistence.
   * @default 'nadi-ui-theme'
   */
  storageKey?: string | null;

  /**
   * Custom CSS variables to inject into the root element.
   */
  customVariables?: Record<string, string>;
}

/**
 * Reactive theme provider that manages light/dark mode with automatic persistence
 * and system preference detection.
 *
 * **Why this is better than React/Vue:**
 * - No context provider wrapping needed
 * - Theme changes instantly update all components via signals
 * - Zero re-renders, only affected CSS updates
 * - Works in SSR with proper hydration
 */
export function ThemeProvider(config: ThemeConfig = {}) {
  const { defaultTheme = 'system', storageKey = 'nadi-ui-theme', customVariables = {} } = config;

  // Load saved theme or use default
  const getInitialTheme = (): Theme => {
    if (typeof window === 'undefined') return defaultTheme;

    if (storageKey) {
      const saved = localStorage.getItem(storageKey);
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        return saved;
      }
    }

    return defaultTheme;
  };

  // Create reactive theme signal
  const [theme, setThemeSignal] = signal<Theme>(getInitialTheme());

  // Resolve actual theme (handles 'system' preference)
  const getResolvedTheme = (): 'light' | 'dark' => {
    if (typeof window === 'undefined') return 'light';

    const currentTheme = theme();
    if (currentTheme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return currentTheme;
  };

  // Apply theme to DOM
  const applyTheme = (resolvedTheme: 'light' | 'dark') => {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;
    root.setAttribute('data-nadi-theme', resolvedTheme);

    // Apply custom CSS variables if provided
    Object.entries(customVariables).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  };

  // Public API to set theme with persistence
  const setTheme = (newTheme: Theme) => {
    setThemeSignal(newTheme);

    if (typeof window !== 'undefined' && storageKey) {
      localStorage.setItem(storageKey, newTheme);
    }
  };

  // Toggle between light and dark
  const toggleTheme = () => {
    const resolved = getResolvedTheme();
    setTheme(resolved === 'light' ? 'dark' : 'light');
  };

  // Effect: Apply theme whenever it changes
  effect(() => {
    const resolved = getResolvedTheme();
    applyTheme(resolved);
  });

  // Listen for system theme changes when theme is 'system'
  if (typeof window !== 'undefined') {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleSystemThemeChange = () => {
      if (theme() === 'system') {
        applyTheme(getResolvedTheme());
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);

    onCleanup(() => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    });
  }

  return {
    /**
     * Reactive theme signal. Read current theme or use in computed values.
     */
    theme,

    /**
     * Set theme mode. Automatically persists to localStorage and updates DOM.
     */
    setTheme,

    /**
     * Toggle between light and dark modes.
     */
    toggleTheme,

    /**
     * Get the resolved theme (converts 'system' to 'light' or 'dark').
     */
    getResolvedTheme,
  };
}

/**
 * Hook to access current theme without creating a new provider.
 * Useful for components that need to read theme but not control it.
 *
 * @example
 * ```ts
 * import { useTheme } from '@nadi/ui/theme';
 *
 * const currentTheme = useTheme();
 * console.log(currentTheme()); // 'light' or 'dark' or 'system'
 * ```
 */
export function useTheme() {
  if (typeof window === 'undefined') {
    return signal<Theme>('light')[0];
  }

  const stored = localStorage.getItem('nadi-ui-theme') as Theme | null;
  const [theme] = signal<Theme>(stored || 'system');
  return theme;
}

/**
 * Get design system CSS variable value.
 * Useful for components that need to access theme tokens in JavaScript.
 *
 * @example
 * ```ts
 * import { getCSSVariable } from '@nadi/ui/theme';
 *
 * const primaryColor = getCSSVariable('--nadi-color-primary-500');
 * const spacing = getCSSVariable('--nadi-space-4');
 * ```
 */
export function getCSSVariable(varName: string): string {
  if (typeof window === 'undefined') return '';
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
}

/**
 * Set custom CSS variable dynamically.
 *
 * @example
 * ```ts
 * import { setCSSVariable } from '@nadi/ui/theme';
 *
 * setCSSVariable('--nadi-color-primary-500', '#ff0000');
 * ```
 */
export function setCSSVariable(varName: string, value: string): void {
  if (typeof window === 'undefined') return;
  document.documentElement.style.setProperty(varName, value);
}
