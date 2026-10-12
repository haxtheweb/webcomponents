# ImageGallery

A gallery that presents images in grid, masonry, or slideshow layouts.

- Package `@haxtheweb/image-gallery` 26.8.0
- HAX block "Image Gallery" (Media, image, gallery, grid, masonry)
- HAX design-system controls offered: primary

## Usage

```html
<image-gallery mode="masonry"><media-image source="media/banner.jpg" alt="Sample image 1"></media-image><media-image source="media/workflow.jpg" alt="Sample image 2"></media-image><media-image source="media/card-1.jpg" alt="Sample image 3"></media-image></image-gallery>
```

## The consumer provides

| Attribute / slot | Label | What it does | HAX input |
|---|---|---|---|
| `mode` | Display mode | How to present the images in the gallery. | select |
| `active-index` | Active index | Index of the active image to start on in gallery mode. | number (advanced) |

## DDD usage

Its source references 22 distinct design-system variables. By family: theme (21), spacing (16), icon (6), border (5), radius (5), timing (4). Most used: `--ddd-spacing-2`, `--ddd-theme-primary`, `--ddd-radius-sm`, `--ddd-spacing-1`, `--ddd-theme-default-coalyGray`, `--ddd-theme-default-limestoneLight`.
