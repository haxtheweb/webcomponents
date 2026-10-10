# InlineAudio

Play audio inline to supplement page content.

- Package `@haxtheweb/inline-audio` 26.8.0
- HAX block "Inline audio" (Media, media, mp3, sound, audio)

## Usage

```html
<inline-audio source="https://inline-audio-mocha.vercel.app/assets/whopper.mp3" accent-color="orange">Hear it yourself</inline-audio>
```

## The consumer provides

| Attribute / slot | Label | What it does | HAX input |
|---|---|---|---|
| `source` | Source | MP3 file or URL. | haxupload |
| `accent-color` | Accent Color | Card accent color. | colorpicker |
| `shiny` | Shiny | Use a lighter accent background instead of gray. | boolean |
| `dark` | Dark | Use dark mode. | boolean (advanced) |

## DDD usage

Its source references 5 distinct design-system variables. By family: theme (4), simple-colors (4). Most used: `--ddd-theme-default-white`, `--simple-colors-default-theme-accent-5`, `--ddd-theme-default-coalyGray`, `--simple-colors-default-theme-accent-2`, `--simple-colors-default-theme-accent-6`.

## Preview notes

The demo audio file is remote and does not play in the preview.
