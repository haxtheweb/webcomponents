# radar-chart

Radar (spider) chart built with Lit and the DDD design system, for maturity models, skill evaluations and facet scoring such as HEOSAT. Defaults to the nine HEOSAT facets.

```html
<radar-chart title="HEOSAT facet scores" scores="3,2,4,3,2,3,5,4,2"></radar-chart>
```

## Properties

| Property / attribute | Default | Notes |
| --- | --- | --- |
| `title` | `Maturity by category` | Visible heading and accessible name of the chart |
| `maxScore` / `max-score` | `5` | Top of the scale |
| `categories` | nine HEOSAT facets | Array, JSON array string, or one per line. Needs 3 or more |
| `scores` | all `0` | Array, JSON array string, or comma separated numbers |
| `targetScores` / `target-scores` | all `5` | Same formats as `scores` |
| `showLegend` / `show-legend` | `true` | `show-legend="false"` hides it |
| `scoreLabel` / `score-label` | `Your score` | Legend and table label |
| `targetLabel` / `target-label` | `Target / Level 5` | Legend and table label |

Scores are clamped between 0 and `maxScore`.

## Accessibility

The SVG has `role="img"`, is named by the title and described by a text summary containing every value. The same data is also available as a table inside a `details` element. Target and score are told apart by dash pattern as well as color.

## Styling

`--radar-chart-score-color`, `--radar-chart-target-color`, `--radar-chart-grid-color`, `--radar-chart-max-width`. All default to DDD tokens.

## Commands

- `yarn start` - development server
- `yarn build` - format and analyze
- `yarn test` - run tests
