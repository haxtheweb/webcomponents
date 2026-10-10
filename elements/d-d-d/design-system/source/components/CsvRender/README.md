# CsvRender

Remote render a CSV file in place as an accessible table.

- Package `@haxtheweb/csv-render` 26.8.0

## Usage

```html
<csv-render data-source="data/demo.csv" summary="Student scores from the previous 12 month period." caption="Student semester scores"></csv-render>
```

## Properties

No HAX settings are declared; these are its public reactive properties.

| Attribute | Type |
|---|---|
| `is-safari` | Boolean |
| `element-visible` | Boolean |
| `data-source` | String |
| `loading` | Boolean |
| `debounce-delay` | Number |
| `caption` | String |
| `summary` | String |
| `table` | Array |
| `tableheadings` | Array |
| `table-data` | String |

## DDD usage

Its source references 7 distinct design-system variables. By family: simple-colors (10), theme (4). Most used: `--simple-colors-default-theme-accent-6`, `--ddd-theme-default-white`, `--simple-colors-default-theme-accent-1`, `--simple-colors-default-theme-accent-2`, `--ddd-theme-default-black`, `--ddd-theme-default-coalyGray`.
