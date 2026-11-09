# &lt;html-block&gt;

Block
> A basic HTML block that provides HAXschema wiring

## Usage
To use this web component in your project you can utilize one of the following styles of syntax.

```js
/* In an existing JS module / web component */
import '@haxtheweb/html-block/html-block.js';

/* CDN */
<script type="module" src="https://cdn.hax.cloud/cdn/build/es6/node_modules/@haxtheweb/html-block/html-block.js"></script>
```

## Running script with `allowscript`

By default every html-block sanitizes its content on render: inline event
handlers (`onclick=...`) are removed, `javascript:` URLs are dropped and
`<script>` tags are turned into escaped text. Setting the `allowscript`
attribute asks for the raw markup instead, but because that attribute is
saved with the page content it is **not** honored on its own. The hosting
platform has to opt in once, before content loads:

```html
<script>
  // only on platforms where every author is trusted to run script for
  // every visitor (a personal site, a local demo). HAXcms leaves this off.
  globalThis.HAXHtmlBlockAllowScript = true;
  // or, through the app settings object HAXcms backends already provide:
  globalThis.appSettings = { htmlBlockAllowScript: true };
</script>
```

Without the opt in, `allowscript` is kept on the element (content round
trips unchanged) but ignored, and the shared sanitizer in `@haxtheweb/utils`
removes the attribute from imported / rendered content.

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

Block

## License
[Apache-2.0 License](http://opensource.org/licenses/Apache-2.0)