# Demo Audit Report

Updated 2026-09-29 (post-improvement pass) via a single-pass scan of every element in `elements/` (demo presence, root `index.html` redirect vs full content, tag usage with/without attributes, `demo-snippet` usage, and `HAXCMSLitElement` inheritance for theme detection).

This audit covers all elements in `elements/` and categorizes them by demo quality, location, and necessity.

## Summary

- **Total elements audited:** 224
- **Good demos (element shown with attributes):** 158 visual elements (+ `chat-agent`, which is driven via JS/ChatStore, and `outline-player` theme)
- **Bare-tag demos remaining:** 8 non-theme entries — every one verified legitimate (slot-, CSS-variable-, app-page-, or JS-driven); plus 10 themes whose preview lives in the root `index.html`
- **Package/hub demos (own tag not rendered, demo exercises sub-tags/sub-pages):** 12 — all legitimate
- **Broken demos:** 0
- **Dangling root stubs (redirect to missing demo):** 0
- **Polymer-style demos:** 0
- **Utilities/behaviors/mixins (no demo, by convention):** 26
- **Themes (`HAXCMSLitElement`):** 20 — all with full root `index.html` site previews

## Changes since the 2026-09-29 audit

**Stream A — element demo fixes (11 files):**
- `chat-agent`: demo rebuilt — fully static, no `open-apis.hax.cloud` references, interface pre-opened via ChatStore with a scripted offline sample exchange
- `jwt-login`: full declarative attribute surface (`url`, `method`, `key`, `refresh-url`, `logout-url`, `redirect-url`) + offline harness driving the `jwt` property and logging `jwt-changed`/`jwt-token`/`jwt-logged-in`
- `beaker-broker`: added `dat-url` example; `html-block`: slotted HTML + runtime `allowscript` toggle harness; `lrn-math`: restructured with inline/display-mode/`mathtext` examples; `outline-designer`: heading structure + `hide-content-ops` snippets; `user-scaffold`: interaction-memory readout harness; `voice-recorder`: `label` example
- Kept as-is after verification: `portal-launcher` and `simple-emoji` (purely slot-driven); `hax-cloud` demo (functional app page; standards cleanups only, root stubbed)

**Stream B — theme root site previews (12 themes):**
- All 12 redirect-root themes replaced with rich root `index.html` site previews using the established `haxcms-site-builder` reference pattern
- 4 themes (`clean-one`, `haxor-slevin`, `simple-blog`, `outline-player`) received new reference-format `demo/site.json` + `demo/pages` outlines
- `terrible-themes` received a variant-aware preview: `site-best`/`site-outlet`/`site-productionz`/`site-resume` outlines with a DDD-styled `aria-pressed` switcher

**Stream C — cleanup (34 files removed, 20 roots standardized):**
- 15 utility placeholder `demo/` directories deleted (verified zero external references; `package.json`/`custom-elements.json` unaffected)
- Their now-dangling root redirect stubs removed as well (lead validation step)
- 19 + `hax-cloud` full root `index.html` files converted to the standard redirect stub (content verified as superset in `demo/index.html` first)
- `media-playlist`: root-only "How to Develop" section ported into `demo/index.html` before stubbing

---

## 1. Demo-less Utilities (convention: no demo)

These 26 non-visual infrastructure packages ship no `demo/` and no root `index.html`:

- `a11y-behaviors`, `a11y-utils`, `anchor-behaviors`, `baseline-build-hax`, `deduping-fix`, `dl-behavior`, `dynamic-import-registry`, `es-global-bridge`, `fullscreen-behaviors`, `hax-body-behaviors`, `hax-bookmarklet`, `intersection-element`, `json-outline-schema`, `lazy-image-helpers`, `lazy-import-discover`, `media-behaviors`, `micro-frontend-registry`, `mutation-observer-import-mixin`, `pouch-db`, `radio-behaviors`, `schema-behaviors`, `shadow-style`, `simple-colors-shared-styles`, `simple-filter`, `utils`, `wc-autoload`

