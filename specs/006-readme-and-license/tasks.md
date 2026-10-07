---

description: "Task list for README and license"
---

# Tasks: README en licentie

**Input**: Design documents from `/specs/006-readme-and-license/`

**Prerequisites**: plan.md, spec.md, research.md (R1–R7), data-model.md, contracts/readme-outline.md, quickstart.md

**Tests**: Included (constitution II). Each story adds its checks to `readme.test.js` first and confirms they fail.

**Organization**: US1 (what and why), US2 (run and verify) and US3 (terms). US1 and US2 both edit `README.md`, so their README tasks run in sequence.

## Format: `[ID] [P?] [Story] Description`

## Conventions for every task

- **Language and style**: the README and notices are in English. No em-dashes (`—`) and no emoji (FR-012). Sentence-case headings, and link text that says where the link goes.
- **Headings**: exactly as in `contracts/readme-outline.md`, in that order.
- **Facts must be checkable**: every fact comes from the repository (specs, `quickstart.md` Results, `package.json`, git tags). There are no exact test counts (research R6).
- **No personal data** beyond the owner's name "Sander Ettema".
- **Formatting**: run `npm run format` after editing, so `npm run format:check` (part of the `code` check) passes.
- **Traceability**: put task-ID comments in `readme.test.js` (`// T005`).

---

## Phase 1: Setup

- [X] T001 Create `readme.test.js` (node:test, `node:fs` only) with the helpers it needs:
  - `read(path)`;
  - `headings(markdown)`, returning the `#` and `##` lines in order;
  - `section(markdown, heading)`, returning the text up to the next `##`;
  - `relativeLinks(markdown)`, returning every `[text](target)` and `![alt](target)` whose target doesn't start with `http`, `https`, `mailto` or `#`, with the anchor stripped;
  - `codeBlocks(text)`, returning the lines inside fenced blocks.

  Add one sanity test, `006 helpers parse headings and links`, with an inline fixture

---

## Phase 2: Foundational

None. The three documents are independent. US3's `LICENSE` and notices files may be written before or in parallel with the README stories.

---

## Phase 3: User Story 1 - Begrijpen wat dit is en waarom het bestaat (Priority: P1) 🎯 MVP

**Goal**: A visitor understands what the repository is and why it exists, how it was built, and what was learned.

**Independent Test**: The US1 tests pass. A reader who only reads the README can state the purpose within 3 minutes (SC-001, manual).

### Tests for User Story 1 ⚠️

