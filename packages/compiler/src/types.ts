/**
 * Type definitions for the Nadi compiler
 */

export interface SFCDescriptor {
  filename: string;
  template: SFCBlock | null;
  script: SFCBlock | null;
  styles: SFCBlock[];
  customBlocks: SFCBlock[];
}

export interface SFCBlock {
  type: string;
  content: string;
  attrs: Record<string, string | true>;
  loc: {
    start: { line: number; column: number };
    end: { line: number; column: number };
  };
}

export interface CompileOptions {
  filename?: string;
  sourceMap?: boolean;
  scopeId?: string;
  mode?: 'module' | 'function';
  ssr?: boolean;
  isProduction?: boolean;
}

export interface CompileResult {
  code: string;
  map?: any;
  errors: CompileError[];
  warnings: CompileWarning[];
}

export interface CompileError {
  message: string;
  loc?: {
    start: { line: number; column: number };
    end: { line: number; column: number };
  };
}

export interface CompileWarning {
  message: string;
  loc?: {
    start: { line: number; column: number };
    end: { line: number; column: number };
  };
}

export interface TransformOptions {
  scopeId?: string | undefined;
  isProd?: boolean | undefined;
}
