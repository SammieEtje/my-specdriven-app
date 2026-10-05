// T003 Code rules for the quality gate (FR-003, FR-016)
import js from '@eslint/js';
import globals from 'globals';
import comments from '@eslint-community/eslint-plugin-eslint-comments';

export default [
  {
    ignores: ['node_modules/', '.claude/', '.specify/', 'specs/', 'playwright-report/', 'test-results/']
  },
  js.configs.recommended,
  {
    linterOptions: { reportUnusedDisableDirectives: 'error' },
    plugins: { '@eslint-community/eslint-comments': comments },
    rules: {
      '@eslint-community/eslint-comments/require-description': 'error'
    }
  },
  {
    files: ['app.js', 'logic.js', 'html.js'],
    languageOptions: { globals: globals.browser }
  },
  {
    files: ['**/*.test.js', 'scripts/**', 'e2e/**', '*.config.js'],
    languageOptions: { globals: globals.node }
  },
  {
    files: ['e2e/**'],
    languageOptions: { globals: { ...globals.node, ...globals.browser } }
  }
];
