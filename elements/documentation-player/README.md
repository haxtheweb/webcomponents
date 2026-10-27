# &lt;documentation-player&gt;

Living documentation for a web component in one tag: animated walkthroughs, a short video tutorial, the demo markup, generated documentation and the HAX schema, with copy buttons for HTML, the JS import, `npm i` and the CDN script, plus Try in CodePen and, inside the HAX editor, Insert into your site.

```html
<documentation-player
  docs-src="https://cdn.hax.cloud/cdn/build/es6/node_modules/@haxtheweb/meme-maker/lib/meme-maker.docs.json"
></documentation-player>
```

Everything comes from files that ship in the element's `lib/` folder, next to the docs data, so pointing `docs-src` at that file is usually all you need.

| Attribute | Purpose |
| --- | --- |
| `docs-src` | The element's docs data, `lib/<tag>.docs.json`, written by the element's build |
| `motion-src` | One storyboard to play instead of the ones listed in the docs data |
| `video-src` | A video tutorial; overrides the one in the docs data |
| `topic` | For elements with several walkthroughs, the one to open first, e.g. `add-blocks` |
| `tab` | `motion`, `video`, `demo`, `docs` or `schema` |
| `autoplay` | Start the walkthrough when it loads. Reduced motion shows a still frame |
| `demo-href`, `docs-href` | Links for the Open demo and Open documentation buttons |

## Files in an element's `lib/`

| File | Made by | Purpose |
| --- | --- | --- |
| `<tag>.docs.json` | the element build | attributes, slots, events, HAX schema, snippets, surface hash, and the lists below |
| `<tag>.motion.json` | a person, or `scripts/draft-element-walkthrough.mjs` | the main walkthrough |
| `<tag>.<topic>.motion.json` | a person | one walkthrough per topic, e.g. `haxcms-elements.outline.motion.json`; `"title"` and `"order"` control the topic picker |
| `<tag>[.<topic>].video.json` | `scripts/link-element-tutorial.mjs` | `{ source, title, captions, tutorial }` for a video tutorial |
| `<tag>[.<topic>].captions.vtt` | `scripts/link-element-tutorial.mjs` | WebVTT captions for that video |

A storyboard records the surface hash of the element it was written for. When attributes, HAX settings, slots, events or demo schema change, the player marks the walkthrough as possibly out of date, and `node scripts/extract-element-docs.mjs --status` lists it as stale.

## Documenting what is inside it

The original way to use this element still works: whatever you put inside it shows in the Video tab, its markup in the Demo tab, and Try in CodePen and Insert use it.

```html
<documentation-player label="Haxcellence" url="https://haxtheweb.org/">
  <video-player source="https://www.youtube.com/watch?v=LrS7dqokTLE"></video-player>
</documentation-player>
```

## Theming

Colors come from DDD tokens through `--dp-main`, `--dp-ground`, `--dp-second`, `--dp-accent`, `--dp-line` and `--dp-panel`. Override them on the element to restyle it.

## Credits

The storyboard engine in `lib/motion-core.js` is inspired by and adapted from Enes Ozturk's [dimensional-drawing](https://github.com/enesozturk/dimensional-drawing) skill (MIT).

A brighter future dreamed and developed by the Penn State [HAXTheWeb](https://hax.psu.edu/) initiative.
