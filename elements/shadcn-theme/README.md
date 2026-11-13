# shadcn-theme

A HAXcms theme in the shadcn/ui sidebar layout (sidebar, inset panel with a header and breadcrumb; the sidebar overlays below 768px), built on the **shadcn/ui DDD bridge**.

## What the bridge does

HAX blocks only read DDD tokens (`--ddd-*`). This package re-expresses shadcn/ui's tokens under their own names and points every DDD token a block reads at the closest shadcn/ui token. While this theme is active, blocks take on shadcn/ui's color, type, corners, elevation, focus and motion. Authored content stays plain DDD content that renders in any other theme.

The design system registers as `shadcn` with `extends: "ddd"` in `DesignSystemManager`, so DDD's styles, data attributes and HAX authoring options stay in place.

| File | What it is |
|---|---|
| `design-system/bridge.json` | The authored mapping: pinned sources, fonts, and each DDD token → shadcn/ui token |
| `lib/ShadcnTokens.js` | Generated: the shadcn/ui tokens the map and theme use, as `light-dark()` pairs |
| `lib/ShadcnDDDMap.js` | Generated: the `--ddd-*` → shadcn/ui remap |
| `lib/shadcn.ddd-map.json` | Generated: the full map with resolved values, coverage per contract tier and a contrast report |
| `lib/ShadcnDesignSystem.js` | Registers and activates the `shadcn` design system |
| `shadcn-theme.js` | The theme |

## Coverage

Checked against the shared [bridge contract](../d-d-d/design-system/bridge/README.md): identity 100%, feel 17%, semantic 0%, structure locked. shadcn doesn't publish its theme to npm, so the bridge pins the file `shadcn init` writes to a repository commit and verifies it by sha256. Brand roles use neutral, as shadcn's primary does. The focus ring uses `--primary` because shadcn's 50% `--ring` gray is under 3:1 on white. Kept as DDD on purpose: duration-normal/slow and emphasized easing, state opacities and control heights (no tokens), border widths, and heading/body sizes.

## Rebuilding the tokens

```
yarn ddd:bridge elements/shadcn-theme          # from the monorepo root
yarn ddd:bridge elements/shadcn-theme --check  # fail if the generated files are stale
```

## Attribution

See `NOTICE`. Type: Geist and Geist Mono, licensed under the SIL Open Font License 1.1. This is an independent HAX integration, not affiliated with or endorsed by shadcn.
