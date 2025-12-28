#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import prompts from 'prompts';
import minimist from 'minimist';
import { red, green, cyan, yellow, bold, reset } from 'kolorist';

const argv = minimist(process.argv.slice(2), {
  string: ['_', 'template', 'package-manager'],
  boolean: ['typescript', 'javascript', 'git'],
  alias: { t: 'template', p: 'package-manager' },
});

const cwd = process.cwd();

const TEMPLATES = [
  {
    name: 'vanilla',
    display: 'Vanilla',
    color: cyan,
    variants: [
      { name: 'vanilla-ts', display: 'TypeScript', color: cyan },
      { name: 'vanilla', display: 'JavaScript', color: yellow },
    ],
  },
  {
    name: 'laravel',
    display: 'Laravel',
    color: red,
    variants: [
      { name: 'laravel-ts', display: 'TypeScript', color: cyan },
      { name: 'laravel', display: 'JavaScript', color: yellow },
    ],
  },
  {
    name: 'django',
    display: 'Django',
    color: green,
    variants: [
      { name: 'django-ts', display: 'TypeScript', color: cyan },
      { name: 'django', display: 'JavaScript', color: yellow },
    ],
  },
  {
    name: 'express',
    display: 'Express',
    color: yellow,
    variants: [
      { name: 'express-ts', display: 'TypeScript', color: cyan },
      { name: 'express', display: 'JavaScript', color: yellow },
    ],
  },
  {
    name: 'nextjs',
    display: 'Next.js',
    color: cyan,
    variants: [
      { name: 'nextjs-ts', display: 'TypeScript', color: cyan },
      { name: 'nextjs', display: 'JavaScript', color: yellow },
    ],
  },
  {
    name: 'nuxt',
    display: 'Nuxt',
    color: green,
    variants: [
      { name: 'nuxt-ts', display: 'TypeScript', color: cyan },
      { name: 'nuxt', display: 'JavaScript', color: yellow },
    ],
  },
];

const renameFiles: Record<string, string | undefined> = {
  _gitignore: '.gitignore',
};

