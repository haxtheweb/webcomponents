# SimpleCta

A simple button with a link to take action.

- Package `@haxtheweb/simple-cta` 26.8.0
- HAX block "Call to action" (Layout, marketing, button, link, url)
- HAX design-system controls offered: primary, accent

## Usage

```html
<simple-cta label="Click to learn more" link="https://haxtheweb.org/"></simple-cta>
```

## The consumer provides

| Attribute / slot | Label | What it does | HAX input |
|---|---|---|---|
| `label` | Label | Link label | textfield |
| `link` | Link | Enter a link to any resource | haxupload |
| `hide-icon` | Hide icon | Hide the icon used to accent text | boolean |
| `icon` | Icon | Action link icon | iconpicker (advanced) |

## DDD usage

Its source references 10 distinct design-system variables. By family: theme (20), font (3), radius (2), icon (2), spacing (1), border (1). Most used: `--ddd-theme-default-link`, `--ddd-theme-accent`, `--ddd-theme-bgContrast`, `--ddd-theme-primary`, `--ddd-font-weight-black`, `--ddd-radius-xs`.
