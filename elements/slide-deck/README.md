# slide-deck

Presents a PowerPoint deck imported by HAXcms, slide by slide, in the page.

```html
<slide-deck source="files/decks/my-talk/deck.json"></slide-deck>
```

The PPTX import route writes `deck.json` alongside the original file and its
extracted media. That manifest is the element's only required input:

```json
{
  "title": "My talk",
  "pptx": "files/decks/my-talk/original.pptx",
  "slides": [{ "number": 1, "title": "…", "html": "…", "notes": "…" }]
}
```

## How it renders

Content is layered, so a deck degrades rather than breaks:

- The manifest's per slide text and speaker notes always render. This is what
  assistive technology and site search read, and it is all that is needed for
  the deck to be navigable.
- When the manifest names a `pptx`, the original file is painted over that text
  by [`@aiden0z/pptx-renderer`](https://www.npmjs.com/package/@aiden0z/pptx-renderer).
  The renderer is only fetched once the deck scrolls into view, so a deck lower
  down a page costs nothing until it is looked at. If it cannot run, the text
  layer simply stays visible.

## Properties

| property | attribute | description                                                    |
| -------- | --------- | -------------------------------------------------------------- |
| `source` | `source`  | URL of `deck.json`, relative to the page or absolute           |
| `deckId` | `deck-id` | Distinguishes slide links when a page holds more than one deck |
| `slide`  | `slide`   | Currently displayed slide, 1 based                             |
| `mode`   | `mode`    | `slide` for one at a time, `grid` for every slide plus notes   |

Slides are reachable by URL as `#<deck-id>-slide-<n>`, and arrow keys, `Home`
and `End` move through a focused deck.

## Commands

- `npm start` - development server
- `npm run build` - build and analyze
- `npm run test` - run tests

# Credits

A brighter future dreamed and developed by the Penn State [HAXTheWeb](https://hax.psu.edu/) initiative.
