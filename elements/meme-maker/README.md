# &lt;meme-maker&gt;

> Make a meme out of an image.

`<meme-maker>` renders an image with top and bottom caption text in the classic
meme format. It is a `LitElement` web component and is HAX-capable, so it can be
authored and configured inside the HAX editor.

## Usage

To use this web component in your project you can utilize one of the following
styles of syntax.

```js
/* In an existing JS module / web component */
import '@haxtheweb/meme-maker/meme-maker.js';

/* CDN */
<script type="module" src="https://cdn.hax.cloud/cdn/build/es6/node_modules/@haxtheweb/meme-maker/meme-maker.js"></script>
```

Minimal example:

```html
<meme-maker
  image-url="https://cdn2.thecatapi.com/images/9j5.jpg"
  top-text="I bring you"
  bottom-text="the death"
  alt="Cat stalking a small toy"
></meme-maker>
```

## Properties

| Property | Attribute | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `imageUrl` | `image-url` | String | `null` | URL to the meme image. |
| `topText` | `top-text` | String | `null` | Text rendered on top of the image. |
| `bottomText` | `bottom-text` | String | `null` | Text rendered on the bottom of the image. |
| `alt` | `alt` | String | `""` | Alt text passed to the underlying `<img>` for non-sighted users. |
| `describedBy` | `described-by` | String | `null` | `aria-describedby` value passed to the underlying `<img>`. |
| `crossorigin` | `crossorigin` | Boolean | `false` | Sets the `crossorigin` attribute on the underlying `<img>`. |

## Attributes

Attributes mirror their corresponding properties (kebab-case).

| Attribute | Property | Type | Description |
| --- | --- | --- | --- |
| `image-url` | `imageUrl` | String | URL to the meme image. |
| `top-text` | `topText` | String | Top caption text. |
| `bottom-text` | `bottomText` | String | Bottom caption text. |
| `alt` | `alt` | String | Alt text for the image. |
| `described-by` | `describedBy` | String | `aria-describedby` for the image. |
| `crossorigin` | `crossorigin` | Boolean | Sets `crossorigin` on the image. |

## Methods

These are HAX lifecycle hooks invoked by the HAX editor; consumers do not call
them directly.

| Method | Parameters | Description |
| --- | --- | --- |
| `haxHooks` | none | Registers this element's HAX lifecycle hooks (`progressiveEnhancement`, `gizmoRegistration`). |
| `haxgizmoRegistration` | `store` | Dispatches an `i18n-manager-register-element` event so HAX loads this element's `locales/` translations. |
| `haxprogressiveEnhancement` | `el` | Returns a plain-HTML string (image + captions) for RSS, bots, and legacy renderers. |

## Slots, Events & CSS Parts

None declared in the manifest. The element renders its own
`<figure>` / `<img>` / `<figcaption>` structure and exposes no named slots,
custom events, or shadow-DOM CSS parts.

## Styling

The caption font size is themeable via these custom properties (defined in the
element styles; not yet declared in `custom-elements.json`):

| Custom property | Default | Applies |
| --- | --- | --- |
| `--meme-maker-font-size` | `36px` | Caption font size (base / desktop). |
| `--meme-maker-font-size-medium` | `20px` | Caption font size at `max-width: 800px`. |
| `--meme-maker-font-size-small` | `20px` | Caption font size at `max-width: 600px`. |

```css
meme-maker {
  --meme-maker-font-size: 50px;
  --meme-maker-font-size-medium: 24px;
  --meme-maker-font-size-small: 16px;
}
```

## Use in the HAX editor

`<meme-maker>` is HAX-capable. In the editor it appears as the **Meme** gizmo
(`hax:meme` icon, tagged `Media` / `funny` / `meme` / `image`) and supports
scaling and source editing.

The HAX configuration panel exposes:

| Property | Field | Notes |
| --- | --- | --- |
| `imageUrl` | Source (`haxupload`) | Upload or pick the meme image. |
| `topText` | Top text | Textfield. |
| `bottomText` | Bottom text | Textfield. |
| `alt` | Alternative text | Required — describe the image for non-sighted users. |

## Demo

Run the local demo:

```bash
npm start
```

This starts a development server and opens `demo/index.html`, watching `*.js`
and `lib/*.js` for changes. The demo demonstrates caption sizing across
responsive breakpoints and a `crossorigin` image source.

## Contributing

1. Fork it! `git clone https://github.com/haxtheweb/webcomponents.git`
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

[Apache-2.0 License](http://opensource.org/licenses/Apache-2.0)