*Note:* ~10 of these still carry `@demo` JSDoc tags in their source pointing at the deleted demos — harmless documentation boilerplate; can be stripped in a follow-up.

---

## 2. Themes — all 20 with root site previews

All themes follow the rich root `index.html` preview convention (`haxcms-site-builder` + `demo/site.json` outline):

- `bootstrap-theme`, `chamfer-theme`, `clean-one`, `clean-portfolio-theme`, `clean-two`, `example-haxcms-theme`, `glossy-portfolio-theme`, `haxma-theme`, `haxor-slevin`, `journey-theme`, `learn-two-theme`, `link-card-theme`, `outline-player`, `polaris-theme`, `resume-theme`, `simple-blog`, `spacebook-theme`, `terrible-themes`, `training-theme`, `twenty-six-theme`

`demo/index.html` is secondary for themes; 10 render a bare theme tag there and 9 never render their own tag — acceptable since the preview surface is the root file.

---

## 3. Root `index.html` convention

- **Non-theme elements:** standard redirect stub (`globalThis.location.href = 'demo/index.html'`)
- **Themes:** full site preview rendering `demo/site.json` through `haxcms-site-builder`
- Zero non-theme elements keep duplicated full root demos; zero dangling stubs

---

## 4. Remaining Bare-Tag Demos (verified legitimate) — 8 non-theme

- `air-horn` — slot-driven wrapper; API is slotted content
- `chat-agent` — fully functional demo; properties driven via JS/ChatStore so the attribute scanner reports bare usage
- `d-d-docs` — renders the full DDD documentation site
- `demo-snippet` — the demo infrastructure itself
- `fluid-type` — API exercised via CSS custom properties
- `hax-cloud` — functional app page (`dist/`, `wc-registry.json`, site-builder); no public attribute API
- `portal-launcher` — purely slot-driven; slotted links are the API
- `simple-emoji` — purely slot-driven wrapper

No action needed on any of these.

---

## 5. Package/Hub Demos (own tag not rendered; demo exercises sub-tags or sub-pages) — 12