- [X] T002 [US1] Add to `readme.test.js`:
  - `006:FR-001 README has the required sections in order`: the `##` headings equal exactly `Why this exists`, `What you can see`, `How it was built`, `Features`, `Lessons learned`, `Run it`, `Test it`, `Quality gate and contributing`, `Known issues`, `License` and `Acknowledgements`, and the first line is `# Spec-driven to-do demo`;
  - `006:FR-012 README and notices follow the writing rules`: no `—` and no `\p{Extended_Pictographic}` in `README.md` or `THIRD_PARTY_NOTICES.md` (a file that doesn't exist yet fails the test);
  - `006:SC-005 every relative link resolves`: each `relativeLinks` target in `README.md` and `THIRD_PARTY_NOTICES.md` exists on disk;
  - `006:FR-004 Features lists 001 to 006 with links to their specs`: the Features section contains a link to `specs/00N-…/spec.md` for N from 1 to 6, and the 002 row contains `not built`;
  - `006:FR-011 acknowledges AI assistance`: Acknowledgements mentions `Claude Code` and `Spec Kit`;
  - `006:FR-002 Why this exists states the purpose`: the section contains `Spec Kit`, `AI assistant` and `data-spec` (analyze H1);
  - `006:FR-003 How it was built explains the workflow`: the section links to `.specify/memory/constitution.md`, names each of `specify`, `clarify`, `plan`, `tasks`, `analyze`, `implement` and `converge`, mentions `prompts.md`, and shows a tag example matching `/\b00\d-(specify|plan|tasks|analyze|implement)\b/` (analyze H1);
  - `006:FR-005 Lessons learned is honest and specific`: the section contains each of `001`, `XSS`, `accessibility`, `Close`, `server` and `outage` (case-insensitive), the five lessons from contract item 5 (analyze H1);
  - `006:edge no personal data`: `README.md` and `THIRD_PARTY_NOTICES.md` contain no email address (`/[\w.+-]+@[\w-]+\.[\w.]+/`) (analyze G2).

  Run them and confirm they fail, because `README.md` doesn't exist yet

### Implementation for User Story 1

- [X] T003 [US1] Create `README.md` with the title, summary and badge from contract item 0, and the US1 sections from contract items 1 to 5, 9 and 11. The badge is `[![Quality gate](https://github.com/SammieEtje/my-specdriven-app/actions/workflows/quality-gate.yml/badge.svg)](https://github.com/SammieEtje/my-specdriven-app/actions/workflows/quality-gate.yml)`.
  - **Why this exists:** follows contract item 1.
  - **What you can see:** the board and the trace panel.
  - **How it was built:** the phases, links to `.specify/memory/constitution.md` and `specs/`, the tag pattern `<feature>-<phase>`, the `prompts.md` per feature, and a note that the specs are in Dutch.
  - **Features:** a table with feature, status, outcome and spec. Use the outcome sentences from each spec's summary or plan Summary. 002 is "specified, not built"; 006 is this README and license.
  - **Lessons learned:** at least the five items from contract item 5, each in one or two sentences with a link to the evidence (`specs/004-ci-quality-gates/quickstart.md`, `specs/005-complete-core-flow/quickstart.md`).
  - **Known issues:** the three items from contract item 9.
  - **Acknowledgements:** contract item 11.

  Leave the `Run it`, `Test it`, `Quality gate and contributing` and `License` headings in place with a single line `See below.`, which US2 and US3 replace. Make sure T002 passes, apart from the notices file, which US3 adds
- [X] T004 [US1] Check every factual claim in the US1 sections against its source and fix any mismatch:
  - each feature outcome against its spec or plan;
  - the lessons against `quickstart.md` Results of 004 and 005;
  - the phases against `.specify/memory/constitution.md` "Ontwikkelworkflow";
  - the tags against `git tag`.

  List each checked claim and its source in a short note at the end of `specs/006-readme-and-license/quickstart.md` under "Fact check"

---

## Phase 4: User Story 2 - De demo zelf draaien en controleren (Priority: P1)

**Goal**: A developer can run the demo, run every check, and knows how to contribute.

**Independent Test**: The US2 test passes, and a fresh clone following only the README succeeds (SC-002).

### Tests for User Story 2 ⚠️

- [X] T005 [US2] Add `006:FR-006 every command in Run it and Test it exists` to `readme.test.js`. For each line in the code blocks of those two sections that starts with `npm` or `npx`, it must be one of:
  - `npm ci`;
  - `npm start`;
  - `npm test`;
  - `npx playwright install chromium`;
  - `npm run <name>`, where `<name>` is a key of `package.json` `scripts`.

  Also assert that `Run it` mentions `http://localhost:8000`, and that `Quality gate and contributing` names `code`, `security` and `usability` and contains `pull request` and `branch protection` (FR-007, analyze H1). Run it and confirm it fails

### Implementation for User Story 2

- [X] T006 [US2] In `README.md`, replace the placeholder lines under `Run it`, `Test it` and `Quality gate and contributing` with the content from contract items 6 to 8:
  - **Run it:** prerequisites (Node 24 or newer, Python 3), then `npm ci`, `npm start`, then open `http://localhost:8000`.
  - **Test it:** one command per line with a one-line purpose each: `npm test`, `npm run lint`, `npm run format:check`, `npm run lint:security`, `npx playwright install chromium` (once) and `npm run test:e2e`.
  - **Quality gate and contributing:** the three required checks and what each runs (from `specs/004-ci-quality-gates/contracts/quality-gate.md`); branch protection on `main` that applies to admins; the flow (branch, Spec Kit phases, PR, three green checks, merge).

  Make sure T005 passes
- [X] T007 [US2] Fresh-clone check (SC-002): `git clone` the local repository into the scratchpad directory, follow only the README's "Run it" and "Test it" steps, and record the outcome of each step under "Fresh clone" in `specs/006-readme-and-license/quickstart.md`. If a step fails, fix the README, not the environment

---

## Phase 5: User Story 3 - Weten wat ik mag (Priority: P1)

**Goal**: The repository has a license GitHub recognises, and every third-party part is credited with its license. The trademarks are excluded.

**Independent Test**: The US3 tests pass, and after merging, GitHub reports `MIT` (SC-003).

### Tests for User Story 3 ⚠️

- [X] T008 [P] [US3] Add to `readme.test.js`:
  - `006:FR-008 LICENSE is the MIT license for Sander Ettema`: the first line is `MIT License`; it contains `Copyright (c) 2026 Sander Ettema`; and it contains the MIT sentences `Permission is hereby granted, free of charge` and `THE SOFTWARE IS PROVIDED "AS IS"`;
  - `006:FR-009 third-party notices cover every external component`: `THIRD_PARTY_NOTICES.md` contains `IBM Plex`, `OFL-1.1`, a link to `fonts/OFL.txt`, `Spec Kit`, `Copyright GitHub, Inc.`, `.specify/` and `Polderworks design system`, and every path it names exists;
  - `006:FR-010 trademarks are excluded`: both the README `License` section and the notices file contain `Polderworks` and `Loods` in a sentence with `trademark`.

  Confirm they fail

### Implementation for User Story 3

- [X] T009 [P] [US3] Create `LICENSE` with the standard MIT License text, exactly as published by the OSI (data-model: "byte-for-byte … apart from the copyright line"), with the line `Copyright (c) 2026 Sander Ettema`. Add no other text (research R1)
- [X] T010 [P] [US3] Create `THIRD_PARTY_NOTICES.md` per data-model "THIRD_PARTY_NOTICES.md". Give each entry the fields Name, Paths, Origin, License, Copyright and License text:
  - IBM Plex: points to `fonts/OFL.txt`;
  - Spec Kit (version 1.0.11): origin `https://github.com/github/spec-kit`, with the full MIT text inline and `Copyright GitHub, Inc.`;
  - Polderworks design system: MIT through `LICENSE`, plus the trademark paragraph (research R3);
  - Development tools: "not redistributed; installed from npm into the git-ignored `node_modules/`", with license families.
- [X] T011 [US3] In `README.md`, replace the placeholder under `License` with:
  - one line linking to `LICENSE` (MIT);
  - one line linking to `THIRD_PARTY_NOTICES.md`;
  - the trademark paragraph from research R3.

  Make sure T008 passes, along with every earlier `readme.test.js` test

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T012 Run `npm run format`, then `npm test`, `npm run lint`, `npm run format:check` and `npm run lint:security`. All must pass. `npm run test:e2e` is unaffected, but run it once to confirm
- [X] T013 Check every external `https://` link in `README.md` and `THIRD_PARTY_NOTICES.md` with `curl -sIL -o /dev/null -w '%{http_code}'`. Each must return 200; the badge URL may return 200 or 404 until the PR is merged. Record the results under "Links" in `specs/006-readme-and-license/quickstart.md`
- [X] T017 Reader test (SC-001, analyze G1): ask someone new to the repository (or the owner as a stand-in, noted as such) to read only `README.md` for at most 3 minutes, then state in their own words what the repository is and why it exists. Record the answer, the reader type and whether it matches FR-002 under "Reader test" in `specs/006-readme-and-license/quickstart.md`. If it doesn't match, improve `Why this exists` and repeat. Run this before T014 (it is numbered T017 because it was added after analysis)
- [X] T014 Append `## Phase: implement` to `specs/006-readme-and-license/prompts.md`, commit and tag `006-implement`
- [X] T015 **After confirmation**: push `006-readme-and-license` with its tags and open a PR to `main`. The three checks must be green
- [X] T016 After the PR is merged: run `gh api repos/SammieEtje/my-specdriven-app --jq .license.spdx_id` and check that it prints `MIT` (SC-003). `main` is protected, so record the result in `specs/006-readme-and-license/quickstart.md` in the first commit of the next feature branch, and mention it in that feature's `prompts.md`. That way it still lands in a phase commit (analyze U1)

---

## Dependencies & Execution Order

- **T001** comes first.
- **README.md, in sequence**: T002 → T003 → T004, then T005 → T006 → T007, then T011.
- **US3 files, in parallel with US1 and US2**: T008, T009 and T010 can run any time after T001; T011 needs T003.
- **Polish**: after all stories, in the order T012, T013, T017, T014, T015, T016. T015 needs your confirmation, and T016 runs after the merge.

## Parallel Example: User Story 3

```bash
Task: "LICENSE with the MIT text"   # T009
Task: "THIRD_PARTY_NOTICES.md"      # T010
```

## Implementation Strategy

1. **MVP**: T001 to T004 give a README that explains what and why.
2. US2 makes it runnable, and US3 makes reuse lawful.
3. Polish: checks, link check, then the PR. GitHub shows MIT once it is merged.
