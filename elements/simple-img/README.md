# &lt;simple-img&gt;

Img
> simple image manipulation: resize, crop, rotate, re-encode and watermark a photo

simple-img shows a sized copy of its photo. When the photo lives in a HAXcms
site (a `files/...` src), the HAXcms backends make that copy when the page is
saved, under `files/haxcms-managed/simple-img/`, so it is a plain file on any
host, static ones included. Any other src, or a page not saved since, shows
the original photo. Variants are made for quarter-turn rotations, sides up to
4000px and watermarks that are site photos; see `lib/SimpleImgVariants.js`.

## Usage
To use this web component in your project you can utilize one of the following styles of syntax.

```js
/* In an existing JS module / web component */
import '@haxtheweb/simple-img/simple-img.js';

/* CDN */
<script type="module" src="https://cdn.hax.cloud/cdn/build/es6/node_modules/@haxtheweb/simple-img/simple-img.js"></script>
```

## Develop / Demo
Running `npm start` will start a local development server and open your default browser to display it. It will start watching *.js and lib/*.js files for changes automatically for your demo.
```bash
npm start
```


## Contributing

1. Fork it! `git clone https://github.com/haxtheweb/webcomponents.git`
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

Img

## License
[Apache-2.0 License](http://opensource.org/licenses/Apache-2.0)