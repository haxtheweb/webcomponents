# &lt;un-sdg&gt;

> United Nations Sustainable Development Goal.

`<un-sdg>` renders one of the 17 UN Sustainable Development Goals as an icon
(SVG), or — with `color-only` — as a solid color swatch in the goal's official
color. It extends `SchemaBehaviors(LitElement)` and emits OER schema microdata
(`typeof="oer:Topic"`, `oer:name`, `oer:image`) so the goal is semantically
described for search engines and learning tools. It is HAX-capable.

## Usage

To use this web component in your project you can utilize one of the following
styles of syntax.

```js
/* In an existing JS module / web component */
import '@haxtheweb/un-sdg/un-sdg.js';

/* CDN */
<script type="module" src="https://cdn.hax.cloud/cdn/build/es6/node_modules/@haxtheweb/un-sdg/un-sdg.js"></script>
```

Minimal example (Goal 4 — Quality Education):

```html
<un-sdg goal="4"></un-sdg>
```

Color-only swatch (Goal 13 — Climate Action):

```html
<un-sdg goal="13" color-only></un-sdg>
```

## Properties

| Property | Attribute | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `goal` | `goal` | Number | `1` | UN SDG number (1–17). Invalid values are reset to `1`. |
| `colorOnly` | `color-only` | Boolean | `false` | Show only the goal's official color as a solid swatch instead of the icon. |
| `alt` | — | String | `""` | Alt text for the icon image. Auto-generated as `Goal N: <name>` when `goal` changes. |
| `loading` | — | String | `"lazy"` | `loading` attribute passed to the underlying `<img>` (`lazy`, `eager`, `auto`). |
| `fetchpriority` | — | String | `"low"` | `fetchpriority` attribute passed to the underlying `<img>` (`high`, `low`, `auto`). |

## Attributes

| Attribute | Property | Type | Description |
| --- | --- | --- | --- |
| `goal` | `goal` | Number | UN SDG number (1–17). |
| `color-only` | `colorOnly` | Boolean | Show only the goal color swatch. |

(`alt`, `loading`, and `fetchpriority` are properties only — they are not
reflected to attributes.)

## Methods, Slots, Events & CSS Parts

None declared in the manifest. The element renders its own `<img>` (or a color
`<div>` in `color-only` mode) and exposes no public methods, named slots,
custom events, or shadow-DOM CSS parts.

## Supported goals

The 17 goals and their official colors:

| # | Goal | Color |
| --- | --- | --- |
| 1 | No Poverty | `#e5243b` |
| 2 | Zero Hunger | `#dda63a` |
| 3 | Good Health and Well-being | `#4c9f38` |
| 4 | Quality Education | `#c5192d` |
| 5 | Gender Equality | `#ff3a21` |
| 6 | Clean Water and Sanitation | `#26bde2` |
| 7 | Affordable and Clean Energy | `#fcc30b` |
| 8 | Decent Work and Economic Growth | `#a21942` |
| 9 | Industry, Innovation and Infrastructure | `#fd6925` |
| 10 | Reduced Inequalities | `#dd1367` |
| 11 | Sustainable Cities and Communities | `#fd9d24` |
| 12 | Responsible Consumption and Production | `#bf8b2e` |
| 13 | Climate Action | `#3f7e44` |
| 14 | Life Below Water | `#0a97d9` |
| 15 | Life on Land | `#56c02b` |
| 16 | Peace, Justice and Strong Institutions | `#00689d` |
| 17 | Partnerships for the Goals | `#19486a` |

## Use in the HAX editor

`<un-sdg>` is HAX-capable. In the editor it appears as the **UN SDG** gizmo
(`hax:apps` icon, tagged `Other` / `sustainable`) and supports source editing
but not scaling.

The HAX configuration panel exposes:

| Property | Field | Notes |
| --- | --- | --- |
| `goal` | Goal (slider) | UN SDG number, 1–17, step 1. Required. |
| `colorOnly` | Color only (boolean) | Show only the goal color. |

## Demo

Run the local demo:

```bash
npm start
```

This starts a development server and opens `demo/index.html`. The demo renders
all 17 goals in sequence.

## Contributing

1. Fork it! `git clone https://github.com/haxtheweb/webcomponents.git`
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

[Apache-2.0 License](http://opensource.org/licenses/Apache-2.0)
