# Demo Audit Report

Updated 2026-09-29 via a single-pass scan of every element in `elements/` (demo presence, root `index.html` redirect vs full content, tag usage with/without attributes, `demo-snippet` usage, and `HAXCMSLitElement` inheritance for theme detection).

This audit covers all elements in `elements/` and categorizes them by demo quality, location, and necessity.

## Summary

- **Total elements audited:** 224
- **Good demos (show element with attributes/properties):** 150 visual elements (+ `outline-player` theme)
- **Bare-tag-only demos:** 15 visual elements (down from 91) + 10 themes + 4 utilities
- **Demo exercises element via sub-tags / hub pages (legitimate for packages):** 13
- **Broken demo:** 1 (`chat-agent` — empty body)
- **Utilities/behaviors/mixins (no demo needed):** ~26; 11 now ship no demo, 15 still carry a placeholder demo
- **Themes (`HAXCMSLitElement`):** 20

## Changes since the previous audit

- **Removed from `elements/`:** `data-viz`, `runkit-embed`
- **New elements:** `chamfer-theme`, `figure-label`, `hax-app-installer`, `hax-bookmarklet`, `sheet-music`, `simple-pager`, `slide-deck`, `tableau-embed`
- **All 30 Polymer-style demos (`demo-pages-shared-styles`) are gone** — 0 remain (previous Phase 2 complete)
- **All 12 "root `index.html` only" demos now also have `demo/index.html`** (previous Phase 1 complete); the standard root file is now a redirect stub (`globalThis.location.href = 'demo/index.html'`) on 185 elements
- **Bare-tag demos reduced from 91 to 15 visual elements**; most remaining bare-tag usages are legitimate (slot-driven or CSS-variable-driven elements)
- **Placeholder demos removed from most utilities** — 11 utilities now ship no demo at all

---

## 1. Broken / Missing Demos

- `chat-agent` — `demo/index.html` has an empty `<body>`; no element is rendered at all. Needs a real demo (note: it currently points at `open-apis.hax.cloud`, which is being moved off of — see on-premises API rule)

The following have no `demo/index.html` and no root `index.html`, which is correct since they are non-visual infrastructure:

- `a11y-behaviors`, `baseline-build-hax`, `deduping-fix`, `dl-behavior`, `es-global-bridge`, `hax-bookmarklet`, `intersection-element`, `media-behaviors`, `schema-behaviors`, `simple-filter`, `utils`

*Recommendation:* Fix `chat-agent`. No action needed for the infrastructure packages.

---

## 2. Don't Need Demos (utilities, behaviors, mixins, scripts)

**No longer ship a demo (cleanup already done):**
- `a11y-behaviors`, `baseline-build-hax`, `deduping-fix`, `dl-behavior`, `es-global-bridge`, `hax-bookmarklet`, `intersection-element`, `media-behaviors`, `schema-behaviors`, `simple-filter`, `utils`

**Still carry a leftover placeholder demo (can be ignored or removed):**
- `a11y-utils`
- `anchor-behaviors`
- `dynamic-import-registry`
- `fullscreen-behaviors` (demo uses its own tag with attributes, but it is a behavior)
- `hax-body-behaviors`
- `json-outline-schema`
- `lazy-image-helpers`
- `lazy-import-discover`
- `micro-frontend-registry`
- `mutation-observer-import-mixin`
- `pouch-db`
- `radio-behaviors`
- `shadow-style`
- `simple-colors-shared-styles`
- `wc-autoload`

*Recommendation:* Remove the 15 leftover placeholder demos for consistency with the utilities that already had theirs removed.

---

## 3. Themes (need site context, not a simple component demo)

20 themes detected via `HAXCMSLitElement` inheritance. All 20 now have both a root `index.html` and a `demo/index.html`.

**Full root `index.html` site preview (8):**
- `clean-portfolio-theme`, `example-haxcms-theme`, `glossy-portfolio-theme`, `haxma-theme`, `journey-theme`, `link-card-theme`, `resume-theme`, `spacebook-theme`

**Root `index.html` is a redirect stub to `demo/index.html` (12):**
- `bootstrap-theme`, `chamfer-theme`, `clean-one`, `clean-two`, `haxor-slevin`, `learn-two-theme`, `outline-player`, `polaris-theme`, `simple-blog`, `terrible-themes`, `training-theme`, `twenty-six-theme`

Demo quality within `demo/index.html`: `outline-player` shows its tag with attributes; 10 themes render only a bare tag (`clean-one`, `example-haxcms-theme`, `glossy-portfolio-theme`, `haxma-theme`, `haxor-slevin`, `journey-theme`, `link-card-theme`, `resume-theme`, `simple-blog`, `spacebook-theme`); 9 themes never render their own tag (`bootstrap-theme`, `chamfer-theme`, `clean-portfolio-theme`, `clean-two`, `learn-two-theme`, `polaris-theme`, `terrible-themes`, `training-theme`, `twenty-six-theme`).

*Recommendation:* A bare `<my-theme>` tag in `demo/index.html` is a weak preview for a theme. Give the 12 redirect-root themes a full root `index.html` site preview like the 8 above, and treat `demo/index.html` as secondary for all themes. `chamfer-theme` is new — confirm it follows whichever convention is adopted.

---

## 4. Full (non-redirect) root `index.html` files

28 elements keep a full demo in the root `index.html` instead of the standard redirect stub. All 28 also have a `demo/index.html`, and in most cases the content is duplicated between the two:

