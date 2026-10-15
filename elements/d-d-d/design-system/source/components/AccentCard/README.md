# AccentCard

A card with optional accent styling.

- Package `@haxtheweb/accent-card` 26.8.0
- HAX block "Card" (Layout, content, card, Image, Presentation)

## Usage

```html
<accent-card accent-color="red" accent-heading horizontal image-src="media/card-2.jpg"><h3 slot="heading">Accent Card</h3><h4 slot="subheading">A card with optional accent stylings.</h4><div slot="content"><p>This card is highly customizable to contain any content you'd like</p></div></accent-card>
```

## The consumer provides

| Attribute / slot | Label | What it does | HAX input |
|---|---|---|---|
| `slot "heading"` | Heading | A heading for card. | textfield |
| `slot "subheading"` | Subheading | An optional subheading for card. | textfield |
| `slot "content"` | Content | Content for card. | textfield |
| `slot "footer"` | Footer | An optional footer for card. | textfield |
| `image-src` | Image | Optional image | haxupload |
| `image-alt` | Image Alt Text | Alternative text describing the image for screen readers. Leave empty only if the image is purely decorative. | textfield |
| `image-align` | imageAlign | Image Horizontal Alignment | select |
| `image-valign` | imageValign | Image Vertical Alignment | select |
| `accent-color` | Accent Color | An optional accent color. | colorpicker |
| `dark` | Dark Theme | Enable Dark Theme | boolean |
| `horizontal` | Horizontal | Horizontal orientation? | boolean |
| `accent-heading` | Heading Accent | Apply accent color to heading? | boolean |
| `accent-background` | Background Accent | Apply accent color to card background? | boolean |
| `no-border` | No Border Accent | Remove border accent? | boolean |
| `flat` | Flat | Remove box shadow? | boolean |
| `slot "corner"` | Corner | Content for card corner. | textfield (advanced) |

## DDD usage

Its source references 18 distinct design-system variables. By family: border (10), theme (8), spacing (7), simple-colors (6), icon (4), radius (2). Most used: `--ddd-border-xs`, `--ddd-border-lg`, `--ddd-spacing-4`, `--ddd-theme-default-white`, `--ddd-spacing-2`, `--ddd-theme-default-coalyGray`.
