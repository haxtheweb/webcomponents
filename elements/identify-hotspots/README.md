# identify-hotspots

A graded "find the hotspot" activity: the learner finds the right spots on an image. It is the assessed counterpart to the informational `lrndesign-imagemap`. It extends `QuestionElement`, so the block frame, directions toggle, attempts, feedback slots, learner-record restore and xAPI plumbing are the same as every other HAX question.

## Usage

```html
<identify-hotspots
  question="Spot the three hazards"
  media-title="Workshop floor"
  src="workshop.svg"
  alt="A workshop: a workbench with a power tool on the left, an outlet above a puddle in the middle, a heater and a paint can on the right."
  max-misses="4"
>
  <input type="checkbox" value="Frayed power cord" data-correct="true"
    data-x="25.5" data-y="56.4" data-width="11" data-height="12.8" />
  <input type="checkbox" value="Water by the outlet" data-correct="true"
    data-x="43" data-y="69.2" data-width="22" data-height="17.6" />
  <input type="checkbox" value="Workbench"
    data-x="5" data-y="44" data-width="38" data-height="11" />
</identify-hotspots>
```

Each `<input>` is one named region. `data-x`, `data-y`, `data-width` and `data-height` are percentages of the image, measured from its top left corner; the region is the ellipse inscribed in that box. `data-correct="true"` makes it a hotspot to find; without it the region is a named decoy. The number to find is the number of hotspots. The inputs are read once and removed, like every question's answer key.

## How it works

- A click, tap or keyboard probe on a hotspot not found yet marks it found (numbered marker, announced by name).
- Anything else is a miss: empty space, a decoy (announced by its name) or a hotspot already found. A cross marks where it landed.
- The attempt ends when every hotspot is found or `max-misses` is used up. With `max-misses="0"` misses are unlimited and a **Finish** button ends the attempt.
- When an attempt ends short, **Show what I missed** outlines the rest with the revealed status (dashed), never the incorrect one.

## Attributes

| Attribute | Property | Default | What it is |
|---|---|---|---|
| `src` | `src` | `""` | Image to search. `http(s)`, relative and `data:image/` addresses only. |
| `alt` | `alt` | `""` | Text alternative of the image (required). Never shown as the title. |
| `media-title` | `mediaTitle` | `""` | Visible title above the image. |
| `question` | `question` | `""` | What the learner is asked to find. |
| `max-misses` | `maxMisses` | `4` | Misses that end an attempt; `0` = unlimited. |
| `max-attempts` | `maxAttempts` | `0` | Attempts allowed; `0` = unlimited. |
| | `answers` | `[]` | The regions: `{ label, correct, x, y, width, height }`. |

`collapsible`, `collapsed`, `quiz-name`, `disabled` and the OER Schema attributes come from `QuestionElement`.

## Slots

`content` (related content), `feedbackCorrect`, `feedbackIncorrect`, `hint`, `evidence`: the `QuestionElement` feedback slots.

## Methods

- `probe(x, y)`: probe at a point in percent of the image, as a click does. Returns a promise that resolves once an attempt it ended has been checked.

## Events

- `user-engagement` (bubbles, composed): once per finished attempt. `detail: { activityDisplay: "answered", objectName, resultSuccess, statement }`.
- `question-element-state`: from `QuestionElement`, after each finished attempt.

## xAPI

One `answered` statement per finished attempt, as a `choice` interaction:

- `object.definition.choices`: every region (hotspots and decoys), id = `c-` + hash of its name.
- `correctResponsesPattern`: the hotspot ids joined by `[,]`.
- `result.response`: ids of the hotspots found (never names), joined by `[,]`.
- `result.score`: `raw` = found, `max` = hotspots to find.
- `result.extensions`: attempts and max attempts. The number of misses is not recorded.

Nothing is sent while HAX is editing. On a return visit the hotspots found come back from the saved response (unknown ids are ignored); where the misses landed is not part of the record.

## Keyboard and accessibility

- The picture is a single tab stop. Hidden hotspots are never tab stops, which would give the answers away.
- Arrow keys move a crosshair 2% of the image; with Shift, 10%. Enter or Space probes at the crosshair.
- Every probe is announced through a live region that is also visible under the picture, and found and revealed hotspots are listed there by name.
- The crosshair is drawn with a dark and a light stroke so it shows on any picture in light and dark mode, and uses system colors under forced colors.
- Found, miss and revealed each have their own color, line style (solid, dotted, dashed), icon and word. The palette accent is only used by the header chip and the buttons.
- Positions are percentages, so marks stay in place at any width.

## Editing in HAX

Configure: image, alternative text, title, question and the answers (name, left, top, width, height, hotspot or decoy). Advanced: attempts and misses allowed. While editing, every region is outlined on the image with its name so the numbers can be checked by eye.

Style hook: `--identify-hotspots-image-max-width` limits how wide the image grows (default 100%).
