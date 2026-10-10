# LicenseElement

Provide a license for your work.

- Package `@haxtheweb/license-element` 26.8.0
- HAX block "License" (Other, content, copyright, license, cc0)

## Usage

```html
<license-element title="Wonderland" creator="Mad Hatter" source="https://haxtheweb.org/" license="by"></license-element>
```

## The consumer provides

| Attribute / slot | Label | What it does | HAX input |
|---|---|---|---|
| `title` | Title | Title of the cited work. | textfield |
| `source` | Source link | Source URL for the licensed work. | textfield |
| `license` | License | License applied to this work. | select |
| `creator` | Creator | Creator or owner of this work. | textfield |
| `more-link` | Source link | Link to additional licensing details. | textfield (advanced) |
| `more-label` | More label | Label for additional licensing details. | textfield (advanced) |

## DDD usage

Its source references 11 distinct design-system variables. By family: spacing (5), theme (4), font (2), icon (2), line (1). Most used: `--ddd-spacing-2`, `--ddd-theme-default-slateGray`, `--ddd-line-height-140`, `--ddd-spacing-9`, `--ddd-font-size-ms`, `--ddd-spacing-8`.