- `ai-usage-license`, `author-card`, `bibliography-builder`, `career-timeline`, `clean-portfolio-theme`, `cms-hax`, `d-d-d`, `d-d-docs`, `demo-snippet`, `example-hax-element`, `example-haxcms-theme`, `glossy-portfolio-theme`, `h-a-x`, `hax-body`, `hax-cloud`, `haxma-theme`, `image-gallery`, `journey-theme`, `link-card-theme`, `media-playlist`, `replace-tag`, `resume-theme`, `screen-recorder`, `spacebook-theme`, `stop-note`, `un-sdg`, `web-container`, `wysiwyg-hax`

(8 of these are the themes from Section 3 whose root preview is intentional.)

*Recommendation:* For the 20 non-theme entries, replace the root `index.html` with the standard redirect stub once the content is confirmed to match `demo/index.html`, to avoid maintaining two copies.

---

## 5. Bare-Tag Demos (no attributes shown) — 15 visual elements

These render the element but never with attributes. Several are legitimate because the API is slot- or CSS-variable-driven (noted where verified); the rest are placeholders.

- `air-horn` — slot-driven wrapper (verified: API is slotted content)
- `beaker-broker` — broker wiring
- `d-d-docs` — renders full DDD documentation (verified)
- `demo-snippet` — the demo infrastructure itself
- `fluid-type` — verified: API is exercised via CSS custom properties, not attributes
- `hax-cloud` — package wrapper
- `html-block` — slot-based block
- `jwt-login` — verified placeholder ("This is jwt-login"); should show `jwt`, `url`, `refresh-url` etc.
- `lrn-math` — slot-driven math rendering
- `outline-designer` — verify whether properties should be shown
- `page-scroll-position` — verified placeholder ("This is page-scroll-position"); should show `progress`, `has-active-parent` usage
- `portal-launcher` — slot API shown; consider also showing `active-tools`/`visible-tools`
- `simple-emoji` — verify whether properties should be shown
- `user-scaffold` — verify
- `voice-recorder` — verify

*Recommendation:* Only `jwt-login` and `page-scroll-position` are confirmed genuine gaps. Verify the remaining unannotated entries; if slot/CSS-var coverage is sufficient, no change is needed.

---

## 6. Own Tag Not Rendered, But Demo Is Real (packages/hub pages) — 13 elements

These never render their own top-level tag in `demo/index.html`, but the demo is legitimate because it exercises sub-elements, sub-pages, or JS wiring:

- `chat-agent` — **broken**, empty body (see Section 1)
- `course-design` — substantial demo (421 lines) via sub-components
- `file-system-broker` — demos broker wiring
- `hax-app-installer` — demos the installer UI (351 lines)
- `hax-body` — demos body wiring
- `hax-iconset` — renders `simple-iconset-demo` (the package's actual surface)
- `haxcms-elements` — demos sub-elements
- `i18n-manager` — demos manager wiring (could also be classified as a utility)
- `lrndesign-chart` — hub page linking to `bar.html` / `line.html` / `pie.html` sub-demos (verified)
- `lrs-elements` — renders `lrs-bridge`/`lrs-emitter` (verified: the package's actual tags)
- `replace-tag` — hub page linking to `magicDeviceMethod.html` / `magicMethod.html` / `traditionalMethod.html` (verified)
- `super-daemon` — demos via JS
- `wysiwyg-hax` — demos via JS

*Recommendation:* No action except fixing `chat-agent`.

---

## 7. Good Demos (element shown with attributes) — 150 visual elements

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
- `iframe-loader`
- `image-compare-slider`
- `image-gallery`
- `image-inspector`
- `img-pan-zoom`
- `img-view-modal`
- `inline-audio`
- `la-tex`
- `license-element`
- `linkedin-embed`
- `lorem-data`
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
- `video-player`
- `vocab-term`
- `web-container`
- `wikipedia-query`
- `word-count`

Of these, 25 demos do not use `demo-snippet` and render directly (e.g., `app-hax`, `cms-hax`, `code-editor`, `code-sample`, `d-d-d`, `d-d-docs`, `h-a-x`, `hax-app-installer`, `hax-body`, `hax-cloud`, `haxcms-elements`, `lazy-image-helpers`, `lazy-import-discover`, `micro-frontend-registry`, `outline-designer`, `promise-progress`, `replace-tag`, `sheet-music`, `simple-pager`, `slide-deck`, `super-daemon`, `tableau-embed`, `wc-autoload`, `web-container`, `wysiwyg-hax`).

---

## QA Plan

### Phase 1: Standardize demo location — COMPLETE
Every element with a demo now has `demo/index.html`; the root `index.html` is a redirect stub on 185 elements.

### Phase 2: Modernize old Polymer demos — COMPLETE
Zero `demo-pages-shared-styles` usages remain in the monorepo.

### Phase 3: Add property coverage to bare-tag demos — NEARLY COMPLETE
Reduced from 91 to 15 visual elements (Section 5). Confirmed remaining gaps: `jwt-login`, `page-scroll-position`. Verify the other unannotated entries in Section 5; skip behaviors/utilities.

### Phase 4: Theme previews — PARTIAL
8 of 20 themes have a full root `index.html` site preview. Give the remaining 12 redirect-root themes a root site preview. New `chamfer-theme` needs a preview either way.

### Phase 5: Cleanup and validation — REMAINING
- Fix `chat-agent`'s empty demo body.
- Remove the 15 leftover utility placeholder demos (Section 2).
- Convert the 20 non-theme full root `index.html` files to redirect stubs once content is confirmed duplicated in `demo/index.html` (Section 4).
- Re-run this audit and confirm: zero broken demos, zero placeholder utility demos, every theme has a root site preview.
