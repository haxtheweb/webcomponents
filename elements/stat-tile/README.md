# stat-tile

One number that matters, with its label and how it changed. Place several in a grid for a dashboard row.

```html
<stat-tile label="Enrolled" value="1284" change="6% this term" trend="up"></stat-tile>
```

| Attribute | What it does |
|---|---|
| `label` | What the number measures. |
| `value` | The number. A plain number is grouped for the page language (`1284` shows as 1,284); anything else (`87%`, `4.2 hrs`) shows as written. |
| `change` | How it changed, in words: `6% this term`. Optional. |
| `trend` | `up` or `down`. Draws an arrow and says the direction to screen readers; up is the success color, down the error color. Optional. |

The tile is a description list (`dl`), so the label and value are read as a pair. It draws its frame from the DDD card tokens (`--ddd-card-radius`, `--ddd-card-padding`, `--ddd-card-border-width`, `--ddd-card-shadow`), so it follows the active design system.

## Commands

- `yarn start` - development server
- `yarn run build` - format, analyze and extract docs
- `yarn test` - run tests
