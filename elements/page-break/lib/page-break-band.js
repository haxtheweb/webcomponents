/**
 * Copyright 2021 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css, supportsAdoptingStyleSheets } from "lit";

/**
 * The page-break editing band: styles, template and helpers that only matter
 * while HAX is in edit mode. page-break imports this module on demand the
 * first time it is edited (data-hax-ray / editModeChanged) so visitors never
 * download it. Everything renders inside the page-break shadow root and
 * calls back into the page-break host, so the DOM, classes, events and
 * i18n strings are the same as when this lived in page-break.js.
 */

/**
 * Styles for the editing band; adopted into the page-break shadow root
 * after its own static styles the first time the band is loaded
 */
export const PageBreakBandStyles = css`
  :host {
    /* band palette; light-dark() follows the editor color-scheme */
    --page-break-ink: light-dark(
      var(--ddd-theme-default-slateGray),
      var(--ddd-theme-default-slateLight)
    );
    --page-break-head: light-dark(
      var(--ddd-theme-default-nittanyNavy),
      var(--ddd-theme-default-white)
    );
    --page-break-rule: light-dark(
      var(--ddd-theme-default-limestoneGray),
      var(--ddd-theme-default-slateGray)
    );
    --page-break-line: light-dark(
      var(--ddd-theme-default-limestoneLight),
      var(--ddd-theme-default-coalyGray)
    );
    --page-break-tint: light-dark(
      var(--ddd-theme-default-skyMaxLight),
      var(--ddd-theme-default-nittanyNavy)
    );
    --page-break-accent: light-dark(
      var(--ddd-theme-default-nittanyNavy),
      var(--ddd-theme-default-creekLight)
    );
    --page-break-on-accent: light-dark(
      var(--ddd-theme-default-white),
      var(--ddd-theme-default-potentialMidnight)
    );
    --page-break-focus: light-dark(
      var(--ddd-theme-default-link),
      var(--ddd-theme-default-linkLight)
    );
    --page-break-chip-bg: light-dark(
      var(--ddd-theme-default-white),
      var(--ddd-theme-default-potentialMidnight)
    );
    --page-break-ok-bg: light-dark(
      var(--ddd-theme-default-successLight),
      var(--ddd-theme-default-success)
    );
    --page-break-ok-ink: light-dark(
      var(--ddd-theme-default-success),
      var(--ddd-theme-default-successLight)
    );
    --page-break-draft-bg: light-dark(
      var(--ddd-theme-default-limestoneMaxLight),
      var(--ddd-theme-default-coalyGray)
    );
    --page-break-speed: 0.18s;
  }
  /* only visible while editing in HAX (data-hax-ray); visitors never see it */
  :host([data-hax-ray]) {
    display: block;
    height: auto;
    margin: var(--ddd-spacing-4) 0;
    padding: 0;
    border: none;
    background-color: transparent;
  }
  /* the band carries hover, focus and selected states itself */
  :host([data-hax-ray]:not(.blinkfocus)) {
    outline: none !important;
  }
  .pb-row {
    display: none;
  }
  :host([data-hax-ray]) .pb-row {
    display: flex;
    align-items: center;
    gap: var(--ddd-spacing-2);
  }
  .pb {
    all: unset;
    box-sizing: border-box;
    flex: 1 1 auto;
    min-width: 0;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--ddd-spacing-2) var(--ddd-spacing-3);
    min-height: var(--ddd-icon-md);
    padding: var(--ddd-spacing-1) var(--ddd-spacing-2);
    border: var(--ddd-border-size-xs) solid transparent;
    border-radius: var(--ddd-radius-md);
    cursor: pointer;
    font-family: var(--ddd-font-primary);
    color: var(--page-break-ink);
    transition:
      background-color var(--page-break-speed) ease,
      border-color var(--page-break-speed) ease,
      color var(--page-break-speed) ease;
  }
  .pb-rule {
    flex: 1 1 var(--ddd-spacing-6);
    min-width: var(--ddd-spacing-4);
    border-top: var(--ddd-border-size-sm) dotted var(--page-break-rule);
    transition:
      border-color var(--page-break-speed) ease,
      opacity var(--page-break-speed) ease;
  }
  .pb-rule.lead {
    flex: 0 0 var(--ddd-spacing-6);
  }
  .pb-title {
    display: inline-flex;
    align-items: center;
    gap: var(--ddd-spacing-2);
    min-width: 0;
    max-width: 100%;
    font-family: var(--ddd-font-primary);
    font-size: var(--ddd-font-size-5xs);
    font-weight: var(--ddd-font-weight-medium);
    line-height: 1.3;
    color: var(--page-break-head);
  }
  .pb-title simple-icon-lite {
    flex: 0 0 auto;
    --simple-icon-height: var(--ddd-icon-4xs);
    --simple-icon-width: var(--ddd-icon-4xs);
  }
  .pb-title-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .pb-meta {
    display: inline-flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--ddd-spacing-1) var(--ddd-spacing-2);
    opacity: 0.55;
    transition: opacity var(--page-break-speed) ease;
  }
  .pb-chip {
    display: inline-flex;
    align-items: center;
    gap: var(--ddd-spacing-1);
    height: 22px;
    padding: 0 var(--ddd-spacing-2);
    border-radius: var(--ddd-radius-rounded);
    border: var(--ddd-border-size-xs) solid var(--page-break-line);
    background-color: var(--page-break-chip-bg);
    font-family: var(--ddd-font-navigation);
    font-size: var(--ddd-font-size-6xs);
    font-weight: var(--ddd-font-weight-medium);
    letter-spacing: 0.02em;
    color: var(--page-break-ink);
    white-space: nowrap;
  }
  .pb-chip simple-icon-lite {
    --simple-icon-height: 12px;
    --simple-icon-width: 12px;
  }
  .pb-chip.ok {
    background-color: var(--page-break-ok-bg);
    border-color: transparent;
    color: var(--page-break-ok-ink);
  }
  .pb-chip.draft {
    background-color: var(--page-break-draft-bg);
    border-style: dashed;
  }
  .pb-chip.mono {
    font-family: var(--ddd-font-mono, monospace);
    font-weight: var(--ddd-font-weight-regular);
    letter-spacing: 0;
  }
  .pb-key {
    display: none;
    font-family: var(--ddd-font-navigation);
    font-size: var(--ddd-font-size-6xs);
    font-weight: var(--ddd-font-weight-medium);
    color: var(--page-break-ink);
  }
  .pb-action {
    display: inline-flex;
    align-items: center;
    gap: var(--ddd-spacing-2);
    height: var(--ddd-spacing-8);
    padding: 0 var(--ddd-spacing-3) 0 var(--ddd-spacing-2);
    border-radius: var(--ddd-radius-rounded);
    border: var(--ddd-border-size-xs) dashed var(--page-break-rule);
    font-family: var(--ddd-font-navigation);
    font-size: 13px;
    font-weight: var(--ddd-font-weight-medium);
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--page-break-ink);
    white-space: nowrap;
    transition:
      background-color var(--page-break-speed) ease,
      border-color var(--page-break-speed) ease,
      color var(--page-break-speed) ease;
  }
  .pb-action simple-icon-lite {
    --simple-icon-height: var(--ddd-icon-4xs);
    --simple-icon-width: var(--ddd-icon-4xs);
  }
  .pb-action-selected {
    display: none;
  }
  /* hover and keyboard focus */
  .pb:hover,
  .pb:focus-visible {
    background-color: var(--page-break-tint);
    border-color: var(--page-break-accent);
    color: var(--page-break-head);
  }
  .pb:hover .pb-rule,
  .pb:focus-visible .pb-rule {
    border-top-style: solid;
    border-color: var(--page-break-accent);
    opacity: 0.35;
  }
  .pb:hover .pb-meta,
  .pb:focus-visible .pb-meta {
    opacity: 1;
  }
  .pb:hover .pb-action,
  .pb:focus-visible .pb-action {
    background-color: var(--page-break-accent);
    border-style: solid;
    border-color: var(--page-break-accent);
    color: var(--page-break-on-accent);
  }
  .pb:focus-visible {
    outline: var(--ddd-border-size-md) solid var(--page-break-focus);
    outline-offset: 2px;
  }
  .pb:focus-visible .pb-key {
    display: inline;
  }
  /* selected: the active element in HAX */
  :host([data-hax-active]) .pb,
  :host([data-hax-active]) .pb:hover,
  :host([data-hax-active]) .pb:focus-visible {
    background-color: var(--page-break-accent);
    border-color: var(--page-break-accent);
    color: var(--page-break-on-accent);
  }
  :host([data-hax-active]) .pb-title {
    color: var(--page-break-on-accent);
  }
  :host([data-hax-active]) .pb .pb-rule {
    border-top-style: solid;
    border-color: var(--page-break-on-accent);
    opacity: 0.35;
  }
  :host([data-hax-active]) .pb .pb-meta {
    opacity: 0.8;
  }
  :host([data-hax-active]) .pb-chip,
  :host([data-hax-active]) .pb-chip.ok,
  :host([data-hax-active]) .pb-chip.draft {
    background-color: transparent;
    border-color: color-mix(
      in srgb,
      var(--page-break-on-accent) 45%,
      transparent
    );
    color: var(--page-break-on-accent);
  }
  :host([data-hax-active]) .pb .pb-action {
    background-color: var(--page-break-on-accent);
    border-style: solid;
    border-color: var(--page-break-on-accent);
    color: var(--page-break-accent);
  }
  :host([data-hax-active]) .pb-action-rest,
  :host([data-hax-active]) .pb .pb-key {
    display: none;
  }
  :host([data-hax-active]) .pb-action-selected {
    display: inline;
  }
  .pb-tools {
    display: inline-flex;
    align-items: center;
    gap: var(--ddd-spacing-1);
    flex: 0 0 auto;
  }
  @media (prefers-reduced-motion: reduce) {
    :host {
      --page-break-speed: 0s;
    }
  }
  .link-info {
    background-color: light-dark(
      var(--ddd-theme-default-limestoneLight),
      var(--ddd-theme-default-slateGray)
    );
    border: var(--ddd-border-xs);
    border-color: light-dark(
      var(--ddd-theme-default-limestoneGray),
      var(--ddd-theme-default-coalyGray)
    );
    border-radius: var(--ddd-radius-xs);
    padding: var(--ddd-spacing-3);
    margin-top: var(--ddd-spacing-2);
    font-size: var(--ddd-font-size-xs);
    color: light-dark(
      var(--ddd-theme-default-coalyGray),
      var(--ddd-theme-default-limestoneLight)
    );
  }
  :host([data-hax-ray]) .link-info {
    display: block;
  }
  .link-url {
    font-family: var(--ddd-font-mono, monospace);
    background-color: light-dark(
      var(--ddd-theme-default-white),
      var(--ddd-theme-default-coalyGray)
    );
    padding: var(--ddd-spacing-1) var(--ddd-spacing-2);
    border-radius: var(--ddd-radius-xs);
    border: var(--ddd-border-size-xs) solid
      light-dark(
        var(--ddd-theme-default-limestoneGray),
        var(--ddd-theme-default-slateGray)
      );
    display: inline-block;
    margin: var(--ddd-spacing-1) 0;
    word-break: break-all;
    text-decoration: none;
    color: light-dark(
      var(--ddd-theme-default-coalyGray),
      var(--ddd-theme-default-limestoneLight)
    );
  }
  .link-url:hover {
    background-color: light-dark(
      var(--ddd-theme-default-limestoneMaxLight),
      var(--ddd-theme-default-slateMaxLight)
    );
    color: var(--ddd-theme-default-skyBlue);
    border-color: var(--ddd-theme-default-skyBlue);
  }
  simple-toolbar-button.save-button,
  simple-toolbar-button.cancel-button {
    --simple-toolbar-button-height: 20px;
    --simple-toolbar-button-width: 20px;
    padding: var(--ddd-spacing-1);
    border: var(--ddd-border-xs);
    box-shadow: var(--ddd-boxShadow-sm);
    --simple-toolbar-button-hover-border-color: transparent;
  }
  /* save / cancel sit at the end of the band while editing */
  /* same colours and icons as the HAXcms top bar Save / Cancel */
  simple-toolbar-button.save-button,
  simple-toolbar-button.cancel-button {
    border-radius: var(--ddd-radius-circle);
    border: var(--ddd-border-size-xs) solid var(--ddd-theme-default-skyBlue);
    background-color: var(--ddd-theme-default-skyBlue);
    color: var(--ddd-theme-default-white);
    box-shadow: none;
    transition:
      opacity var(--page-break-speed) ease,
      background-color var(--page-break-speed) ease;
  }
  simple-toolbar-button.save-button:hover,
  simple-toolbar-button.save-button:focus-within {
    border-color: var(--ddd-theme-default-skyBlue);
    background-color: light-dark(
      var(--simple-colors-default-theme-light-blue-1, #e1f5fe),
      var(--simple-colors-default-theme-light-blue-2, #b3e5fc)
    );
    color: light-dark(
      var(--ddd-theme-default-skyBlue),
      var(--ddd-theme-default-white)
    );
  }
  simple-toolbar-button.cancel-button {
    background-color: var(--ddd-theme-default-discoveryCoral);
    border-color: var(--ddd-theme-default-discoveryCoral);
    color: var(--ddd-theme-default-white);
  }
  simple-toolbar-button.cancel-button:hover,
  simple-toolbar-button.cancel-button:focus-within {
    border-color: var(--ddd-theme-default-discoveryCoral);
  }
`;

