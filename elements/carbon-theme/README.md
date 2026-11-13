# carbon-theme

A HAXcms theme in the layout of Carbon's own documentation site, [carbondesignsystem.com](https://carbondesignsystem.com), built on the **Carbon DDD bridge**:

- **UI shell**: a light 48px header and a side navigation on the background layer, with the current item on the selected background and a 3px interactive bar. Both follow the theme into g100 in dark mode.
- **Page header**: each page opens with a panel holding the breadcrumb, a light display title and the page description as lead text.
- **Content**: on the `layer-01` gray below the header, with previous and next as ghost buttons on a rule.

## What the bridge does

HAX blocks only read DDD tokens (`--ddd-*`). This package re-expresses Carbon's tokens under their own names (`--cds-*` from the white and g100 themes; the IBM palette and Carbon motion as `--carbon-*`) and points every DDD token a block reads at the closest Carbon token. While this theme is active, blocks take on Carbon color, IBM Plex type, square corners, Carbon's single elevation, its focus ring, productive motion and control heights. Authored content stays plain DDD content that renders in any other theme.

The design system registers as `carbon` with `extends: "ddd"` in `DesignSystemManager`, so DDD's styles, data attributes and HAX authoring options stay in place.

| File | What it is |
|---|---|
| `design-system/bridge.json` | The authored mapping: sources (`@carbon/styles` CSS, `@carbon/colors` and `@carbon/motion` DTCG), fonts, and each DDD token → Carbon token |
| `lib/CarbonTokens.js` | Generated: the Carbon tokens the map and theme use, as `light-dark()` pairs |
| `lib/CarbonDDDMap.js` | Generated: the `--ddd-*` → Carbon remap |
| `lib/carbon.ddd-map.json` | Generated: the full map with resolved values, coverage per contract tier and a contrast report |
| `lib/CarbonDesignSystem.js` | Registers and activates the `carbon` design system |
| `carbon-theme.js` | The theme |

## Coverage

Checked against the shared [bridge contract](../d-d-d/design-system/bridge/README.md): identity 97%, feel 61%, semantic 42% (density at Carbon's spacing steps: 16px surface padding and stack gap, 8px inline gap, which match DDD), structure locked. Kept as DDD on purpose: font weights medium and black (Carbon only has light, regular and semibold), state opacities (Carbon uses hover colors), border widths (same values), and heading/body sizes (Carbon body-01 is 14px, under the 16px floor). Carbon's spacing scale sits on DDD's 4px grid, so the theme chrome uses DDD spacing.

## Rebuilding the tokens

```
yarn ddd:bridge elements/carbon-theme          # from the monorepo root
yarn ddd:bridge elements/carbon-theme --check  # fail if the generated files are stale
```

## Attribution

See `NOTICE`. IBM Plex is licensed under the SIL Open Font License 1.1 and loads from Google Fonts. This is an independent HAX integration, not affiliated with or endorsed by IBM.
