# material-theme

A HAXcms theme laid out like the Material Design 3 site itself (top app bar; a navigation rail of top-level pages, each with its `metadata.icon` and a pill indicator on the current section, hidden below 600px; a navigation drawer for the whole outline that overlays below 840px; content on a rounded surface), built on the **Material 3 DDD bridge**.

The demo site (`demo/`) is a course design kit in that layout: a home page with a hero and "What's new" cards, get started, foundations, styles, components with tabs and learning checks, and the bridge's coverage, all authored with ordinary HAX blocks. Its artwork in `demo/files` is original to this repository.

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

Checked against the shared [bridge contract](../d-d-d/design-system/bridge/README.md): identity 97%, feel 52%, semantic 42% (density from M3 layout guidance: 16px card padding and stack gap, 8px inline gap; button padding from `md.comp.button.leading-space`, 24px), structure locked. M3's baseline primary is purple, so brand roles are purple. Incorrect stays on the purple static palette and correct on green; with HAX's labels, icons and line styles, the meaning channels hold. Kept as DDD on purpose: light and black font weights (M3 types Roboto at 400/500/700), control heights, border widths, and heading/body sizes.

## Rebuilding the tokens

```
yarn ddd:bridge elements/material-theme          # from the monorepo root
yarn ddd:bridge elements/material-theme --check  # fail if the generated files are stale
```

## Attribution

See `NOTICE`. Type: Roboto (SIL Open Font License 1.1) and Roboto Mono (Apache-2.0). This is an independent HAX integration, not affiliated with or endorsed by Google.
