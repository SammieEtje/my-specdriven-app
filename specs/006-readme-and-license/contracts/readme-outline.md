# Contract: README outline

These `##` headings are required, in this order (asserted by `readme.test.js`). Content rules
follow each one.

0. `# Spec-driven to-do demo`, followed by a one- to three-sentence summary and the `Quality gate`
   workflow badge (linked to the Actions tab).
1. `## Why this exists` (FR-002): to make spec-driven development with GitHub Spec Kit and an AI
   assistant visible and checkable. A deliberately small app, so the process is the subject.
   Traceability from every UI element (`data-spec`) to the requirement and the decision.
2. `## What you can see` (US1): the to-do board, and the decision-trace panel that shows the
   spec, phases and decisions behind any element you click.
3. `## How it was built` (FR-003): the constitution first, then per feature the phases specify,
   clarify, plan, tasks, analyze and implement, with converge as a check after implement (used in
   practice, not yet in the constitution's workflow list), with links to `.specify/memory/constitution.md` and
   `specs/<feature>/`. Each phase ends with a commit, a `<feature>-<phase>` tag, and the prompt in
   `prompts.md`. It notes that the specs are written in Dutch.
4. `## Features` (FR-004): a table of 001 to 006, each with a one-line outcome and a link to its
   spec, with 002 marked as specified but not built.
5. `## Lessons learned` (FR-005): an honest list, at minimum:
   - 001 tasks were marked done but never built (add, filters, empty state, persist), and the 004
     browser tests exposed it;
   - the gate itself found an XSS and two accessibility defects;
   - a measurement error was corrected (Close-button focus);
   - test flakiness was traced to the local server;
   - a GitHub Actions outage needed job re-runs.
6. `## Run it` (FR-006): prerequisites (Node 24+, Python 3), `npm ci`, `npm start`, and the URL.
7. `## Test it` (FR-006): `npm test`, `npm run lint`, `npm run format:check`,
   `npm run lint:security`, `npx playwright install chromium`, `npm run test:e2e`, each with a
   one-line purpose. No exact counts (research R6).
8. `## Quality gate and contributing` (FR-007): the three required checks (`code`, `security`,
   `usability`) and what each runs. Branch protection on `main` applies to admins too. Work goes
   through a pull request, following the Spec Kit flow.
9. `## Known issues`: the spec-03 trace mismatch for checkboxes, focus after closing by backdrop
   click, and 002 not built.
10. `## License` (FR-008 to FR-010): MIT (link to `LICENSE`), third-party notices (link to
    `THIRD_PARTY_NOTICES.md`), and the trademark paragraph.
11. `## Acknowledgements` (FR-011): GitHub Spec Kit and IBM Plex. Much of the specs, plans and code
    was produced with an AI assistant (Claude Code) under the owner's direction and review.

**Writing rules**: no em-dashes, no emoji, sentence-case headings. Descriptive link text, never
"click here".
