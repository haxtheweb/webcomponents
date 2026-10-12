# PlayList

Display any kind of content in a playlist.

- Package `@haxtheweb/play-list` 26.8.0
- HAX block "Play list" (Layout, play list, list, gallery, grid)
- HAX design-system controls offered: primary

## Usage

```html
<play-list pagination navigation loop><media-image source="media/campus.jpg"></media-image><media-image source="media/banner.jpg"></media-image></play-list>
```

## The consumer provides

| Attribute / slot | Label | What it does | HAX input |
|---|---|---|---|
| `default slot` | Source | Content shown in the playlist. | code-editor |
| `edit` | Edit mode | Toggle between edit and preview mode for playlist. | boolean |
| `navigation` | Navigation | Show forward and backward navigation buttons. | boolean |
| `pagination` | Pagination | Show pagination dots. | boolean |
| `orientation` | Orientation | Orientation of the slides. | select |
| `slide` | Slide to start on | Slide index to focus on initially. | number (advanced) |
| `aspect-ratio` | Aspect Ratio | Aspect ratio of the slides. | select (advanced) |

## DDD usage

Its source references 12 distinct design-system variables. By family: theme (15), icon (7), spacing (5), border (1), font (1). Most used: `--ddd-theme-primary`, `--ddd-icon-2xl`, `--ddd-spacing-1`, `--ddd-theme-default-slateMaxLight`, `--ddd-theme-default-limestoneGray`, `--ddd-icon-xxs`.
