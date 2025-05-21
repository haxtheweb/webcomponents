# &lt;barcode-reader&gt;

Reader
> Element to read barcodes and QR codes through a video stream

## Usage
To use this web component in your project you can utilize one of the following styles of syntax.

```js
/* In an existing JS module / web component */
import '@haxtheweb/barcode-reader/barcode-reader.js';

/* CDN */
<script type="module" src="https://cdn.hax.cloud/cdn/build/es6/node_modules/@haxtheweb/barcode-reader/barcode-reader.js"></script>
```
## Usage after imported
barcode-reader will give controls to show/hide and start the scanner, but the submit button to utilize the data is left up to the website.

## Component Specific Attributes
`value` Value of the result. 
`scale` Scale of the video as a number, no percentage sign.
`hideinput` Include value to hide the input tag and result. Shown by default.

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

Reader

## License
[Apache-2.0 License](http://opensource.org/licenses/Apache-2.0)