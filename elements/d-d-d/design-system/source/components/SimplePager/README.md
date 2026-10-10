# SimplePager

A presentational pager that mirrors a limit/offset/total page shape and fires one page-changed event; it does no fetching itself.

- Package `@haxtheweb/simple-pager` 26.8.0

## Usage

```html
<simple-pager total="137" limit="25" offset="50" max-buttons="7"></simple-pager>
```

## Properties

No HAX settings are declared; these are its public reactive properties.

| Attribute | Type |
|---|---|
| `is-safari` | Boolean |
| `limit` | Number |
| `offset` | Number |
| `total` | Number |
| `count` | Number |
| `mode` | String |
| `max-page-buttons` | Number |
| `force-visible` | Boolean |
| `label` | String |

## DDD usage

Its source references 18 distinct design-system variables. By family: theme (16), spacing (9), font (6), border (3), radius (2), icon (2). Most used: `--ddd-theme-default-navy`, `--ddd-spacing-1`, `--ddd-border-xs`, `--ddd-font-size-4xs`, `--ddd-theme-default-slateGray`, `--ddd-font-navigation`.
