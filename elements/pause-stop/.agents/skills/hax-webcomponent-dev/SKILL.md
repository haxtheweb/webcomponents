---
name: hax-webcomponent-dev
description: >
  Develop HAX-capable web components using LitElement, DDD design system, and HAXSchema.
  Use when scaffolding new components, adding HAX editor support, auditing accessibility,
  or applying DDD tokens to elements in the webcomponents monorepo.
version: 1.4.0
license: Apache-2.0
metadata:
  author: haxtheweb
  tags: [hax, webcomponents, lit, ddd, haxschema, accessibility]
  source: create
---

# HAX Web Component Development

Develop HAX-capable web components using LitElement, DDD design system, and HAXSchema.

## When to Use

- Scaffolding a new component in the webcomponents monorepo or as a standalone package
- Adding or updating `haxProperties` / `demoSchema`
- Auditing a component for DDD compliance, dark mode, or accessibility
- Refactoring legacy SimpleColors usage to DDD tokens
- Fixing build issues with HAXCMSLitElement themes
- Reviewing component JavaScript for Polymer parser compatibility

## Before you build

Answer these before writing code. They are the corrections reviewers most often have to make.

1. **Does an element already exist?** Run `hax wc --search "<words>"` (add `--format json` for machine-readable results). It searches every element in the monorepo by tag, title, description and tags and flags the preferred building blocks. Compose existing elements (inputs, tooltips, icons, cards, collapses) instead of rebuilding them.
2. **Leaf or parent?** A leaf renders its own content. A parent that HAX authors drop other elements into is a _grid_ element: its haxProperties use `"type": "grid"` and its children are slotted elements. Decide this up front; it changes the haxProperties and the editing experience. A condensed, offline walk-through of the parent/child pattern is in `references/grid-parent-child.md`, next to this file.
3. **Dark mode.** Every color must come from a `--ddd-theme-*` token or `currentColor`. When light and dark need different values, use `light-dark()` with tokens. Plan this now; retrofitting it is where hard-coded fills slip through.
4. **Which fields are essential?** Anything the element cannot render without is `"required": true` in haxProperties.

## How It Works

1. **Scaffold**: Always use `hax webcomponent my-element --y --no-i` (the `hax` global, never `npx hax`). Do not create element directories or files by hand in the monorepo. `--no-i` keeps it from launching a dev server; without a TTY it is implied.
2. **Base class**: Import from `@haxtheweb/d-d-d/d-d-d.js`. The scaffold's `class MyEl extends DDDSuper(I18NMixin(LitElement))` is correct. `DDD` itself is an exported class (`DDDSuper(SimpleColorsSuper(LitElement))`), so `extends DDD` also works. Never write `DDD(LitElement)`: `DDD` is a class, not a mixin.
3. **Implement HAXSchema**: Keep `lib/<element>.haxProperties.json` in sync with the element's properties, including a `demoSchema` that HAX can insert as a working example.
4. **Style with DDD**: `--ddd-spacing-*`, `--ddd-font-*`, `--ddd-theme-*`, `--ddd-radius-*`, `--ddd-icon-*`. SimpleColors only where DDD has no equivalent shade.
5. **Verify**: run `hax audit` from the element folder and fix everything it reports (see "What `hax audit` checks"), then `hax audit schema` to validate the element's `haxProperties`, `demoSchema` and locale files, and `hax audit i18n` to catch UI text that isn't in `this.t`.
6. **Build themes**: after changing a HAXCMSLitElement theme run `yarn run build`; never hand-edit `custom-elements.json`.

## Preferred building blocks

- **Inputs**: `simple-fields-field` from `@haxtheweb/simple-fields/lib/simple-fields-field.js` (text, select, checkbox, textarea, etc.) instead of raw `<input>` / `<select>`. It already handles labels, validation styling and dark mode.
- **Tooltips**: `simple-tooltip` from `@haxtheweb/simple-tooltip/simple-tooltip.js`, attached with `for="<id of target>"`. See `a11y-collapse` for a real usage.
- **Icons and icon buttons**: `simple-icon` / `simple-icon-button` (`@haxtheweb/simple-icon`).
- **Expand/collapse**: `a11y-collapse` (always set `heading-button`) and `a11y-collapse-group`.

## haxProperties essentials

From the HAXSchema documented in `hax-body-behaviors/lib/HAXWiring.js`:

