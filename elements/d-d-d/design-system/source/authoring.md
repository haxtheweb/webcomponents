# Authoring attributes and palettes

HAX authors theme content with data attributes instead of CSS. These attributes work on plain HTML inside any DDD context. Components should honour them rather than invent parallel props.

## Data attributes

| Attribute | Values | Effect |
|---|---|---|
| `data-primary` | `0`–`25` | Sets `--ddd-theme-primary` to `--ddd-primary-N`, plus `--ddd-theme-bgContrast` (white) or `--lowContrast-override` (black) for text on it |
| `data-accent` | `0`–`14` | Sets `--ddd-theme-accent` to `--ddd-accent-N`. On `p`, `blockquote`, `ol`, `ul` and `div` this gives an accent background, a `--ddd-border-sm` border in the primary colour, and `--ddd-spacing-6` padding |
| `data-design-treatment` | `vert`, `horz-10p`, `horz-25p`, `horz-50p`, `horz-full`, `horz-md`, `horz-lg`, `bg`, `dropCap-xs…xl` | Heading rule or fill in the primary colour, or a drop cap of 2–10 lines |
| `data-instructional-action` | a learning verb or noun (`reflect`, `quiz`, `objectives`…) | Icon before the heading in that action's colour |
| `data-font-family` | `primary`, `secondary`, `navigation` | Switches between the three families |
| `data-font-weight` | `light`, `regular`, `medium`, `bold`, `black` | `--ddd-font-weight-*` |
| `data-font-size` | `6xs`…`4xl`, `type1-s/m/l` | `--ddd-font-size-*` with line-height normal |
| `data-padding` / `data-margin` | `xs` 8, `s` 16, `m` 32, `l` 48, `xl` 64 (margin also `center`) | Only from 600px up |
| `data-width` | `25`, `50`, `75`, `100` | Percent width, only from 600px up |
| `data-float-position` | `left`, `right` | Float with `spacing-8`/`spacing-4` margins, only from 1440px up |
| `data-border` | `xs`, `sm`, `md`, `lg` | `--ddd-border-*` |
| `data-border-radius` | `xs` (Rounded), `sm`, `md` (Rounder), `lg`, `xl` (Roundest) | `--ddd-radius-*` |
| `data-box-shadow` | `sm`, `md`, `lg`, `xl` | `--ddd-boxShadow-*` |
| `data-text-align` | `left`, `center`, `right`, `justify` | |
| `data-pulse` | (none), `1`, `2` | Attention pulse ring in the primary colour, 16/24/40px |

Utility classes mirror these attributes: `.r-*` (radius), `.bs-*` (shadow), `.fw-0…3`, `.ls-<px>-sm|lg`, `.bg-gradient-*`, `.ddd-font-primary|secondary|navigation`, `.h-invert`, `.breadcrumb`, `.sr-only`.

## Palettes (`data-palette`)

A palette sets seven fills, `--ddd-palette-color-1…7`, and seven matching inks, `--ddd-palette-text-color-1…7`. Ink N is meant to sit on fill N. Use a palette when a whole region or site needs a coordinated scheme; use `data-primary`/`data-accent` for a single block. Palettes draw on DDD base colours and SimpleColors shades, all of which are tokens in this system. The Foundations › Palettes card renders every palette live.

| # | Name | Built from |
|---|---|---|
| — | Default | Coaly gray, SimpleColors greys, amber |
| 0 | wisdom-walk-green | greens and limes, Future lime, Invent orange. The source notes text-color-4 fails contrast |
| 1 | very-violent-red | reds, Discovery coral, Slate gray, Pugh blue |
| 2 | beetles-yellow | oranges, Keystone yellow, Creek teal |
| 3 | offbrand-nittany-blue | Nittany navy, light blues, orange, Keystone yellow |
| 4 | boring-blue-gray | Coaly gray, blue-greys, Slate gray |
| 5 | monotone | greys from 12 to white |
| 6 | salmon-season | pinks, Original 87 pink, Discovery coral, limes |
| 7 | tweedle-dee | indigo through pink |
| 8 | polaris-invent | Sky blue, Beaver blue, Nittany navy, Limestone, Invent orange |
| 9 | positively-purple | Wonder purple, Atherton violet, Shrine tan |
| 10 | honey-bear | deep oranges, Landgrant brown, ambers |
| 11 | boldly-lion | Nittany navy, Beaver blue, Pugh blue, Slate, Limestone, Keystone yellow, all-DDD |
| 12 | ocean-current | indigo, blues, cyan, teal, amber |
| 13 | twilight-indigo | deep purples and indigos, blue-greys |
| 14 | evergreen-earth | greens, browns, amber |
| 15 | graphite-contrast | Coaly gray, greys, cyan, amber |

`hax-palette-picker` previews and applies palettes. Check every palette in a dark context before shipping it.
