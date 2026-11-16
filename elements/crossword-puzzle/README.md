# crossword-puzzle

A crossword made from a list of words and clues. The author writes the words; the grid is generated, never placed by hand. Learners type one letter per square and check their answer. It is a graded question: it extends `QuestionElement` from `@haxtheweb/multiple-choice`, so attempts, Check answer, Try again, feedback slots, stacking, the learner record and xAPI work the way they do in the other HAX question types.

```html
<crossword-puzzle question="Web basics mini" max-attempts="3">
  <input value="HTML" data-clue="Markup language of the web" />
  <input value="HREF" data-clue="Attribute that holds a link's destination" />
  <input value="LINK" data-clue="Element that loads a stylesheet" />
  <input value="FORK" data-clue="Copy a repo to your own account" />
  <p slot="hint">Three of the four start in a corner.</p>
</crossword-puzzle>
```

## Content

Each word is a light DOM `<input>`: `value` is the word and `data-clue` is its clue. The inputs are read once and removed (as in every question type) so the answers are not sitting in the page; HAX writes them back on save.

Spaces, hyphens and punctuation are left out of the grid, case does not matter, and an accented or non-Latin letter is one square (`É`, `Ł`, `語`). Learners type the same letter the author wrote: `E` does not match `É`.

## How the grid is made

`lib/crossword-layout.js` exports `crosswordLayout(words)`, a pure function with no randomness: the same words in the same order always give the same grid.

1. The longest word goes first, across.
2. Every other word, longest first, is tried on each letter it shares with the grid, across and down. A place is legal only when the word crosses a word going the other way and touches nothing else.
3. Among legal places it takes the one with the most crossings, then the smallest grid, then the narrowest.
4. Words with no legal place are tried again once the others are down, and reported as `unplaced` if they still do not fit.
5. Squares are numbered in reading order. Clue order is across by number, then down by number.

Limits keep it fast: 24 words, 16 letters a word, at least 2 letters. In the HAX editor the element shows the answer key and lists the words left out, with the reason, so the author can change them. Learners just do not see those words.

## Attributes

| Attribute | Property | Notes |
| --- | --- | --- |
| `question` | `question` | Title shown above the grid. |
| `max-attempts` | `maxAttempts` | Checks allowed. `0` (default) is unlimited. |
| `accent-color` | `accentColor` | Optional color name (`blue`, `teal`, `green`, ...) for the chip, active word and buttons. Without it the page palette is used. |
| `collapsible`, `collapsed` | same | Stacking, as in every question type. |
| `quiz-name` | `quizName` | Name used in learner data. |

`answers` (property only) is the list `[{ label, clue }]` read from the inputs.

## Slots

`content` (related content), `hint`, `feedbackIncorrect`, `feedbackCorrect`, `evidence`: the `QuestionElement` feedback slots.

## Events

- `user-engagement`: after each check; `detail.statement` is the xAPI statement.
- `question-element-state`: after each check, with status, attempts and the letters typed.
- `learner-progress-request` (on `window`): asks for a saved record when the page loads.

## xAPI

One `answered` statement per check, interaction type `fill-in`.

- `result.response`: the word typed for each clue, in clue order, joined by `[,]`. An empty square inside a word is `_`; a word with nothing typed is empty.
- `object.definition.correctResponsesPattern`: the words in the same order.
- `result.score`: correct words out of words in the grid.
- `result.success`: every word correct. `result.completion`: solved, or attempts used up.

The saved response puts the learner's letters back on a later visit. A response for a different set of clues is ignored. Nothing is checked or sent while HAX is editing.

## Keyboard

The grid is one tab stop.

| Key | What it does |
| --- | --- |
| A letter or digit | Fills the square and moves to the next square of the word |
| Arrow keys | Move to the next square that way, stepping over black squares |
| Space | Switch between across and down on a square that has both |
| Backspace | Clear the square; on an empty square, go back one and clear that |
| Delete | Clear the square |
| Home / End | First / last square of the word |

Selecting a square that is already active also switches direction. Selecting a clue moves to the first square of its word.

## Accessibility

- Every square is a text field named for its place: "1 across, letter 2 of 4; 1 down, letter 1 of 4". After a check the name also says Correct, Incorrect or Missing.
- The clue for the active word is shown above the grid and announced when the word changes.
- After a check each square carries its status as line style, color, an icon and the word (title and accessible name): correct is solid, incorrect is dotted, an empty square is Missing, not Incorrect. The active word highlight is decoration only.
- Squares shrink with the page down to 24px. Clues move under the grid on narrow screens. A grid too wide for the page scrolls inside its own box.
- One character per square on phone keyboards: no autocorrect, autocomplete or spell check.

## Styling

`--ddd-component-crossword-puzzle-tint` (active word and clue) and `--ddd-component-crossword-puzzle-line` (square borders) can be set from outside. Status colors come from the `--ddd-status-*` tokens.

# Credits

A brighter future dreamed and developed by the Penn State [HAXTheWeb](https://hax.psu.edu/) initiative.
