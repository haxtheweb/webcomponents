# A11yCollapse

Single expandable and collapsible container.

- Package `@haxtheweb/a11y-collapse` 26.8.0
- HAX block "Collapsible container" (Layout)

## Usage

```html
<a11y-collapse heading="Heading" heading-button><p>Content goes here.</p></a11y-collapse>
```

## The consumer provides

| Attribute / slot | Label | What it does | HAX input |
|---|---|---|---|
| `heading` | Heading | Text for the collapse. | textfield |
| `expanded` | Expanded | Expand by default. | boolean |
| `heading-button` | Heading Button | Make the entire heading clickable instead of only the icon. | boolean |
| `icon` | Icon | Icon for the expand/collapse toggle button. | iconpicker |
| `icon-expanded` | Icon (when expanded) | Optional icon for the expanded toggle state. | iconpicker |
| `default slot` | Content | Content for the collapse. | code-editor |
| `tooltip` | Tooltip | Tooltip for the expand/collapse toggle button. | textfield (advanced) |
| `tooltip-expanded` | Tooltip (when expanded) | Tooltip for the expand/collapse button when expanded. | textfield (advanced) |

## DDD usage

Its source references 7 distinct design-system variables. By family: spacing (15), border (4), theme (4), font (3). Most used: `--ddd-spacing-4`, `--ddd-theme-default-coalyGray`, `--ddd-border-xs`, `--ddd-font-weight-bold`, `--ddd-border-sm`, `--ddd-theme-body-font-size`.
