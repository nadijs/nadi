/**
 * Laravel adapter client-side utilities
 */

import { hydrate } from '@nadi/core';

export interface LaravelNadiConfig {
  csrfToken?: string;
  user?: any;
  env?: string;
}

/**
 * Initialize Nadi Laravel app
 */
export function createLaravelApp(App: any, config: LaravelNadiConfig = {}) {
  // Get component and props from server
  const appEl = document.getElementById('app');
  const component = appEl?.dataset.component;
  const propsJson = appEl?.dataset.props;

  if (!component || !propsJson) {
    console.error('Nadi: Missing component or props data');
    return;
  }

  const props = JSON.parse(propsJson);

  // Setup global config
  (window as any).__NADI_CONFIG__ = config;

  // Setup CSRF token for requests
  if (config.csrfToken) {
    setupCSRF(config.csrfToken);
  }

  // Hydrate or mount
  const isSSR = appEl?.innerHTML.trim() !== '';

  if (isSSR) {
    return hydrate(() => <App {...props} />, appEl);
  } else {
    return hydrate(() => <App {...props} />, appEl);
  }
}

/**
 * Setup CSRF token for all requests
 */
function setupCSRF(token: string) {
  // Add to fetch
  const originalFetch = window.fetch;
  window.fetch = function(input, init?) {
    init = init || {};
    init.headers = init.headers || {};

    if (typeof init.headers === 'object' && !Array.isArray(init.headers)) {
      (init.headers as Record<string, string>)['X-CSRF-TOKEN'] = token;
      (init.headers as Record<string, string>)['X-Requested-With'] = 'XMLHttpRequest';
    }

    return originalFetch(input, init);
  };
}

/**
 * Laravel route helper
 */
export function route(name: string, params: Record<string, any> = {}): string {
  // Simple implementation - in production, use Laravel's route() helper via Ziggy
  const routes = (window as any).__NADI_ROUTES__ || {};
  let url = routes[name] || `/${name}`;

  Object.entries(params).forEach(([key, value]) => {
    url = url.replace(`{${key}}`, value);
  });

  return url;
}

/**
 * Get CSRF token
 */
export function csrf(): string {
  return (window as any).__NADI_CONFIG__?.csrfToken || '';
}

/**
 * Get authenticated user
 */
export function user(): any {
  return (window as any).__NADI_CONFIG__?.user || null;
}
