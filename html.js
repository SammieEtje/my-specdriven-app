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
