# material-theme

A HAXcms theme in the Material 3 layout (top app bar, navigation drawer that overlays below 840px, content surface), built on the **Material 3 DDD bridge**.

## What the bridge does

HAX blocks only read DDD tokens (`--ddd-*`). This package re-expresses Material Design 3's tokens under their own names and points every DDD token a block reads at the closest Material 3 token. While this theme is active, blocks take on Material 3's color, type, corners, elevation, focus and motion. Authored content stays plain DDD content that renders in any other theme.

The design system registers as `material` with `extends: "ddd"` in `DesignSystemManager`, so DDD's styles, data attributes and HAX authoring options stay in place.

| File | What it is |
|---|---|
| `design-system/bridge.json` | The authored mapping: pinned sources, fonts, and each DDD token → Material 3 token |
| `lib/MaterialTokens.js` | Generated: the Material 3 tokens the map and theme use, as `light-dark()` pairs |
| `lib/MaterialDDDMap.js` | Generated: the `--ddd-*` → Material 3 remap |
| `lib/material.ddd-map.json` | Generated: the full map with resolved values, coverage per contract tier and a contrast report |
| `lib/MaterialDesignSystem.js` | Registers and activates the `material` design system |
| `material-theme.js` | The theme |

## Coverage

Checked against the shared [bridge contract](../d-d-d/design-system/bridge/README.md): identity 97%, feel 52%, semantic 0%, structure locked. M3's baseline primary is purple, so brand roles are purple. Incorrect stays on the purple static palette and correct on green; with HAX's labels, icons and line styles, the meaning channels hold. Kept as DDD on purpose: light and black font weights (M3 types Roboto at 400/500/700), control heights, border widths, and heading/body sizes.

## Rebuilding the tokens

```
yarn ddd:bridge elements/material-theme          # from the monorepo root
yarn ddd:bridge elements/material-theme --check  # fail if the generated files are stale
```

## Attribution

See `NOTICE`. Type: Roboto (SIL Open Font License 1.1) and Roboto Mono (Apache-2.0). This is an independent HAX integration, not affiliated with or endorsed by Google.
