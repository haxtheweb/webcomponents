# &lt;hax-iconset&gt;

Iconset
> HAX-specific icons

## Usage
To use this web component in your project you can utilize one of the following styles of syntax.

```js
/* In an existing JS module / web component */
import '@haxtheweb/hax-iconset/hax-iconset.js';

/* CDN */
<script type="module" src="https://cdn.hax.cloud/cdn/build/es6/node_modules/@haxtheweb/hax-iconset/hax-iconset.js"></script>
```

## Develop / Demo
Running `npm start` will start a local development server and open your default browser to display it. It will start watching *.js and lib/*.js files for changes automatically for your demo.
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

## Attribution
The `hax:admin-*` glyph paths are taken from Google's
[Material Design Icons / Material Symbols](https://github.com/google/material-design-icons)
(filled style, 24px grid), Copyright Google LLC, licensed under the
[Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0), the same
license as this package. `hax:admin-blocks` reuses the existing `hax:blocks` glyph.

## License
[Apache-2.0 License](http://opensource.org/licenses/Apache-2.0)