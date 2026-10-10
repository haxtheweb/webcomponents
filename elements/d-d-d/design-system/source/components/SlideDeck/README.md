# SlideDeck

Present an imported PowerPoint deck slide by slide, with speaker notes.

- Package `@haxtheweb/slide-deck` 0.0.0
- HAX block "Slide deck" (Media, presentation, slides, powerpoint, pptx)
- HAX design-system controls offered: accent, primary, card, text

## Usage

```html
<slide-deck source="data/deck.json" deck-id="demo"></slide-deck>
```

## The consumer provides

| Attribute / slot | Label | What it does | HAX input |
|---|---|---|---|
| `source` | Deck manifest | Drop a .pptx file and it is converted to a slide deck automatically. The field is set to the resulting deck.json path. | haxupload |
| `deck-id` | Deck id | Only needed when a page holds more than one deck, so slide links stay distinct | textfield |
| `downloadable` | Allow download | Show a download button for the original PowerPoint file in the player controls | boolean (advanced) |

## DDD usage

Its source references 11 distinct design-system variables. By family: spacing (8), border (4), font (3), theme (3). Most used: `--ddd-spacing-3`, `--ddd-border-xs`, `--ddd-spacing-1`, `--ddd-font-size-4xs`, `--ddd-font-navigation`, `--ddd-theme-primary`.

## Preview notes

The preview deck has no `.pptx` (this system cannot serve PowerPoint files), so slide-deck shows its text tier: each slide's HTML and notes from `deck.json`. With a `.pptx` in the manifest it paints the original slides over that.
