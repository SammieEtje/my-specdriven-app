// T007 (007) Which Spec Kit documents exist, which phase shows which, and the one guarded request (research R1, R2, R4)

export const PHASES = ['specify', 'clarify', 'plan', 'tasks', 'analyze', 'implement'];

// Kept in step with specs/ by docs.test.js, which prints the entry to paste when a folder or file changes
export const FEATURE_DOCS = [
  {
    id: '001',
    dir: '001-spec-driven-todo-demo',
    title: 'Spec-driven todo demo',
    files: [
      'contracts/README.md',
      'data-model.md',
      'plan.md',
      'prompts.md',
      'quickstart.md',
      'research.md',
      'spec.md',
      'tasks.md'
    ]
  },
  {
    id: '002',
    dir: '002-priority-task-order',
    title: 'Prioriteitstaken Volgorde',
    files: ['prompts.md', 'spec.md']
  },
  {
    id: '003',
    dir: '003-adopt-polderworks-design',
    title: 'Polderworks-designsysteem adopteren',
    files: ['plan.md', 'prompts.md', 'quickstart.md', 'research.md', 'spec.md', 'tasks.md']
  },
  {
    id: '004',
    dir: '004-ci-quality-gates',
    title: 'Kwaliteitspoort voor pull requests',
    files: [
      'contracts/quality-gate.md',
      'data-model.md',
      'plan.md',
      'prompts.md',
      'quickstart.md',
      'research.md',
      'spec.md',
      'tasks.md'
    ]
  },
  {
    id: '005',
    dir: '005-complete-core-flow',
    title: 'Kernflow uit feature 001 voltooien',
    files: [
      'contracts/ui-behaviour.md',
      'data-model.md',
      'plan.md',
      'prompts.md',
      'quickstart.md',
      'research.md',
      'spec.md',
      'tasks.md'
    ]
  },
  {
    id: '006',
    dir: '006-readme-and-license',
    title: 'README en licentie',
    files: [
      'contracts/readme-outline.md',
      'data-model.md',
      'plan.md',
      'prompts.md',
      'quickstart.md',
      'research.md',
      'spec.md',
      'tasks.md'
    ]
  },
  {
    id: '007',
    dir: '007-spec-phase-tabs',
    title: 'Fasetabs met de echte Spec Kit-documenten',
    files: [
      'contracts/markdown-subset.md',
      'contracts/ui-panel.md',
      'data-model.md',
      'plan.md',
      'prompts.md',
      'quickstart.md',
      'research.md',
      'spec.md',
      'tasks.md'
    ]
  }
];

export function findFeature(id) {
  return FEATURE_DOCS.find((entry) => entry.id === id) ?? null;
}

// Feature numbers from a data-spec value, in order of first appearance (research R5)
export function featuresFor(dataSpec) {
  const ids = String(dataSpec ?? '')
    .split(/\s+/)
    .map((token) => token.split(':')[0])
    .filter((id) => /^\d{3}$/.test(id));
  return [...new Set(ids)];
}

const PLAN_SUPPORT = ['research.md', 'data-model.md', 'quickstart.md'];

// The documents a phase tab shows for one feature (research R4). The first is the main one.
export function phaseDocuments(entry, phase) {
  const ref = (file, section = null) => ({ label: file, file, section });
  switch (phase) {
    case 'specify':
      return [ref('spec.md')];
    case 'clarify':
      return [ref('spec.md', 'Clarifications')];
    case 'plan': {
      const contracts = entry.files.filter((file) => file.startsWith('contracts/')).sort();
      const support = PLAN_SUPPORT.filter((file) => entry.files.includes(file));
      return [ref('plan.md'), ...[...support, ...contracts].map((file) => ref(file))];
    }
    case 'tasks':
      return [ref('tasks.md')];
    case 'analyze':
      return [ref('prompts.md', 'Phase: analyze')];
    case 'implement':
      return [ref('prompts.md', 'Phase: implement')];
    default:
      return [];
  }
}

// Only manifest paths can become a request, so neither user input nor document text can steer one (FR-014)
export function docUrl(dir, file) {
  const entry = FEATURE_DOCS.find((candidate) => candidate.dir === dir);
  if (!entry || !entry.files.includes(file)) throw new Error(`Not a known Spec Kit document: ${dir}/${file}`);
  return `specs/${dir}/${file}`;
}

const cache = new Map();

// LoadResult (data-model): ok with text, not-produced for a 404, unavailable when the request fails.
// Failures are not cached, so a blocked request can succeed on a later try.
export function loadDocument(dir, file) {
  const key = `${dir}/${file}`;
  if (!cache.has(key)) {
    const pending = fetch(docUrl(dir, file))
      .then(async (response) => {
        if (response.ok) return { state: 'ok', text: await response.text() };
        return { state: response.status === 404 ? 'not-produced' : 'unavailable' };
      })
      .catch(() => ({ state: 'unavailable' }))
      .then((result) => {
        if (result.state !== 'ok') cache.delete(key);
        return result;
      });
    cache.set(key, pending);
  }
  return cache.get(key);
}
