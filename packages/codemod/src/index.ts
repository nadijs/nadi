import fs from 'fs/promises';
import path from 'path';
import { parse as parseVue } from 'vue-template-compiler';
import { parse as babelParse } from '@babel/parser';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import * as t from '@babel/types';

export interface MigrateOptions {
  from: 'vue' | 'react' | 'svelte';
  to: 'nadi';
  typescript?: boolean;
  dryRun?: boolean;
  force?: boolean;
  keepOriginal?: boolean;
}

export interface MigrateResult {
  outputPath: string;
  preview?: string;
}

export async function migrate(filePath: string, options: MigrateOptions): Promise<MigrateResult> {
  const content = await fs.readFile(filePath, 'utf-8');

  let nadiCode: string;

  switch (options.from) {
    case 'vue':
      nadiCode = await convertVueToNadi(content, options);
      break;
    case 'react':
      nadiCode = await convertReactToNadi(content, options);
      break;
    case 'svelte':
      nadiCode = await convertSvelteToNadi(content, options);
      break;
    default:
      throw new Error(`Unknown source framework: ${options.from}`);
  }

  const outputPath = filePath.replace(/\.(vue|jsx|tsx|svelte)$/, '.nadi');

  if (options.dryRun) {
    return { outputPath, preview: nadiCode };
  }

  // Check if output file exists
  const exists = await fs
    .access(outputPath)
    .then(() => true)
    .catch(() => false);
  if (exists && !options.force) {
    throw new Error(`Output file already exists: ${outputPath}. Use --force to overwrite.`);
  }

  // Write converted file
  await fs.writeFile(outputPath, nadiCode, 'utf-8');

  // Remove original if requested
  if (!options.keepOriginal) {
    await fs.unlink(filePath);
  }

  return { outputPath };
}

async function convertVueToNadi(content: string, options: MigrateOptions): Promise<string> {
  const parsed = parseVue(content);

  // Extract sections
  const scriptContent = parsed.script?.content || '';
  const templateContent = parsed.template?.content || '';
  const styleContent = parsed.styles?.[0]?.content || '';
  const isScoped = parsed.styles?.[0]?.scoped || false;

  // Convert script (setup syntax)
  const convertedScript = convertVueScript(scriptContent, options.typescript);

  // Convert template to JSX
  const convertedTemplate = convertVueTemplate(templateContent);

  // Build .nadi file
  return `<script${options.typescript ? ' lang="ts"' : ''}>
${convertedScript}
</script>

<template>
${convertedTemplate}
</template>

${
  styleContent
    ? `<style${isScoped ? ' scoped' : ''}>
${styleContent}
</style>`
    : ''
}`.trim();
}

function convertVueScript(script: string, typescript?: boolean): string {
  if (!script.trim()) {
    return `export default function Component() {\n  return {};\n}`;
  }

  // Parse with Babel
  const ast = babelParse(script, {
    sourceType: 'module',
    plugins: ['typescript', 'jsx'],
  });

  const imports: string[] = [];
  const body: string[] = [];

  traverse(ast, {
    ImportDeclaration(path) {
      const source = path.node.source.value;

      // Convert Vue imports to Nadi
      if (source === 'vue') {
        const specifiers = path.node.specifiers
          .map((s) => {
            if (t.isImportSpecifier(s) && t.isIdentifier(s.imported)) {
              const name = s.imported.name;
              // Convert ref → signal, watch → effect
              if (name === 'ref') return 'signal';
              if (name === 'watch' || name === 'watchEffect') return 'effect';
              if (name === 'onMounted') return 'onMount';
              if (name === 'onUnmounted') return 'onCleanup';
              return name;
            }
            return null;
          })
          .filter(Boolean);

        imports.push(`import { ${specifiers.join(', ')} } from '@nadi/core';`);
      } else {
        imports.push(generate(path.node).code);
      }

      path.remove();
    },

    VariableDeclaration(path) {
      const declaration = path.node.declarations[0];
      if (t.isIdentifier(declaration.id) && t.isCallExpression(declaration.init)) {
        const callee = declaration.init.callee;

        // Convert ref() to signal()
        if (t.isIdentifier(callee) && callee.name === 'ref') {
          const name = declaration.id.name;
          const arg = declaration.init.arguments[0];
          body.push(`  const [${name}, set${capitalize(name)}] = signal(${generate(arg).code});`);
          path.remove();
          return;
        }
      }

      body.push(`  ${generate(path.node).code}`);
      path.remove();
    },
  });

  return `${imports.join('\n')}

export default function Component() {
${body.join('\n')}

  return {};
}`;
}

