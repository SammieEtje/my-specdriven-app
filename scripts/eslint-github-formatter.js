// T004 ESLint formatter that emits GitHub annotations, one per finding (FR-012)
import path from 'node:path';

const escape = (value) => String(value).replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A');

export default function githubFormatter(results) {
  const lines = [];
  let errors = 0;
  let warnings = 0;

  for (const result of results) {
    const file = path.relative(process.cwd(), result.filePath);
    for (const message of result.messages) {
      const level = message.severity === 2 ? 'error' : 'warning';
      if (level === 'error') errors += 1;
      else warnings += 1;
      const rule = message.ruleId ?? 'eslint';
      lines.push(
        `::${level} file=${file},line=${message.line ?? 1},col=${message.column ?? 1},title=${escape(rule)}::${escape(message.message)}`
      );
    }
  }

  lines.push(`ESLint: ${errors} error(s), ${warnings} warning(s)`);
  return lines.join('\n');
}
