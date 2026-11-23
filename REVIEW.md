# Review instructions

Instructions for Claude Code Review on pull requests in this repository. Project rules live in [AGENTS.md](AGENTS.md); this file only adds what a review should do with them.

## Modern Web Guidance pass (advisory)

For changed files under `elements/`, also review against [Modern Web Guidance](https://github.com/GoogleChrome/modern-web-guidance) (MWG): accessibility, HTML semantics, forms and platform API use.

- Comment only when you find something, and only on lines the pull request changed. No finding, no comment.
- Start each such finding with "MWG (advisory)" and name the guide id it comes from. These findings are Nit at most and never a reason to hold a merge.
- Drop a finding that conflicts with a HAX rule. HAX rules win (AGENTS.md, "Browser support and outside guidance"): no optional chaining, `globalThis`, explicit `.js` paths for HAX's own imports, no native `alert()` / `confirm()` / `prompt()`, authored `http` links and resources keep working, site pages stay embeddable, DDD tokens over raw values, and no change to an authorable element's attributes, usage or existing labels.
- Apply the browser support policy before suggesting a fallback or a newer feature: Baseline Widely available features need no fallback; Newly available features go behind feature detection with a working plain path; no polyfills.
- Shadow DOM is where these elements differ from MWG's page-level examples. An `id` reference (`aria-labelledby`, `aria-describedby`, `aria-controls`, `aria-owns`, `aria-activedescendant`, `<label for>`) that crosses a shadow root resolves to nothing; flag one, and flag a host that has both `delegatesFocus` and its own `tabindex`.
- Triage table: <https://github.com/haxtheweb/praw/blob/main/webcomponents/MODERN-WEB-GUIDANCE.md>

## Do not report

- Anything CI already enforces: ESLint, Prettier, Stylelint, DDD token lint, the Baseline lint (`baseline-js/use-baseline`), license headers, CodeQL.
- Non-English locale files (`elements/*/locales/*.<lang>.json`), `custom-elements.json`, `lib/*.docs.json`, `dist/`, and the third-party code listed in `THIRD_PARTY` in `scripts/license-header-check.mjs`.
