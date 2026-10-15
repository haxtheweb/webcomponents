# PageSection

Section container for page content and screen-based layouts.

- Package `@haxtheweb/page-section` 26.8.0
- HAX block "Page section" (Layout, page, section, container, cta)

## Usage

```html
<page-section preset="antihero" filter bg="light-blue" full fold scroller><h2>Sharp looking section</h2><hr/><p>This is some sharp looking, well presented content</p><simple-cta hotline filled outlined slot="buttons">Really sharp</simple-cta></page-section>
```

## The consumer provides

| Attribute / slot | Label | What it does | HAX input |
|---|---|---|---|
| `preset` | Design treatment | Preset style that updates related settings. | radio |
| `image` | Image | Background media for the section. | haxupload |
| `bg` | Background color | Background color when no image is set. | colorpicker |
| `scroller` | Scroll button | Show a button that scrolls to the next section. | boolean (advanced) |
| `fold` | Display fold | Show a visual fold at the bottom of the section. | boolean (advanced) |
| `full` | Full screen size | Fill the viewer's screen height. | boolean (advanced) |
| `filter` | Apply Filter | Apply a visual filter to the background image. | boolean (advanced) |
| `default slot` | Content | Section content. | textfield (advanced) |
| `slot "entice"` | Entice | Optional enticement content. | textfield (advanced) |
| `slot "buttons"` | Buttons | Button group shown below the text. | textfield (advanced) |

## DDD usage

Its source references 38 distinct design-system variables. By family: spacing (25), theme (23), icon (14), font (12), simple-colors (5). Most used: `--ddd-spacing-25`, `--ddd-icon-xl`, `--ddd-icon-md`, `--ddd-theme-default-limestoneLight`, `--ddd-spacing-2`, `--ddd-spacing-4`.
