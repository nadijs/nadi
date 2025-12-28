import { renderToStaticMarkup, renderToString } from '@nadi/core';
import { compile } from '@nadi/compiler';
import { build as viteBuild, type ViteDevServer } from 'vite';
import fs from 'fs/promises';
import path from 'path';
import glob from 'glob';

export interface PrerenderConfig {
  /**
   * Routes to prerender
   * Can be an array of paths or async function that returns paths
   */
  routes: string[] | (() => Promise<string[]> | string[]);

  /**
   * Routes to exclude from prerendering
   */
  exclude?: string[];

  /**
   * Output directory for static files
   */
  staticDir?: string;

  /**
   * Hydration strategy
   * - 'all': Hydrate all components
   * - 'islands': Only hydrate components marked with data-interactive
   * - 'none': No hydration (fully static)
   */
  hydration?: 'all' | 'islands' | 'none';

  /**
   * Selectors for components to hydrate (islands mode)
   */
  hydrateSelectors?: string[];

  /**
   * Fallback behavior for non-prerendered routes
   * - 'client': Render on client
   * - '404': Show 404 page
   * - 'redirect': Redirect to specified route
   */
  fallback?: 'client' | '404' | { redirect: string };
}

export interface PrerenderResult {
  route: string;
  html: string;
  meta: {
    title?: string;
    description?: string;
    links: string[];
    scripts: string[];
  };
  interactive: string[];
}

/**
 * Vite plugin for static pre-rendering
 */
export function prerender(config: PrerenderConfig) {
  return {
    name: 'nadi-prerender',

    async closeBundle() {
      const routes = typeof config.routes === 'function' ? await config.routes() : config.routes;

      const excludePatterns = config.exclude || [];
      const filteredRoutes = routes.filter(
        (route) =>
          !excludePatterns.some((pattern) => {
            if (pattern.includes('*')) {
              const regex = new RegExp(pattern.replace('*', '.*'));
              return regex.test(route);
            }
            return route === pattern;
          })
      );

      console.log(`Prerendering ${filteredRoutes.length} routes...`);

      const results: PrerenderResult[] = [];

      for (const route of filteredRoutes) {
        try {
          const result = await prerenderRoute(route, config);
          results.push(result);

          // Write HTML file
          const outputPath = path.join(
            config.staticDir || 'dist',
            route === '/' ? 'index.html' : `${route}/index.html`
          );

          await fs.mkdir(path.dirname(outputPath), { recursive: true });
          await fs.writeFile(outputPath, result.html, 'utf-8');

          console.log(`✓ Prerendered: ${route}`);
        } catch (error) {
          console.error(`✗ Failed to prerender ${route}:`, error);
        }
      }

      // Generate hydration manifest
      if (config.hydration === 'islands') {
        await generateHydrationManifest(results, config.staticDir || 'dist');
      }

      console.log(`Done! Generated ${results.length} static pages.`);
    },
  };
}

/**
 * Prerender a single route
 */
export async function prerenderRoute(
  route: string,
  config: PrerenderConfig
): Promise<PrerenderResult> {
  // Load component for this route
  const component = await loadComponentForRoute(route);

  // Render to static HTML
  const isFullyStatic = config.hydration === 'none';
  const html = isFullyStatic ? renderToStaticMarkup(component) : renderToString(component);

  // Extract meta tags (would integrate with @nadi/meta)
  const meta = {
    title: extractTitle(html),
    description: extractMeta(html, 'description'),
    links: extractLinks(html),
    scripts: extractScripts(html),
  };

  // Find interactive components
  const interactive =
    config.hydration === 'islands'
      ? findInteractiveComponents(html, config.hydrateSelectors || [])
      : [];

  // Build final HTML
  const finalHtml = buildHtmlDocument(html, meta, interactive, config);

  return {
    route,
    html: finalHtml,
    meta,
    interactive,
  };
}

/**
 * Load component for a given route
 */
async function loadComponentForRoute(route: string): Promise<any> {
  // This would integrate with router to load the correct component
  // For now, return a placeholder
  return () => `<div>Content for ${route}</div>`;
}

/**
 * Find interactive components in HTML
 */
function findInteractiveComponents(html: string, selectors: string[]): string[] {
  const interactive: string[] = [];

  // Default selector
  if (html.includes('data-interactive')) {
    interactive.push('data-interactive');
  }

  // Custom selectors
  for (const selector of selectors) {
    if (html.includes(selector)) {
      interactive.push(selector);
    }
  }

  return interactive;
}

