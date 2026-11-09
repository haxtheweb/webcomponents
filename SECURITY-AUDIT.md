# Security Audit Playbook — webcomponents monorepo

Entry point for recurring security audits of this repo. One of five HAX repos audited on a regular cycle (`create`, `haxcms-nodejs`, `webcomponents`, `haxcms-php`, `HAXiam`) — see the project-specific rule in the PRAW rule registry (`haxtheweb/praw` `RULES.md`).

## Read order (do this first)

1. `AGENTS.md` — monorepo layout, per-element test commands, build restrictions
2. "Security invariants" below: the rules every element keeps. They are the committed record; there is no checked-in findings report and PR lists are not the record either. Inline `// security (...)` comments mark where a rule is enforced and each element's own test suite keeps it true.
3. `SECURITY.md` — disclosure policy (private advisory at `haxtheweb/issues`, never public issues)

## Scope

- `elements/**` first-party source only. Vendored `lib/` bundles (`latex2html5`, `mammoth`, `openseadragon`, `xlsx`, …) are supply-chain context to track upstream, not audit targets
- Hardcoded secrets/keys; SRI/CSP posture is informational for a component library

## Security invariants

The rules every element keeps. A fix that introduces a new class of rule adds a line here in the same PR; a change that weakens one needs a matching test change. The shared helpers live in `@haxtheweb/utils` (`elements/utils/lib/sanitize.js`, `safe-html.js`, `url.js`).

- **DOM sinks (`JS-XSS`):** anything that reaches `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `createContextualFragment` or `document.write` from remote, author, clipboard, microservice or stored-page data passes `sanitizeHTMLString()` / `sanitizeHTMLForImport()` / `sanitizeNodeTree()` first, and is parsed in an inert document, never a live `div`. This covers the editor paste path, editor insert sinks and the public site-builder render path, not only save time
- **Script-capable gadgets:** `<html-block allowscript>` takes effect only behind an explicit platform opt-in; `<demo-snippet>` sanitizes what it stamps unless `unsafe-scripts` is set; `<template>` contents are preserved only for `code-sample`-style display
- **Dynamic code loading:** `import()` of a URL taken from data (app store, docs JSON, registry) is same-origin, under `WCGlobalBasePath`/`WCGlobalCDNPath`, or on the HAX CDN allow-list unless the app store opts in; third-party CDN scripts are version-pinned and carry SRI where the host supports it
- **URLs (`JS-URL`):** `safeNavigateHref()` / `hasUnsafeURLProtocol()` / `safeRedirect()` before any navigation or `href`/`src` assignment; `?format=` and redirect targets are allow-listed; `javascript:`, `vbscript:` and non-image `data:` are stripped from every `*src/*href/*url` attribute including custom-element ones
- **Text interpolation:** author or URL text goes into the DOM via `textContent`/`createElement`, into selectors via `CSS.escape()` (with try/catch around `location.hash`), and into URLs via `encodeURIComponent`; never into a template string that becomes `innerHTML`
- **Messaging (`JS-MSG`):** `postMessage` `targetOrigin` never falls back to `"*"`; receivers check `event.source` and `event.origin`; third-party badge/embed HTML runs in a sandboxed opaque-origin iframe
- **Storage (`JS-STORAGE`):** JWTs are never written to `localStorage`/`sessionStorage`; the HttpOnly refresh cookie is the persistence
- **Registry integrity:** `MicroFrontendRegistry` items are frozen after `define()`; per-service tokens are scoped so the JWT never leaves the HAXcms origin
- **Supply chain:** `yarn.lock` entries carry `integrity` and no `http://` resolves; Actions are SHA-pinned with `contents: read`; npm publish is manual with `--provenance`

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

- One `security/<topic>` branch and PR per fix (never one giant PR); findings, severities and anything deferred live in the PR description or the private advisory, never in committed files; the committed record is the rule, not the finding
- Mark the code that enforces a rule with an inline `security (<rule>)` comment using the rule families above (`JS-XSS`, `JS-URL`, `JS-MSG`, `JS-STORAGE`); a fix that introduces a new class of rule adds a line under "Security invariants" in the same PR
- Report vulnerabilities via `SECURITY.md` (private advisory), never public issues
