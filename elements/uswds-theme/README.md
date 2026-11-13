# uswds-theme

A HAXcms theme in the [U.S. Web Design System](https://designsystem.digital.gov) page templates, built on the **USWDS DDD bridge**:

- **Header**: a basic header with the site title and, on desktop, the top-level pages as primary navigation (current page in primary with a bar under it). Below 1024px a text **Menu** button opens the full navigation.
- **Landing page**: the site's first page uses the USWDS landing page layout. The content column is centered and `page-section` blocks run edge to edge, so a hero, a tagline and a dark graphic list are plain HAX content. The page title stays for screen readers; the hero carries the visible heading.
- **Inner pages**: the documentation layout, with side navigation (a rule above each row, a bar on the current item), breadcrumbs and a reading column.
- **Footer**: a return-to-top link, a band of primary links and a secondary band with the site title and the `footerPrimary` region.

## What the bridge does

HAX blocks only read DDD tokens (`--ddd-*`). This package re-expresses the USWDS palette under its own names and points every DDD token a block reads at the closest USWDS value from its default theme. While this theme is active, the whole block ecosystem takes on USWDS colors, Source Sans and Merriweather, radii, shadows and its thick focus outline, and authored content stays plain DDD content that renders in any other theme.

The design system registers as `uswds` with `extends: "ddd"` in `DesignSystemManager`, so DDD's styles, data attributes and HAX authoring options stay in place and the USWDS layer is added after them.

| File | What it is |
|---|---|
| `design-system/bridge.json` | The authored mapping: upstream package and version, the color map files, fonts, and each DDD token → USWDS value |
| `lib/UswdsTokens.js` | Generated: the USWDS palette colors the map and theme use |
| `lib/UswdsDDDMap.js` | Generated: the `--ddd-*` → `--usa-*` remap |
| `lib/uswds.ddd-map.json` | Generated: the full map with resolved values, coverage per contract tier and a contrast report |
| `lib/UswdsDesignSystem.js` | Registers and activates the `uswds` design system |
| `uswds-theme.js` | The theme |

USWDS keeps its palette in Sass maps, so the bridge reads them with the generator's `scss-map` format. Vivid grades are written as `--usa-<family>-vivid-<grade>`: USWDS's `blue-60v` is `--usa-blue-vivid-60`. Values USWDS only computes in Sass (font stacks, weights, radii, shadows, the focus outline, card and button spacing) are literal entries whose notes name the USWDS setting they come from.

## Coverage

Checked against the shared [bridge contract](../d-d-d/design-system/bridge/README.md): identity 94%, feel 0%, semantic 42% (density from USWDS card and button spacing: 24px card padding, 16px card gap, 20px button padding), structure locked. Named colors follow the default theme's roles: primary `blue-60v`, dark brand `blue-warm-70v`/`80v`, base `gray-cool`, success `green-cool`, warning `gold`, and the visited-link `violet-70v` as HAX's incorrect purple. Warning text is `gold-60v`, one step past the default `warning-darker`, which is 4.11:1 on `warning-lighter`. Kept as DDD on purpose: medium and black weights (USWDS sets none), radius-lg/xl (USWDS stops at 8px plus pill), motion and state opacities (no tokens), control heights, border widths, and heading/body sizes. USWDS has no dark mode; the theme chrome pairs palette steps with `light-dark()`.

## Rebuilding the tokens

```
yarn ddd:bridge elements/uswds-theme          # from the monorepo root
yarn ddd:bridge elements/uswds-theme --check  # fail if the generated files are stale
```

The generator fetches `@uswds/uswds` at the version pinned in `bridge.json` with `npm pack`, so USWDS is never a dependency of this package. The package's `license` field points at its `LICENSE.md`, so the generator checks that file for the CC0 1.0 dedication before reading anything.

## Attribution

Token values come from the U.S. Web Design System (`@uswds/uswds` 3.14.0), a work of the U.S. government in the public domain in the United States and dedicated worldwide under CC0 1.0. Source Sans 3 and Merriweather (SIL Open Font License 1.1) and Roboto Mono (Apache-2.0) load from Google Fonts. See `NOTICE`.

This is an independent HAX integration, not affiliated with or endorsed by the General Services Administration or any government agency. It does not include the official government website banner, agency seals or the identifier, which are for real federal websites only.
