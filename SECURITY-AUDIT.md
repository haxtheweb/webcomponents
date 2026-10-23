# Security Audit Playbook — webcomponents monorepo

Entry point for recurring security audits of this repo. One of five HAX repos audited on a regular cycle (`create`, `haxcms-nodejs`, `webcomponents`, `haxcms-php`, `HAXiam`) — see the project-specific rule in the PRAW rule registry (`haxtheweb/praw` `RULES.md`).

## Read order (do this first)

1. `AGENTS.md` — monorepo layout, per-element test commands, build restrictions
2. `security_best_practices_report.md` — canonical current state (each round rewrites it; a "previously reported — verified fixed" section carries history)
3. `security_best_practices_report_YYYY-MM-DD.md` — archived rounds
4. `SECURITY.md` — disclosure policy (private advisory at `haxtheweb/issues`, never public issues)

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

- `security_best_practices_report.md` (undated) is canonical — rewrite in place each round, keeping the verified-fixed section
- Cite findings as `elements/<name>/lib/file.js:line` with rule IDs (`JS-XSS-001`, `JS-URL-002`, `JS-MSG-001`, `JS-STORAGE-001`)
- Mark fixes with inline `security (JS-xxx-00x)` comments
- Report vulnerabilities via `SECURITY.md` (private advisory), never public issues
