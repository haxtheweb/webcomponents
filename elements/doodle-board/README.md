# &lt;doodle-board&gt;

Draw a picture, mark up an image with feedback, or collect a signature. One element, three modes.

```html
<script type="module">
  import "@haxtheweb/doodle-board/doodle-board.js";
</script>

<!-- a picture made in HAX -->
<doodle-board
  mode="draw"
  drawing="data:image/png;base64,..."
  alt="..."
></doodle-board>

<!-- feedback: marks over a student's submission -->
<doodle-board
  mode="feedback"
  src="submission.png"
  drawing="data:image/png;base64,..."
  alt="..."
></doodle-board>

<!-- visitors draw on the published page and download their picture -->
<doodle-board mode="draw" interactive></doodle-board>

<!-- the editor on its own, e.g. a signature pad in a form -->
<doodle-board-canvas mode="signature" downloadable></doodle-board-canvas>
```

## Elements

| Element               | Use                                                                                                                                   |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `doodle-board`        | HAX-capable display. Shows `src` with the `drawing` layer on top, or the editor when `interactive`.                                   |
| `doodle-board-canvas` | The editor: pen, highlighter, eraser, line, arrow, box, circle, text, fill; size, opacity and DDD colors; undo/redo; clear; download. |
| `doodle-board-field`  | The `doodle` input method for HAX settings: a preview with Edit drawing, which opens the editor in a dialog.                          |

## Modes

| `mode`      | Tools                                                                     | Default ink    |
| ----------- | ------------------------------------------------------------------------- | -------------- |
| `draw`      | all, including fill                                                       | beaverBlue     |
| `feedback`  | all but fill                                                              | original87Pink |
| `signature` | pen (follows pen pressure) and eraser; a sign-here line that is not saved | nittanyNavy    |

## How the drawing is stored

`drawing` (and `doodle-board-canvas` `value`) is a transparent PNG data URL holding only the marks. The background stays in `src`, so the submission can be replaced or re-uploaded without losing feedback. `download()` combines them: background (or white paper, except in signature mode), then marks.

## doodle-board-canvas API

| Member                                     |                                                                                                        |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| `getValue()`                               | marks as a PNG data URL, `""` when empty                                                               |
| `toBlob()`                                 | resolves `{ blob, layerOnly }`; `layerOnly` is true when a cross-site background could not be combined |
| `download()`                               | fires cancelable `doodle-board-download` `{ blob, filename }`, then saves with a link unless cancelled |
| `clear()`, `undo()`, `redo()`, `isEmpty()` |                                                                                                        |
| `dirty`                                    | true after any change since the value was loaded                                                       |
| `background-upload`                        | shows Image, to draw over a local image (fires `doodle-board-background` `{ src }`)                    |
| `downloadable`                             | shows Download                                                                                         |

Keyboard: <kbd>Ctrl</kbd>+<kbd>Z</kbd> undo, <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd> redo, <kbd>[</kbd> <kbd>]</kbd> size. Hold <kbd>Shift</kbd> for squares, circles and 45° lines.

## HAX input method

`HAXFields.js` maps `inputMethod: "doodle"` to `doodle-board-field`. A setting can point it at sibling settings so the editor opens over the right background in the right mode:

```json
{
  "property": "drawing",
  "title": "Drawing",
  "inputMethod": "doodle",
  "backgroundProperty": "src",
  "modeProperty": "mode"
}
```

Any element can use the input method for an image-valued property, e.g. a signature on a certificate.
