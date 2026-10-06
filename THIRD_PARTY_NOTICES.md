# Third-party notices

This repository contains material that comes from, or is based on, other projects. This file lists each one, where it
comes from and under which terms it is used. Everything else in this repository is covered by the MIT license in
[LICENSE](LICENSE).

## IBM Plex Sans and IBM Plex Mono

- **Paths**: `fonts/*.woff2` (Latin-1 subset of Regular, Medium and SemiBold)
- **Origin**: the IBM Plex typeface family, from the official `@ibm/plex-sans` 1.1.0 and `@ibm/plex-mono` 2.5.0
  packages ([IBM Plex on GitHub](https://github.com/IBM/plex))
- **License**: SIL Open Font License 1.1 (OFL-1.1)
- **Copyright**: Copyright © 2017 IBM Corp. with Reserved Font Name "Plex"
- **License text**: [fonts/OFL.txt](fonts/OFL.txt)

## Spec Kit

- **Paths**: `.specify/` (templates, scripts and workflow configuration) and `.claude/skills/speckit-*` (the
  `/speckit-*` assistant commands)
- **Origin**: [GitHub Spec Kit](https://github.com/github/spec-kit), version 1.0.11, generated into this repository by its
  setup command
- **License**: MIT
- **Copyright**: Copyright GitHub, Inc.
- **License text**:

```text
MIT License

Copyright GitHub, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

Files under `.specify/memory/` (the project constitution) and the feature specifications under `specs/` were written for
this project and are covered by [LICENSE](LICENSE).

## Polderworks design system

- **Paths**: `.claude/skills/polderworks-design/` (design tokens, component bundle and guidelines)
- **Origin**: the design system of Polderworks, a venture of the repository owner
- **License**: MIT, as part of this repository ([LICENSE](LICENSE))
- **Copyright**: Copyright (c) 2026 Sander Ettema
- **Trademarks**: "Polderworks" and "Loods" are trademarks of the owner's ventures. The MIT license covers the code,
  design tokens and documentation, but it grants no right to use the names Polderworks or Loods, or their brand identity,
  in a way that suggests affiliation or endorsement.

The component bundle refers to React as an external global; it does not include React itself.

## Development tools (not redistributed)

The tests and checks use tools that `npm ci` installs into `node_modules/`, which is not part of this repository. They
are not redistributed here and keep their own licenses: ESLint (MIT) with eslint-plugin-no-unsanitized (MPL-2.0) and the eslint-comments plugin (MIT), Prettier (MIT), Playwright
(Apache-2.0), axe-core (MPL-2.0) and its Playwright integration (MPL-2.0), and globals (MIT). The GitHub Actions used by
the quality gate are pinned in `.github/workflows/quality-gate.yml` and run on GitHub; they are not included here either.
