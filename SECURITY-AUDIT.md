# Security Audit Playbook — webcomponents monorepo

Entry point for recurring security audits of this repo. One of five HAX repos audited on a regular cycle (`create`, `haxcms-nodejs`, `webcomponents`, `haxcms-php`, `HAXiam`) — see the project-specific rule in the PRAW rule registry (`haxtheweb/praw` `RULES.md`).

## Read order (do this first)

1. `AGENTS.md` — monorepo layout, per-element test commands, build restrictions
2. The open and merged `security/*` pull requests on `haxtheweb/webcomponents` — each audit round lands as one PR per finding, titled `[<element>] ...`, with the finding, the fix and the regression test in the PR description. There is no checked-in report file; the PR list is the canonical record of what was found, what was fixed and what was deferred. The 2026-11 round is https://github.com/haxtheweb/webcomponents/pull/1170 through https://github.com/haxtheweb/webcomponents/pull/1176 (paste path, editor sinks, public render path, html-block `allowscript` / demo-snippet, dynamic import allow-lists, rich-text-editor, hardening sweep)
3. `SECURITY.md` — disclosure policy (private advisory at `haxtheweb/issues`, never public issues)

## Scope

- `elements/**` first-party source only. Vendored `lib/` bundles (`latex2html5`, `mammoth`, `openseadragon`, `xlsx`, …) are supply-chain context to track upstream, not audit targets
- Dangerous DOM sinks: `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write` — anything reaching them from remote/author-controlled data must pass `sanitizeHTMLString()` from `@haxtheweb/utils` (the recurring finding pattern: `cms-hax`, `editable-table`, `wikipedia-query`)
- URL handling: `safeNavigateHref()` / `hasUnsafeURLProtocol()` / `safeRedirect()` before any navigation or `href` assignment; `querySelector(location.hash)` needs try/catch + `CSS.escape()`
- `postMessage` `targetOrigin` must never fall back to `"*"`; validate `event.origin` on receive (LTI/embedded elements)
- Storage: never persist JWTs to localStorage/sessionStorage (HttpOnly refresh cookie pattern)
- URL params interpolated into CSS selectors/attributes need escaping (`safeParam()` pattern)
- Hardcoded secrets/keys; SRI/CSP posture is informational for a component library

## Commands

```bash
yarn audit                                       # dependency advisories
cd elements/<element-name> && npm test           # per-element suite (verify fixes against it)
npm run test --filter <element-name>             # filtered monorepo run
```

Never run a build at the repo root.

## Regression guards (must stay green)

- The affected element's own test suite — every past fix was verified this way (e.g. `elements/cms-hax`, `elements/editable-table`)
- New sink hardening gets a test asserting sanitized output

## Reporting convention

- One `security/<topic>` branch and PR per finding (never one giant PR); the PR description is the report: finding, sink, fix, regression test, anything deliberately skipped and why
- Deferred items are listed in the round's final sweep PR so the next round starts from them
- Cite findings as `elements/<name>/lib/file.js:line` with rule IDs (`JS-XSS-001`, `JS-URL-002`, `JS-MSG-001`, `JS-STORAGE-001`)
- Mark fixes with inline `security (JS-xxx-00x)` comments
- Report vulnerabilities via `SECURITY.md` (private advisory), never public issues
