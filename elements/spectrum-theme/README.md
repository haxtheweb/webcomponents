# spectrum-theme

A HAXcms theme in an Adobe Spectrum 2 app frame (header, side navigation that overlays below 1024px, rounded content panel), built on the **Spectrum DDD bridge**.

## What the bridge does

HAX blocks only read DDD tokens (`--ddd-*`). This package re-expresses Adobe Spectrum's tokens under their own names and points every DDD token a block reads at the closest Spectrum token. While this theme is active, blocks take on Spectrum's color, type, corners, elevation, focus and motion. Authored content stays plain DDD content that renders in any other theme.

The design system registers as `spectrum` with `extends: "ddd"` in `DesignSystemManager`, so DDD's styles, data attributes and HAX authoring options stay in place.

| File | What it is |
|---|---|
| `design-system/bridge.json` | The authored mapping: pinned sources, fonts, and each DDD token → Spectrum token |
| `lib/SpectrumTokens.js` | Generated: the Spectrum tokens the map and theme use, as `light-dark()` pairs |
| `lib/SpectrumDDDMap.js` | Generated: the `--ddd-*` → Spectrum remap |
| `lib/spectrum.ddd-map.json` | Generated: the full map with resolved values, coverage per contract tier and a contrast report |
| `lib/SpectrumDesignSystem.js` | Registers and activates the `spectrum` design system |
| `spectrum-theme.js` | The theme |

## Coverage

Checked against the shared [bridge contract](../d-d-d/design-system/bridge/README.md): identity 97%, feel 57%, semantic 0%, structure locked. Spectrum defines its palette per mode, so named DDD colors take the light set as constants (`fromMode`). Kept as DDD on purpose: shadows lg/xl (Spectrum has one drop shadow), emphasized easing, state opacities (Spectrum uses state colors), border widths (same values), and heading/body sizes (DDD reading sizes stay).

## Rebuilding the tokens

```
yarn ddd:bridge elements/spectrum-theme          # from the monorepo root
yarn ddd:bridge elements/spectrum-theme --check  # fail if the generated files are stale
```

## Attribution

See `NOTICE`. Type: Source Sans 3 and Source Code Pro, licensed under the SIL Open Font License 1.1. Spectrum's own face, Adobe Clean, is proprietary and is never loaded; Source Sans 3 is the open face its font stack falls back to. This is an independent HAX integration, not affiliated with or endorsed by Adobe.
