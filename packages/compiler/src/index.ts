/**
 * Nadi Compiler
 *
 * Compiles .nadi single-file components to vanilla JavaScript
 */

export { compile, compileTemplate, compileScript, compileStyle } from './compiler';
export type { CompileOptions, CompileResult, SFCDescriptor } from './types';
export { parse } from './parser';
export { transform } from './transform';
