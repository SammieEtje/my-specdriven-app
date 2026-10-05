// T022 Recorded accessibility exceptions (004:FR-016). Each entry needs a non-empty reason.
// Example: { rule: 'color-contrast', selector: '#example', reason: 'Decorative text, see issue #12' }
const defaultList = [];

export function loadExceptions(list = defaultList) {
  for (const entry of list) {
    if (typeof entry.reason !== 'string' || entry.reason.trim() === '') {
      throw new Error(`a11y exception for rule "${entry.rule}" on "${entry.selector}" has no reason (FR-016)`);
    }
  }
  return list;
}

export default defaultList;
