# DDDocs

The DDD style guide as an element: pick a topic and it renders that part of the design system, from colours and type to the pattern library.

- Package `@haxtheweb/d-d-docs` 26.8.0
- HAX block "Design, Develop, Destroy" (Other, developer, design)

## Usage

```html
<d-d-docs option="Shadows"></d-d-docs>
```

## The consumer provides

| Attribute / slot | Label | What it does | HAX input |
|---|---|---|---|
| `option` | Option to render |  |  |

## DDD usage

Its source references 95 distinct design-system variables. By family: palette (119), theme (117), spacing (42), font (19), radius (10), border (9). Most used: `--ddd-palette-color-1`, `--ddd-palette-color-2`, `--ddd-palette-color-3`, `--ddd-palette-color-4`, `--ddd-palette-color-5`, `--ddd-palette-color-6`.
