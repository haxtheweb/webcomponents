# Demo Audit Report

This audit covers all elements in `elements/` and categorizes them by demo quality, location, and necessity.

## Summary

- **Total elements audited:** ~220
- **Good demos (modern, shows properties):** ~80
- **Could use improvement (old style, bare tag, or wrong location):** ~120
- **Don't need demos (utilities/behaviors/mixins):** ~20
- **Themes (need site context):** ~19
- **Missing any usable demo:** 3

---

## 1. Missing Demos (no usable entry point)

These elements have neither `demo/index.html` nor a root `index.html` that serves as a demo.

- `deduping-fix` — script override, no visual element
- `es-global-bridge` — utility class, no visual element
- `intersection-element` — mixin only, no visual element

*Recommendation:* No action needed; they are non-visual infrastructure.

---

## 2. Don't Need Demos (utilities, behaviors, mixins, scripts)

These are non-visual or infrastructure-only. If they have a placeholder demo, it can be ignored or removed.

- `a11y-behaviors`
- `a11y-utils`
- `anchor-behaviors`
- `baseline-build-hax`
- `deduping-fix`
- `dl-behavior`
- `es-global-bridge`
- `hax-body-behaviors`
- `intersection-element`
- `json-outline-schema`
- `lazy-image-helpers`
- `media-behaviors`
- `mutation-observer-import-mixin`
- `radio-behaviors`
- `schema-behaviors`
- `shadow-style`
- `utils`
- `wc-autoload`

---

## 3. Themes (need site context, not simple component demo)

Themes require a HAXcms site context to render properly. Some have a root `index.html` preview; others only have a `demo/index.html` with a bare tag.

**Themes with root `index.html` preview only:**
- `clean-portfolio-theme`
- `example-haxcms-theme`
- `glossy-portfolio-theme`
- `haxma-theme`
- `journey-theme`
- `link-card-theme`
- `resume-theme`
- `spacebook-theme`
- `twenty-six-theme`

**Themes with `demo/index.html` (often bare tag):**
- `bootstrap-theme`
- `clean-one`
- `clean-two`
- `haxor-slevin`
- `learn-two-theme`
- `outline-player`
- `polaris-theme`
- `simple-blog`
- `terrible-themes`
- `training-theme`

*Recommendation:* Ensure each theme has a working root `index.html` that renders a basic site preview. `demo/index.html` is less useful for themes.

---

## 4. Demos Only in Root `index.html` (not `demo/index.html`)

These elements have a usable demo but it lives in the root `index.html` instead of the standard `demo/index.html`.

- `ai-usage-license`
- `author-card`
- `bibliography-builder`
- `career-timeline`
- `d-d-docs`
- `demo-snippet`
- `example-hax-element`
- `image-gallery`
- `replace-tag`
- `screen-recorder`
- `un-sdg`
- `web-container`

*Recommendation:* Move or copy these into `demo/index.html` for consistency. Many of these are already high-quality demos (e.g., `author-card`, `image-gallery`, `ai-usage-license`).

---

## 5. Old Polymer-Style Demos (`demo-pages-shared-styles`)

These 30 demos still use the deprecated `<style is="custom-style" include="demo-pages-shared-styles">` construct. They should be modernized to use DDD tokens and standard CSS.

- `a11y-carousel`
- `a11y-collapse`
- `a11y-compare-image`
- `a11y-media-player`
- `accent-card`
- `anchor-behaviors`
- `chartist-render`
- `editable-table`
- `hexagon-loader`
- `image-compare-slider`
- `img-view-modal`
- `lorem-data`
- `lrndesign-chart`
- `lrndesign-imagemap`
- `lrndesign-timeline`
- `moment-element`
- `parallax-image`
- `polaris-theme`
- `product-offering`
- `relative-heading`
- `responsive-utility`
- `retro-card`
- `scroll-button`
- `self-check`
- `simple-login`
- `simple-picker`
- `simple-popover`
- `simple-search`
- `vocab-term`
- `wikipedia-query`

*Recommendation:* Remove the Polymer include and replace with DDD-based layout in the demo.

---

## 6. Bare-Tag Demos (no attributes/properties shown)

These 91 elements have a `demo/index.html` but the demo never shows the element with any attributes. The demo is a bare tag (`<my-element>`) with no property coverage.

- `a11y-behaviors`
- `a11y-gif-player`
- `a11y-menu-button`
- `a11y-utils`
- `air-horn`
- `anchor-behaviors`
- `baseline-build-hax`
- `beaker-broker`
- `bootstrap-theme`
- `chartist-render`
- `chat-agent`
- `clean-one`
- `clean-two`
- `cms-hax`
- `course-design`
- `course-model`
- `data-viz`
- `d-d-d`
- `dl-behavior`
- `dynamic-import-registry`
- `editable-table`
- `event-badge`
- `file-system-broker`
- `flash-card`
- `fluid-type`
- `fullscreen-behaviors`
- `grade-book`
- `h5p-element`
- `hax-body-behaviors`
- `hax-body`
- `hax-cloud`
- `haxcms-elements`
- `hax-iconset`
- `haxor-slevin`
- `html-block`
- `i18n-manager`
- `image-compare-slider`
- `img-view-modal`
- `json-outline-schema`
- `jwt-login`
- `la-tex`
- `lazy-image-helpers`
- `lazy-import-discover`
- `learn-two-theme`
- `lrndesign-chart`
- `lrn-math`
- `lrs-elements`
- `lunr-search`
- `media-behaviors`
- `meme-maker`
- `merit-badge`
- `micro-frontend-registry`
- `moar-sarcasm`
- `multiple-choice`
- `mutation-observer-import-mixin`
- `outline-designer`
- `page-scroll-position`
- `parallax-image`
- `polaris-theme`
- `portal-launcher`
- `pouch-db`
- `product-card`
- `product-offering`
- `radio-behaviors`
- `responsive-grid`
- `responsive-utility`
- `retro-card`
- `runkit-embed`
- `schema-behaviors`
- `self-check`
- `shadow-style`
- `simple-autocomplete`
- `simple-blog`
- `simple-colors-shared-styles`
- `simple-emoji`
- `simple-filter`
- `simple-img`
- `simple-login`
- `simple-modal`
- `simple-toast`
- `simple-wc`
- `social-share-link`
- `super-daemon`
- `terrible-themes`
- `training-theme`
- `unity-webgl`
- `user-scaffold`
- `utils`
- `voice-recorder`
- `wc-autoload`
- `wysiwyg-hax`

