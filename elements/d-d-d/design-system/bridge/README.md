# DDD design system bridges

A bridge makes an outside design system (PatternFly, Carbon, Spectrum, ...) **DDD capable**. Its tokens are written out under their own names, and the DDD tokens that HAX blocks read are pointed at them. Blocks pick up the system's look without changing, and authored content stays plain DDD content that renders in any theme. A bridge registers with `DesignSystemManager` as a dialect (`extends: "ddd"`), so DDD's styles, data attributes and HAX authoring stay in place.

- `build-bridge.js`: the generator (`yarn ddd:bridge elements/<system>-theme [--check]` from the monorepo root)
- `contract.json`: which DDD tokens a bridge may answer, by tier
- `<theme>/design-system/bridge.json`: one system's mapping (see `elements/patternfly-theme`)

## Sources

`bridge.json` lists one or more `sources`, each an npm package pinned to an exact version with its license. `format: "css"` reads compiled CSS custom properties, using `scopes.light` and `scopes.dark` (selectors merged in order) to resolve each mode. `format: "dtcg"` reads a [DTCG](https://www.designtokens.org/) token file and writes each token as a custom property under the source's `prefix` (for example, Carbon's palette `blue.60` becomes `--carbon-blue-60`). DTCG sources are treated as mode-free, which suits palettes and motion. Later sources override earlier ones on name clashes.

## The contract

Every bridge is checked against the same contract, so coverage is comparable across systems.

| Tier      | Mapping    | What it covers                                                                                                                      | Why                                                                                                                                                                                                                                               |
| --------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Structure | **locked** | spacing, font-size scale, line height, letter spacing, icon sizes, z-index, breakpoints, opacity scale, target sizes, layout widths | Authored content and block layouts are built on these numbers. Remapping them reflows existing content, and reading sizes and target sizes are accessibility decisions. A system's own spacing belongs in its theme chrome, using its own tokens. |
| Identity  | expected   | named colors, font families, font weights, radius, shadows, focus ring                                                              | What makes the system recognizable                                                                                                                                                                                                                |
| Feel      | optional   | motion durations and easing, state opacities, control and text-field heights, border widths                                         | How the system behaves and how dense its controls are. Control heights never go below the 24px minimum target.                                                                                                                                    |
| Semantic  | optional   | heading and body text sizes                                                                                                         | Roles a system can size without touching the scales. Body text never goes below 16px, headings never go below body text, and heading sizes never grow as the level goes down.                                                                     |

The generator fails when a bridge maps a locked token, maps a token the contract doesn't list (add it to a tier first), breaks a guard, points a named DDD color at a value that changes between light and dark, drops a key DDD color pair below 4.5:1 contrast, or uses a license that can't ship with Apache-2.0. The `<system>.ddd-map.json` it writes reports coverage per tier and family, and lists which tokens stayed DDD.

Changing the contract changes what every bridge may do. Do it in its own PR, then regenerate every bridge.
