# ScreenRecorder

Records the screen, with optional system audio and microphone, from inside the page.

- Package `@haxtheweb/screen-recorder` 26.8.0
- HAX block "screen-recorder" (Other)
- HAX design-system controls offered: accent, primary, card, text

## Usage

```html
<screen-recorder title="Sample property title"></screen-recorder>
```

## The consumer provides

| Attribute / slot | Label | What it does | HAX input |
|---|---|---|---|
| `title` | Title |  | textfield |

## DDD usage

Its source references 12 distinct design-system variables. By family: theme (12), spacing (10), font (9), radius (3), border (1). Most used: `--ddd-spacing-1`, `--ddd-font-navigation`, `--ddd-theme-default-coalyGray`, `--ddd-spacing-2`, `--ddd-theme-default-white`, `--ddd-radius-sm`.

## Preview notes

Recording asks for screen-capture permission, which the preview frame does not grant.
