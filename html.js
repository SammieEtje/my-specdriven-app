// T016 Tagged template that HTML-escapes every interpolated value (004:FR-007, research R6)
const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export function html(strings, ...values) {
  return strings.reduce((output, part, index) => {
    if (index === 0) return part;
    const value = values[index - 1];
    const text = value === null || value === undefined ? '' : String(value);
    return output + text.replace(/[&<>"']/g, (char) => ESCAPES[char]) + part;
  }, '');
}

// T032 (007) markup escapes like html, but inserts fragments that markup itself built, so the Markdown
// renderer can nest blocks (research R3). Only markup creates a SafeHtml; any other value is escaped.
class SafeHtml {
  constructor(value) {
    this.value = value;
  }

  toString() {
    return this.value;
  }
}

function escapeValue(value) {
  if (value instanceof SafeHtml) return value.value;
  if (Array.isArray(value)) return value.map(escapeValue).join('');
  const text = value === null || value === undefined ? '' : String(value);
  return text.replace(/[&<>"']/g, (char) => ESCAPES[char]);
}

export function markup(strings, ...values) {
  return new SafeHtml(strings.reduce((output, part, index) => output + escapeValue(values[index - 1]) + part));
}
