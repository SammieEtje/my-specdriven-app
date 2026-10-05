import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

// T007 Static checks of the quality-gate workflow (004: FR-001 to FR-003, FR-005 to FR-007, FR-012, FR-014, FR-015)

const WORKFLOW = new URL('./.github/workflows/quality-gate.yml', import.meta.url);
const JOBS = ['code', 'security', 'usability'];

function source() {
  assert.ok(existsSync(WORKFLOW), '.github/workflows/quality-gate.yml is missing');
  return readFileSync(WORKFLOW, 'utf8')
    .split('\n')
    .filter((line) => !line.trim().startsWith('#'))
    .join('\n');
}

function jobBlock(text, job) {
  const start = text.search(new RegExp(`^  ${job}:\\s*$`, 'm'));
  assert.ok(start >= 0, `job "${job}" is missing`);
  const rest = text.slice(start + 1);
  const next = rest.search(/^ {2}[a-z][\w-]*:\s*$/m);
  return next >= 0 ? rest.slice(0, next) : rest;
}

test('004:FR-001 runs on pull requests to main, pushes to main and manual dispatch', () => {
  const text = source();
  const onBlock = text.slice(text.search(/^on:/m), text.search(/^permissions:/m));
  assert.match(onBlock, /pull_request:\s*\n\s+branches:\s*\[main\]/);
  for (const type of ['opened', 'synchronize', 'reopened', 'ready_for_review']) {
    assert.match(onBlock, new RegExp(`types:[^\\n]*\\b${type}\\b`), `pull_request type ${type} missing`);
  }
  assert.match(onBlock, /push:\s*\n\s+branches:\s*\[main\]/);
  assert.match(onBlock, /workflow_dispatch:/);
  assert.doesNotMatch(text, /\bpaths(-ignore)?:/, 'a paths filter would leave required checks unreported');
});

test('004:FR-014 read-only token, no pull_request_target, no persisted credentials', () => {
  const text = source();
  assert.match(
    text,
    /^permissions:\s*\n {2}contents: read\s*\n(?! {2}\S)/m,
    'workflow-level permissions must be contents: read only'
  );
  assert.doesNotMatch(text, /pull_request_target/);
  const checkouts = text.match(/uses: actions\/checkout@[^\n]*\n(?:\s+with:[\s\S]*?)?(?=\n\s+- |\n {2}\S|$)/g) ?? [];
  assert.ok(checkouts.length >= JOBS.length, 'every job checks out the code');
  for (const checkout of checkouts) {
    assert.match(checkout, /persist-credentials: false/, 'checkout must not persist credentials');
  }
  for (const job of ['code', 'usability']) {
    assert.doesNotMatch(jobBlock(text, job), /permissions:/, `${job} must not widen permissions`);
  }
  const security = jobBlock(text, 'security');
  assert.match(security, /security-events: write/);
  assert.doesNotMatch(security, /contents: write|pull-requests: write|actions: write/);
});

test('004:FR-012 one job per category: code, security, usability', () => {
  const text = source();
  const jobsSection = text.slice(text.search(/^jobs:/m));
  const names = [...jobsSection.matchAll(/^ {2}([a-z][\w-]*):\s*$/gm)].map((match) => match[1]);
  assert.deepEqual(names, JOBS);
});

test('004:FR-015 every job has a 10-minute timeout and nothing continues on error', () => {
  const text = source();
  for (const job of JOBS) {
    assert.match(jobBlock(text, job), /timeout-minutes: 10\b/, `${job} lacks timeout-minutes: 10`);
  }
  assert.doesNotMatch(text, /continue-on-error/);
});

test('004:R2 every action is pinned to a full commit SHA', () => {
  const uses = [...source().matchAll(/uses:\s*(\S+)/g)].map((match) => match[1]);
  assert.ok(uses.length > 0);
  for (const ref of uses) {
    assert.match(ref, /@[0-9a-f]{40}$/, `${ref} is not pinned to a commit SHA`);
  }
  assert.match(
    source(),
    /ghcr\.io\/gitleaks\/gitleaks:v[\d.]+@sha256:[0-9a-f]{64}/,
    'gitleaks image must be pinned by digest'
  );
});

test('004:FR-002 FR-003 code job runs tests, lint and formatting', () => {
  const code = jobBlock(source(), 'code');
  for (const command of ['npm test', 'npm run lint', 'npm run format:check']) {
    assert.ok(code.includes(`run: ${command}`), `code job lacks "${command}"`);
  }
});

test('004:FR-005 to FR-008 security job runs every scanner', () => {
  const security = jobBlock(source(), 'security');
  assert.match(security, /gitleaks[\s\S]*--redact/, 'gitleaks with --redact');
  assert.ok(security.includes('run: npm audit --audit-level=high'), 'npm audit');
  assert.match(security, /dependency-review-action@[\s\S]*?fail-on-severity: high/, 'dependency review');
  assert.ok(security.includes('run: npm run lint:security'), 'unsafe HTML lint');
  assert.ok(security.includes('run: node --test privacy.test.js'), 'privacy check');
  assert.match(
    security,
    /codeql-action\/init@[\s\S]*?config-file: \.\/\.github\/codeql\/codeql-config\.yml/,
    'CodeQL init'
  );
  assert.match(security, /codeql-action\/analyze@/, 'CodeQL analyze');
  const codeqlConfig = readFileSync(new URL('./.github/codeql/codeql-config.yml', import.meta.url), 'utf8');
  assert.match(codeqlConfig, /security-extended/);
});

test('004:FR-009 to FR-011 usability job runs the browser checks', () => {
  const usability = jobBlock(source(), 'usability');
  assert.ok(usability.includes('run: npm run test:e2e'), 'usability job lacks "npm run test:e2e"');
});

// T030 Each job reports a summary, and usability keeps the browser report on failure (004:FR-012, US4)
test('004:FR-012 every job ends with an always-on summary step', () => {
  const text = source();
  for (const job of JOBS) {
    const block = jobBlock(text, job);
    const lastStep = block.slice(block.lastIndexOf('\n      - name:'));
    assert.match(lastStep, /if: \$\{\{ always\(\) \}\}/, `${job}: last step must run always`);
    assert.match(lastStep, /GITHUB_STEP_SUMMARY/, `${job}: last step must write the job summary`);
  }
});

test('004:FR-012 usability uploads the Playwright report on failure', () => {
  const usability = jobBlock(source(), 'usability');
  assert.match(usability, /actions\/upload-artifact@[0-9a-f]{40}[\s\S]*?path: playwright-report\//);
  assert.match(usability, /if: \$\{\{ failure\(\) \}\}\s*\n\s+uses: actions\/upload-artifact/);
});
