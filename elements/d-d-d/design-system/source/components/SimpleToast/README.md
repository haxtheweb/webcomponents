# SimpleToast

A singular toast / message for conistency.

- Package `@haxtheweb/simple-toast` 26.8.0

## Usage

```html
<p>simple-toast is a page-level singleton. Code raises it with a <code>simple-toast-show</code> event.</p>
```

## Properties

No HAX settings are declared; these are its public reactive properties.

| Attribute | Type |
|---|---|
| `is-safari` | Boolean |
| `opened` | Boolean |
| `text` | String |
| `class-style` | String |
| `close-text` | String |
| `duration` | Number |
| `event-callback` | String |
| `close-button` | Boolean |

## DDD usage

Its source references 13 distinct design-system variables. By family: spacing (13), theme (6), font (2), boxShadow (1), border (1), radius (1). Most used: `--ddd-spacing-5`, `--ddd-spacing-2`, `--ddd-theme-primary`, `--ddd-theme-default-white`, `--ddd-theme-default-coalyGray`, `--ddd-spacing-9`.

## Preview notes

A page-level singleton: dispatch a simple-toast-show event with { text, duration } to raise it.
