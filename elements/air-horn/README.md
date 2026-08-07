# &lt;air-horn&gt;

> Demonstrative purposes via meme.

`<air-horn>` is a vanilla web component (it extends `HTMLElement` directly, not
LitElement) that plays an air horn sound effect when clicked. Slot any content
inside it — an image, a gif, a button — and clicking anywhere on the element
triggers the sound. It is a lightweight, dependency-free element and is **not**
HAX-capable (it has no `haxProperties`).

## Usage

To use this web component in your project you can utilize one of the following
styles of syntax.

```js
/* In an existing JS module / web component */
import '@haxtheweb/air-horn/air-horn.js';

/* CDN */
<script type="module" src="https://cdn.hax.cloud/cdn/build/es6/node_modules/@haxtheweb/air-horn/air-horn.js"></script>
```

Minimal example — slot an animated gif and click to play the sound:

```html
<air-horn>
  <img src="air-horn.gif" alt="Click to play the air horn" />
</air-horn>
```

## Properties

These are internal implementation fields, not consumer-configurable. The
element has no settable properties or attributes.

| Property | Attribute | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `html` | — | String | — | _(read-only getter)_ Returns the shadow-DOM template string (`<style>` + `<slot>`). Internal. |
| `template` | — | HTMLTemplateElement | — | Internal `<template>` element used to stamp the shadow DOM. |

## Attributes

None. The element reflects no attributes.

## Methods, Slots, Events & CSS Parts

None declared in the manifest. The element's shadow DOM includes a `<slot>` so
slotted light-DOM children render inside it, and a click listener plays the
sound — but the manifest does not declare the slot, any custom events, or CSS
parts.

## Demo

Run the local demo:

```bash
npm start
```

This starts a development server and opens `demo/index.html`. The demo slots an
`<a11y-gif-player>` (animated air horn gif) inside `<air-horn>`; clicking it
plays the sound effect.

## Contributing

1. Fork it! `git clone https://github.com/haxtheweb/webcomponents.git`
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

[Apache-2.0 License](http://opensource.org/licenses/Apache-2.0)
