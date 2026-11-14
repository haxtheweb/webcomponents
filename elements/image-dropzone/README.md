# image-dropzone

A graded activity: the learner places text labels onto zones laid over an image, then checks. It extends `QuestionElement` (`@haxtheweb/multiple-choice/lib/QuestionElement.js`), so attempts, the block frame, feedback slots, stacking, learner-record restore and xAPI plumbing are the same as the other question types.

## Usage

```html
<image-dropzone
  src="files/page-wireframe.svg"
  alt="Wireframe of a web page with five empty regions"
  media-title="Page wireframe"
  question="Label the page regions"
  max-attempts="3"
>
  <input type="checkbox" value="header" data-zone="Top band" data-x="3" data-y="12.3" data-width="94" data-height="13.8" />
  <input type="checkbox" value="footer" data-zone="Bottom band" data-x="3" data-y="84.6" data-width="94" data-height="11.5" />
  <input type="checkbox" value="section" />
  <p slot="caption">A common page layout.</p>
</image-dropzone>
```

Each `<input>` is one label. A label with `data-zone` is correct on that zone; a label without it is a distractor. One label per zone and one zone per label. The inputs are read once and removed from the page so the key is not left in the document; HAX writes them back when it saves.

## Attributes

| Attribute | Property | What it does |
|---|---|---|
| `src` | `src` | Image the zones sit on. `http(s)`, a relative path or an inline `data:image/...`; anything else is not rendered. Required. |
| `alt` | `alt` | Alternative text of the image. Required. Never shown as the title. |
| `media-title` | `mediaTitle` | Visible title above the image. |
| `question` | `question` | What the learner is asked to do. |
| `max-attempts` | `maxAttempts` | Checks allowed; `0` is unlimited. |
| `randomize` | `randomize` | Shuffle the labels in the bank. |
| `collapsible`, `collapsed`, `quiz-name`, `disabled`, `hide-buttons`, OER fields | | Inherited from `QuestionElement`. |

Per label (`<input>` attributes, or items of the `answers` property): `value` / `label`, `data-zone` / `zone` (the zone's name for screen readers; describe where it is, not what goes there), and `data-x`, `data-y`, `data-width`, `data-height` / `x`, `y`, `width`, `height` as percentages of the image. Numbers are kept on the image (a zone with a name and no size gets 20 by 15).

## Slots

`caption` (below the image, only when filled), plus the `QuestionElement` slots: `content`, `feedbackCorrect`, `feedbackIncorrect`, `hint`, `evidence`.

## Events

- `user-engagement` (bubbles, composed) after each check: `{ activityDisplay, objectName, resultSuccess, statement }`.
- `question-element-state` (bubbles, composed) after each check.
- `learner-progress-request` on `window` when the visitor view loads.

## xAPI

One `answered` statement per check, interaction type `matching`: `source` is every label (distractors too), `target` is the zones, and `result.response` and `correctResponsesPattern` are `labelId[.]zoneId` pairs joined with `[,]`. Ids are component ids (`c-` plus 8 hex of the label text or zone name), so reordering keeps them and rewording changes only that one. Score is correct zones out of zones. A check before every zone is filled shows a message and is neither an attempt nor a statement. Nothing is sent while HAX is editing.

## Keyboard and accessibility

- Tap or click is the main path: select a label to pick it up, select a zone to place it, select a placed label to send it back. Mouse drag and drop does the same on top of that (labels to zones, zone to zone, zone back to the bank).
- Keyboard: Enter or Space on a label picks it up and moves focus to the first empty zone; Tab moves between zones; Enter places it and moves focus to the next label still in the bank; Escape puts a held label back and returns focus to it.
- Zones are buttons named by the authored zone name plus what they hold ("Top band: empty", "Top band: header"). Every move is spoken through a polite live region.
- Zones stay quiet until a label is held; then their outline and fill take the palette marker and tint. The held label and the action buttons take the palette accent. Results never do: a correct zone is green with a solid line, a check icon and the word; an incorrect one is purple with a dotted line, a cross icon and the word, and the same results are listed in words under the image.
- Zones are placed in percentages, so they hold at any width; every target is at least 24px.
- In HAX edit mode the activity is replaced by an author view: every zone outlined with its name and label, and extra labels marked.

## Development

`yarn test` in this folder runs the tests in headless Chromium; `yarn run build` refreshes `custom-elements.json` and `lib/image-dropzone.docs.json`.
