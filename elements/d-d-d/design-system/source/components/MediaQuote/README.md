# MediaQuote

Image with a quote, citation, and optional caption.

- Package `@haxtheweb/media-quote` 26.8.0
- HAX block "Media quote" (Media, quote)
- HAX design-system controls offered: primary, accent, font

## Usage

```html
<media-quote src="media/workflow.jpg" alt="A cat stalking a small toy"><span slot='quote'>A cute cat stalking a toy</span> <span slot='author'>John Doe</span> <span slot='author-detail'>Professional Cat Photographer</span> <span slot='caption'>This cat is stalking a Totoro toy. How cute!</span></media-quote>
```

## The consumer provides

| Attribute / slot | Label | What it does | HAX input |
|---|---|---|---|
| `slot "quote"` | Quote | Quote text. | textfield |
| `slot "author"` | Author | Quote author. | textfield |
| `slot "author-detail"` | Author details | Author details. | textfield |
| `slot "caption"` | Caption | Image caption. | textfield |
| `src` | Image Source | Image file used for media quote. | haxupload |
| `alt` | Alt Text | Alternative text for the image. | alt |
| `accent-color` | Accent Color | Card accent color. | colorpicker (advanced) |

## DDD usage

Its source references 15 distinct design-system variables. By family: font (11), spacing (9), theme (4), primary (2), border (1). Most used: `--ddd-spacing-2`, `--ddd-font-size-4xs`, `--ddd-font-size-xs`, `--ddd-spacing-0`, `--ddd-spacing-3`, `--ddd-theme-primary`.
