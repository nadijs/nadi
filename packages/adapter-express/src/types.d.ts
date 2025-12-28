declare module '@nadi.js/core' {
  export function renderToString(component: any, props?: Record<string, any>): string;
  export function renderToHtml(component: any, props?: Record<string, any>): string;
}

declare module '@nadi.js/compiler' {
  export interface CompileOptions {
    filename?: string;
    ssr?: boolean;
  }

  export interface CompileResult {
    code: string;
    map?: any;
  }

  export function compile(source: string, options?: CompileOptions): CompileResult;
}

declare module 'express' {
  export interface Request {
    [key: string]: any;
  }

  export interface Response {
    send(body: any): Response;
    [key: string]: any;
  }

  export interface NextFunction {
    (err?: any): void;
  }

  export type RequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void | Promise<void>;
}
