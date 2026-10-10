# AiUsageLicense

Display an AI Usage License (AIUL) badge for your work.

- Package `@haxtheweb/ai-usage-license` 26.8.0
- HAX block "AI Usage License" (Other, content, ai, license, aiul)

## Usage

```html
<ai-usage-license license="CD" modifier="IM"></ai-usage-license>
```

## The consumer provides

| Attribute / slot | Label | What it does | HAX input |
|---|---|---|---|
| `license` | License | The AI usage license level for this work. See https://dmd-program.github.io/aiul/ for details. | select |
| `modifier` | Media Modifier | Optional media domain modifier. Specifies the type of media this license applies to. | select |
| `uri` | AIUL URI (OER Schema) | OER Schema: URI for the AI Usage License reference page. Auto-populated from the license link when not set. | textfield |

## DDD usage

Its source references 13 distinct design-system variables. By family: spacing (6), font (6), theme (5), line (1), icon (1). Most used: `--ddd-spacing-2`, `--ddd-theme-default-slateGray`, `--ddd-font-weight-bold`, `--ddd-font-size-s`, `--ddd-line-height-140`, `--ddd-spacing-9`.