async function init() {
  const argTargetDir = formatTargetDir(argv._[0]);
  const argTemplate = argv.template || argv.t;

  let targetDir = argTargetDir || 'nadi-project';

  const getProjectName = () => (targetDir === '.' ? path.basename(path.resolve()) : targetDir);

  let result: prompts.Answers<
    'projectName' | 'overwrite' | 'packageName' | 'framework' | 'variant' | 'packageManager' | 'git'
  >;

  prompts.override({
    overwrite: argv.overwrite,
  });

  try {
    result = await prompts(
      [
        {
          type: argTargetDir ? null : 'text',
          name: 'projectName',
          message: reset('Project name:'),
          initial: 'nadi-project',
          onState: (state) => {
            targetDir = formatTargetDir(state.value) || 'nadi-project';
          },
        },
        {
          type: () => (!fs.existsSync(targetDir) || isEmpty(targetDir) ? null : 'select'),
          name: 'overwrite',
          message: () =>
            (targetDir === '.' ? 'Current directory' : `Target directory "${targetDir}"`) +
            ` is not empty. Remove existing files and continue?`,
          choices: [
            {
              title: 'Yes',
              value: 'yes',
            },
            {
              title: 'No',
              value: 'no',
            },
          ],
        },
        {
          type: (_, { overwrite }: { overwrite?: string }) => {
            if (overwrite === 'no') {
              throw new Error(red('✖') + ' Operation cancelled');
            }
            return null;
          },
          name: 'overwriteChecker',
        },
        {
          type: () => (isValidPackageName(getProjectName()) ? null : 'text'),
          name: 'packageName',
          message: reset('Package name:'),
          initial: () => toValidPackageName(getProjectName()),
          validate: (dir) => isValidPackageName(dir) || 'Invalid package.json name',
        },
        {
          type: argTemplate && TEMPLATES.some((f) => f.name === argTemplate) ? null : 'select',
          name: 'framework',
          message:
            typeof argTemplate === 'string' && !TEMPLATES.some((f) => f.name === argTemplate)
              ? reset(`"${argTemplate}" isn't a valid template. Please choose from below: `)
              : reset('Select a template:'),
          initial: 0,
          choices: TEMPLATES.map((framework) => {
            const frameworkColor = framework.color;
            return {
              title: frameworkColor(framework.display || framework.name),
              value: framework,
            };
          }),
        },
        {
          type: (framework: any) => (framework && framework.variants ? 'select' : null),
          name: 'variant',
          message: reset('Select a variant:'),
          choices: (framework: any) =>
            framework.variants.map((variant: any) => {
              const variantColor = variant.color;
              return {
                title: variantColor(variant.display || variant.name),
                value: variant.name,
              };
            }),
        },
        {
          type: argv['package-manager'] ? null : 'select',
          name: 'packageManager',
          message: reset('Select a package manager:'),
          choices: [
            { title: 'npm', value: 'npm' },
            { title: 'pnpm', value: 'pnpm' },
            { title: 'yarn', value: 'yarn' },
          ],
        },
        {
          type: argv.git !== undefined ? null : 'confirm',
          name: 'git',
          message: reset('Initialize git repository?'),
          initial: true,
        },
      ],
      {
        onCancel: () => {
          throw new Error(red('✖') + ' Operation cancelled');
        },
      }
    );
  } catch (cancelled: any) {
    console.log(cancelled.message);
    return;
  }

  const { framework, overwrite, packageName, variant, packageManager, git } = result;

  const root = path.join(cwd, targetDir);

  if (overwrite === 'yes') {
    emptyDir(root);
  } else if (!fs.existsSync(root)) {
    fs.mkdirSync(root, { recursive: true });
  }

  const template: string = variant || framework?.name || argTemplate;
  const pkgManager = packageManager || argv['package-manager'] || 'npm';
  const useGit = git !== undefined ? git : argv.git;

  console.log(`\nScaffolding project in ${root}...`);

  const templateDir = path.resolve(
    fileURLToPath(import.meta.url),
    '../..',
    `templates/${template}`
  );

  const write = (file: string, content?: string) => {
    const targetPath = path.join(root, renameFiles[file] ?? file);
    if (content) {
      fs.writeFileSync(targetPath, content);
    } else {
      copy(path.join(templateDir, file), targetPath);
    }
  };

  const files = fs.readdirSync(templateDir);
  for (const file of files.filter((f) => f !== 'package.json')) {
    write(file);
  }

  const pkg = JSON.parse(fs.readFileSync(path.join(templateDir, `package.json`), 'utf-8'));

  pkg.name = packageName || getProjectName();

  write('package.json', JSON.stringify(pkg, null, 2) + '\n');

  const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent);
  const pkgManagerName = pkgInfo ? pkgInfo.name : pkgManager;

  console.log(`\n${green('✔')} Done!\n`);

  const cdProjectName = path.relative(cwd, root);
  console.log(`  cd ${cdProjectName.includes(' ') ? `"${cdProjectName}"` : cdProjectName}`);

  switch (pkgManagerName) {
    case 'yarn':
      console.log('  yarn');
      console.log('  yarn dev');
      break;
    default:
      console.log(`  ${pkgManagerName} install`);
      console.log(`  ${pkgManagerName} run dev`);
      break;
  }
  console.log();

  if (useGit) {
    console.log(`Initializing git repository...`);
    try {
      const { execSync } = await import('node:child_process');
      execSync('git init', { cwd: root, stdio: 'ignore' });
      execSync('git add -A', { cwd: root, stdio: 'ignore' });
      execSync('git commit -m "Initial commit from create-nadi"', {
        cwd: root,
        stdio: 'ignore',
      });
      console.log(`${green('✔')} Git repository initialized\n`);
    } catch (e) {
      console.log(`${yellow('⚠')} Failed to initialize git repository\n`);
    }
  }
}

function formatTargetDir(targetDir: string | undefined) {
  return targetDir?.trim().replace(/\/+$/g, '');
}

function copy(src: string, dest: string) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    copyDir(src, dest);
  } else {
    fs.copyFileSync(src, dest);
  }
}

function isValidPackageName(projectName: string) {
  return /^(?:@[a-z\d\-*~][a-z\d\-*._~]*\/)?[a-z\d\-~][a-z\d\-._~]*$/.test(projectName);
}

function toValidPackageName(projectName: string) {
  return projectName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/^[._]/, '')
    .replace(/[^a-z\d\-~]+/g, '-');
}

function copyDir(srcDir: string, destDir: string) {
  fs.mkdirSync(destDir, { recursive: true });
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file);
    const destFile = path.resolve(destDir, file);
    copy(srcFile, destFile);
  }
}

function isEmpty(path: string) {
  const files = fs.readdirSync(path);
  return files.length === 0 || (files.length === 1 && files[0] === '.git');
}

function emptyDir(dir: string) {
  if (!fs.existsSync(dir)) {
    return;
  }
  for (const file of fs.readdirSync(dir)) {
    if (file === '.git') {
      continue;
    }
    fs.rmSync(path.resolve(dir, file), { recursive: true, force: true });
  }
}

function pkgFromUserAgent(userAgent: string | undefined) {
  if (!userAgent) return undefined;
  const pkgSpec = userAgent.split(' ')[0];
  const pkgSpecArr = pkgSpec.split('/');
  return {
    name: pkgSpecArr[0],
    version: pkgSpecArr[1],
  };
}

init().catch((e) => {
  console.error(e);
});
