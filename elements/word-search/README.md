# word-search

A word search: a letter grid with hidden words. The learner taps the first letter of a word, then its last letter.

```html
<word-search title="Find six web words">
  <ul>
    <li>HTML</li>
    <li>CSS</li>
    <li>DOM</li>
    <li>SLOT</li>
    <li>ARIA</li>
    <li>LIT</li>
  </ul>
</word-search>
```

## What it practices, and what it does not

Be honest with yourself before you add one.

- It practices **recognising how a term is spelled**: the learner looks at each term several times while scanning for it. That has some value for new vocabulary, names and spelling in a first or second language.
- It does **not** practice what a term means, when to use it, or how it relates to other terms. Finding "ARIA" in a grid says nothing about whether the learner knows what ARIA is. For meaning, use a matching question, `memory-match` with term and meaning pairs, a self check or a short answer question.
- It is a visual scanning task. See "Screen readers" below: it can be completed without sight, but that is slow and is not the same activity.

It is ungraded. Nothing is right or wrong; a word is found or not found yet. Use it as a warm up or a break, not as evidence of learning.

## How the grid is made

The words are the only content. The grid is generated from them in the browser:

- The generator is seeded from a hash of the word list and the options (no `Math.random`), so the same words give every learner, and every reload, the same grid. Changing a word, the size or a direction option makes a new grid.
- Words are upper cased by the rules of the page language (the nearest `lang` attribute) and split into user perceived characters, so accented letters and letters with combining marks take one cell. Spaces and punctuation are left out (`web component` is hidden as `WEBCOMPONENT`; the list still shows what the author wrote).
- Empty cells are filled with letters taken from the words themselves, so the grid stays in the alphabet of the content.
- A word that can not be placed (longer than the grid, a single letter, or no room left) is listed in the block while editing in HAX and is left out for learners. A repeated word is used once.
- Filler letters can spell things by accident. Check the grid before you publish, as you would any generated puzzle.

## Attributes and properties

| Attribute | Property | Type | Default | What it does |
| --- | --- | --- | --- | --- |
| `title` | `title` | String | `""` | Visible title in the block header. |
| | `words` | Array of `{ word }` | from light DOM | The words. Read from the `<li>` elements; setting it (the HAX form does) rewrites that list. Never saved as an attribute. |
| `size` | `size` | Number | empty | Letters per side, 4 to 16. Empty fits the longest word, between 6 and 12. More than 12 scrolls sideways inside the block on a phone. |
| `diagonal` | `diagonal` | Boolean | `false` | Also hide words diagonally. |
| `backwards` | `backwards` | Boolean | `false` | Also hide words written backwards. |
| `accent-color` | `accentColor` | String | `""` | Optional accent for the header chip, the chosen first letter and the button. The names `DDDAccent` maps (`blue`, `teal`, `purple`, ...). |
| `id` / `resource` | | String | | Either one keys the learner record. Without them the key is a hash of the title and the words. |

## Content (light DOM)

One `<li>` per word, in a `<ul>` or `<ol>`. It is not slotted and it is never changed by the element, so what is saved is exactly what was authored. Without JavaScript the page shows the plain word list.

## Methods

- `selectCell(row, col)`: what a tap does (first call sets the start, second the end).
- `startOver()`: clear the found words.
- `restoreLearnerResponse(response)` / `forgetLearnerResponse()`: show the words of a saved response as found, or forget them.

## Events

| Event | When | Detail |
| --- | --- | --- |
| `user-engagement` | A word is found (`progressed`); every word is found (`completed`, once per visit). Bubbles, composed. Never while HAX is editing. | `{ activityDisplay, objectName, resultCompletion, statement }` |
| `learner-progress-request` | On `window`, when the visitor view loads and when a `learner-progress-ready` event is heard. | `{ activityId, tag, record }`; a listener sets `record` and the ids in `record.response` are shown as found. |

It also listens for `learner-progress-cleared` on `window` and clears itself.

## xAPI

| | |
| --- | --- |
| Verbs | `progressed`, `completed` |
| Activity type | `http://adlnet.gov/expapi/activities/simulation` |
| `result.response` | Ids of the words found so far, joined by `[,]`. An id is `c-` plus 8 hex of the word as it is in the grid; never the text. |
| `result.completion` | `true` when every word is found. |
| `result.score` | On `completed`: `raw` = words found, `max` = words in the grid. |
| `result.extensions` | `https://haxtheweb.org/xapi/extensions/progress` = found / total. |
| Counts toward completion | Yes. Done = every word found. |

## Styling

Colours come from DDD tokens and follow dark mode. The header chip, the edge of the chosen first letter and the Start over button take the palette roles (`--ddd-palette-chip`, `--ddd-palette-marker`, `--ddd-palette-tint`, `--ddd-palette-accent`), then `accent-color` on the element.

Found words use the DDD chart series colours (`--ddd-chart-1` to `--ddd-chart-8`) as a border and a light fill. Colour is never the only key: every word has a number in the list, the same number is on each of its cells, and the word is struck through. Finding a word is not "correct", so the green correct status is only used for the finished state in the footer.

## Keyboard

The grid is one tab stop.

| Key | Action |
| --- | --- |
| Arrow keys | Move one letter. |
| Home / End | First / last letter of the row. |
| Enter or Space | Choose the first letter, then the last letter. |
| Escape | Clear the first letter. |

Either end of a word can be chosen first. A mouse or pen can also drag from one end to the other. Touch always uses two taps, so the page can still scroll.

## Screen readers

- The grid is an ARIA grid: a screen reader reads each letter with its row and column. A found letter reads "found, word 2"; the chosen first letter reads "start" and is `aria-selected`.
- Every action is spoken through a status region that is also visible in the footer: "Start at H, row 1 column 1. Now choose the last letter.", "Found HTML.", "No word there.", "Start cleared.".
- The word list reads each word with its number and "found" when it is.
- This makes the activity operable, not equivalent. Finding a word without sight means reading the grid letter by letter and holding it in memory, which is far more work than the visual task and practices something different. If the page needs every learner to get the same practice, pair it with, or replace it by, an activity about the same terms that does not depend on scanning.

## Phone width

Cells are never smaller than 24px. Up to 12 letters per side fit a 360px screen; larger grids scroll sideways inside the block and the page itself does not scroll sideways.

## Motion

None, except the shared completion burst on the header chip the first time the puzzle is finished. Nothing moves with reduced motion.
