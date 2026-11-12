# ecosystem-web

The HAX ecosystem web as a web component: every part of HAX as a tile on concentric rings, the connections between them, sub-webs that open from a tile, and tours that walk through it a step at a time. It replaces the stand-alone player in [PRAW's `ecosystem/`](https://github.com/haxtheweb/praw/tree/main/ecosystem) and is phase 2 of [hax.cloud](https://github.com/haxtheweb/issues/issues/3310).

```html
<script type="module" src="@haxtheweb/ecosystem-web/ecosystem-web.js"></script>
<ecosystem-web src="https://hax.cloud/ecosystem-webs.json" web="main"></ecosystem-web>
```

## Attributes

| Attribute | What it does |
| --- | --- |
| `src` | URL of the JSON bundle of webs PRAW builds: `{order, webs: {id: {mmd, json}}, slugs, images, icons}` |
| `web` | The web shown; `main` is the ecosystem web |
| `node` | The selected tile's id in that web |
| `tour` | The tour being played |
| `step` | The tour step shown, from 0; `-1` shows the whole web |
| `list-view` | Show the web as nested lists instead of the drawing |
| `playing` | Advance the tour on its own |

`web`, `node`, `tour` and `step` reflect, so setting any of them routes the web, and every change made in the web fires `ecosystem-web-changed` with `{web, node, tour, step, path}`. `path` is the page for that view when the bundle has `slugs` (hax.cloud's `/penn-state/strategic-plan/aa-plan`, `/tours/everyone/step-3`), so a HAXcms theme can keep the address bar and the web in step.

`loadBundle(bundle)` takes a bundle already in memory instead of `src`.

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
