# `<h-a-x>`

`@haxtheweb/h-a-x` — the single tag that transforms authoring. Drop `<h-a-x>` onto a page, slot in any HTML content, and the full HAX (Headless Authoring eXperience) editor is wired around it: an editable `hax-body`, the `hax-tray` inspector, the `hax-app-picker`, the `hax-autoloader`, and the `hax-cancel-dialog`. This is the root bootstrap element for the entire HAX editor — it is not itself a HAX-capable gizmo (`useHAX: false`) because it *is* the editor.

It extends `HTMLElement` directly (no LitElement), renders a small shadow-DOM template containing `<hax-body><slot></slot></hax-body>`, and orchestrates the global `HAXStore` on `connectedCallback`.

## Install / Import

```bash
npm i @haxtheweb/h-a-x
```

```js path=null start=null
// ES module / bare import (npm or CDN)
import '@haxtheweb/h-a-x/h-a-x.js';
```

```html path=null start=null
<script type="module" src="https://cdn.hax.cloud/cdn/build/es6/node_modules/@haxtheweb/h-a-x/h-a-x.js"></script>
```

## Usage

Wrap any content in `<h-a-x>`; the slotted children become the editable body that HAX loads and saves.

```html path=null start=null
<h-a-x
  app-store='{"url": "appstore.json"}'
  offset-margin="0px 0px 0px 48px"
  element-align="right"
>
  <p>Editable content goes here</p>
  <tab-list tabs='[{"link":"...","label":"..."}]'></tab-list>
  <self-check title="Self check" ...>
    <span slot="question">Question area</span>
    <span>Content area</span>
  </self-check>
</h-a-x>
```

- `app-store` — a JSON string (single-quoted in HTML) defining the HAX app store to load extra gizmos/apps from. In the demo it points at `appstore.json`.
- `element-align` — which side the HAX tray docks on (`left` or `right`). Defaults to `left` and is persisted to `localStorage` under `hax-tray-elementAlign`.
- `offset-margin` — CSS margin string applied to the HAX tray (e.g. to clear a sidebar).
- `hide-toolbar` / `hide-panel-ops` — presence attributes that hide the HAX toolbar or panel operations in the tray.

On connect, the element imports the slotted content into the active `hax-body` once the app store has loaded. When the author saves (the `hax-save` global event), `<h-a-x>` serializes the body back into its own `innerHTML` and fires `hax-save-body-value`.

## Properties

| Property | Attribute | Type | Default | Description |
|---|---|---|---|---|
| `elementAlign` | `element-align` | String | `"left"` (persisted) | Side the HAX tray docks on; written back to `HAXStore.elementAlign`. |
| `offsetMargin` | `offset-margin` | String | `null` | CSS margin string applied to the HAX tray. |
| `hideToolbar` | `hide-toolbar` | String/Boolean | `null` | Presence attribute; hides the HAX toolbar when set. |
| `hidePanelOps` | `hide-panel-ops` | String/Boolean | `null` | Presence attribute; hides panel operations in the tray when set. |
| `appStore` | `app-store` | String (JSON) | `null` | JSON string defining the HAX app store; parsed and applied to `HAXStore.appStore`. |
| `html` | — | String (getter) | template | Read-only getter returning the shadow-DOM template markup. |
| `template` | — | HTMLTemplateElement | `new template` | Internal `<template>` element used to stamp the shadow DOM. |
| `windowControllers` | — | AbortController | `new AbortController()` | Aborts `hax-cancel` / `hax-save` window listeners on disconnect. |
| `windowControllersLoaded` | — | AbortController | `new AbortController()` | Aborts the `hax-store-app-store-loaded` listener after import. |
| `windowControllersReady` | — | AbortController | `new AbortController()` | Aborts the `hax-store-ready` listener after store wiring. |

## Attributes

Observed attributes (from `static get observedAttributes()`):

| Attribute | Description |
|---|---|
| `element-align` | Tray dock side (`left`/`right`). |
| `offset-margin` | CSS margin string for the tray. |
| `app-store` | JSON string defining the HAX app store. |
| `hide-panel-ops` | Presence attribute; hides tray panel operations. |

`hide-toolbar` is also supported via a getter/setter pair, though it is not in the observed-attributes list.

## Slots

| Slot | Description |
|---|---|
| (default) | Authorable content. Slotted children are imported into the active `hax-body` and become the editable document. On save they are replaced with the serialized body HTML. |

## Events

| Event | Type | Detail | Description |
|---|---|---|---|
| `hax-save-body-value` | `CustomEvent` | `{ value: string, keepEditMode: boolean }` | Fired (composed, bubbling, cancelable) when the author saves. `value` is the serialized HAX body HTML; `keepEditMode` reflects the save request. |

