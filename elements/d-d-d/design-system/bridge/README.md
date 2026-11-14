# DDD design system bridges

A bridge makes an outside design system (PatternFly, Carbon, Spectrum, ...) **DDD capable**. Its tokens are written out under their own names, and the DDD tokens that HAX blocks read are pointed at them. Blocks pick up the system's look without changing, and authored content stays plain DDD content that renders in any theme. A bridge registers with `DesignSystemManager` as a dialect (`extends: "ddd"`), so DDD's styles, data attributes and HAX authoring stay in place.

- `build-bridge.js`: the generator (`yarn ddd:bridge elements/<system>-theme [--check]` from the monorepo root)
- `contract.json`: which DDD tokens a bridge may answer, by tier
- `<theme>/design-system/bridge.json`: one system's mapping (see `elements/patternfly-theme`)

## Sources

`bridge.json` lists one or more `sources`. Each is an npm package pinned to an exact version with its license, or, for a system that doesn't publish its theme to npm, a raw URL pinned to a full commit sha with a `sha256` and a `licenseUrl` from the same commit (the generator verifies both). Shippable licenses are MIT, Apache-2.0, BSD-2/3-Clause, ISC and CC0-1.0 (public domain dedications such as USWDS). When a package's `license` field reads `SEE LICENSE IN <file>`, the generator checks that file for the declared license's text. Later sources override earlier ones on name clashes. Formats:

| `format`    | Reads                                                                                                                                                                                                        | Modes                                                     |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------- |
| `css`       | compiled CSS custom properties; blocks may nest (Tailwind's `@theme`)                                                                                                                                        | `scopes.light` / `scopes.dark`: selectors merged in order |
| `dtcg`      | a [DTCG](https://www.designtokens.org/) token file, written as custom properties under `prefix` (Carbon's `blue.60` → `--carbon-blue-60`)                                                                    | mode-free                                                 |
| `scss-vars` | Sass `$name: value;` files, written under `prefix`; `module.$var` becomes `var(--module-var)` (Material's `md-ref-palette.$primary40` → `var(--md-ref-palette-primary40)`)                                   | `file` for both, or `files: { light, dark }`              |
| `scss-map`  | Sass map files (`$name: ("blue": (5: #eff6fb, "vivid": (60: #005ea2)))`), flattened under `prefix` by key path (`--usa-blue-5`, `--usa-blue-vivid-60`); `false` entries are skipped and nothing is evaluated | mode-free; `files: [ ... ]` merged in order               |

Lengths may be `px`, `rem`, `em` or `calc(<length> * <number>)`, so Tailwind's spacing steps stay multiples of `--spacing` (`calc(var(--spacing) * 6)`) and still face the guards. Colors may be hex, `rgb()` or `oklch()`; the generator converts them for contrast checks and DDD's rgb-channel tokens, and writes them out as the upstream wrote them.

The keywords `white` and `black` read as colors too (USWDS writes them that way).

A `css` scope selector matches a rule whose selector is exactly that selector, or a rule whose selector list contains it, so a scope can name one member of a shared rule (Web Awesome writes `:where(:root), .wa-theme-default, .wa-light, ...` for its light theme and `.wa-dark, ...` for its dark one).

A map entry can take `"fromMode": "light"` (or `"dark"`) to write that mode's value as a constant. Use it for a named DDD color when the system's palette only exists per mode (Spectrum).

A design system that lives in its theme rather than on npm (for example Keepcase in `elements/vhs-blog-theme`) is a `local` source: `"local": true` with `file` relative to the theme folder. It is read in place, and its `license` must match the theme's own `package.json`.

## The contract

Every bridge is checked against the same contract, so coverage is comparable across systems.

| Tier      | Mapping    | What it covers                                                                                                                      | Why                                                                                                                                                                                                                                                             |
| --------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Structure | **locked** | spacing, font-size scale, line height, letter spacing, icon sizes, z-index, breakpoints, opacity scale, target sizes, layout widths | Authored content and block layouts are built on these numbers. Remapping them reflows existing content, and reading sizes and target sizes are accessibility decisions. A system's own spacing belongs in its theme chrome, using its own tokens.               |
| Identity  | expected   | named colors, font families, font weights, radius, shadows, focus ring                                                              | What makes the system recognizable                                                                                                                                                                                                                              |
| Feel      | optional   | motion durations and easing, state opacities, control and text-field heights, border widths                                         | How the system behaves and how dense its controls are. Control heights never go below the 24px minimum target.                                                                                                                                                  |
| Semantic  | optional   | heading and body text sizes; density: surface padding, stack gap, inline gap, control padding                                       | Roles a system can size without touching the scales. Body text never goes below 16px, headings never go below body text, and heading sizes never grow as the level goes down. Density has per-token floors (8px surface padding and stack gap, 4px inline gap). |
| Component | optional   | card radius, padding, border width and shadow; control radius; tag radius                                                           | Where a system gives a kind of component its own shape (square cards, pill buttons). Each defaults to a general DDD token, so nothing changes until a bridge maps one. Blocks with a deliberate design of their own, stop-note first among them, have no component token.                 |

### Paired text colors

DDD gives every primary palette (`data-primary="0"` to `"25"`) the text color that reads on it: `--ddd-primary-N-on`, black or white, chosen for DDD's own colors. A bridge that remaps a palette to a lighter or darker color can break that pair, so the generator re-checks every remapped palette in light and dark:

- DDD's pair is kept when it still reaches 4.5:1.
- When only the other color does, the pair flips and the map carries `--ddd-primary-N-on` for that palette.
- A bridge may set a pair itself (`"--ddd-primary-7-on": { "value": "white" }`); it is checked as given.
- A palette neither black nor white reads on fails the build.

The report lists every checked pair under `pairs`, with its ratio and whether it is DDD's, paired by the generator, or set by the bridge.

The generator fails when a bridge maps a locked token, maps a token the contract doesn't list (add it to a tier first), breaks a guard, points a named DDD color at a value that changes between light and dark, drops a key DDD color pair or a palette's text color pair below 4.5:1 contrast, or uses a license that can't ship with Apache-2.0. The `<system>.ddd-map.json` it writes reports coverage per tier and family, and lists which tokens stayed DDD.

Changing the contract changes what every bridge may do. Do it in its own PR, then regenerate every bridge.