*Recommendation:* For each visual element, add at least one example with meaningful attributes. Skip behaviors/utilities.

---

## 7. Good Demos (modern, in `demo/index.html` or root `index.html`, show properties)

These elements have a usable demo that shows the element with attributes or in a realistic context.

- `ai-usage-license` (root index.html)
- `author-card` (root index.html)
- `career-timeline` (root index.html)
- `image-gallery` (root index.html)
- `web-container` (root index.html)
- `a11y-details`
- `a11y-figure`
- `a11y-tabs`
- `absolute-position-behavior`
- `aframe-player`
- `app-hax`
- `audio-player`
- `awesome-explosion`
- `b-r`
- `check-it-out`
- `citation-element`
- `code-editor`
- `code-sample`
- `collection-list`
- `count-up`
- `csv-render`
- `date-card`
- `discord-embed`
- `disqus-embed`
- `documentation-player`
- `elmsln-loading`
- `enhanced-text`
- `fill-in-the-blanks`
- `full-width-image`
- `future-terminal-text`
- `git-corner`
- `github-preview`
- `grid-plate`
- `hal-9000`
- `h-a-x`
- `hax-logo`
- `hex-picker`
- `iframe-loader`
- `image-inspector`
- `img-pan-zoom`
- `inline-audio`
- `license-element`
- `linkedin-embed`
- `lrn-table`
- `lrn-vocab`
- `map-menu`
- `mark-the-words`
- `matching-question`
- `md-block`
- `media-image`
- `media-playlist`
- `media-quote`
- `music-player`
- `oer-schema`
- `page-break`
- `page-contents-menu`
- `page-flag`
- `page-section`
- `paper-input-flagged`
- `pdf-browser-viewer`
- `person-testimonial`
- `place-holder`
- `play-list`
- `post-card`
- `product-glance`
- `progress-donut`
- `promise-progress`
- `q-r`
- `rich-text-editor`
- `rpg-character`
- `simple-colors`
- `simple-cta`
- `simple-datetime`
- `simple-fields`
- `simple-icon`
- `simple-icon-picker`
- `simple-progress`
- `simple-range-input`
- `simple-search`
- `simple-toolbar`
- `simple-tooltip`
- `sorting-question`
- `spotify-embed`
- `star-rating`
- `stop-note`
- `tagging-question`
- `twitter-embed`
- `type-writer`
- `undo-manager`
- `user-action`
- `video-player`
- `word-count`
- `screen-recorder` (root index.html)
- `resume-theme` (root index.html)
- `journey-theme` (root index.html)

*Note:* Some good demos are in the root `index.html` and should eventually be moved to `demo/index.html` for consistency, but they are functionally complete.

---

## QA Plan

### Phase 1: Move root `index.html` demos into `demo/index.html`
**Goal:** Standardize demo location.
**Elements:** `ai-usage-license`, `author-card`, `bibliography-builder`, `career-timeline`, `d-d-docs`, `demo-snippet`, `example-hax-element`, `image-gallery`, `replace-tag`, `screen-recorder`, `un-sdg`, `web-container`.
**Action:** Copy or refactor the root `index.html` into `demo/index.html`. This is a quick win for ~12 elements.

### Phase 2: Modernize old Polymer demos
**Goal:** Remove deprecated `demo-pages-shared-styles` and align with DDD design system.
**Elements:** 30 elements (see Section 5).
**Action:** Replace the Polymer include with standard CSS using DDD variables. Update `demo-snippet` usage if needed. This is a medium-sized batch task.

### Phase 3: Add property coverage to bare-tag demos
**Goal:** Ensure every visual element demonstrates at least one key attribute/property.
**Elements:** ~91 (see Section 6). Exclude behaviors/utilities/themes from this pass.
**Action:** For each visual element, open `demo/index.html` and add `<my-element attr="value">` examples that exercise the API. This is the largest QA pass. Tackle in batches by element family (e.g., all `simple-*` elements, all `a11y-*` elements, all media elements).

### Phase 4: Theme previews
**Goal:** Ensure every theme has a working root `index.html` preview.
**Elements:** `clean-portfolio-theme`, `example-haxcms-theme`, `glossy-portfolio-theme`, `haxma-theme`, `journey-theme`, `link-card-theme`, `resume-theme`, `spacebook-theme`, `twenty-six-theme`.
**Action:** Verify the root `index.html` renders a basic site preview. If missing, create a minimal one.

### Phase 5: Final validation
**Goal:** Run a quick check that every visual element has a `demo/index.html`.
**Action:** Re-run the audit script and confirm zero bare-tag visual elements and zero missing demos.