/**
 * Add the band styles to a page-break shadow root, after its static styles
 * @param {ShadowRoot} root
 */
export function adoptPageBreakBandStyles(root) {
  if (!root) {
    return;
  }
  const sheet = PageBreakBandStyles.styleSheet;
  if (supportsAdoptingStyleSheets && sheet && root.adoptedStyleSheets) {
    if (!root.adoptedStyleSheets.includes(sheet)) {
      root.adoptedStyleSheets = [...root.adoptedStyleSheets, sheet];
    }
  } else if (!root.querySelector("style[data-page-break-band]")) {
    const style = globalThis.document.createElement("style");
    style.setAttribute("data-page-break-band", "");
    style.textContent = PageBreakBandStyles.cssText;
    root.appendChild(style);
  }
}

/**
 * Number of tags; tags may be a comma-separated string or an array
 * @param {String|Array} tags
 */
export function pageBreakTagCount(tags) {
  if (Array.isArray(tags)) {
    return tags.filter((tag) => tag != null && `${tag}`.trim() !== "").length;
  }
  if (typeof tags === "string") {
    return tags.split(",").filter((tag) => tag.trim() !== "").length;
  }
  return 0;
}

/**
 * Keep Enter / Space on the band from reaching the HAX body text editor
 * (which listens on the window); the native button still turns them into
 * a click, which HAX uses to select this element as it does today
 */
