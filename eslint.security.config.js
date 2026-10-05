// T018 Unsafe HTML sinks (004:FR-007). The html`` tagged template (html.js) is the approved escape.
import nounsanitized from 'eslint-plugin-no-unsanitized';

const escape = { escape: { taggedTemplates: ['html'] } };

export default [
  {
    files: ['app.js', 'logic.js', 'html.js'],
    plugins: { 'no-unsanitized': nounsanitized },
    rules: {
      'no-unsanitized/property': ['error', escape],
      'no-unsanitized/method': ['error', escape]
    }
  }
];
