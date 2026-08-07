# `<grid-plate>`

`@haxtheweb/grid-plate` — a layout container that arranges slotted content into 1–4 responsive columns. Drop material into named `col-1` … `col-4` slots, choose a predefined column layout, and the grid adjusts each column's width across `xs`, `sm`, `md`, `lg`, and `xl` breakpoints. It is the primary column-layout primitive used throughout HAX-authored content and is fully HAX-capable (the "Column layout" gizmo).

## Install / Import

```bash
npm i @haxtheweb/grid-plate
```

```js path=null start=null
// ES module / bare import (npm or CDN)
import '@haxtheweb/grid-plate/grid-plate.js';
```

```html path=null start=null
<script type="module">
  import '@haxtheweb/grid-plate/grid-plate.js';
</script>

<grid-plate layout="1-1">
  <p slot="col-1">Column one</p>
  <p slot="col-2">Column two</p>
</grid-plate>
```

## Layouts

`layout` selects a named column arrangement from the predefined `layouts` map. At the `xs` breakpoint every layout stacks its columns to `100%`; the ratios below apply at `sm`/`md`/`lg`/`xl`.

| Layout key | Columns | Description |
|---|---|---|
| `1` | 1 | Full width |
| `1-1` | 2 | Equal width (50/50) |
| `2-1` | 2 | Wide & narrow (~66.7/33.3) |
| `1-2` | 2 | Narrow & wide (~33.3/66.7) |
| `3-1` | 2 | Wider & narrower (75/25) |
| `1-3` | 2 | Narrower & wider (25/75) |
| `1-1-1` | 3 | Equal width (33.3 each) |
| `2-1-1` | 3 | Wide, narrow, narrow (50/25/25) |
| `1-2-1` | 3 | Narrow, wide, narrow (25/50/25) |
| `1-1-2` | 3 | Narrow, narrow, wide (25/25/50) |
| `1-1-1-1` | 4 | Equal width (25 each) |

Legacy layout names are still accepted and map to the keys above: `12`→`1`, `6/6`→`1-1`, `8/4`→`2-1`, `4/8`→`1-2`, `4/4/4`→`1-1-1`, `3/3/3/3`→`1-1-1-1`.

Supply a custom `layouts` object to add or override layouts. Each entry is `{ columnLayout, xs, sm, md, lg, xl }`, where every size is an array of column-width strings (one per column).

## Properties

| Property | Attribute | Type | Default | Description |
|---|---|---|---|---|
| `layout` | `layout` | String | `"1-1"` | Key of the selected layout (see Layouts). |
| `columns` | `columns` | Number | `4` | Number of column slots to display; slots beyond this are hidden. |
| `layouts` | `layouts` | Object | predefined map | Map of layout keys to per-breakpoint column-width arrays. |
| `responsiveSize` | `responsive-size` | String | `"xs"` | Current responsive size (`xs`, `sm`, `md`, `lg`, `xl`); set automatically by ResponsiveUtility. |
| `disableResponsive` | `disable-responsive` | Boolean | `false` | Keep the multi-column layout on larger screens while still stacking at `xs`. |
| `itemMargin` | `item-margin` | Number | `null` | Margin around slotted items (px). Falls back to `16px` via `--grid-plate-item-margin`. |
| `itemPadding` | `item-padding` | Number | `null` | Padding inside slotted items (px). Falls back to `16px` via `--grid-plate-item-padding`. |
| `breakpointSm` | `breakpoint-sm` | Number | `600` | Small breakpoint (px); applied on attach. |
| `breakpointMd` | `breakpoint-md` | Number | `900` | Medium breakpoint (px); applied on attach. |
| `breakpointLg` | `breakpoint-lg` | Number | `1200` | Large breakpoint (px); applied on attach. |
| `breakpointXl` | `breakpoint-xl` | Number | `1500` | Extra-large breakpoint (px); applied on attach. |
| `dataHaxRay` | `data-hax-ray` | String | `null` | Set by the HAX editor to enable layout outlines and drag-and-drop affordances. |
| `ready` | `ready` | Boolean | `false` | Lifecycle flag, set to `true` shortly after first render. Managed internally. |

## Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `layout` | String | `"1-1"` | Key of the selected layout. |
| `columns` | Number | `4` | Number of column slots to display. |
| `layouts` | Object | predefined map | Map of layout keys to per-breakpoint column-width arrays. |
| `responsive-size` | String | `"xs"` | Current responsive size; set automatically by ResponsiveUtility. |
| `disable-responsive` | Boolean | `false` | Lock multi-column layout on larger screens. |
| `item-margin` | Number | `null` | Margin around slotted items (px). |
| `item-padding` | Number | `null` | Padding inside slotted items (px). |
| `breakpoint-sm` | Number | `600` | Small breakpoint (px). |
| `breakpoint-md` | Number | `900` | Medium breakpoint (px). |
| `breakpoint-lg` | Number | `1200` | Large breakpoint (px). |
| `breakpoint-xl` | Number | `1500` | Extra-large breakpoint (px). |
| `data-hax-ray` | String | `null` | HAX editor edit-mode signal. |
| `ready` | Boolean | `false` | Internal lifecycle flag. |

