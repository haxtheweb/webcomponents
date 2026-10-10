# PlaceHolder

A place holder that can be converted into the media type that's been selected.

- Package `@haxtheweb/place-holder` 26.8.0
- HAX block "Placeholder" (Text, development, authoring, media, image)

## Usage

```html
<place-holder type="image"></place-holder>
```

## The consumer provides

| Attribute / slot | Label | What it does | HAX input |
|---|---|---|---|
| `type` | Type | Type of gizmo that this accepts for replacement. | select |
| `text` | Text | Identify the place holder desired in greater detail | textfield |

## DDD usage

Its source references 12 distinct design-system variables. By family: theme (8), spacing (3), font (3), lh (2), border (1), radius (1). Most used: `--ddd-theme-default-limestoneMaxLight`, `--ddd-theme-default-coalyGray`, `--ddd-spacing-2`, `--ddd-lh-120`, `--ddd-border-lg`, `--ddd-theme-default-info`.
