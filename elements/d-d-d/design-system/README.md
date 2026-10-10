# DDD design system sync

This folder produces the **DDD Design System artifact** on claude.ai: every DDD token and every element that uses DDD (75 elements plus the HAX themes) rendered live in light and dark. It also produces the DTCG token export in `../tokens/`.

```
yarn install                 # once, so @haxtheweb/* and esbuild resolve
yarn design-system:sync      # -> elements/d-d-d/design-system/dist/
```

To publish `dist/`, ask Claude to "publish elements/d-d-d/design-system/dist as the DDD design system". Publish `design-system.json` last.

## What is generated and what is authored

| Output in `dist/` | Comes from |
|---|---|
| `tokens.json` | `source/tokens.json`, with every value re-read from `DDDStyles.js` and SimpleColors. Usage notes and grouping are authored. The sync warns about tokens added to the source that have no entry yet. |
| `components/bundle.js`, `components/lib/*.js` | esbuild over the modules in `source/bundle/entries.json`, with `prelude.js` and `postlude.js`. `import.meta.url` is rewritten to `runtime/nm/`. The result is wrapped, ASCII-escaped and size-checked. |
| `components/<Card>/` | `source/components/`: the hand-authored `preview.html` and `README.md` for each card. `bundle.css` lives here too. |
| `runtime/icons/` | Every `elements/*/lib/svgs/<set>/*.svg`, packed as data URIs. |
| `runtime/sites/<theme>/` | `elements/<theme>/demo/` files listed in `source/runtime/sites.json`, then the overrides in `source/runtime/sites/`. |
| `runtime/nm/` | The files listed in `source/runtime/nm.json`, copied from `node_modules`. These are the files that elements fetch at runtime. |
| `runtime/data/`, `runtime/media/`, `README.md`, `authoring.md`, `patterns.md`, `design-system.json` | Copied from `source/` as they are. |

## Common changes

- **New element.** Add its module to `source/bundle/entries.json` (`main`). Add a `source/components/<Name>/preview.html` (first line `<!-- @dsCard group="…" height=… -->`) and a `README.md`. Then add `{"name":"<Name>"}` to `source/bundle/header.json` at the position it should appear.
- **New token.** Change `DDDStyles.js`, then run the sync. It warns about the new token: add it to the right family in `source/tokens.json` with a one-line `usage`.
- **An element fetches a file at runtime** (a 404 under `runtime/nm/` in a preview). Add its path under `node_modules` to `source/runtime/nm.json`.

The artifact's limits are checked at the end of every sync:
- `bundle.js` is at most 6 MB and each library at most 2 MB;
- every other file is at most 512 KB;
- at most 511 files in total and at most 600 colors;
- no `node_modules` path segments, no `.pptx`, and no XML DOCTYPE.

Run with `--skip-bundle` to refresh everything except the bundles. Run with `--node-modules <dir>` to resolve packages from another install. Under `bun`, the sync uses `Bun.build` instead of esbuild.
