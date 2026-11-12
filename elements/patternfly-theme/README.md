# patternfly-theme

A HAXcms theme in the [PatternFly 6](https://www.patternfly.org) page layout (masthead, sidebar navigation, inset main container), built on the **PatternFly DDD bridge**.

## What the bridge does

HAX blocks only read DDD tokens (`--ddd-*`). This package re-expresses PatternFly's tokens under their own names and points every DDD token a block reads at the closest PatternFly token. While this theme is active, the whole block ecosystem takes on PatternFly colors, Red Hat type, radii, shadows and focus rings, and authored content stays plain DDD content that renders in any other theme.

The design system registers as `patternfly` with `extends: "ddd"` in `DesignSystemManager`, so DDD's styles, data attributes and HAX authoring options stay in place and the PatternFly layer is added after them.

| File | What it is |
|---|---|
| `design-system/bridge.json` | The authored mapping: upstream package and version, light/dark scopes, fonts, and each DDD token → PatternFly token |
| `lib/PatternflyTokens.js` | Generated: the PatternFly tokens the map and theme use, as `light-dark()` pairs |
| `lib/PatternflyDDDMap.js` | Generated: the `--ddd-*` → `--pf-t--*` remap |
| `lib/patternfly.ddd-map.json` | Generated: the full map with resolved values, coverage per contract tier and a contrast report |
| `lib/PatternflyDesignSystem.js` | Registers and activates the `patternfly` design system |
| `patternfly-theme.js` | The theme |

## Coverage

Checked against the shared [bridge contract](../d-d-d/design-system/bridge/README.md): identity 92%, feel 43%, semantic 0%, structure locked. Kept as DDD on purpose: font weights light and medium (no PatternFly 300 or 500 step), radius-xl and boxShadow-xl, emphasized easing, state opacities and control heights (PatternFly has no tokens for them), and the heading/body sizes (PatternFly body text is 14px, under the 16px floor, and its h3-h6 would fall below DDD's 20px body text).

## Rebuilding the tokens

```
yarn ddd:bridge elements/patternfly-theme          # from the monorepo root
yarn ddd:bridge elements/patternfly-theme --check  # fail if the generated files are stale
```

The generator fetches `@patternfly/patternfly` at the version pinned in `bridge.json` with `npm pack`, so PatternFly is never a dependency of this package. It refuses licenses that can't ship with Apache-2.0, and fails on unresolved tokens, contrast regressions, or named DDD colors mapped to values that change between light and dark (DDD's named colors are constants that blocks pair with `light-dark()` themselves).

## Attribution

Token values come from PatternFly (`@patternfly/patternfly` 6.7.0, MIT). Red Hat Text, Red Hat Display and Red Hat Mono are licensed under the SIL Open Font License 1.1 and load from Google Fonts. See `NOTICE`. This is an independent HAX integration, not affiliated with or endorsed by Red Hat.
