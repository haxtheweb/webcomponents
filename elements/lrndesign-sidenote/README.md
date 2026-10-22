# &lt;lrndesign-sidenote&gt;

A note set apart from the surrounding content, with an optional icon and label above the slotted content. Tinted by the accent color.

## Usage

```html
<script type="module">
  import "@haxtheweb/lrndesign-sidenote/lrndesign-sidenote.js";
</script>

<lrndesign-sidenote label="Instructor note" icon="icons:bookmark" accent-color="blue">
  <p>Supporting information that sits beside the main text.</p>
</lrndesign-sidenote>
```

## Properties

| Attribute | Property | Description |
| --- | --- | --- |
| `label` | `label` | Text shown above the content. |
| `icon` | `icon` | Icon beside the label, such as `icons:bookmark`. A name without an iconset (`bookmark`) is looked up in the `icons` iconset. |
| `accent-color` | `accentColor` | Color the note is tinted with (SimpleColors name, default `grey`). |
| `dark` | `dark` | Use the dark theme of the accent color. |

## Slots

- default: content of the note.

## Styling

- Part: `container`.
- `--lrndesign-sidenote-container-padding` (default `--ddd-spacing-4`)
- `--lrndesign-sidenote-container-margin-left` (default `0px`)
- `--lrndesign-sidenote-label-font-size` (default `--ddd-font-size-ms`)
- `--simple-colors-default-theme-accent-1` still sets the background, as in the original element.

## Accessibility

- With a label the note has `role="note"` and is named by its label; without one it has no role.
- The icon is decorative and hidden from assistive technology.
- The label is plain text, not a heading, because the right heading level depends on where the note is placed. Put a heading inside the slot if the note needs to appear in the outline.
- Colors come from the accent color pair (background `accent-1`, text `accent-12`), which keeps contrast in both light and dark themes.

## Server rendering

The first render depends only on the properties and the slotted content, so the label, icon and content are in the server rendered HTML. Slotted content is plain light DOM, so RSS, markdown and no-JavaScript readers get it too.

## Develop / test

```bash
yarn start
yarn test
```
