# Contract: Markdown subset (`markdown.js`)

`renderMarkdown(source, { baseDir })` returns an HTML string. `extractSection(source, heading)`
returns the text from the line `## <heading>` up to (not including) the next line that starts with
`## `, or `null` if the heading is absent. Both are pure and run in node and the browser.

## Block syntax

| Syntax | Output | Notes |
|--------|--------|-------|
| `#` to `######` heading | `<h3>` to `<h6>`, capped at `h6` | Shifted two levels, because the panel title is the page's `h2`. |
| Paragraph (consecutive non-empty lines) | `<p>` | Lines are joined with a space. |
| `-`, `*` or `1.` list item, nested by indentation (2 or more spaces) | `<ul>` / `<ol>` with `<li>` | `<ol start>` keeps the first number. |
| `- [ ]` / `- [x]` / `- [X]` | `<li class="md-task">` with `<span class="md-check" role="img" aria-label="Done">` or `"Open"` | No form controls, so nothing joins the Tab order. |
| GFM table (header row, `|---|` row, body rows) | `<table>` with `<thead>` and `<tbody>` | Alignment colons are ignored. Escaped `\|` stays in the cell. |
| Fenced code (```` ``` ```` with optional language) | `<pre><code>` | Content verbatim, escaped. |
| `> ` block quote | `<blockquote>` | Content rendered as paragraphs. |
| `---`, `***` on its own line | `<hr>` | |
| Anything else, including raw HTML and `<!-- -->` | Paragraph text, escaped | FR-010. |

## Inline syntax

| Syntax | Output |
|--------|--------|
| `` `code` `` | `<code>`, content verbatim |
| `**bold**` | `<strong>` |
| `*italic*`, `_italic_` | `<em>` |
| `[text](url)` | `<a>`. `https:` URLs get `target="_blank" rel="noopener noreferrer"`. Relative URLs resolve against `baseDir` (for example `specs/003-adopt-polderworks-design/`). Any other scheme (`javascript:`, `data:`, `http:`) renders the text without a link. |
| Bare `https://` URL | Text, no link |

## Safety rules (FR-010, 004 FR-007)

- Every piece of document text goes through the `html` tagged template. The renderer never inserts
  document text into markup any other way, so `npm run lint:security` passes without exceptions.
- No attribute other than `href` takes document text, and `href` only after the scheme check above.
- `renderMarkdown('<img src=x onerror=alert(1)>')` returns a paragraph whose text is that string.

## Fidelity rule (SC-001)

For every document in the manifest: the words of the rendered text (tags removed, entities decoded)
equal the words of the source with the Markdown syntax removed, in the same order. `docs.test.js`
checks this on all real documents.