The element also listens for these global events: `hax-store-ready` (wires the store + app store + tray flags), `hax-store-app-store-loaded` (imports slotted content into the body), `hax-cancel` (re-imports slotted content), and `hax-save` (serializes the body and fires `hax-save-body-value`).

## Methods

| Method | Parameters | Returns | Description |
|---|---|---|---|
| `applyHAX` | — | `true` | Requests `HaxStore` availability, then appends `hax-tray`, `hax-app-picker`, `hax-autoloader`, and `hax-cancel-dialog` to `document.body`. Runs once per page. |
| `storeReady` | `e` | `void` | `hax-store-ready` handler: parses `app-store`, applies tray flags (`hidePanelOps`, `hideToolbar`, `offsetMargin`) and `elementAlign` to the store. |
| `appStoreReady` | `e` | `void` | `hax-store-app-store-loaded` handler: imports slotted content into the active body now that the app store is loaded. |
| `importSlotToHaxBody` | — | `void` | Reads the slotted nodes (or `children`), joins their `outerHTML`, and calls `HAXStore.activeHaxBody.importContent(body)`. |
| `saveEvent` | `e` | `Promise<void>` | `hax-save` handler: awaits `haxToContent()`, writes the result to `innerHTML`, and dispatches `hax-save-body-value`. |
| `cancelEvent` | `e` | `void` | `hax-cancel` handler: re-imports slotted content into the body. |

## CSS

`<h-a-x>` ships a small scoped style block in its shadow DOM (via the `html` getter) rather than a LitElement `styles` static getter. It imports `editableTableDisplayStyles` from `@haxtheweb/editable-table` and rewrites `:host` selectors to `hax-body table` so editable tables render consistently inside the body. Notable rules:

- `:host, h-a-x { display: block; }` and `[hidden] { display: none; }`
- `:host img, h-a-x img { max-width: 100%; }` (with vendor `fill-available` variants)
- Active outline for `hax-body[edit-mode]` content: `var(--hax-body-active-outline, 2px solid var(--hax-ui-color-focus, #000))`
- Empty active contenteditable placeholder: `"Type / to add blocks"` at 0.4 opacity

The element also adopts any `document.adoptedStyleSheets` flagged with `sheet.hax === true` into its shadow root (with a `<style data-hax-sheet-fallback>` fallback when constructed-sheet adoption is unsupported).

### CSS Custom Properties

| Property | Default | Description |
|---|---|---|
| `--hax-body-active-outline` | `2px solid var(--hax-ui-color-focus, #000)` | Outline on the active editable element in edit mode. |
| `--hax-ui-color-focus` | `#000` | Focus color used by the active outline. |
| `--hax-ui-caret-color` | `auto` | Caret color in edit mode. |

## Demo / Develop

Run the local demo from the element directory:

```bash path=null start=null
npm start
```

This starts the dev server and opens `demo/index.html`, which mounts `<h-a-x>` with an `app-store` pointing at `appstore.json`, a right-aligned tray, a left offset, and a mix of slotted content (`<p>`, `<tab-list>`, `<self-check>`, lists).

## Explanation

`<h-a-x>` is the integration point between plain HTML and the HAX editor. Most HAX elements are *content* gizmos that authors manipulate inside the editor; `<h-a-x>` is the *host* that makes a region editable. Because it is a plain `HTMLElement` with a hand-written shadow DOM, it avoids pulling LitElement into the editor bootstrap path and can adopt document-level constructed stylesheets so the editor chrome matches the surrounding page.

The lifecycle is intentionally event-driven and load-order tolerant:

1. `connectedCallback` runs `applyHAX()` once (guarded by `__HAXApplied` / `globalThis.__HAXApplied`) to create the store, tray, app picker, autoloader, and cancel dialog.
2. The constructor registers `hax-store-ready` and `hax-store-app-store-loaded` listeners (each with its own `AbortController` so they clean up on disconnect).
3. When the store is ready, `storeReady` applies `app-store`, tray visibility flags, and alignment.
4. When the app store is loaded, `appStoreReady` imports the slotted content into the active body — this ordering ensures gizmos from the app store are registered before content is hydrated.
5. `hax-save` serializes the body back to `innerHTML` and emits `hax-save-body-value`; `hax-cancel` re-imports the original slotted content.

The element pulls its HAX subsystem dependencies through `lib/h-a-x-dependencies.js`: `hax-body`, `hax-tray`, `hax-autoloader`, `hax-app`, `hax-app-picker`, `hax-toolbar`, and `hax-cancel-dialog`.

## Contributing

1. Fork it! `git clone https://github.com/haxtheweb/webcomponents.git`
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

Apache-2.0 © The Pennsylvania State University