function convertVueTemplate(template: string): string {
  // Simple conversion (production would need a proper parser)
  return template
    .replace(/@click/g, 'onClick')
    .replace(/@input/g, 'onInput')
    .replace(/v-if="([^"]+)"/g, (_, cond) => `{${cond} && (`)
    .replace(/<\/(\w+)>(?=[^<]*<Show)/g, '</Show>)}')
    .replace(/\{\{([^}]+)\}\}/g, (_, expr) => `{${expr.trim()}()}`)
    .replace(/v-for="([^"]+) in ([^"]+)"/g, (_, item, list) => `{${list}().map(${item} => (`)
    .replace(/:key="([^"]+)"/g, 'key={$1}');
}

async function convertReactToNadi(content: string, options: MigrateOptions): Promise<string> {
  const ast = babelParse(content, {
    sourceType: 'module',
    plugins: ['typescript', 'jsx'],
  });

  const imports: string[] = [];
  const componentBody: string[] = [];

  traverse(ast, {
    ImportDeclaration(path) {
      const source = path.node.source.value;

      if (source === 'react') {
        const specifiers = path.node.specifiers
          .map((s) => {
            if (t.isImportSpecifier(s) && t.isIdentifier(s.imported)) {
              const name = s.imported.name;
              if (name === 'useState') return 'signal';
              if (name === 'useMemo') return 'computed';
              if (name === 'useEffect') return 'effect';
              if (['useCallback', 'memo'].includes(name)) return null; // Remove
              return name;
            }
            return null;
          })
          .filter(Boolean);

        if (specifiers.length > 0) {
          imports.push(`import { ${specifiers.join(', ')} } from '@nadi/core';`);
        }
      } else {
        imports.push(generate(path.node).code);
      }

      path.remove();
    },

    FunctionDeclaration(path) {
      if (t.isIdentifier(path.node.id)) {
        const functionBody = path.node.body.body
          .map((stmt) => convertReactStatement(stmt))
          .filter(Boolean)
          .join('\n  ');

        componentBody.push(`export default function ${path.node.id.name}(props) {
  ${functionBody}

  return {};
}`);
      }
    },
  });

  return `<script${options.typescript ? ' lang="ts"' : ''}>
${imports.join('\n')}

${componentBody.join('\n')}
</script>

<template>
  {/* Add JSX here */}
</template>`;
}

function convertReactStatement(stmt: t.Statement): string {
  if (t.isVariableDeclaration(stmt)) {
    const decl = stmt.declarations[0];
    if (t.isIdentifier(decl.id) && t.isCallExpression(decl.init)) {
      const callee = decl.init.callee;

      // useState → signal
      if (t.isIdentifier(callee) && callee.name === 'useState') {
        const name = decl.id.name;
        const arg = decl.init.arguments[0];
        return `const [${name}, set${capitalize(name)}] = signal(${generate(arg).code});`;
      }
    }
  }

  return generate(stmt).code;
}

async function convertSvelteToNadi(content: string, options: MigrateOptions): Promise<string> {
  // Parse Svelte component (simplified)
  const scriptMatch = content.match(/<script>([\s\S]*?)<\/script>/);
  const templateMatch = content.match(/<script>[\s\S]*?<\/script>([\s\S]*?)(<style|$)/);
  const styleMatch = content.match(/<style>([\s\S]*?)<\/style>/);

  const script = scriptMatch?.[1] || '';
  const template = templateMatch?.[1] || '';
  const style = styleMatch?.[1] || '';

  // Convert reactive statements
  const convertedScript = script
    .replace(/let\s+(\w+)\s*=\s*([^;]+);/g, 'const [$1, set$1] = signal($2);')
    .replace(/\$:\s*(\w+)\s*=\s*([^;]+);/g, 'const $1 = computed(() => $2);')
    .replace(/\$:\s*{([^}]+)}/g, 'effect(() => {$1});');

  // Convert template
  const convertedTemplate = template
    .replace(/{#if\s+([^}]+)}([\s\S]*?){\/if}/g, '<Show when={() => $1}>$2</Show>')
    .replace(/{#each\s+(\w+)\s+as\s+(\w+)}([\s\S]*?){\/each}/g, '{$1().map($2 => ($3))}')
    .replace(/on:(\w+)={([^}]+)}/g, 'on$1={$2}');

  return `<script${options.typescript ? ' lang="ts"' : ''}>
import { signal, computed, effect } from '@nadi/core';

export default function Component() {
${convertedScript}

  return {};
}
</script>

<template>
${convertedTemplate}
</template>

${
  style
    ? `<style scoped>
${style}
</style>`
    : ''
}`.trim();
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
