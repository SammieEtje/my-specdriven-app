# Quickstart: validate feature 003 (Polderworks-designsysteem adopteren)

Manual checks that complement `npm test` (`logic.test.js` and `design.test.js`). Run them after each
user story and once more in the polish phase (T040). Check a box when the step passes.

## Start

1. Run `npm start` from the repository root.
2. Open `http://localhost:8000`.

## 1. Keyboard-only core flow (SC-004, FR-007, constitution IV)

Without touching the mouse, confirm a visible solid teal focus ring at every step:

- [x] Tab to the header and press Enter: the trace panel shows `spec-10`.
- [x] Tab to the task input, then to **Add task**, and press Enter: the trace panel shows `spec-01`. (Add task only updates the trace; it has never created a task since 001, and this feature does not change that.)
- [x] Tab to a task checkbox and press Space: the title gets a strike-through and the meta line ends in `Completed`.
- [x] Tab through the three filters and press Enter on **Active**: it shows the underline and bold text, and the trace panel updates.
- [x] Tab to **Open** and press Enter: the dialog opens with focus in the Title field.
- [x] Edit the title: the task row updates while you type.
- [x] Press Escape: the dialog closes and focus returns to the **Open** button.

## 2. Mouse states (FR-005, US2)

- [x] Hovering **Add task** moves it from navy to teal, with no shadow, lift or animation.
- [x] Hovering **Open** and **Close** darkens the border from slate to navy. The hover fill (`--surface-sunken`) is the same Ice as the card, so on a card it is not visible; this matches the design-system Button.
- [x] Hovering **Persist demo state** turns the teal text navy.
- [x] Clicking any element gives it a dashed navy outline (traced element), clearly different from the solid teal focus ring.

## 3. Offline (SC-005, FR-011)

- [x] With every non-localhost request blocked, the page renders in IBM Plex and is usable in well under 2 seconds (measured 39 ms on localhost).
- [x] With network back on, the Network tab shows no request to any origin other than `localhost:8000`.

## 4. Layout and edge cases

- [x] At a 360px-wide viewport the panels stack and there is no horizontal scroll.
- [x] With the OS set to dark mode, the page stays light and fully readable (R3).
- [x] Give a task a title and owner of 80+ characters: they wrap inside the row and the dialog, with no overflow.

## 5. Design-system comparison (SC-006)

Compare each control with its pattern in `.claude/skills/polderworks-design/_ds_bundle.js`:

- [x] **Add task**: Button primary. **Open** and **Close**: Button secondary. **Persist demo state**: Button ghost.
- [x] Filters: Tabs (navy underline instead of gold, per R4).
- [x] Task input, dialog fields: Input. Checkbox: Checkbox (native, navy accent).
- [x] "7 specs" badge and task tag: Tag (neutral).
- [x] "Live trace enabled": StatusBadge (green dot, navy text).
- [x] Task dialog: Dialog. Trace object: CodeBlock (light). Highlighted phase: Callout.

## Results (T040, 2026-10-03)

Run in headless Chrome against `python3 -m http.server`. Keyboard steps were driven with real key
presses, and states were read from computed styles. The SC-006 comparison was done visually from
screenshots. One problem was found and fixed: at 360px the task title was squeezed beside its tag
and Open button. The actions now wrap onto their own line. Escape returns focus to the Open
button. In the committed baseline from before this feature, focus fell back to `<body>`.
