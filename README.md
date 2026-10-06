# Spec-driven to-do demo

A small to-do app that exists to show a way of working: every feature is specified, planned, broken into tasks, checked
and only then built, with an AI assistant doing much of the writing under human direction. Click any element in the app
and it tells you which requirement it implements and which decisions led to it.

[![Quality gate](https://github.com/SammieEtje/my-specdriven-app/actions/workflows/quality-gate.yml/badge.svg)](https://github.com/SammieEtje/my-specdriven-app/actions/workflows/quality-gate.yml)

## Why this exists

This repository is a demonstration of spec-driven development with [GitHub Spec Kit](https://github.com/github/spec-kit)
and an AI assistant. The to-do app is deliberately small, so the process is the subject, not the app.

The goal is to make that process visible and checkable:

- Every feature starts as a written specification with user stories, requirements and measurable success criteria.
- Every decision along the way (clarifications, design choices, trade-offs) is recorded next to the specification.
- Every element on the screen carries a `data-spec` attribute that names the requirement it implements, for example
  `data-spec="003:FR-008"`, and a trace panel in the app shows the story behind it.
- Every pull request has to pass automated checks for code, security and usability before it can reach `main`.

It also shows where this way of working helps and where it still needs a human to look closely. See
[Lessons learned](#lessons-learned).

## What you can see

The app has two panels:

- **The to-do board.** Add tasks, check them off, filter by All, Active or Completed, and open a task to edit its title,
  description, tag and owner. Tasks are saved in your browser, so they survive a reload. Nothing leaves your machine.
- **The decision trace.** Click any element on the board and this panel shows the specification behind it: the feature,
  the element, its description, and what was decided in each phase (specify, clarify, plan, tasks, implement).

The interface follows the Polderworks design system and works with keyboard only.

## How it was built

The ground rules are in the [project constitution](.specify/memory/constitution.md): keep it simple, make every
requirement testable, keep everything traceable, keep it accessible, and keep user data local.

Each feature then goes through the same phases, each one a Spec Kit command:

1. **specify**: describe what is needed and why, as user stories and testable requirements.
2. **clarify**: resolve the questions only a person can answer.
3. **plan**: decide how to build it, with the reasoning written down.
4. **tasks**: break the plan into small, ordered tasks, tests first.
5. **analyze**: check the specification, plan and tasks against each other and against the constitution before any
   code is written.
6. **implement**: build the tasks and mark them done.
7. **converge**: compare the finished code with the specification and add tasks for anything still missing. This step
   was used for feature 003; the constitution does not list it yet.

Each phase ends with a commit and a git tag named `<feature>-<phase>`, for example `004-plan`. The prompt that started
each phase and the decisions made in it are kept in a `prompts.md` file per feature. Tagging started with feature 003.

Everything lives in [specs/](specs): one folder per feature with `spec.md`, `plan.md`, `research.md`, `tasks.md`,
`quickstart.md` and `prompts.md`. The specifications are written in Dutch; the plans, code and this README are in
English.

## Features

| Feature                       | Status               | Outcome                                                                                             | Specification                                      |
| ----------------------------- | -------------------- | --------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| 001 Spec-driven to-do demo    | Built                | The board, the task dialog and the decision trace. Four promised behaviours were missing until 005. | [spec](specs/001-spec-driven-todo-demo/spec.md)    |
| 002 Priority task order       | Specified, not built | Reordering tasks by priority with drag and drop.                                                    | [spec](specs/002-priority-task-order/spec.md)      |
| 003 Polderworks design system | Built                | The app restyled on design-system tokens, with self-hosted fonts that work offline.                 | [spec](specs/003-adopt-polderworks-design/spec.md) |
| 004 Pull-request quality gate | Built                | Automated `code`, `security` and `usability` checks that every pull request must pass.              | [spec](specs/004-ci-quality-gates/spec.md)         |
| 005 Complete the core flow    | Built                | Adding tasks, filters, the empty state and saving across reloads, as 001 had promised.              | [spec](specs/005-complete-core-flow/spec.md)       |
| 006 README and license        | Built                | This README, the MIT license and the third-party notices.                                           | [spec](specs/006-readme-and-license/spec.md)       |

## Lessons learned

The process did not prevent every mistake. It made them visible, which is the point.

- **Ticked boxes are not evidence.** In feature 001, the tasks for adding a task, filtering, the empty state and saving
  were all marked done, but the code never did any of it. Nobody noticed until the browser tests of the 004 quality
  gate tried the full flow and failed. Feature 005 then built what 001 had promised. The converge step exists to catch this:
  it compares the code with the specification instead of trusting the task list.
- **The quality gate found real defects on its first run.** Task titles typed in the dialog were inserted into the page
  as HTML, which allowed an XSS attack. The accessibility checks also found two defects: the scrollable trace block could
  not be reached by keyboard, and its label was not valid on that element. All three were fixed. The evidence is in
  [the 004 quickstart](specs/004-ci-quality-gates/quickstart.md) and [the 005 quickstart](specs/005-complete-core-flow/quickstart.md).
- **Measure twice before you report.** A manual test reported that the Close button in the task dialog did not return
  focus to the Open button. A repeated measurement showed it did; the first check read the focus too early. The
  baseline was corrected from five gaps to four, and the correction is recorded.
- **Flaky tests have causes.** Browser tests failed at random under parallel load. The causes were a local Python file
  server that dropped connections and tests that started before the app had finished loading. A small Node test server
  and an explicit "app is ready" signal fixed it.
- **Never merge red, even when it is not your fault.** During a GitHub Actions outage, check runs were cancelled before
  they started. They were re-run until they passed, instead of merging without green checks.
- **Analysis before code pays off.** Every analyze step found something before any code existed: a requirement without
  a test, a check running in the wrong job, or an empty title that would have survived a reload.

## Run it

You need Node.js 24 or newer and Python 3.

```bash
npm ci        # install the development tools
npm start     # serve the app
```

Then open http://localhost:8000 in your browser.

## Test it

```bash
npm test                          # unit and static checks, including traceability, privacy and this README
npm run lint                      # common code mistakes
npm run format:check              # consistent formatting
npm run lint:security             # unsafe HTML insertion
npx playwright install chromium   # once, for the browser tests
npm run test:e2e                  # accessibility, keyboard use and the full core flow in a real browser
```

Each feature's `quickstart.md` records what these produced at the time it was built.

## Quality gate and contributing

Every pull request to `main` runs three checks, and all three must pass before it can be merged:

- **`code`**: the tests, linting, formatting, and a check that every `data-spec` label points to a real requirement.
- **`security`**: a scan for leaked secrets, a dependency audit and review, a check against unsafe HTML insertion, a check
  that the app makes no requests to other sites, and CodeQL static analysis.
- **`usability`**: accessibility checks against WCAG 2.1 AA, visible keyboard focus on every control, and the full core
  flow in a real browser.

Branch protection on `main` enforces this, also for administrators, and requires branches to be up to date. There is
no way around the checks.

To contribute, open a branch named after the feature (for example `007-short-name`), follow the phases above with the
Spec Kit commands, and open a pull request. It merges once all three checks are green.

## Known issues

- Clicking a task's checkbox shows the trace for the add-task specification instead of the one for checking off tasks.
  The trace data lists the checkboxes under the wrong names.
- Closing the task dialog by clicking outside it leaves keyboard focus on the closed dialog instead of the Open button.
  Closing with the Close button or Escape works correctly.
- Feature 002, reordering tasks by priority, is specified but not built.

## License

The code and documentation in this repository are available under the [MIT license](LICENSE).

Some parts come from other projects and keep their own terms; see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

"Polderworks" and "Loods" are trademarks of the owner's ventures. The MIT license covers the code, design tokens and
documentation, but it grants no right to use these names or their brand identity in a way that suggests affiliation or
endorsement.

## Acknowledgements

- [GitHub Spec Kit](https://github.com/github/spec-kit) for the specification workflow and its commands.
- [IBM Plex](https://github.com/IBM/plex) for the typefaces.
- Playwright and axe-core for the browser and accessibility checks.

Much of the specifications, plans and code was produced with an AI assistant, Claude Code, under the direction and
review of the owner, Sander Ettema. Every phase was started, reviewed and approved by him, and the questions only a
person can answer were put to him and recorded.
