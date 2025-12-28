/**
 * Express adapter for Nadi with SSR support
 */

import type { Request, Response, NextFunction, RequestHandler } from 'express';
import { renderToString, renderToHtml } from '@nadi/core';
import { compile } from '@nadi/compiler';
import fs from 'fs';
import path from 'path';

export interface NadiExpressOptions {
  componentsDir: string;
  dev?: boolean;
  ssr?: boolean;
  manifest?: string;
}

export interface NadiRequest extends Request {
  nadi?: {
    component: string;
    props: Record<string, any>;
  };
}

export function nadi(options: NadiExpressOptions): RequestHandler {
  const {
    componentsDir,
    dev = process.env.NODE_ENV !== 'production',
    ssr = true,
    manifest: manifestPath,
  } = options;

  // Load manifest in production
  let manifest: any = {};
  if (!dev && manifestPath) {
    try {
      manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    } catch (err) {
      console.error('Failed to load manifest:', err);
    }
  }

  return (req: Request, res: Response, next: NextFunction) => {
    // Add nadi render method to response
    (res as any).nadi = async (component: string, props: Record<string, any> = {}) => {
      try {
        if (ssr) {
          const html = await renderComponent(component, props, componentsDir, dev);
          const scripts = getScripts(manifest, dev);
          const styles = getStyles(manifest);

          res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Nadi App</title>
              ${styles}
            </head>
            <body>
              <div id="app" data-component="${component}" data-props='${JSON.stringify(props)}'>
                ${html}
              </div>
              ${scripts}
            </body>
            </html>
          `);
        } else {
          // Client-side only
          const scripts = getScripts(manifest, dev);
          const styles = getStyles(manifest);

          res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Nadi App</title>
              ${styles}
            </head>
            <body>
              <div id="app" data-component="${component}" data-props='${JSON.stringify(props)}'></div>
              ${scripts}
            </body>
            </html>
          `);
        }
      } catch (error: any) {
        console.error('Nadi render error:', error);
        res.status(500).send('Internal Server Error');
      }
    };

    next();
  };
}

async function renderComponent(
  component: string,
  props: Record<string, any>,
  componentsDir: string,
  dev: boolean
): Promise<string> {
  try {
    const componentPath = path.join(componentsDir, `${component}.nadi`);

    if (!fs.existsSync(componentPath)) {
      throw new Error(`Component ${component} not found`);
    }

    const source = fs.readFileSync(componentPath, 'utf-8');
    const compiled = compile(source, { filename: componentPath, ssr: true });

    // Execute compiled code and render
    // In production, components would be pre-compiled
    const Component = eval(compiled.code);
    return renderToString(() => <Component {...props} />);
  } catch (error) {
    console.error('Component render error:', error);
    return '';
  }
}

function getScripts(manifest: any, dev: boolean): string {
  if (dev) {
    return '<script type="module" src="/src/main.ts"></script>';
  }

  const scripts: string[] = [];
  for (const [file, data] of Object.entries(manifest)) {
    if ((data as any).isEntry) {
      scripts.push(`<script type="module" src="/build/${(data as any).file}"></script>`);
    }
  }

  return scripts.join('\n');
}

function getStyles(manifest: any): string {
  const styles: string[] = [];
  for (const [file, data] of Object.entries(manifest)) {
    if ((data as any).css) {
      for (const cssFile of (data as any).css) {
        styles.push(`<link rel="stylesheet" href="/build/${cssFile}">`);
      }
    }
  }

  return styles.join('\n');
}

export default nadi;
