# PersonTestimonial

Stylized quote with an optional image.

- Package `@haxtheweb/person-testimonial` 26.8.0
- HAX block "Image Blockquote" (Layout, content, presentation, blockquote, quote)
- HAX design-system controls offered: primary

## Usage

```html
<person-testimonial position="Coffee drinker" name="bto-pro" image="media/headshot.jpg"><p>I at times, enjoy coffee. Those times, are all times.</p></person-testimonial>
```

## The consumer provides

| Attribute / slot | Label | What it does | HAX input |
|---|---|---|---|
| `image` | Image | Add an image to the testimonial. | haxupload |
| `name` | Full Name | Name of the person giving the testimonial. | textfield |
| `position` | Position or Job Title | Position or job title of the person. | textfield |
| `default slot` | Quote | Quote from the testimonial author. | textfield |

## DDD usage

Its source references 17 distinct design-system variables. By family: theme (6), spacing (6), font (5), icon (2), boxShadow (1), lh (1). Most used: `--ddd-spacing-1`, `--ddd-theme-default-coalyGray`, `--ddd-icon-xxs`, `--ddd-font-primary`, `--ddd-theme-default-limestoneMaxLight`, `--ddd-theme-primary`.
