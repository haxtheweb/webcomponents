# instructional-cadence

Shows a course's pacing as music. Each lesson is a phrase, written as one bar with a beat per page, so a 13-page lesson is a bar of 13/4. A blank page is a rest. The course is engraved and played with [`sheet-music`](../sheet-music).

It appears as the **Cadence** screen in HAXcms Reports, and can also be used on its own. See [haxtheweb/issues#3045](https://github.com/haxtheweb/issues/issues/3045).

## What it measures

The element measures the shape of each lesson, not its intensity. A light page is never marked down for being light. The five parts take their names from the music terms they borrow:

| Part | Music meaning | Passes when |
| --- | --- | --- |
| Anacrusis | A pickup before the first strong beat | The first page with content weighs at most 60% of the climax. |
| Development | The working-through of the material | The pages from the pickup to the climax change direction at least once, and none of them is a blank content page. |
| Climax | The high point of a phrase | The heaviest page is at least 1.25 times the lesson's median page, and sits 35 to 90% of the way through. Among near-equal candidates (within 10%), the one nearest the golden section (0.618) wins. |
| Decrescendo | Getting softer | The next page with content after the climax is at least 30% lighter. |
| Cadence | The close of a phrase | The lesson ends on a page with content that is not the climax. This is an authentic cadence (V to I). Ending on a blank page or on the climax leaves it open, which is a half cadence (it stops on V). |

A lesson's flow is the number of parts present, out of 5. Course flow is the share of all parts present across all lessons.

These are borrowed names, not a claim that music theory defines a good lesson. The thresholds are a starting point for research, measured against the course's own median page.

## Pages, lessons and rests

- **Page weight** is minutes of learner effort:
  - words ÷ 200
  - 0.4 per image
  - 2 if the page has a video, counted once whatever its length or how many player tags wrap it
  - 1 per embed (H5P, iframes)
  - 1 per audio
  - 0.6 per check
- **Rest:** a page with no media and fewer than 30 words is blank, and plays as a rest. This includes title-only lesson pages and a segment's page of links to the pages below it.
- **Lesson:** the outline level that holds the lessons is found automatically. It is the deepest level whose pages with children hold at least 5 pages on average. A lesson's beats are its own page and everything below it, in reading order. For example, a lesson's lecture segments each contribute their preview and video pages.
  - Pages outside lessons play as unscored **interludes**, such as a module's own page, its review and its quiz.
  - Set `lesson-depth` to override the level.

## Usage

```html
<instructional-cadence course-title="My course"></instructional-cadence>
<script type="module">
  const el = document.querySelector("instructional-cadence");
  el.items = manifestItems; // JSON Outline Schema items: id, parent, title, slug, order
  el.rows = pageRows; // one per page: id, words, images, videos, embeds
</script>
```

| Property | Attribute | Description |
| --- | --- | --- |
| `items` | | Outline items. |
| `rows` | | Page rows, matched to items by `id`. |
| `courseTitle` | `course-title` | Title on the engraved score. |
| `basePath` | `base-path` | Prefix for page links. |
| `lessonDepth` | `lesson-depth` | Outline level of lessons (0 is the top). -1 finds it automatically. |
| `hideScore` | `hide-score` | Leave out the `sheet-music` score. |
| `hideStats` | `hide-stats` | Leave out the summary numbers, for hosts that show their own. |

The element fires `cadence-open-page` with `{ id, slug }` when a page link is used. Call `preventDefault()` on that event to handle navigation yourself, as Reports does.

The scoring lives in `lib/cadence-model.js`. Its functions are pure (`analyzeCadence`, `buildPhrases`, `lessonShape`, `pageWeight`, `isRest`, `cadenceToAlphaTex`).

The demo (`demo/index.html`) plays all 470 pages of LARCH 060, read from the published course at oer.hax.psu.edu.

## Commands

- `npm start`: development server
- `npm run build`: format, analyze and write docs data
- `npm run test`: run tests

# Credits

A brighter future dreamed and developed by the Penn State [HAXTheWeb](https://hax.psu.edu/) initiative.