- `course-design` — substantial demo via sub-components
- `file-system-broker` — broker wiring
- `hax-app-installer` — installer UI
- `hax-body` — body wiring
- `hax-iconset` — renders `simple-iconset-demo` (the package's actual surface)
- `haxcms-elements` — sub-elements
- `i18n-manager` — manager wiring (utility-like)
- `lrndesign-chart` — hub linking to `bar.html` / `line.html` / `pie.html`
- `lrs-elements` — renders `lrs-bridge`/`lrs-emitter`
- `replace-tag` — hub linking to `magicDeviceMethod.html` / `magicMethod.html` / `traditionalMethod.html`
- `super-daemon` — JS-driven
- `wysiwyg-hax` — JS-driven

No action needed.

---

## 6. Good Demos (element shown with attributes) — 158 visual elements

- `a11y-carousel`
- `a11y-collapse`
- `a11y-compare-image`
- `a11y-details`
- `a11y-figure`
- `a11y-gif-player`
- `a11y-media-player`
- `a11y-menu-button`
- `a11y-tabs`
- `absolute-position-behavior`
- `accent-card`
- `aframe-player`
- `ai-usage-license`
- `app-hax`
- `audio-player`
- `author-card`
- `awesome-explosion`
- `b-r`
- `beaker-broker`
- `bibliography-builder`
- `career-timeline`
- `chartist-render`
- `citation-element`
- `cms-hax`
- `code-editor`
- `code-sample`
- `collection-list`
- `count-up`
- `course-model`
- `csv-render`
- `d-d-d`
- `date-card`
- `discord-embed`
- `disqus-embed`
- `documentation-player`
- `editable-table`
- `elmsln-loading`
- `enhanced-text`
- `event-badge`
- `example-hax-element`
- `figure-label`
- `fill-in-the-blanks`
- `flash-card`
- `full-width-image`
- `future-terminal-text`
- `git-corner`
- `github-preview`
- `grade-book`
- `grid-plate`
- `h-a-x`
- `h5p-element`
- `hal-9000`
- `hax-logo`
- `hex-picker`
- `hexagon-loader`
- `html-block`
- `iframe-loader`
- `image-compare-slider`
- `image-gallery`
- `image-inspector`
- `img-pan-zoom`
- `img-view-modal`
- `inline-audio`
- `jwt-login`
- `la-tex`
- `license-element`
- `linkedin-embed`
- `lorem-data`
- `lrn-math`
- `lrn-table`
- `lrn-vocab`
- `lrndesign-imagemap`
- `lrndesign-timeline`
- `lunr-search`
- `map-menu`
- `mark-the-words`
- `matching-question`
- `md-block`
- `media-image`
- `media-playlist`
- `media-quote`
- `meme-maker`
- `merit-badge`
- `moar-sarcasm`
- `moment-element`
- `multiple-choice`
- `music-player`
- `oer-schema`
- `outline-designer`
- `page-break`
- `page-contents-menu`
- `page-flag`
- `page-section`
- `paper-input-flagged`
- `parallax-image`
- `pdf-browser-viewer`
- `person-testimonial`
- `place-holder`
- `play-list`
- `post-card`
- `product-card`
- `product-glance`
- `product-offering`
- `progress-donut`
- `promise-progress`
- `q-r`
- `relative-heading`
- `responsive-grid`
- `responsive-utility`
- `retro-card`
- `rich-text-editor`
- `rpg-character`
- `screen-recorder`
- `scroll-button`
- `self-check`
- `sheet-music`
- `simple-autocomplete`
- `simple-colors`
- `simple-cta`
- `simple-datetime`
- `simple-fields`
- `simple-icon`
- `simple-icon-picker`
- `simple-img`
- `simple-login`
- `simple-modal`
- `simple-pager`
- `simple-picker`
- `simple-popover`
- `simple-progress`
- `simple-range-input`
- `simple-search`
- `simple-toast`
- `simple-toolbar`
- `simple-tooltip`
- `simple-wc`
- `slide-deck`
- `social-share-link`
- `sorting-question`
- `spotify-embed`
- `star-rating`
- `stop-note`
- `tableau-embed`
- `tagging-question`
- `twitter-embed`
- `type-writer`
- `un-sdg`
- `undo-manager`
- `unity-webgl`
- `user-action`
- `user-scaffold`
- `video-player`
- `vocab-term`
- `web-container`
- `wikipedia-query`
- `word-count`

Plus `chat-agent` (functional, JS-driven) and the `outline-player` theme demo.

---

## Known Follow-ups (element-source issues found during this pass; outside demo-file scope)

1. **`lrn-math` CDN dependency:** the element source loads MathJax from `cdnjs.cloudflare.com` whenever it renders — consider vendoring or pinning for offline use.
2. **`outline-designer` harness:** the preserved pre-existing harness fetches `https://haxtheweb.org/site.json` and `example.json`; the newly added sections are fully static.
3. **`hax-cloud` demo page:** references `dist/`, `wc-registry.json`, and site-builder assets (pre-existing app-page structure preserved; root now stubbed).
4. **`html-block` quirk:** the element strips `allowscript` on connect, so runtime property toggling is the only meaningful demo path — documented in the demo.
5. **`@demo` JSDoc tags:** ~10 utility sources still reference deleted demos (see Section 1 note).

---

## QA Plan — all phases complete

- **Phase 1: Standardize demo location — COMPLETE** (all elements with demos use `demo/index.html`; roots are redirect stubs)
- **Phase 2: Modernize Polymer demos — COMPLETE** (zero `demo-pages-shared-styles` remain)
- **Phase 3: Bare-tag property coverage — COMPLETE** (91 → 0 genuine gaps; remaining bare-tag entries all verified legitimate)
- **Phase 4: Theme previews — COMPLETE** (20/20 themes have full root site previews)
- **Phase 5: Cleanup and validation — COMPLETE** (chat-agent fixed; utility placeholder demos and dangling stubs removed; root stubs standardized; final validation scan passed: zero broken, zero dangling, zero Polymer, 158+ good demos)
