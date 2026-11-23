# &lt;hax-iconset&gt;

Iconset

> HAX-specific icons

## Usage

To use this web component in your project you can utilize one of the following styles of syntax.

```js
/* In an existing JS module / web component */
import "@haxtheweb/hax-iconset/hax-iconset.js";

/* CDN */
<script
  type="module"
  src="https://cdn.hax.cloud/cdn/build/es6/node_modules/@haxtheweb/hax-iconset/hax-iconset.js"
></script>;
```

## Develop / Demo

Running `npm start` will start a local development server and open your default browser to display it. It will start watching _.js and lib/_.js files for changes automatically for your demo.

```bash
$ npm start
```

## Contributing

1. Fork it! `git clone https://github.com/haxtheweb/webcomponents.git`
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

Iconset

## Admin icons (`hax:admin-*`)

The `hax:admin-*` glyphs in `lib/svgs/hax/` are the icon family for the HAX
site admin dialog. Their spec, names and the rule for adding one live in the
DDD "HAX UI admin layer" doc (`elements/d-d-d/design-system/source/hax-ui-admin.md`,
section "Admin icons"). Add new SVGs to `lib/svgs/hax/` and run `yarn run build`
in this folder to regenerate `lib/hax-iconset-manifest.js`.

## The Future Traveler (`hax:future-traveler`)

`hax:future-traveler` (color) and `hax:future-traveler-plain` (one ink) are
HAX's mascot, the Future Traveler. They were first named
`hax:world-traveler` and `hax:world-traveler-plain`; those files stay in
`lib/svgs/hax/` so content that names them keeps drawing, but they are listed
under `wcfactory.iconset.legacy` in `package.json`, which keeps them out of the
manifest and the icon picker. Use the `future-traveler` names in anything new.

`hax:future-goggles` is his goggles on their own, in one ink: the short form of
him, and the mark for search and commands (the palette that opens with
`Alt+Shift`). Use it where the wand (`hax:wand`) or the wizard hat
(`hax:wizard-hat`) once stood for the palette; those two icons stay in the set
for content that names them.

## Attribution

The `hax:admin-*` glyph paths are taken from Google's
[Material Design Icons / Material Symbols](https://github.com/google/material-design-icons)
(filled style, 24px grid), Copyright Google LLC, licensed under the
[Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0), the same
license as this package. `hax:admin-blocks` reuses the existing `hax:blocks` glyph. `hax:admin-rail-expand` is
Material's `menu_open` mirrored, so its arrow points the way the rail opens. `hax:admin-lock`, `hax:admin-unlock` and `hax:admin-clear-format`
are Material's `lock`, `lock_open` and `format_clear`; `hax:admin-prettify` reuses the existing `hax:format-textblock` glyph.

## License

[Apache-2.0 License](http://opensource.org/licenses/Apache-2.0)

## Project area icons (`hax:php`, `hax:nodejs`)

Every HAX project area has an icon, a DDD color and a hover motion. The record
of which area takes which is the ecosystem web in PRAW
(<https://github.com/haxtheweb/praw/blob/main/ecosystem/README.md>, "Area icons,
colors and motion"), which also holds the style guide for drawing a new one.
Most areas use an icon this set or `simple-icon` already had. Two were drawn
for their area:

- `hax:php`: the HAXcms PHP backend. A HAX block (the `hax:blocks` shape) with
  the `<?` that opens a PHP file cut out of it.
- `hax:nodejs`: the HAXcms Node.js backend. The same block with `.JS` cut out.

Both are HAX's own marks. An area icon never copies another project's logo:
no PHP elephant or wordmark, no Node.js hexagon. They follow the rest of the
set: a 24 by 24 grid, one filled path in one ink with no color of its own, so
`simple-icon` colors it. The hover motion comes from the DDD motion library
through the `motion` attribute:

```html
<simple-icon icon="hax:php" motion="beat"></simple-icon>
<simple-icon icon="hax:nodejs" motion="spin"></simple-icon>
```
