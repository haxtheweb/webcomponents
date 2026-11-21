# &lt;d-d-d&gt;

D
> design, develop, deliver

## Usage
To use this web component in your project you can utilize one of the following styles of syntax.

```js
/* In an existing JS module / web component */
import '@haxtheweb/d-d-d/d-d-d.js';

/* CDN */
<script type="module" src="https://cdn.hax.cloud/cdn/build/es6/node_modules/@haxtheweb/d-d-d/d-d-d.js"></script>
```

## Icon motion library

`lib/DDDMotion.js` holds the motions DDD shares, so elements do not write their own keyframes. The icon motions are nine short, decorative motions that play once when an icon is hovered or takes keyboard focus. See them in `demo/motion.html` and under **Motion** in the style guide (`d-d-docs`).

| Name | Motion | When to use it |
|---|---|---|
| `pop` | scales up and settles | hubs: the thing a page or card is about |
| `wiggle` | quick side to side rotation | things you edit or report |
| `tilt` | tips back and returns | tools in hand |
| `beat` | two soft scale beats | living things and status |
| `lift` | rises a little and comes back | layers, storage and files |
| `spin` | one full turn | reserved: at most one per view |
| `nudge` | slides forward and back | flows, pipes and next steps |
| `strike` | swings down and back | gavel-like actions and rules |
| `glow` | brightens with a soft halo | ideas and magic |

`beat` is the scale motion. `pulse` (`data-pulse`) stays what it was: the ring that asks for attention.

### Rules

- A motion plays once per hover or focus, then rests. It lasts under a second.
- Motion is decoration. Nothing is said by the motion alone, and an icon that carries meaning still needs its label.
- With `prefers-reduced-motion: reduce` nothing moves. The library handles this itself: its keyframes exist only when motion is allowed, so an element cannot forget the check.
- Use it sparingly in HAX UI and admin screens. One moving icon per card or tile is plenty.

### On an icon

`simple-icon` and `simple-icon-lite` take a `motion` attribute. The icon plays it on its own hover or keyboard focus:

```html
<simple-icon icon="icons:build" motion="wiggle"></simple-icon>
```

### From a card, tile or button

Put `ddd-motion-trigger` on the element people point at. Hovering it, or keyboard focus anywhere inside it, plays the motion of each icon inside:

```html
<a class="ddd-motion-trigger" href="/files">
  <simple-icon-lite icon="icons:folder-open" motion="lift" aria-hidden="true"></simple-icon-lite>
  Files
</a>
```

In page content this works wherever the DDD design system is loaded. Inside a component, add the shared styles to its shadow root:

```js
import { DDDMotionIconStyles } from "@haxtheweb/d-d-d/lib/DDDMotion.js";

static get styles() {
  return [super.styles, DDDMotionIconStyles, css`...`];
}
```

With those styles in place:

- `ddd-motion-trigger` works on any element in the template, and on the component itself (`<my-card class="ddd-motion-trigger">`), where it also plays slotted icons.
- `class="ddd-motion-lift"` (any of the nine names) plays on any element that can transform, on its own hover or keyboard focus. Add `ddd-motion-play` from script to play it once.
- A component that tracks its own state can set the `motion-active` attribute on a `simple-icon` to play its motion.

### Tokens

| Token | Default | What it sets |
|---|---|---|
| `--ddd-motion-icon-duration` | `--ddd-duration-slow` (600ms) | how long a motion lasts; keep it under a second |
| `--ddd-motion-icon-timing` | `--ddd-timing-ease` | easing |
| `--ddd-motion-icon-distance` | `--ddd-spacing-1` (4px) | how far `lift` and `nudge` travel, and the width of the `glow` halo |

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

D

## License
[ License](http://opensource.org/licenses/)