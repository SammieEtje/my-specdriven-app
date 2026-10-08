// T018 Unsafe HTML sinks (004:FR-007). The html`` tagged template (html.js) is the approved escape.
import nounsanitized from 'eslint-plugin-no-unsanitized';

// T008 (007) markup`` and renderMarkdown() are approved escapers too: both only emit escaped document text (research R3)
const escape = { escape: { taggedTemplates: ['html', 'markup'], methods: ['renderMarkdown'] } };

export default [
  {
    files: ['app.js', 'logic.js', 'html.js', 'docs.js', 'markdown.js'],
    plugins: { 'no-unsanitized': nounsanitized },
    rules: {
      'no-unsanitized/property': ['error', escape],
      'no-unsanitized/method': ['error', escape]
    }
  }
];
