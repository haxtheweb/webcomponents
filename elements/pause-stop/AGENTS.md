# AGENTS.md

Instructions for AI coding agents working on this HAX web component.

## Start here

- Read `.agents/skills/hax-webcomponent-dev/SKILL.md` before writing code. It holds the conventions below in more depth and the reference elements to copy from.
- Use the global `hax` command, never `npx hax` (a different npm package). Pass `--y --no-i` whenever you script it.
- Run `hax audit` from this folder before you finish. It fails on hard-coded colors (including `fill`, `stroke` and `background`), `?.`, `??`, `window` and `DDD(LitElement)`.

## Before you build

1. Check whether an existing HAX element already does this: `hax wc --search "<words>"` searches every element in the monorepo. Prefer composing existing elements over writing new ones.
2. Decide whether this is a leaf element or a parent that holds other elements. A parent that HAX authors place children into declares `"type": "grid"` in its haxProperties.
3. Plan for dark mode from the start. Use `--ddd-theme-*` tokens or `currentColor`; when light and dark need different values, use `light-dark()` with tokens.

## Conventions

- Inputs: use `simple-fields-field` (`@haxtheweb/simple-fields`), not raw `<input>` / `<select>`.
- Tooltips: use `simple-tooltip` (`@haxtheweb/simple-tooltip`). Icons: `simple-icon` / `simple-icon-button`.
- Styling: DDD tokens (`--ddd-spacing-*`, `--ddd-font-*`, `--ddd-theme-*`, `--ddd-radius-*`) instead of literal values.
- JavaScript: `globalThis` instead of `window`; no optional chaining (`?.`) or nullish coalescing (`??`), since the build toolchain's parser fails on them. No TypeScript.
- HAX editor support lives in `lib/*.haxProperties.json`. Mark fields the element cannot work without as `"required": true`, and keep `demoSchema` valid so HAX can insert a working example.