/**
 * Build complete HTML document
 */
function buildHtmlDocument(
  content: string,
  meta: any,
  interactive: string[],
  config: PrerenderConfig
): string {
  const hydrationScript =
    config.hydration !== 'none' ? generateHydrationScript(interactive, config) : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${meta.title ? `<title>${meta.title}</title>` : ''}
  ${meta.description ? `<meta name="description" content="${meta.description}">` : ''}
  ${meta.links.join('\n  ')}
</head>
<body>
  <div id="app">${content}</div>
  ${hydrationScript}
  ${meta.scripts.join('\n  ')}
</body>
</html>`;
}

/**
 * Generate hydration script
 */
function generateHydrationScript(interactive: string[], config: PrerenderConfig): string {
  if (config.hydration === 'none') {
    return '';
  }

  if (config.hydration === 'islands') {
    return `<script type="module">
import { hydrate } from '/@nadi/core';

// Load hydration manifest
const manifest = await fetch('/_hydration-manifest.json').then(r => r.json());
const route = window.location.pathname;
const config = manifest[route];

if (config) {
  // Load only necessary chunks
  for (const chunk of config.chunks) {
    await import('/' + chunk);
  }

  // Hydrate only interactive components
  for (const selector of config.interactive) {
    const elements = document.querySelectorAll('[data-component="' + selector + '"]');
    elements.forEach(el => hydrate(el));
  }
}
</script>`;
  }

  // Full hydration
  return `<script type="module">
import { hydrate } from '/@nadi/core';
hydrate(document.getElementById('app'));
</script>`;
}

/**
 * Generate hydration manifest
 */
async function generateHydrationManifest(results: PrerenderResult[], outputDir: string) {
  const manifest: Record<string, any> = {};

  for (const result of results) {
    manifest[result.route] = {
      interactive: result.interactive,
      chunks: result.meta.scripts
        .map((s) => {
          const match = s.match(/src="([^"]+)"/);
          return match ? match[1] : '';
        })
        .filter(Boolean),
    };
  }

  await fs.writeFile(
    path.join(outputDir, '_hydration-manifest.json'),
    JSON.stringify(manifest, null, 2),
    'utf-8'
  );
}

/**
 * Analyze components to detect which are interactive
 */
export async function analyzeComponents(
  pattern: string,
  options?: {
    detectInteractive?: boolean;
    extractDependencies?: boolean;
  }
): Promise<{
  static: string[];
  interactive: string[];
  dependencies: Record<string, string[]>;
}> {
  const files = glob.sync(pattern);

  const static_: string[] = [];
  const interactive: string[] = [];
  const dependencies: Record<string, string[]> = {};

  for (const file of files) {
    const content = await fs.readFile(file, 'utf-8');
    const componentName = path.basename(file, path.extname(file));

    // Simple heuristic: if file contains signal/computed/effect, it's interactive
    const isInteractive =
      content.includes('signal(') || content.includes('computed(') || content.includes('effect(');

    if (isInteractive) {
      interactive.push(componentName);
    } else {
      static_.push(componentName);
    }

    // Extract dependencies (simplified)
    if (options?.extractDependencies) {
      const imports = content.match(/import .* from ['"]([^'"]+)['"]/g) || [];
      dependencies[componentName] = imports.map((imp) => {
        const match = imp.match(/from ['"]([^'"]+)['"]/);
        return match ? match[1] : '';
      });
    }
  }

  return { static: static_, interactive, dependencies };
}

// Helper functions for HTML parsing
function extractTitle(html: string): string | undefined {
  const match = html.match(/<title>([^<]+)<\/title>/);
  return match ? match[1] : undefined;
}

function extractMeta(html: string, name: string): string | undefined {
  const regex = new RegExp(`<meta name="${name}" content="([^"]+)">`);
  const match = html.match(regex);
  return match ? match[1] : undefined;
}

function extractLinks(html: string): string[] {
  const regex = /<link[^>]+>/g;
  return html.match(regex) || [];
}

function extractScripts(html: string): string[] {
  const regex = /<script[^>]*src="[^"]+"[^>]*><\/script>/g;
  return html.match(regex) || [];
}

export type { ViteDevServer };