- `"type"`: `"element"` (default) or `"grid"` for parents that hold other elements.
- `"settings"`: `configure` (main form), `advanced`, `developer`. Each field has `property` (or `slot`), `title`, `description`, `inputMethod` (`textfield`, `boolean`, `select`, `textarea`, `colorpicker`, ...). `haxupload` is for media files such as an image source, not for a plain link; see `references/grid-parent-child.md`.
- `"required": true` on fields the element cannot work without.
- `"demoSchema"`: `[{ "tag": "my-el", "properties": {...}, "content": "<p>slotted html</p>" }]`. For a grid parent, the demo `content` should contain example children.
- `haxHooks()` on the element lets it join HAX lifecycle events without importing HAX; the hook list is at the top of `HAXWiring.js`.

## Reference elements (copy from these)

All in <https://github.com/haxtheweb/webcomponents/tree/master/elements>:

- **Grid parent / child**: `references/grid-parent-child.md` (offline summary), then `career-timeline` (`career-timeline.js` + `lib/career-org-item.js` / `lib/career-role-item.js`); `d-d-d/lib/ddd-steps-list.js` + `ddd-steps-list-item.js` (and their `.haxProperties.json`); `a11y-collapse-group` + `a11y-collapse`.
- **Managed inputs and dark-mode CSS**: `simple-fields/lib/simple-fields-field.js`, whose styles use `light-dark()` over DDD tokens.
- **haxHooks**: `career-timeline/lib/career-org-item.js`; `multiple-choice` (`gizmoRegistration`, `inlineContextMenu`, `preProcessInsertContent`).

## Dark mode recipe

```css
:host {
  color: var(--ddd-theme-default-coalyGray);
  background-color: light-dark(
    var(--ddd-theme-default-white),
    var(--ddd-theme-default-coalyGray)
  );
}
svg {
  fill: currentColor;
}
```

- No hex, `rgb()`, or named colors in `color`, `background`, `fill`, `stroke`, or SVG `fill="..."` attributes.
- Check the element with the page in dark mode (`color-scheme: dark`) before you finish.

## JavaScript standards

- `globalThis` instead of `window`.
- No optional chaining (`?.`) and no nullish coalescing (`??`): the Polymer-era parser in the build toolchain fails on both. Use explicit `&&` guards and undefined checks.
- No TypeScript. Import third-party libraries from their compiled JavaScript distributions.
- Formatting: run Prettier and match what the scaffold emits.

## What `hax audit` checks

`hax audit` exits 1 when it finds any of these, so treat it as the definition of done:

- Literal values where DDD tokens exist: spacing, borders, radius, shadows, fonts, colors.
- Hard-coded colors in `fill`, `stroke`, `background` and other paint properties, and in SVG `fill` / `stroke` / `stop-color` attributes.
- JavaScript: `?.`, `??`, `window` references, `DDD(LitElement)`.

Multi-line CSS values are not inspected, so keep color declarations on one line or review them by hand.

## Accessibility

Check ARIA attributes, keyboard navigation (every interactive control reachable and operable), visible focus, semantic HTML, and color contrast in both color schemes.

## Server-side rendering (SSR)

When creating or working on a component or theme, audit it for SSR without assuming issues exist. Run `hax audit ssr` (report-only, never fails) to see how it renders under Lit SSR, and review by hand against the "SSR Safety & Enhancement Audit" rule in the ecosystem rules (linked below). The short version:

- No browser globals (`globalThis.window`, `document`, `navigator`, `location`, storage, `matchMedia`, observers) at module top level, in the constructor, or in `render()`.
- Do browser-only work in `connectedCallback`, `firstUpdated` or `updated`, guarded with `globalThis` checks.
- Keep `render()` deterministic (no `Math.random()`, `Date.now()` or generated ids) so server and client markup match.
- Make the first render meaningful without JavaScript: default text, slotted content, `static styles`, and fallbacks.
- For themes, keep the skip link and named regions in the server-rendered template and avoid import-time `document.body` access.

## References

- HAX CLI: `hax webcomponent --help`, `hax audit`, `hax audit schema`, `hax audit i18n`, `hax audit ssr`
- DDD: `webcomponents/elements/d-d-d`; the `hax-design-system` skill in <https://github.com/haxtheweb/praw/tree/main/skills>
- HAXSchema reference: `webcomponents/elements/hax-body-behaviors/lib/HAXWiring.js`
- Ecosystem rules: <https://github.com/haxtheweb/praw/blob/main/RULES.md>
