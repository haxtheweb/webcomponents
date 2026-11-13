# DDD design system bridges

A bridge makes an outside design system (PatternFly, Carbon, Spectrum, ...) **DDD capable**. Its tokens are written out under their own names, and the DDD tokens that HAX blocks read are pointed at them. Blocks pick up the system's look without changing, and authored content stays plain DDD content that renders in any theme. A bridge registers with `DesignSystemManager` as a dialect (`extends: "ddd"`), so DDD's styles, data attributes and HAX authoring stay in place.

- `build-bridge.js`: the generator (`yarn ddd:bridge elements/<system>-theme [--check]` from the monorepo root)
- `contract.json`: which DDD tokens a bridge may answer, by tier
- `<theme>/design-system/bridge.json`: one system's mapping (see `elements/patternfly-theme`)

## Sources

`bridge.json` lists one or more `sources`. Each is an npm package pinned to an exact version with its license, or, for a system that doesn't publish its theme to npm, a raw URL pinned to a full commit sha with a `sha256` and a `licenseUrl` from the same commit (the generator verifies both). Later sources override earlier ones on name clashes. Formats:

| `format` | Reads | Modes |
|---|---|---|
| `css` | compiled CSS custom properties; blocks may nest (Tailwind's `@theme`) | `scopes.light` / `scopes.dark`: selectors merged in order |
| `dtcg` | a [DTCG](https://www.designtokens.org/) token file, written as custom properties under `prefix` (Carbon's `blue.60` → `--carbon-blue-60`) | mode-free |
| `scss-vars` | Sass `$name: value;` files, written under `prefix`; `module.$var` becomes `var(--module-var)` (Material's `md-ref-palette.$primary40` → `var(--md-ref-palette-primary40)`) | `file` for both, or `files: { light, dark }` |

Colors may be hex, `rgb()` or `oklch()`; the generator converts them for contrast checks and DDD's rgb-channel tokens, and writes them out as the upstream wrote them.

A map entry can take `"fromMode": "light"` (or `"dark"`) to write that mode's value as a constant. Use it for a named DDD color when the system's palette only exists per mode (Spectrum).

A design system that lives in its theme rather than on npm (for example Keepcase in `elements/vhs-blog-theme`) is a `local` source: `"local": true` with `file` relative to the theme folder. It is read in place, and its `license` must match the theme's own `package.json`.

## The contract

Every bridge is checked against the same contract, so coverage is comparable across systems.

| Tier      | Mapping    | What it covers                                                                                                                      | Why                                                                                                                                                                                                                                               |
| --------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Structure | **locked** | spacing, font-size scale, line height, letter spacing, icon sizes, z-index, breakpoints, opacity scale, target sizes, layout widths | Authored content and block layouts are built on these numbers. Remapping them reflows existing content, and reading sizes and target sizes are accessibility decisions. A system's own spacing belongs in its theme chrome, using its own tokens. |
| Identity  | expected   | named colors, font families, font weights, radius, shadows, focus ring                                                              | What makes the system recognizable                                                                                                                                                                                                                |
| Feel      | optional   | motion durations and easing, state opacities, control and text-field heights, border widths                                         | How the system behaves and how dense its controls are. Control heights never go below the 24px minimum target.                                                                                                                                    |
| Semantic  | optional   | heading and body text sizes; density: surface padding, stack gap, inline gap, control padding                                      | Roles a system can size without touching the scales. Body text never goes below 16px, headings never go below body text, and heading sizes never grow as the level goes down. Density has per-token floors (8px surface padding and stack gap, 4px inline gap). |

The generator fails when a bridge maps a locked token, maps a token the contract doesn't list (add it to a tier first), breaks a guard, points a named DDD color at a value that changes between light and dark, drops a key DDD color pair below 4.5:1 contrast, or uses a license that can't ship with Apache-2.0. The `<system>.ddd-map.json` it writes reports coverage per tier and family, and lists which tokens stayed DDD.

Changing the contract changes what every bridge may do. Do it in its own PR, then regenerate every bridge.
