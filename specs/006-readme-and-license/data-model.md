# Data Model: README en licentie

## LICENSE

The standard MIT License text, byte-for-byte as published by the OSI, apart from the copyright
line: `Copyright (c) 2026 Sander Ettema`. There are no additional clauses (research R1).

## THIRD_PARTY_NOTICES.md

One entry per external component, each with these fields:

| Field | Rule |
|-------|------|
| Name | the component's own name |
| Paths | the repository paths it covers |
| Origin | the upstream project or URL |
| License | the SPDX identifier and full name |
| Copyright | as stated upstream |
| License text | a path in the repository, or the full text inline |

**Entries**:

| Name | Paths | License | Copyright | License text |
|------|-------|---------|-----------|--------------|
| IBM Plex Sans and Mono | `fonts/*.woff2` | OFL-1.1 | © 2017 IBM Corp., Reserved Font Name "Plex" | `fonts/OFL.txt` |
| Spec Kit (version 1.0.11) | `.specify/`, `.claude/skills/speckit-*` | MIT | GitHub, Inc. | inline |
| Polderworks design system | `.claude/skills/polderworks-design/` | MIT (this repository) | Sander Ettema | `LICENSE` + trademark notice |
| Development tools | `node_modules/` (not in the repository) | various (MIT, Apache-2.0, MPL-2.0) | their authors | not redistributed |

## README.md

The sections and their required content are in `contracts/readme-outline.md`.
