# MediaImage

A way of presenting images with various enhancements.

- Package `@haxtheweb/media-image` 26.8.0
- HAX block "Enhanced Image" (Media, media, core, figure, image)

## Usage

```html
<media-image source="media/campus.jpg" card citation="This is my citation."></media-image>
```

## The consumer provides

| Attribute / slot | Label | What it does | HAX input |
|---|---|---|---|
| `source` | Source | The URL for the image. | haxupload |
| `alt` | Alternative text | Text to describe the image to non-sighted users. | alt |
| `link` | Link | Link the image to a URL | haxupload |
| `card` | Card | Apply a drop shadow to give the appearance of being a raised card. | boolean |
| `box` | Box | Apply a visual box around the image. | boolean |
| `offset` | Offset | Apply a left or right offset to the image. | select |
| `citation` | Citation | Citation for the image. | textfield |
| `caption` | Caption | Caption for the image. | textfield |
| `figure-label-title` | Figure Title | Title for the figure label. | textfield |
| `figure-label-description` | Figure Description | Description for the figure label. | textfield |
| `thumbnail` | Thumbnail image | Thumbnail image source. Shows thumbnail but opens full source in modal. | haxupload (advanced) |
| `round` | Round image | Crops the image appearance to be circle in shape. | boolean (advanced) |
| `disable-zoom` | Disable image modal | Disable clicks opening the image in an image inspector dialog. | boolean (advanced) |

## DDD usage

Its source references 26 distinct design-system variables. By family: font (9), theme (9), spacing (6), component (5), border (3), lh (2). Most used: `--ddd-theme-accent`, `--ddd-font-size-4xs`, `--ddd-theme-default-limestoneLight`, `--ddd-spacing-5`, `--ddd-border-sm`, `--ddd-component-figure-label-title`.
