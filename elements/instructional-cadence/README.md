# instructional-cadence

Shows a course's pacing as music. Each lesson is one measure and each page is one beat, so a nine-page lesson is a bar of 9/4. The score is engraved and played with [`sheet-music`](../sheet-music).

Built for the HAXcms Site Insights stats dashboard. See [haxtheweb/issues#3045](https://github.com/haxtheweb/issues/issues/3045).

## What it measures

The element measures flow, not intensity. A light page is never marked down for being light. Each lesson is checked for five parts:

| Part | Passes when |
| --- | --- |
| Setup | The first page is no heavier than the lesson's typical (median) page. |
| Dance | The middle pages before the peak move up and down, with no empty pages. |
| Peak | The heaviest page lands 35 to 90% of the way through, at least 1.25 times the lesson median. |
| Follow-up | The page after the peak is at least 30% lighter. |
| Recap | The last page is 0.6 to 1.6 times the lesson median. |

A lesson's flow is the number of parts present, out of 5. Course flow is the share of all parts present across lessons.

Page weight is minutes of learner effort, taken from the Site Insights `content` report row:

| Field | Weight |
| --- | --- |
| `readTime` | 1 per minute |
| `images` | 0.4 each |
| `videos` | 2 each |
| `audio` | 1 each |
| `selfChecks` | 0.6 each |
| `h5p` | 1 each |

A video counts as an activity to engage with. Its length is ignored, because a very long video is not more helpful.

A **lesson** is any page whose child pages have no children of their own. The parent page is the first beat (the setup), followed by its children in outline order.

## In the score

- **Density:** a page's weight against the course median sets how its beat divides: a rest, a quarter note, two eighths, or four sixteenths.
- **Pitch:** pitch follows the page's role in the lesson.
- **Resolution:** the recap resolves to the home note only when the recap check passes, so a well-built lesson sounds finished.

## Usage

```html
<instructional-cadence course-title="My course"></instructional-cadence>
<script type="module">
  const el = document.querySelector("instructional-cadence");
  el.items = manifestItems; // JSON Outline Schema items: id, parent, title, slug, order
  el.rows = contentRows; // Site Insights content report rows: id, readTime, images, videos, ...
</script>
```

| Property | Attribute | Description |
| --- | --- | --- |
| `items` | | Outline items. |
| `rows` | | Content report rows, matched to items by `id`. |
| `courseTitle` | `course-title` | Title on the engraved score. |
| `basePath` | `base-path` | Prefix for the page links on missing parts. |
| `hideScore` | `hide-score` | Show the summary only, without `sheet-music`. |

The scoring lives in `lib/cadence-model.js`. Its functions are pure (`analyzeCadence`, `lessonShape`, `pageWeight`, `buildLessons`, `cadenceToAlphaTex`), so other tools can reuse them.

## Commands

- `npm start`: development server
- `npm run build`: format, analyze and write docs data
- `npm run test`: run tests

# Credits

A brighter future dreamed and developed by the Penn State [HAXTheWeb](https://hax.psu.edu/) initiative.