## Slots

| Slot | Description |
|---|---|
| `col-1` | First column content. |
| `col-2` | Second column content. |
| `col-3` | Third column content. |
| `col-4` | Fourth column content. |

The shadow DOM also renders `col-5` and `col-6` slots; they are only visible when `columns` is raised above `4` and a matching entry is supplied via `layouts`.

## Events

| Event | Type | Description |
|---|---|---|
| `disable-responsive-changed` | `CustomEvent` | Fired when `disableResponsive` changes; `detail` is the new boolean value. |

## Methods

| Method | Parameters | Returns | Description |
|---|---|---|---|
| `resize` | — | `void` | Dispatches a global `resize` event so dependents recompute layout. |
| `haxactiveElementChanged` | `el`, `val` | `void` | HAX lifecycle hook invoked when the active editable element changes. |

## CSS Parts

| Part | Description |
|---|---|
| `layout-container` | Each column wrapper (`div.column`). |

## CSS Custom Properties

| Property | Default | Description |
|---|---|---|
| `--grid-plate-item-margin` | `16px` | Margin around slotted items (driven by `itemMargin`). |
| `--grid-plate-item-padding` | `16px` | Padding inside slotted items (driven by `itemPadding`). |
| `--grid-plate-row-margin` | `0px` | Margin on the row container. |
| `--grid-plate-row-padding` | `0px` | Padding on the row container. |
| `--hax-layout-container-outline-width` | `1px` | Outline width of a layout container in HAX edit mode. |
| `--hax-layout-container-hover-outline-width` | `1px` | Hover outline width of a layout container in HAX edit mode. |
| `--hax-layout-container-outline-offset` | `0px` | Outline offset of a layout container in HAX edit mode. |
| `--hax-layout-container-transition` | `0.6s width ease-in-out, 0.6s padding ease-in-out, 0.6s margin ease-in-out` | Transition applied to layout containers when widths change in HAX edit mode. |

## Use in the HAX editor

`grid-plate` registers as a **Column layout** gizmo (`icon: hax:3-3-3-3`, tags: `Layout`, `content`, `grid`) of type `grid`, with `canScale` and `canEditSource` enabled. It advertises DDD `card`, `accent`, and `primary` theming support.

The HAX configuration panel exposes:

| Setting | Control | Description |
|---|---|---|
| Column Layout | select | Chooses a `layout` from the predefined layouts (may reflow on small screens). |
| Disable responsive | boolean | Keeps columns on larger screens while still stacking on the smallest screens. |
| Item Padding | slider (0–120 px, step 4) | Sets `itemPadding`. |
| Item margins | slider (0–120 px, step 4) | Sets `itemMargin`. |

When HAX saves the element, these attributes are stripped (not persisted): `ready`, `layouts`, `columns`, `options`, `responsive-width`, `responsive-size`, and the four `breakpoint-*` attributes.

The HAX demo schema:

```html path=null start=null
<grid-plate item-margin="16" item-padding="16">
  <p slot="col-1">Column one content to replace</p>
  <p slot="col-2">Column two content to replace</p>
</grid-plate>
```

## Demo / Develop

Run the local demo from the element directory:

```bash path=null start=null
npm start
```

This starts the dev server and opens `demo/index.html`, which lets you switch layouts live via a dropdown. The demo composes `grid-plate` with content elements such as `video-player`, `wikipedia-query`, and `media-image` across `col-1` … `col-4`.

## Explanation

`grid-plate` is the standard multi-column layout wrapper for HAX content. It builds on `LitElement` and `@haxtheweb/responsive-utility`: on `firstUpdated` it registers itself with `ResponsiveUtility`, which writes the matching `responsive-size` attribute back onto the element as its width crosses the `breakpoint-*` thresholds. The element then reads the selected layout's column-width array for the current size and applies each width to the corresponding `div.column` wrapper.

Because the column wrappers are flex items with `::slotted(*)` margin/padding driven by `--grid-plate-item-margin` / `--grid-plate-item-padding`, spacing stays consistent across whatever HAX-capable elements you drop into the slots. In HAX edit mode (`data-hax-ray`), the same wrappers gain outlines, active/hover states, and drag-and-drop targets so authors can rearrange material between columns.

## Contributing

1. Fork it! `git clone git@github.com/haxtheweb/webcomponents.git`
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

Apache-2.0 © The Pennsylvania State University
