# tailwind-theme

A HAXcms theme in a Tailwind-style documentation layout (top bar, bordered sidebar that overlays below 1024px, 768px reading column), built on the **Tailwind DDD bridge**.

## What the bridge does

HAX blocks only read DDD tokens (`--ddd-*`). This package re-expresses Tailwind CSS's tokens under their own names and points every DDD token a block reads at the closest Tailwind token. While this theme is active, blocks take on Tailwind's color, type, corners, elevation, focus and motion. Authored content stays plain DDD content that renders in any other theme.

The design system registers as `tailwind` with `extends: "ddd"` in `DesignSystemManager`, so DDD's styles, data attributes and HAX authoring options stay in place.

| File | What it is |
|---|---|
| `design-system/bridge.json` | The authored mapping: pinned sources, fonts, and each DDD token → Tailwind token |
| `lib/TailwindTokens.js` | Generated: the Tailwind tokens the map and theme use, as `light-dark()` pairs |
| `lib/TailwindDDDMap.js` | Generated: the `--ddd-*` → Tailwind remap |
| `lib/tailwind.ddd-map.json` | Generated: the full map with resolved values, coverage per contract tier and a contrast report |
| `lib/TailwindDesignSystem.js` | Registers and activates the `tailwind` design system |
| `tailwind-theme.js` | The theme |

## Coverage

Checked against the shared [bridge contract](../d-d-d/design-system/bridge/README.md): identity 100%, feel 17%, semantic 42% (density as multiples of Tailwind's `--spacing`: p-6 surface padding, space-y-4 stack gap, gap-2 inline gap, px-4 control padding), structure locked. Tailwind has no brand color, so blue-600 stands in. Only open-source values are used (no Tailwind Plus/UI), and authored content uses no utility classes. Kept as DDD on purpose: duration-normal/slow and emphasized easing (Tailwind defines one transition duration), state opacities and control heights (no tokens), border widths, and heading/body sizes.

## Rebuilding the tokens

```
yarn ddd:bridge elements/tailwind-theme          # from the monorepo root
yarn ddd:bridge elements/tailwind-theme --check  # fail if the generated files are stale
```

## Attribution

See `NOTICE`. Type: Tailwind's default system font stack; no web font is loaded. This is an independent HAX integration, not affiliated with or endorsed by Tailwind Labs.
