# &lt;simple-icon&gt;

Icon
> Render an SVG based icon

## Usage
To use this web component in your project you can utilize one of the following styles of syntax.

```js
/* In an existing JS module / web component */
import '@haxtheweb/simple-icon/simple-icon.js';

/* CDN */
<script type="module" src="https://cdn.hax.cloud/cdn/build/es6/node_modules/@haxtheweb/simple-icon/simple-icon.js"></script>
```

## Motion

An icon can play a short, decorative motion once when it is hovered or takes keyboard focus. Set `motion` to one of `pop`, `wiggle`, `tilt`, `beat`, `lift`, `spin`, `nudge`, `strike` or `glow`. It works the same on `simple-icon` and `simple-icon-lite`:

```html
<simple-icon icon="icons:build" motion="wiggle"></simple-icon>
```

The motions belong to the DDD design system's motion library (`@haxtheweb/d-d-d/lib/DDDMotion.js`), which also says when to use each one. `simple-icon` does not import DDD: on a page without it the icon is drawn as usual and does not move. It also does not move when reduced motion is turned on. An icon without `motion` is not affected in any way.

To play the motion from a parent:

- put `class="ddd-motion-trigger"` on the card, tile, button or link around the icon. Hovering it, or keyboard focus inside it, plays the icon's motion. A component adds `DDDMotionIconStyles` to its shadow styles for this; page content gets it with the DDD design system.
- or set the `motion-active` attribute on the icon while it should play.

Motion is decoration only. Do not use it to say something the icon and its label do not already say.

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

Icon

## License
[Apache-2.0 License](http://opensource.org/licenses/Apache-2.0)