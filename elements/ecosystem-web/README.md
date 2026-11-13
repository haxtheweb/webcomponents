# ecosystem-web

The HAX ecosystem web as a web component: every part of HAX as a tile on concentric rings, the connections between them, sub-webs that open from a tile, and tours that walk through it a step at a time. It replaces the stand-alone player in [PRAW's `ecosystem/`](https://github.com/haxtheweb/praw/tree/main/ecosystem) and is phase 2 of [hax.cloud](https://github.com/haxtheweb/issues/issues/3310).

```html
<script type="module" src="@haxtheweb/ecosystem-web/ecosystem-web.js"></script>
<ecosystem-web
  src="https://hax.cloud/ecosystem-webs.json"
  web="main"
></ecosystem-web>
```

## Attributes

| Attribute   | What it does                                                                                                 |
| ----------- | ------------------------------------------------------------------------------------------------------------ |
| `src`       | URL of the JSON bundle of webs PRAW builds: `{order, webs: {id: {mmd, json}}, slugs, images, icons, layers}` |
| `web`       | The web shown; `main` is the ecosystem web                                                                   |
| `node`      | The selected tile's id in that web                                                                           |
| `tour`      | The tour being played                                                                                        |
| `step`      | The tour step shown, from 0; `-1` shows the whole web                                                        |
| `list-view` | Show the web as nested lists instead of the drawing                                                          |
| `playing`   | Advance the tour on its own                                                                                  |
| `lens`      | Read every tile by one measure: `fresh`, `bus`, `impact`, `evidence` or `parity`                             |
| `compact`   | Only the drawing, as a figure on a page                                                                      |

`web`, `node`, `tour`, `step` and `lens` reflect, so setting any of them routes the web, and every change made in the web fires `ecosystem-web-changed` with `{web, node, tour, step, lens, path}`. `path` is the page for that view when the bundle has `slugs` (hax.cloud's `/penn-state/strategic-plan/aa-plan`, `/tours/everyone/step-3`), so a HAXcms theme can keep the address bar and the web in step.

`loadBundle(bundle)` takes a bundle already in memory instead of `src`.

### Reading the web

- **Layers** hides kinds of connection (pillars, people, organizations, schema contracts, relationships); hiding People takes the person tiles with them. Under it, **Read by** picks a lens. Each lens rings every tile solid, dashed or dotted by band (so the band never rests on color alone), shows a key with how many tiles fall in each band, and adds a note to the selected tile's details.
  - `fresh`: the last commit on main to the tile's code, from the bundle's `layers.fresh` and `layers.released`; a filled corner dot marks a release that is due.
  - `bus`: how many people besides `layers.maintainers` connect to a code part, across every web.
  - `impact`: a tile's distinct connections across every web, split into thirds.
  - `evidence`: a cited source, links and evidence on its connections.
  - `parity`: the four-surface parity run (`layers.parity.features`), or, in the OpenAPI web, which backends implement each operation and which clients call it.
    Lenses with nothing to measure in a web are not offered there.
- **Search** (or <kbd>/</kbd>) is a combobox: matches by label, group, icon, role, description or a connection's verb, best first; the rest of the web falls back while you type, and Enter selects.
- **Over time** sits with the tours and grows the web year by year from each tile's `year`, `yearNote` and `always` (or, with `meta.timelineTier`, one ring at a time); a web with `meta.noTimeline` leaves it out.
- **Present** fills the screen. Arrow keys and Page Up/Down step a tour, <kbd>+</kbd> <kbd>-</kbd> <kbd>0</kbd> zoom and fit, Escape leaves full screen.

Finishing a tour or the timeline fires `user-engagement` with `{activityDisplay: "experienced", objectName, objectId, resultCompletion: true}`, the event HAX elements use for learner records; the HAXcms progress store turns it into an xAPI statement.

In the HAX editor the element also shows the open web's Mermaid and JSON source and any problems found reading it. The webs are edited in PRAW, so the source is read-only here.

### Motion and drawing

The camera moves by rewriting the drawing's `viewBox` once a frame, so panning, pinching and zooming never re-render the tiles. Selecting a tile, opening a web and stepping a tour ease the camera over about half a second; a selected tile's connections draw in from it, as do the ones a tour step adds and a newly opened web's. Under `prefers-reduced-motion: reduce` the camera jumps and nothing draws in.

Tile glyphs are drawn as plain SVG shapes. The bundle's `icons` (`{"hax:wand": {vb, d}}`, the markup of each glyph the webs name) are used when present; any other icon is read once from its HAX iconset file. Only basic shapes and their geometry are kept from that markup.

## The data

Each web is the Mermaid flowchart subset and `%%@` annotations PRAW's webs are written in, plus a JSON file of details, tours and evidence. `lib/ecosystem-model.js` parses, attaches and lays them out with no DOM, so it is tested on its own.

## Commands

- `npm start` - development server
- `npm run build` - build and analyze
- `npm run test` - run tests

# Credits

A brighter future dreamed and developed by the Penn State [HAXTheWeb](https://hax.psu.edu/) initiative.
