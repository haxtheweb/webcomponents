# &lt;h5p-element&gt;

> Plays H5P interactive content from a raw `.h5p` file, with no H5P server, Drupal or WordPress.

## Usage
To use this web component in your project you can utilize one of the following styles of syntax.

```js
/* In an existing JS module / web component */
import '@haxtheweb/h5p-element/h5p-element.js';

/* CDN */
<script type="module" src="https://cdn.hax.cloud/cdn/build/es6/node_modules/@haxtheweb/h5p-element/h5p-element.js"></script>
```

### Play a `.h5p` file

Point `source` at a `.h5p` file (or a `blob:` URL made from one). The file is downloaded and unzipped in the browser, so nothing has to be extracted ahead of time and no service worker is needed.

```html
<h5p-element source="files/quiz.h5p"></h5p-element>
```

To play a file the visitor picked or dropped, without uploading it anywhere:

```js
document.querySelector("h5p-element").loadFile(fileFromAnInput);
```

`source` may instead be the URL of an already extracted H5P folder (the previous behavior), and the original wrapped `<iframe>` slot still works when there is no `source`.

Events (both bubble and are composed):

| Event | `detail` |
| --- | --- |
| `h5p-package-loaded` | `title`, `mainLibrary`, `libraries`, `files`, `bytes`, `compressedBytes`, `ms` |
| `h5p-package-error` | `message` |

#### Notes and limits
- The package is only fetched once the element is near the viewport.
- A `.h5p` on another origin needs CORS headers that allow the fetch.
- Video and audio in the package play from `blob:` URLs, so a Content Security Policy needs `media-src blob:`.
- Libraries that fetch their own files by path at runtime are not supported. Everything the player and the common content types need (scripts, styles, fonts, images, media) is read from the zip.
- A `.h5p` contains scripts that run in the page's player frame. Only play packages you trust, the same as embedding any third party content.
- Uploading `.h5p` files to a HAXcms site needs a haxcms-nodejs / haxcms-php release that accepts the extension.

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

5

## License
[Apache-2.0 License](http://opensource.org/licenses/Apache-2.0)