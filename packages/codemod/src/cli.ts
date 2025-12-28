#!/usr/bin/env node
import { Command } from 'commander';
import { migrate } from './index.js';
import glob from 'glob';
import chalk from 'chalk';

const program = new Command();

program
  .name('nadi-codemod')
  .description('Automated migration tools for Nadi framework')
  .version('0.2.0');

program
  .command('vue-to-nadi <pattern>')
  .description('Convert Vue components to Nadi')
  .option('--dry-run', 'Preview changes without writing files')
  .option('--force', 'Overwrite existing .nadi files')
  .option('--typescript', 'Generate TypeScript')
  .option('--keep-original', 'Keep original files after conversion')
  .action(async (pattern, options) => {
    const files = glob.sync(pattern);

    console.log(chalk.blue(`Found ${files.length} Vue files to convert\n`));

    for (const file of files) {
      try {
        const result = await migrate(file, {
          from: 'vue',
          to: 'nadi',
          typescript: options.typescript,
          dryRun: options.dryRun,
          force: options.force,
          keepOriginal: options.keepOriginal,
        });

        if (options.dryRun) {
          console.log(chalk.gray(`Would convert: ${file}`));
          console.log(result.preview);
        } else {
          console.log(chalk.green(`✓ Converted: ${file} → ${result.outputPath}`));
        }
      } catch (error) {
        console.error(chalk.red(`✗ Failed: ${file}`));
        console.error(chalk.red(error.message));
      }
    }
  });

program
  .command('react-to-nadi <pattern>')
  .description('Convert React components to Nadi')
  .option('--dry-run', 'Preview changes without writing files')
  .option('--force', 'Overwrite existing .nadi files')
  .option('--typescript', 'Generate TypeScript')
  .option('--keep-original', 'Keep original files after conversion')
  .action(async (pattern, options) => {
    const files = glob.sync(pattern);

    console.log(chalk.blue(`Found ${files.length} React files to convert\n`));

    for (const file of files) {
      try {
        const result = await migrate(file, {
          from: 'react',
          to: 'nadi',
          typescript: options.typescript,
          dryRun: options.dryRun,
          force: options.force,
          keepOriginal: options.keepOriginal,
        });

        if (options.dryRun) {
          console.log(chalk.gray(`Would convert: ${file}`));
          console.log(result.preview);
        } else {
          console.log(chalk.green(`✓ Converted: ${file} → ${result.outputPath}`));
        }
      } catch (error) {
        console.error(chalk.red(`✗ Failed: ${file}`));
        console.error(chalk.red(error.message));
      }
    }
  });

program
  .command('svelte-to-nadi <pattern>')
  .description('Convert Svelte components to Nadi')
  .option('--dry-run', 'Preview changes without writing files')
  .option('--force', 'Overwrite existing .nadi files')
  .option('--typescript', 'Generate TypeScript')
  .option('--keep-original', 'Keep original files after conversion')
  .action(async (pattern, options) => {
    const files = glob.sync(pattern);

    console.log(chalk.blue(`Found ${files.length} Svelte files to convert\n`));

    for (const file of files) {
      try {
        const result = await migrate(file, {
          from: 'svelte',
          to: 'nadi',
          typescript: options.typescript,
          dryRun: options.dryRun,
          force: options.force,
          keepOriginal: options.keepOriginal,
        });

        if (options.dryRun) {
          console.log(chalk.gray(`Would convert: ${file}`));
          console.log(result.preview);
        } else {
          console.log(chalk.green(`✓ Converted: ${file} → ${result.outputPath}`));
        }
      } catch (error) {
        console.error(chalk.red(`✗ Failed: ${file}`));
        console.error(chalk.red(error.message));
      }
    }
  });

program.parse();
