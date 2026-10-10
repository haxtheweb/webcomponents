# DDD design tokens (DTCG)

These files are the DDD design tokens in the [W3C Design Tokens Community Group format](https://www.designtokens.org/), for use in Figma (via Tokens Studio), Style Dictionary, Penpot and other tools that read DTCG.

| File | What it holds |
|---|---|
| `ddd.tokens.json` | Every DDD token, with light values, plus SimpleColors (`simple-colors.fixed.*` and `simple-colors.default.*`). |
| `ddd.dark.tokens.json` | Only the tokens that change in dark mode: the `light-dark()` pairs in `DDDStyles.js` (shadows) and the SimpleColors default-theme flip. Apply it on top of `ddd.tokens.json`. |
| `$themes.json`, `$metadata.json` | Light and Dark themes and the set order, for Tokens Studio's multi-file sync. |

These files are **generated**, so don't edit them by hand. After you change `elements/d-d-d/lib/DDDStyles.js` or SimpleColors, run:

```
yarn tokens:ddd
```

CI runs `node elements/d-d-d/design-system/build-tokens.js --check` and fails when these files are stale.

## Conventions

- **Paths follow the CSS names.** For example:
  - `--ddd-theme-default-beaverBlue` → `ddd.color.beaverBlue`
  - `--ddd-primary-1` → `ddd.color.primary.1`
  - `--ddd-spacing-4` → `ddd.spacing.4`
  - `--ddd-font-size-xxs` → `ddd.font.size.xxs`
  - `--simple-colors-default-theme-cyan-1` → `simple-colors.default.cyan.1`
- **CSS name on every token.** Each token records its CSS custom property in `$extensions["org.haxtheweb.ddd"].cssVar`, so tool output can map straight back to `var(--ddd-*)`.
- **Aliases stay aliases.** `--ddd-primary-1: var(--ddd-theme-default-beaverBlue)` becomes `"$value": "{ddd.color.beaverBlue}"`.
- **Composite types.**
  - `ddd.border.*` and `ddd.focus.ring` are `border` composites.
  - `ddd.shadow.*` are `shadow` composites.
  - `ddd.easing.ease` is a `cubicBezier`.
- **Untyped tokens.** Gradients and percentage values (`radius.circle`, `headerBorder.treatment.*p`) have no DTCG type, so they keep their CSS value and no `$type`.
- **Left out of the export.** The `--ddd-primary-N-rgb` channel triplets, and the few component defaults DDD sets (`--simple-tooltip-*`, `--simple-modal-*`).
- **Not tokens.** `--ddd-theme-primary` and `--ddd-theme-accent` are set by `data-primary` and `data-accent` at runtime, so they are not tokens. Map those attributes to `ddd.color.primary.N` and `ddd.color.accent.N`.
