# webawesome-theme

A HAXcms theme laid out like Web Awesome's own documentation (layout reference: a component page such as [webawesome.com/docs/components/card](https://webawesome.com/docs/components/card)), built on the **Web Awesome DDD bridge**.

The layout: a two-row header (the site bar on Web Awesome's lowered surface, then one link per top-level page with the current section underlined in the brand color), a bordered sidebar for the outline that overlays below 1024px, a reading column whose title is followed by the page's tags as badges (`metadata.tags`, comma separated; the first in the brand fill) and its description as lead text, and an "On this page" list (`site-menu-content`) on screens 1280px and wider.

The demo site (`demo/`) is a course kit documented in that layout: start and installation, component pages (card, callout, multiple choice) with tags and examples, theming and help, all authored with ordinary HAX blocks. Its artwork in `demo/files` is original to this repository.

## What the bridge does

HAX blocks only read DDD tokens (`--ddd-*`). This package re-expresses Web Awesome's tokens under their own names and points every DDD token a block reads at the closest Web Awesome token. While this theme is active, blocks take on Web Awesome's color, type, corners, elevation, focus and motion. Authored content stays plain DDD content that renders in any other theme. No Web Awesome stylesheet or component is loaded.

The design system registers as `webawesome` with `extends: "ddd"` in `DesignSystemManager`, so DDD's styles, data attributes and HAX authoring options stay in place.

| File | What it is |
|---|---|
| `design-system/bridge.json` | The authored mapping: pinned sources, and each DDD token → Web Awesome token |
| `lib/WebawesomeTokens.js` | Generated: the Web Awesome tokens the map and theme use, as `light-dark()` pairs |
| `lib/WebawesomeDDDMap.js` | Generated: the `--ddd-*` → Web Awesome remap |
| `lib/webawesome.ddd-map.json` | Generated: the full map with resolved values, coverage per contract tier and a contrast report |
| `lib/WebawesomeDesignSystem.js` | Registers and activates the `webawesome` design system |
| `webawesome-theme.js` | The theme |

## Coverage

Checked against the shared [bridge contract](../d-d-d/design-system/bridge/README.md): identity 99%, feel 30%, semantic 42% (density from Web Awesome's space scale: space-l card padding, content-spacing between blocks, space-xs inline gap, space-m control padding), structure locked. Web Awesome's palettes keep a step number at the same lightness in every hue, so the text color DDD puts on each `data-primary` palette passes contrast in all 26 of them. Kept as DDD on purpose: font weight black (Web Awesome stops at 600), emphasized/enter/exit easing (one easing), state opacities (Web Awesome mixes colors instead), control heights (em-based), border size lg, and heading/body sizes.

Only the MIT package `@awesome.me/webawesome` (the default theme and palette) is read. Web Awesome Pro themes, palettes and patterns are commercial and are not used.

## Rebuilding the tokens

```
yarn ddd:bridge elements/webawesome-theme          # from the monorepo root
yarn ddd:bridge elements/webawesome-theme --check  # fail if the generated files are stale
```

## Attribution

See `NOTICE`. Type: Web Awesome's default system font stacks; no web font is loaded. Web Awesome and Font Awesome are trademarks of Fonticons, Inc.; this is an independent HAX integration, not affiliated with or endorsed by Fonticons.
