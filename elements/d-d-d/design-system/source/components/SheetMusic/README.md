# SheetMusic

Renders and plays sheet music, guitar tabs, and score notation via alphaTex or MusicXML.

- Package `@haxtheweb/sheet-music` 0.0.0
- HAX block "Sheet music" (Media, Music, Instructional)
- HAX design-system controls offered: primary

## Usage

```html
<sheet-music source="data/ode-to-joy.xml"></sheet-music>
```

## The consumer provides

| Attribute / slot | Label | What it does | HAX input |
|---|---|---|---|
| `default slot` | AlphaTex notation | Inline alphaTex markup for the sheet music. Edit directly to author notation; it is stored in a template so spacing is preserved. | code-editor |
| `source` | Score file | Upload or link to a MusicXML (.xml/.musicxml/.mxl) or Guitar Pro (.gp3/.gp4/.gp5/.gpx/.gp) file. Overrides inline alphaTex when set. | haxupload |
| `audio` | Audio playback | On by default - listen to the sheet music played via the built-in synthesizer. Turn off for viewer-only (no audio) mode. | boolean (advanced) |
| `show-display-options` | Show display options | Show zoom, stretch, and layout buttons on the player bar. | boolean (advanced) |
| `show-export` | Show export buttons | Show download MIDI and print/PDF buttons on the player bar. | boolean (advanced) |

## DDD usage

Its source references 17 distinct design-system variables. By family: theme (14), spacing (11), radius (4), font (4), icon (2), duration (1). Most used: `--ddd-theme-default-info`, `--ddd-spacing-2`, `--ddd-theme-default-white`, `--ddd-font-size-xs`, `--ddd-theme-default-coalyGray`, `--ddd-radius-xs`.

## Preview notes

Notation is drawn by alphaTab, whose 2.4 MB engine is too large to ship with this system; the preview shows the player bar without the score.