export function pageBreakBandKeydown(e) {
  if (e.key === "Enter" || e.key === " ") {
    e.stopPropagation();
  }
}

/**
 * The editing band: only displayed while HAX is in edit mode (data-hax-ray).
 * Rendered as part of the page-break template so event listeners are bound
 * to the page-break host.
 * @param {PageBreak} host
 */
export function renderPageBreakBand(host) {
  const title =
    typeof host.title === "string" && host.title.trim() !== ""
      ? host.title
      : host.t.pageBreak;
  // the page's own icon when set, otherwise a plain page icon (or the
  // break type icon for non-node breaks)
  const bandIcon =
    typeof host.icon === "string" && host.icon.trim() !== ""
      ? host.icon
      : host.breakType === "node"
        ? "editor:insert-drive-file"
        : host.iconType;
  const tagCount = pageBreakTagCount(host.tags);
  const tagLabel =
    tagCount === 0
      ? host.t.noTags
      : tagCount === 1
        ? host.t.oneTag
        : host.t.tagCount.replace("{count}", tagCount);
  const publishLabel = host.published ? host.t.published : host.t.draft;
  const lockLabel = host.locked ? host.t.locked : host.t.unlocked;
  const slug =
    typeof host.slug === "string" && host.slug.trim() !== ""
      ? host.slug.trim().startsWith("/")
        ? host.slug.trim()
        : `/${host.slug.trim()}`
      : "";
  const settingsLabel = host._haxActive
    ? host.t.editingPageSettings
    : host.t.pageSettings;
  const states = [publishLabel, lockLabel, tagLabel];
  if (slug) {
    states.push(slug);
  }
  const ariaLabel = `${title}, ${settingsLabel}. ${states.join(", ")}`;
  return html`
    <div class="pb-row">
      <button
        type="button"
        class="pb"
        title="${host.t.selectToEditPageDetails}"
        aria-label="${ariaLabel}"
        aria-pressed="${host._haxActive ? "true" : "false"}"
        @keydown="${pageBreakBandKeydown}"
      >
        <span class="pb-rule lead" aria-hidden="true"></span>
        <span class="pb-title" aria-hidden="true">
          <simple-icon-lite icon="${bandIcon}"></simple-icon-lite>
          <span class="pb-title-text">${title}</span>
        </span>
        <span class="pb-meta" aria-hidden="true">
          <span class="pb-chip ${host.published ? "ok" : "draft"}"
            >${publishLabel}</span
          >
          <span class="pb-chip">
            <simple-icon-lite
              icon="${host.locked ? "icons:lock" : "icons:lock-open"}"
            ></simple-icon-lite
            >${lockLabel}</span
          >
          <span class="pb-chip">${tagLabel}</span>
          ${slug ? html`<span class="pb-chip mono">${slug}</span>` : ``}
        </span>
        <span class="pb-rule" aria-hidden="true"></span>
        <span class="pb-key" aria-hidden="true">${host.t.enterKey}</span>
        <span class="pb-action" aria-hidden="true">
          <simple-icon-lite icon="image:tune"></simple-icon-lite>
          <span class="pb-action-rest">${host.t.pageSettings}</span>
          <span class="pb-action-selected">${host.t.editingPageSettings}</span>
        </span>
      </button>
      ${
        host.isLoggedIn && host._haxState
          ? html`
              <span class="pb-tools">
                <simple-toolbar-button
                  class="save-button"
                  icon="icons:save"
                  label="${host.t.savePage}"
                  @click="${host._savePage}"
                ></simple-toolbar-button>
                <simple-toolbar-button
                  class="cancel-button"
                  icon="icons:cancel"
                  label="${host.t.cancel}"
                  @click="${host._cancelEdit}"
                ></simple-toolbar-button>
              </span>
            `
          : ``
      }
    </div>
  `;
}
