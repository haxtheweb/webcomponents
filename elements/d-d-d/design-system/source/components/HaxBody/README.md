# HaxBody

A full on Headless authoring experience as a single tag. The ultimate.

- Package `@haxtheweb/hax-body` 26.8.0

## Usage

```html
<hax-body>
  <h2>Self-check</h2>
  <p>hax-body is the editable canvas: every block inside it can be selected and edited with HAX.</p>
  <stop-note title="Heads up" status="warning"><span slot="message">Content here is live HAX blocks.</span></stop-note>
</hax-body>
```

## Properties

No HAX settings are declared; these are its public reactive properties.

| Attribute | Type |
|---|---|
| `can-undo` | Boolean |
| `can-redo` | Boolean |
| `undostackobserverprops` | Object |
| `target` | Object |
| `stack` | Object |
| `hax-mover` | Boolean |
| `edit-mode` | Boolean |
| `element-align` | String |
| `tray-detail` | String |
| `tray-status` | String |
| `activenode` | Object |
| `canmoveelement` | Boolean |
| `viewsourcetoggle` | Boolean |

## DDD usage

Its source references 48 distinct design-system variables. By family: spacing (68), theme (43), font (40), drop (28), icon (14), primary (9). Most used: `--ddd-spacing-1`, `--ddd-spacing-2`, `--ddd-font-size-6xs`, `--ddd-theme-default-coalyGray`, `--ddd-primary-4`, `--ddd-accent-6`.

## Preview notes

The editing canvas. Full editing needs the HAX store and app store, which a static preview does not have.
