# DddStepsList

`<ddd-steps-list>` shows a numbered process: a column of `<ddd-steps-list-item>` children joined by a dashed line, each with a numbered circle. It is part of `@haxtheweb/d-d-d`, HAX-capable, and backs the "Steps / process" organism in the pattern library.

```html
<ddd-steps-list data-primary="1">
  <ddd-steps-list-item title="Install">Run <code>npm install @haxtheweb/create --global</code>.</ddd-steps-list-item>
  <ddd-steps-list-item title="Create">Run <code>hax site mysite</code>.</ddd-steps-list-item>
  <ddd-steps-list-item title="Publish">Push the site anywhere static files are served.</ddd-steps-list-item>
</ddd-steps-list>
```

## The consumer provides

- Children `ddd-steps-list-item`, each with `title` and slotted content. Numbering is automatic and updates when items change. Other child tags are ignored for numbering.
- `data-primary` on the list or an item: colours the circle, the dashed line and the step title. Default is `#1e407c` (Beaver blue).

## Visual spec

- The list is padded `--ddd-spacing-4`, with `--ddd-icon-lg + --ddd-spacing-4` (72px) left indent for the circles.
- Circle: `--ddd-icon-sm` (40px), `--ddd-radius-circle`, primary fill, bold number in white (black when `--lowContrast-override` is set).
- Connector: 2px dashed primary on the left of every item except the last. The title is an `h3` in the primary colour.
- Under 768px the indent and line drop away and each circle sits above its step.

## Do / don't

- Do use it for ordered procedures, not for unordered features (use a list or card grid).
- Do keep each step's content short; link out for detail.
- Don't pick a `data-primary` flagged "not enough contrast to white" when the page is white: the step title becomes text in that colour.
- The component has no dark-mode switch. Its default Beaver blue title and line are 1.5:1 on the dark `coalyGray` surface. In dark contexts set a light primary such as `data-primary="0"` (Pugh blue, 7.8:1 on `coalyGray`); the Dark theme preview shows the default.

The preview renders the real elements from the bundled `@haxtheweb/d-d-d`.
