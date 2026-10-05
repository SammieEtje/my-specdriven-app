// T004 Runs ESLint, with GitHub annotations in CI and the default formatter locally
import { ESLint } from 'eslint';

const eslint = new ESLint();
const results = await eslint.lintFiles(['.']);
const formatter = await eslint.loadFormatter(process.env.CI ? './scripts/eslint-github-formatter.js' : 'stylish');
const output = await formatter.format(results);

if (output) console.log(output);
process.exitCode = results.some((result) => result.errorCount > 0) ? 1 : 0;
