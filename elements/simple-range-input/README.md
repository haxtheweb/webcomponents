# &lt;simple-range-input&gt;

Range
> simple styling on a range input

## Usage
To use this web component in your project you can utilize one of the following styles of syntax.

```js
/* In an existing JS module / web component */
import '@haxtheweb/simple-range-input/simple-range-input.js';

/* CDN */
<script type="module" src="https://cdn.hax.cloud/cdn/build/es6/node_modules/@haxtheweb/simple-range-input/simple-range-input.js"></script>
```

## Pin lift for seek bars

Add `lift` to a scrubber along a long track, such as a media seek bar. While the pin is grabbed (pointer down, or keyboard focus) the track bends up into a bump under it, so you can see where you are and that you have hold of it. On touch screens the bump is taller so it shows above your fingertip. The space for the bump is always reserved, so nothing moves when it rises, and the native range input stays the control for keyboard and assistive technology.

```html
<simple-range-input lift label="Seek" min="0" max="180" value="59"></simple-range-input>
```

Leave it off for short sliders (volume, speed), settings, and anything that only shows progress.

| Custom property | Default | What it sets |
|---|---|---|
| `--simple-range-input-fill-color` | track color | the played part, before the pin |
| `--simple-range-input-track-color` | accent-2 | the rest of the track |
| `--simple-range-input-lift-height` | `--ddd-range-lift-height` (12px) | bump height for mouse, pen and keyboard |
| `--simple-range-input-lift-height-coarse` | `--ddd-range-lift-height-coarse` (24px) | bump height on touch |
| `--simple-range-input-lift-width` | `--ddd-range-lift-width` (64px) | width of the bump |
| `--simple-range-input-lift-rest` | `--ddd-range-lift-rest` (0) | share of the bump shown at rest, 0 to 1 |
| `--simple-range-input-lift-duration` | `--ddd-range-lift-duration` (150ms) | rise and settle time; reduced motion skips it |

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

Range

## License
[Apache-2.0 License](http://opensource.org/licenses/Apache-2.0)