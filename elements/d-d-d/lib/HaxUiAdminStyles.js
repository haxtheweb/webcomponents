/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 *
 * HAX UI: DDD's layer for admin chrome, the screens a signed-in editor uses
 * to change settings or data (site admin, system admin, outline-designer,
 * revisions, reports, Merlin). Content a visitor sees stays on DDD's
 * content scale. See design-system/source/hax-ui-admin.md for when to
 * apply it, the tokens and the patterns.
 *
 * This file is the one source for the layer. It lives in d-d-d so every
 * admin element can import it, including packages hax-body depends on
 * (super-daemon, simple-modal, rpg-character, simple-fields).
 * @haxtheweb/hax-body/lib/hax-ui-styles.js re-exports it for existing
 * imports.
 */
import { css } from "lit";

/**
 * HAX UI admin tokens: the semantic layer admin surfaces (outline designer,
 * dashboard, dialogs, trays) style themselves with. Every value maps to a
 * DDD primitive; surface, text and accent defer to the HAX UI theme tokens
 * (--hax-ui-background-color, --hax-ui-color, --hax-ui-color-accent) when
 * the editor has set them, so the HAX UI theme switch still applies.
 * Include it in an admin element's static styles; a page can override any
 * token on the element from outside. Admin elements use these tokens
 * instead of raw values or DDD content tokens, and new needs are added
 * here, mapped to DDD, before an element uses them.
 * See haxtheweb/issues#3180.
 */
export const HaxUiAdminTokens = [
  css`
    :host {
      --hax-ui-surface: var(
        --hax-ui-background-color,
        light-dark(
          var(--ddd-theme-default-white, #ffffff),
          var(--ddd-theme-default-coalyGray, #262626)
        )
      );
      --hax-ui-text: var(
        --hax-ui-color,
        light-dark(
          var(--ddd-theme-default-coalyGray, #262626),
          var(--ddd-theme-default-white, #ffffff)
        )
      );
      --hax-ui-text-muted: light-dark(
        var(--ddd-theme-default-slateGray, #314d64),
        var(--ddd-theme-default-white65, rgba(255, 255, 255, 0.65))
      );
      --hax-ui-line: light-dark(
        var(--ddd-theme-default-limestoneLight, #e4e5e7),
        color-mix(
          in srgb,
          var(--ddd-theme-default-white, #ffffff) 18%,
          transparent
        )
      );
      --hax-ui-line-strong: light-dark(
        var(--ddd-theme-default-limestoneGray, #a2aaad),
        color-mix(
          in srgb,
          var(--ddd-theme-default-white, #ffffff) 40%,
          transparent
        )
      );
      --hax-ui-hover: light-dark(
        var(--ddd-theme-default-limestoneMaxLight, #f2f2f4),
        color-mix(
          in srgb,
          var(--ddd-theme-default-white, #ffffff) 8%,
          transparent
        )
      );
      /* rows that belong to the row above (a page's content structure):
         a lighter wash than hover, so hovering one still shows */
      --hax-ui-content-group: light-dark(
        color-mix(
          in srgb,
          var(--ddd-theme-default-limestoneMaxLight, #f2f2f4) 55%,
          transparent
        ),
        color-mix(
          in srgb,
          var(--ddd-theme-default-white, #ffffff) 4%,
          transparent
        )
      );
      --hax-ui-accent: var(
        --hax-ui-color-accent,
        light-dark(
          var(--ddd-theme-default-beaverBlue, #1e407c),
          var(--ddd-theme-default-skyLight, #ccf0ff)
        )
      );
      --hax-ui-accent-strong: light-dark(
        var(--ddd-theme-default-link, #005fa9),
        var(--ddd-theme-default-skyBlue, #009cde)
      );
      --hax-ui-accent-soft: color-mix(
        in srgb,
        var(--hax-ui-accent-strong) 12%,
        transparent
      );
      --hax-ui-selected: color-mix(
        in srgb,
        var(--hax-ui-accent-strong) 18%,
        transparent
      );
      --hax-ui-on-accent: light-dark(
        var(--ddd-theme-default-white, #ffffff),
        var(--ddd-theme-default-potentialMidnight, #000321)
      );
      --hax-ui-danger: light-dark(
        var(--ddd-theme-default-original87Pink, #bc204b),
        var(--ddd-theme-default-discoveryCoral, #f2665e)
      );
      --hax-ui-danger-soft: color-mix(
        in srgb,
        var(--hax-ui-danger) 10%,
        transparent
      );
      --hax-ui-success: light-dark(
        var(--ddd-theme-default-opportunityGreen, #008755),
        var(--ddd-theme-default-creekLight, #cfeceb)
      );
      --hax-ui-focus: light-dark(
        var(--ddd-theme-default-link, #005fa9),
        var(--ddd-theme-default-keystoneYellow, #ffd100)
      );
      --hax-ui-focus-width: var(--ddd-border-size-sm, 2px);
      --hax-ui-drop: var(--hax-ui-accent-strong);
      --hax-ui-drop-width: var(--ddd-border-size-sm, 2px);

      --hax-ui-admin-font-family: var(
        --hax-ui-font-family,
        var(--ddd-font-navigation, sans-serif)
      );
      --hax-ui-admin-font-size: var(--hax-ui-font-size-sm, 14px);
      --hax-ui-admin-font-size-xs: var(--hax-ui-font-size-xs, 12px);
      --hax-ui-row-height: var(--ddd-control-height-xs, 32px);
      --hax-ui-row-height-compact: calc(
        var(--ddd-target-min, 24px) + var(--ddd-spacing-1, 4px)
      );
      --hax-ui-row-height-roomy: var(--ddd-control-height-sm, 40px);
      --hax-ui-target: var(--ddd-target-min, 24px);
      --hax-ui-indent: var(--ddd-spacing-5, 20px);
      --hax-ui-gap: var(--ddd-spacing-1, 4px);
      --hax-ui-gap-md: var(--ddd-spacing-2, 8px);
      --hax-ui-gap-lg: var(--ddd-spacing-3, 12px);
      --hax-ui-icon: var(--ddd-icon-4xs, 16px);
      --hax-ui-radius: var(--ddd-radius-xs, 4px);
      --hax-ui-radius-lg: var(--ddd-radius-sm, 8px);
      --hax-ui-radius-pill: var(--ddd-radius-rounded, 100px);
      --hax-ui-shadow-popover: var(
        --ddd-boxShadow-md,
        0 4px 12px rgba(0, 0, 0, 0.16)
      );
      --hax-ui-duration: var(--ddd-duration-fast, 150ms);
      --hax-ui-easing: var(--ddd-timing-ease, ease);
      /* showing what changed: rows sliding to new places, new rows
         growing in, the landing highlight; scaled per input in script */
      --hax-ui-duration-move: var(--ddd-duration-fast, 150ms);
      --hax-ui-easing-move: var(
        --ddd-timing-emphasized,
        cubic-bezier(0.2, 0, 0, 1)
      );
      --hax-ui-landed: color-mix(
        in srgb,
        var(--hax-ui-accent-strong) 24%,
        transparent
      );
      /* promoted from the spec's proposed list (site admin, system
         settings, page history, rpg-character-builder, toast and Merlin
         each wrote these by hand before) */
      --hax-ui-sunken: light-dark(
        var(--ddd-theme-default-limestoneMaxLight, #f2f2f4),
        rgba(0, 0, 0, 0.22)
      );
      --hax-ui-titlebar: light-dark(
        var(--ddd-theme-default-coalyGray, #262626),
        var(--ddd-theme-default-potentialMidnight, #000321)
      );
      --hax-ui-on-titlebar: var(--ddd-theme-default-white, #ffffff);
      --hax-ui-primary: light-dark(
        var(--ddd-theme-default-nittanyNavy, #001e44),
        var(--ddd-theme-default-linkLight, #cce9ff)
      );
      --hax-ui-primary-hover: light-dark(
        var(--ddd-theme-default-beaverBlue, #1e407c),
        var(--ddd-theme-default-skyLight, #ccf0ff)
      );
      --hax-ui-on-primary: light-dark(
        var(--ddd-theme-default-white, #ffffff),
        var(--ddd-theme-default-potentialMidnight, #000321)
      );
      --hax-ui-success-soft: color-mix(
        in srgb,
        var(--hax-ui-success) 14%,
        transparent
      );
      --hax-ui-warning: light-dark(#8a5300, #ffcf80);
      --hax-ui-warning-soft: light-dark(
        var(--ddd-theme-default-warningLight, #fff4e5),
        rgba(255, 174, 0, 0.14)
      );
      --hax-ui-info: light-dark(
        var(--ddd-theme-default-info, #014361),
        var(--ddd-theme-default-infoLight, #e5f6fd)
      );
      --hax-ui-info-soft: light-dark(
        var(--ddd-theme-default-infoLight, #e5f6fd),
        color-mix(
          in srgb,
          var(--ddd-theme-default-skyBlue, #009cde) 14%,
          transparent
        )
      );
      --hax-ui-field-height: var(--ddd-textfield-height-sm, 40px);
      --hax-ui-titlebar-height: 48px;
      --hax-ui-action-bar-height: 56px;
      --hax-ui-rail-width: 192px;
      --hax-ui-rail-width-collapsed: 56px;
    }
  `,
];
/**
 * Small pieces every admin surface repeats, built on HaxUiAdminTokens:
 * status pills, keyboard hints, visually hidden text and the focus ring.
 */
export const HaxUiAdminPrimitives = [
  css`
    .hax-ui-pill {
      display: inline-flex;
      align-items: center;
      flex: none;
      padding: 0 var(--hax-ui-gap-md);
      border-radius: var(--hax-ui-radius-pill);
      font-size: var(--hax-ui-admin-font-size-xs);
      font-weight: var(--ddd-font-weight-medium, 500);
      line-height: 1.5;
      white-space: nowrap;
      color: var(--hax-ui-text-muted);
      background-color: var(--hax-ui-hover);
    }
    .hax-ui-pill[data-tone="success"] {
      color: var(--hax-ui-success);
      background-color: transparent;
      box-shadow: inset 0 0 0 1px currentColor;
    }
    .hax-ui-pill[data-tone="danger"] {
      color: var(--hax-ui-danger);
      background-color: var(--hax-ui-danger-soft);
    }
    .hax-ui-pill[data-tone="accent"] {
      color: var(--hax-ui-accent);
      background-color: var(--hax-ui-accent-soft);
    }
    .hax-ui-kbd {
      font-family: var(--ddd-font-mono, monospace);
      font-size: var(--hax-ui-admin-font-size-xs);
      padding: 0 var(--hax-ui-gap);
      border: 1px solid var(--hax-ui-line);
      border-bottom-width: var(--hax-ui-focus-width);
      border-radius: var(--hax-ui-radius);
      color: var(--hax-ui-text);
      background-color: var(--hax-ui-surface);
    }
    .hax-ui-sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0 0 0 0);
      white-space: nowrap;
      border: 0;
    }
    .hax-ui-focus-ring:focus-visible {
      outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
      outline-offset: calc(-1 * var(--hax-ui-focus-width));
    }
    @media (forced-colors: active) {
      .hax-ui-focus-ring:focus-visible {
        outline-color: Highlight;
      }
    }
  `,
];

/**
 * One name per admin meaning. Admin chrome uses the hax:admin-* family
 * only (see "Admin icons" in hax-ui-admin.md); pick the icon by what it
 * means here instead of typing a name, so every surface draws the same
 * glyph for the same action:
 *
 *   <simple-icon-lite icon="${HaxUiAdminIcons.close}"></simple-icon-lite>
 *
 * Section and Reports icons stay in the site admin section registry.
 * Content icons (block icons, hax:file-*, brand marks) are not admin
 * chrome and stay what they are.
 */
export const HaxUiAdminIcons = Object.freeze({
  add: "hax:admin-add",
  back: "hax:admin-back",
  check: "hax:admin-check",
  chevron: "hax:admin-chevron",
  close: "hax:admin-close",
  copy: "hax:admin-copy",
  delete: "hax:admin-delete",
  download: "hax:admin-download",
  drag: "hax:admin-drag",
  edit: "hax:admin-edit",
  enter: "hax:admin-enter",
  external: "hax:admin-external",
  history: "hax:admin-history",
  home: "hax:admin-home",
  info: "hax:admin-info",
  more: "hax:admin-more",
  preview: "hax:admin-preview",
  railCollapse: "hax:admin-rail-collapse",
  railExpand: "hax:admin-rail-expand",
  refresh: "hax:admin-refresh",
  search: "hax:admin-search",
  selectAll: "hax:admin-select-all",
  upload: "hax:admin-upload",
  voice: "hax:admin-voice",
  warning: "hax:admin-warning",
});

/**
 * The controls every admin surface shares, as the HaxUiAdminControls and
 * HaxUiAdminFieldRow design-system cards describe them. Spread after
 * HaxUiAdminTokens and use the classes instead of restyling a button,
 * switch or input in each element.
 *
 * - .hax-ui-btn (secondary), .hax-ui-btn.primary, .hax-ui-btn.ghost,
 *   .hax-ui-btn.danger (outline, opens a confirm), .hax-ui-btn.danger-fill
 *   (the final commit); 32px, words beside a 16px icon
 * - .hax-ui-icon-btn: 32px square, needs aria-label
 * - .hax-ui-seg: segmented control of buttons with aria-pressed
 * - .hax-ui-chip, .hax-ui-chip[data-set]: filter chips
 * - .hax-ui-switch: a button with role="switch" and aria-checked
 * - .hax-ui-input, .hax-ui-select, .hax-ui-textarea: 40px field controls;
 *   add .compact for a 32px toolbar control (search, filters)
 * - .hax-ui-field-row with .hax-ui-field-label (label + p help) and
 *   .hax-ui-field-control; .hax-ui-changed-dot before a changed label
 * - .hax-ui-message[data-tone="warning|danger|info"] under a control
 * - .hax-ui-callout[data-tone="warning|info"]
 * - .hax-ui-empty: empty state
 */
export const HaxUiAdminControls = [
  css`
    .hax-ui-btn {
      all: unset;
      box-sizing: border-box;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--hax-ui-gap);
      height: var(--hax-ui-row-height);
      padding: 0 var(--hax-ui-gap-lg);
      border: 1px solid var(--hax-ui-line-strong);
      border-radius: var(--hax-ui-radius);
      font-family: var(--hax-ui-admin-font-family);
      font-size: 13px;
      font-weight: var(--ddd-font-weight-medium, 500);
      white-space: nowrap;
      color: var(--hax-ui-text);
      background-color: var(--hax-ui-surface);
      --simple-icon-width: var(--hax-ui-icon);
      --simple-icon-height: var(--hax-ui-icon);
      transition:
        background-color var(--hax-ui-duration) var(--hax-ui-easing),
        border-color var(--hax-ui-duration) var(--hax-ui-easing);
    }
    .hax-ui-btn:hover {
      background-color: var(--hax-ui-hover);
    }
    .hax-ui-btn.ghost {
      border-color: transparent;
      background-color: transparent;
    }
    .hax-ui-btn.ghost:hover {
      background-color: var(--hax-ui-hover);
    }
    .hax-ui-btn.primary {
      min-width: 88px;
      font-weight: var(--ddd-font-weight-bold, 700);
      color: var(--hax-ui-on-primary);
      background-color: var(--hax-ui-primary);
      border-color: var(--hax-ui-primary);
    }
    .hax-ui-btn.primary:hover {
      background-color: var(--hax-ui-primary-hover);
      border-color: var(--hax-ui-primary-hover);
    }
    .hax-ui-btn.danger {
      color: var(--hax-ui-danger);
      border-color: var(--hax-ui-danger);
    }
    .hax-ui-btn.danger:hover {
      background-color: var(--hax-ui-danger-soft);
    }
    .hax-ui-btn.danger-fill {
      font-weight: var(--ddd-font-weight-bold, 700);
      color: var(--hax-ui-on-accent);
      background-color: var(--hax-ui-danger);
      border-color: var(--hax-ui-danger);
    }
    /* disabled must win over .primary / .danger / .ghost and their
       :hover (the doubled class matches their weight, and comes later),
       so an unavailable Save never lights up on hover */
    .hax-ui-btn.hax-ui-btn:is([disabled], [aria-disabled="true"]),
    .hax-ui-btn.hax-ui-btn:is([disabled], [aria-disabled="true"]):hover {
      cursor: default;
      font-weight: var(--ddd-font-weight-medium, 500);
      color: var(--hax-ui-text-muted);
      background-color: var(--hax-ui-surface);
      border-color: var(--hax-ui-line-strong);
    }
    .hax-ui-btn.hax-ui-btn.ghost:is([disabled], [aria-disabled="true"]),
    .hax-ui-btn.hax-ui-btn.ghost:is([disabled], [aria-disabled="true"]):hover {
      border-color: transparent;
      background-color: transparent;
      opacity: 0.6;
    }
    .hax-ui-icon-btn {
      all: unset;
      box-sizing: border-box;
      cursor: pointer;
      flex: none;
      display: inline-grid;
      place-items: center;
      width: var(--hax-ui-row-height);
      height: var(--hax-ui-row-height);
      border-radius: var(--hax-ui-radius);
      color: var(--hax-ui-text-muted);
      --simple-icon-width: var(--hax-ui-icon);
      --simple-icon-height: var(--hax-ui-icon);
    }
    .hax-ui-icon-btn:hover {
      color: var(--hax-ui-text);
      background-color: var(--hax-ui-hover);
    }
    .hax-ui-icon-btn.danger:hover {
      color: var(--hax-ui-danger);
      background-color: var(--hax-ui-danger-soft);
    }
    .hax-ui-icon-btn[disabled],
    .hax-ui-icon-btn[aria-disabled="true"] {
      cursor: default;
      opacity: 0.5;
    }
    .hax-ui-seg {
      display: inline-flex;
      border: 1px solid var(--hax-ui-line-strong);
      border-radius: var(--hax-ui-radius);
      overflow: hidden;
    }
    .hax-ui-seg button {
      all: unset;
      box-sizing: border-box;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: var(--hax-ui-gap);
      height: calc(var(--hax-ui-row-height) - 2px);
      padding: 0 10px;
      font-family: var(--hax-ui-admin-font-family);
      font-size: 13px;
      color: var(--hax-ui-text);
    }
    .hax-ui-seg button + button {
      border-left: 1px solid var(--hax-ui-line-strong);
    }
    .hax-ui-seg button:hover {
      background-color: var(--hax-ui-hover);
    }
    .hax-ui-seg button[aria-pressed="true"] {
      font-weight: var(--ddd-font-weight-bold, 700);
      background-color: var(--hax-ui-accent-soft);
    }
    .hax-ui-seg button[disabled] {
      cursor: default;
      color: var(--hax-ui-text-muted);
    }
    .hax-ui-chip {
      all: unset;
      box-sizing: border-box;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: var(--hax-ui-gap);
      height: 24px;
      padding: 0 var(--hax-ui-gap-md);
      border: 1px dashed var(--hax-ui-line-strong);
      border-radius: var(--hax-ui-radius-pill);
      font-family: var(--hax-ui-admin-font-family);
      font-size: var(--hax-ui-admin-font-size-xs);
      color: var(--hax-ui-text-muted);
    }
    .hax-ui-chip:hover {
      color: var(--hax-ui-text);
      background-color: var(--hax-ui-hover);
    }
    .hax-ui-chip[data-set] {
      border-style: solid;
      border-color: transparent;
      font-weight: var(--ddd-font-weight-medium, 500);
      color: var(--hax-ui-text);
      background-color: var(--hax-ui-accent-soft);
    }
    .hax-ui-switch {
      all: unset;
      box-sizing: border-box;
      cursor: pointer;
      position: relative;
      flex: none;
      width: 36px;
      height: 20px;
      border-radius: var(--hax-ui-radius-pill);
      /* off: text-muted, not line-strong; limestoneGray on white is about
         2.4:1, under the 3:1 non-text minimum (WCAG 1.4.11) */
      background-color: var(--hax-ui-text-muted);
      transition: background-color var(--hax-ui-duration) var(--hax-ui-easing);
    }
    .hax-ui-switch::after {
      content: "";
      position: absolute;
      top: 2px;
      left: 2px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      /* the thumb is the panel color, so it contrasts with the track in
         light and dark, on and off */
      background-color: var(--hax-ui-surface);
      transition: left var(--hax-ui-duration) var(--hax-ui-easing);
    }
    .hax-ui-switch[aria-checked="true"] {
      background-color: var(--hax-ui-accent-strong);
    }
    .hax-ui-switch[aria-checked="true"]::after {
      left: 18px;
    }
    .hax-ui-switch[disabled],
    .hax-ui-switch[aria-disabled="true"] {
      cursor: default;
      opacity: 0.5;
    }
    .hax-ui-input,
    .hax-ui-select,
    .hax-ui-textarea {
      box-sizing: border-box;
      width: 100%;
      height: var(--hax-ui-field-height);
      margin: 0;
      padding: 0 var(--hax-ui-gap-lg);
      border: 1px solid var(--hax-ui-line-strong);
      border-radius: var(--hax-ui-radius);
      font-family: var(--ddd-font-primary, sans-serif);
      font-size: var(--hax-ui-admin-font-size);
      color: var(--hax-ui-text);
      background-color: var(--hax-ui-surface);
      transition: border-color var(--hax-ui-duration) var(--hax-ui-easing);
    }
    .hax-ui-textarea {
      height: auto;
      min-height: calc(3 * var(--hax-ui-field-height));
      padding: var(--hax-ui-gap-md) var(--hax-ui-gap-lg);
      line-height: 1.4;
      resize: vertical;
    }
    .hax-ui-input.compact,
    .hax-ui-select.compact {
      height: var(--hax-ui-row-height);
      padding: 0 var(--hax-ui-gap-md);
      font-size: 13px;
    }
    .hax-ui-input:hover,
    .hax-ui-select:hover,
    .hax-ui-textarea:hover {
      border-color: var(--hax-ui-text-muted);
    }
    .hax-ui-input::placeholder,
    .hax-ui-textarea::placeholder {
      color: var(--hax-ui-text-muted);
      opacity: 1;
    }
    .hax-ui-input[aria-invalid="true"],
    .hax-ui-select[aria-invalid="true"],
    .hax-ui-textarea[aria-invalid="true"] {
      border-color: var(--hax-ui-danger);
    }
    .hax-ui-input[disabled],
    .hax-ui-select[disabled],
    .hax-ui-textarea[disabled] {
      cursor: default;
      color: var(--hax-ui-text-muted);
      background-color: var(--hax-ui-hover);
    }
    .hax-ui-btn:focus-visible,
    .hax-ui-icon-btn:focus-visible,
    .hax-ui-chip:focus-visible,
    .hax-ui-switch:focus-visible,
    .hax-ui-input:focus-visible,
    .hax-ui-select:focus-visible,
    .hax-ui-textarea:focus-visible {
      outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
      outline-offset: 2px;
    }
    .hax-ui-seg button:focus-visible {
      outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
      outline-offset: calc(-1 * var(--hax-ui-focus-width));
    }
    .hax-ui-field-row {
      display: grid;
      grid-template-columns: minmax(0, 240px) minmax(0, 480px);
      gap: var(--hax-ui-gap-lg) var(--ddd-spacing-6, 24px);
      align-items: start;
      padding: var(--hax-ui-gap-lg) 0;
      border-bottom: 1px solid var(--hax-ui-line);
    }
    .hax-ui-field-label label,
    .hax-ui-field-label .name {
      display: inline-flex;
      align-items: center;
      gap: var(--hax-ui-gap);
      font-weight: var(--ddd-font-weight-bold, 700);
    }
    .hax-ui-field-label p {
      margin: 2px 0 0;
      font-size: var(--hax-ui-admin-font-size-xs);
      line-height: 1.4;
      color: var(--hax-ui-text-muted);
    }
    .hax-ui-field-control {
      display: flex;
      flex-direction: column;
      gap: var(--hax-ui-gap);
      min-width: 0;
    }
    .hax-ui-changed-dot {
      flex: none;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: var(--hax-ui-accent-strong);
    }
    .hax-ui-message,
    .hax-ui-callout {
      display: flex;
      align-items: flex-start;
      gap: var(--hax-ui-gap-md);
      padding: var(--hax-ui-gap) var(--hax-ui-gap-md);
      border-radius: var(--hax-ui-radius);
      font-size: var(--hax-ui-admin-font-size-xs);
      line-height: 1.4;
      --simple-icon-width: var(--hax-ui-icon);
      --simple-icon-height: var(--hax-ui-icon);
    }
    .hax-ui-callout {
      padding: var(--hax-ui-gap-md) var(--hax-ui-gap-lg);
      font-size: var(--hax-ui-admin-font-size);
    }
    .hax-ui-message[data-tone="warning"],
    .hax-ui-callout[data-tone="warning"] {
      color: var(--hax-ui-warning);
      background-color: var(--hax-ui-warning-soft);
    }
    .hax-ui-message[data-tone="danger"],
    .hax-ui-callout[data-tone="danger"] {
      color: var(--hax-ui-danger);
      background-color: var(--hax-ui-danger-soft);
    }
    .hax-ui-message[data-tone="info"],
    .hax-ui-callout[data-tone="info"] {
      color: var(--hax-ui-info);
      background-color: var(--hax-ui-info-soft);
    }
    .hax-ui-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--hax-ui-gap-md);
      padding: var(--ddd-spacing-8, 32px) var(--ddd-spacing-4, 16px);
      border: 1px dashed var(--hax-ui-line-strong);
      border-radius: var(--hax-ui-radius-lg);
      text-align: center;
      color: var(--hax-ui-text-muted);
      --simple-icon-width: 24px;
      --simple-icon-height: 24px;
    }
    .hax-ui-empty strong {
      color: var(--hax-ui-text);
    }
    @media (max-width: 600px) {
      .hax-ui-field-row {
        grid-template-columns: minmax(0, 1fr);
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .hax-ui-btn,
      .hax-ui-switch,
      .hax-ui-switch::after,
      .hax-ui-input,
      .hax-ui-select,
      .hax-ui-textarea {
        transition: none;
      }
    }
    @media (forced-colors: active) {
      .hax-ui-btn:focus-visible,
      .hax-ui-icon-btn:focus-visible,
      .hax-ui-chip:focus-visible,
      .hax-ui-switch:focus-visible,
      .hax-ui-input:focus-visible,
      .hax-ui-select:focus-visible,
      .hax-ui-textarea:focus-visible,
      .hax-ui-seg button:focus-visible {
        outline-color: Highlight;
      }
      .hax-ui-switch[aria-checked="true"] {
        background-color: Highlight;
      }
    }
  `,
];

/**
 * simple-fields inside an admin surface, drawn as a HAX UI field: put
 * class="hax-ui-simple-field" on a simple-fields-field, or on a
 * simple-fields container to style every field in it, to get the 40px
 * bordered field, admin text and focus ring, instead of restyling
 * simple-fields in each element. Add .compact for a 32px toolbar field.
 */
export const HaxUiAdminSimpleFields = [
  css`
    simple-fields-field.hax-ui-simple-field,
    simple-fields.hax-ui-simple-field simple-fields-field {
      box-sizing: border-box;
      /* stacked: simple-fields renders the control and its description,
         errors and counter as siblings, which belong below the control */
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: stretch;
      min-height: var(--hax-ui-field-height);
      padding: 0 var(--hax-ui-gap-md);
      border: 1px solid var(--hax-ui-line-strong);
      border-radius: var(--hax-ui-radius);
      background-color: var(--hax-ui-surface);
      --simple-fields-font-family: var(--ddd-font-primary, sans-serif);
      --simple-fields-font-size: var(--hax-ui-admin-font-size);
      --simple-fields-line-height: 1.2;
      --simple-fields-color: var(--hax-ui-text);
      --simple-fields-background-color: transparent;
      --simple-fields-border-color: transparent;
      --simple-fields-border-bottom-size: 0;
      --simple-fields-border-bottom-focus-size: 0;
      --simple-fields-margin: 0;
      --simple-fields-margin-small: 0;
      --simple-fields-input-max-width: 100%;
      --simple-fields-row-focus-outline-width: 0;
      --simple-fields-accent-color: var(--hax-ui-accent-strong);
      --simple-fields-placeholder-color: var(--hax-ui-text-muted);
      --simple-fields-placeholder-opacity: 1;
    }
    simple-fields-field.hax-ui-simple-field.compact,
    simple-fields.hax-ui-simple-field.compact simple-fields-field {
      min-height: var(--hax-ui-row-height);
    }
    simple-fields-field.hax-ui-simple-field:focus-within,
    simple-fields.hax-ui-simple-field simple-fields-field:focus-within {
      outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
      outline-offset: 1px;
    }
  `,
];

/**
 * The admin shell, as the HaxUiAdminShell and HaxUiAdminActionBar cards
 * describe it: the section rail (nested parts, badges, collapse to icons,
 * narrow overlay), page header, body, action bar with status and changed
 * dot, overflow menu for bulk actions, the leave prompt and group titles.
 * Taken from haxcms-site-admin, the reference; system settings shares it.
 *
 * Its class names (.section, .rail*, .main, .ph*, .body, .ftr, .st, .dot,
 * .more-*, .scrim, .leave, .group-title) are the shell's vocabulary, so it
 * is not part of HaxUiAdminStyles: only an element that draws the shell
 * spreads it, after HaxUiAdminStyles. Buttons are .hax-ui-btn.
 */
export const HaxUiAdminShell = [
  css`
    .group-title {
      display: flex;
      align-items: center;
      gap: var(--hax-ui-gap-lg);
      margin: var(--ddd-spacing-6, 24px) 0 var(--hax-ui-gap-md);
      font-size: var(--hax-ui-admin-font-size-xs);
      font-weight: var(--ddd-font-weight-bold, 700);
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: var(--hax-ui-text-muted);
    }
    .group-title::after {
      content: "";
      flex: 1;
      border-top: 1px solid var(--hax-ui-line);
    }

    /* section layout */
    .section {
      display: flex;
      height: 100%;
      min-height: 0;
    }
    .section {
      position: relative;
    }
    .rail {
      width: var(--hax-ui-rail-width);
      flex: none;
      transition: width var(--hax-ui-duration) var(--hax-ui-easing);
      display: flex;
      flex-direction: column;
      gap: 2px;
      padding: var(--hax-ui-gap-md);
      overflow: auto;
      background-color: var(--hax-ui-sunken);
      border-right: 1px solid var(--hax-ui-line);
    }
    .rail ul {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .rail-help {
      margin-top: auto;
      padding-top: var(--hax-ui-gap-md);
      border-top: 1px solid var(--hax-ui-line);
    }
    .rail-label {
      padding: var(--hax-ui-gap-lg) var(--hax-ui-gap-md) var(--hax-ui-gap);
      font-size: 11px;
      font-weight: var(--ddd-font-weight-bold, 700);
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: var(--hax-ui-text-muted);
    }
    .rail-item {
      all: unset;
      box-sizing: border-box;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: var(--hax-ui-gap-md);
      width: 100%;
      height: var(--hax-ui-row-height);
      padding: 0 var(--hax-ui-gap-md);
      border-radius: var(--hax-ui-radius);
      color: var(--hax-ui-text);
    }
    .rail-item:hover {
      background-color: var(--hax-ui-hover);
    }
    .rail-item:focus-visible {
      outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
      outline-offset: calc(-1 * var(--hax-ui-focus-width));
    }
    .rail-row {
      display: flex;
      align-items: center;
      gap: 2px;
    }
    .rail-row .rail-item {
      flex: 1;
      min-width: 0;
    }
    .rail-toggle {
      all: unset;
      box-sizing: border-box;
      cursor: pointer;
      flex: none;
      display: grid;
      place-items: center;
      width: 24px;
      height: var(--hax-ui-row-height);
      border-radius: var(--hax-ui-radius);
      color: var(--hax-ui-text-muted);
    }
    .rail-toggle:hover {
      background-color: var(--hax-ui-hover);
      color: var(--hax-ui-text);
    }
    .rail-toggle:focus-visible {
      outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
      outline-offset: calc(-1 * var(--hax-ui-focus-width));
    }
    .rail-toggle simple-icon-lite {
      transition: transform var(--hax-ui-duration) var(--hax-ui-easing);
    }
    .rail-toggle[aria-expanded="true"] simple-icon-lite {
      transform: rotate(90deg);
    }
    /* parts sit one indent in, under a guide line from the section's
           icon with a tick into each part, like outline-designer's tree */
    .rail-sub {
      margin: 2px 0 var(--hax-ui-gap);
    }
    .rail-sub > li {
      position: relative;
      padding-left: var(--hax-ui-indent);
      margin-left: calc(var(--hax-ui-gap-md) + var(--hax-ui-icon) / 2);
    }
    .rail-sub > li::before,
    .rail-sub > li::after {
      content: "";
      position: absolute;
      left: 0;
      background-color: var(--hax-ui-line-strong);
    }
    .rail-sub > li::before {
      top: 0;
      bottom: 0;
      width: 1px;
    }
    .rail-sub > li:last-child::before {
      bottom: 50%;
    }
    .rail-sub > li::after {
      top: 50%;
      width: calc(var(--hax-ui-indent) - 6px);
      height: 1px;
    }
    .rail-item.sub {
      height: calc(var(--hax-ui-row-height) - 4px);
      padding: 0 var(--hax-ui-gap-md);
      font-size: var(--hax-ui-admin-font-size-xs);
    }
    .rail-item.sub simple-icon-lite {
      --simple-icon-width: 14px;
      --simple-icon-height: 14px;
      opacity: 0.8;
    }
    .rail-item.sub .label {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .rail-item[aria-current="true"] {
      font-weight: var(--ddd-font-weight-bold, 700);
    }
    .rail-item.sub[aria-current="location"] {
      font-weight: var(--ddd-font-weight-bold, 700);
      color: var(--hax-ui-text);
    }
    .rail-badge {
      flex: none;
      min-width: 20px;
      padding: 0 6px;
      border-radius: var(--hax-ui-radius-pill);
      font-size: 11px;
      font-weight: var(--ddd-font-weight-bold, 700);
      line-height: 1.6;
      text-align: center;
      font-variant-numeric: tabular-nums;
      color: var(--hax-ui-text-muted);
      background-color: var(--hax-ui-hover);
    }
    .rail-badge[data-tone="danger"] {
      color: var(--hax-ui-danger);
      background-color: var(--hax-ui-danger-soft);
    }
    .rail-badge[data-tone="warning"] {
      color: var(--hax-ui-warning);
      background-color: var(--hax-ui-warning-soft);
    }
    .rail-item[aria-current="page"] {
      font-weight: var(--ddd-font-weight-bold, 700);
      background-color: var(--hax-ui-selected);
      box-shadow: inset 3px 0 0 var(--hax-ui-accent-strong);
    }
    .rail-collapse {
      margin-bottom: var(--hax-ui-gap);
      color: var(--hax-ui-text-muted);
    }
    .rail-collapse:hover {
      color: var(--hax-ui-text);
    }
    .rail-collapse .label {
      font-size: var(--hax-ui-admin-font-size-xs);
    }

    /* collapsed: icons only, each named in a tooltip */
    .rail-collapsed .rail {
      width: var(--hax-ui-rail-width-collapsed);
      padding: var(--hax-ui-gap-md) var(--hax-ui-gap);
      overflow-x: hidden;
    }
    .rail-collapsed .rail-item,
    .rail-collapsed .rail-item.sub {
      position: relative;
      justify-content: center;
      padding: 0;
    }
    .rail-collapsed .rail-item .label,
    .rail-collapsed .rail-label .label {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip: rect(0 0 0 0);
      white-space: nowrap;
    }
    .rail-collapsed .rail-label {
      margin: var(--hax-ui-gap-md) var(--hax-ui-gap);
      padding: 0;
      border-top: 1px solid var(--hax-ui-line-strong);
    }
    /* the open section's parts sit in one sunken group under it */
    .rail-collapsed .rail-sub {
      margin: 2px 0 var(--hax-ui-gap);
      padding: 2px 0;
      border: 1px solid var(--hax-ui-line-strong);
      border-radius: var(--hax-ui-radius);
      background-color: var(--hax-ui-surface);
    }
    .rail-collapsed .rail-sub > li {
      padding-left: 0;
      margin-left: 0;
    }
    .rail-collapsed .rail-sub > li::before,
    .rail-collapsed .rail-sub > li::after {
      display: none;
    }
    .rail-collapsed .rail-item.sub simple-icon-lite {
      --simple-icon-width: 16px;
      --simple-icon-height: 16px;
    }
    .rail-collapsed .rail-item.sub[aria-current="page"],
    .rail-collapsed .rail-item.sub[aria-current="location"] {
      background-color: var(--hax-ui-selected);
      box-shadow: inset 3px 0 0 var(--hax-ui-accent-strong);
    }
    /* a badge becomes a dot on the icon; its number stays for readers */
    .rail-collapsed .rail-badge {
      position: absolute;
      top: 3px;
      right: 6px;
      min-width: 0;
      width: 8px;
      height: 8px;
      padding: 0;
      overflow: hidden;
      font-size: 0;
      line-height: 0;
      background-color: var(--hax-ui-text-muted);
    }
    .rail-collapsed .rail-badge[data-tone="danger"] {
      background-color: var(--hax-ui-danger);
    }
    .rail-collapsed .rail-badge[data-tone="warning"] {
      background-color: var(--hax-ui-warning);
    }
    .rail-tip {
      position: absolute;
      z-index: 4;
      transform: translateY(-50%);
      padding: var(--hax-ui-gap) var(--hax-ui-gap-md);
      border-radius: var(--hax-ui-radius);
      font-size: var(--hax-ui-admin-font-size-xs);
      font-weight: var(--ddd-font-weight-medium, 500);
      white-space: nowrap;
      pointer-events: none;
      color: var(--hax-ui-on-primary);
      background-color: var(--hax-ui-primary);
      box-shadow: var(--hax-ui-shadow-popover);
    }

    /* narrow screens: icons hold their place, the open rail lays over
           the section until a pick, Esc or a click outside closes it */
    .narrow .rail {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      z-index: 3;
    }
    .narrow .main {
      margin-left: var(--hax-ui-rail-width-collapsed);
    }
    .rail-overlay .rail {
      width: min(260px, 85%);
      box-shadow: var(--hax-ui-shadow-popover);
      /* the sunken tint is see-through in dark; lay it on the surface */
      background-color: var(--hax-ui-surface);
      background-image: linear-gradient(
        var(--hax-ui-sunken),
        var(--hax-ui-sunken)
      );
    }
    .rail-scrim {
      position: absolute;
      inset: 0;
      z-index: 3;
      background-color: rgba(0, 3, 33, 0.32);
    }

    .main {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      /* keep a section's own stacking (sticky toolbars) under the rail,
             its tooltip and the open menu */
      isolation: isolate;
    }
    .ph {
      display: flex;
      align-items: flex-start;
      gap: var(--hax-ui-gap-lg);
      padding: var(--ddd-spacing-4, 16px) var(--ddd-spacing-5, 20px)
        var(--hax-ui-gap-lg);
      border-bottom: 1px solid var(--hax-ui-line);
    }
    .ph-text {
      flex: 1;
      min-width: 0;
    }
    .ph-actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--hax-ui-gap-md);
    }
    .ph h2 {
      margin: 0;
      font-size: 22px;
      font-weight: var(--ddd-font-weight-bold, 700);
      line-height: 1.2;
    }
    .ph p {
      margin: var(--hax-ui-gap) 0 0;
      color: var(--hax-ui-text-muted);
    }
    .body {
      flex: 1;
      min-height: 0;
      overflow: auto;
    }
    /* a section that scrolls inside itself (Structure) fills the body */
    .body.fill {
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .body.fill ::slotted(*) {
      flex: 1 1 auto;
      min-height: 0;
    }

    /* action bar */
    .ftr {
      flex: none;
      display: flex;
      align-items: center;
      gap: var(--hax-ui-gap-lg);
      min-height: 56px;
      padding: var(--hax-ui-gap-md) var(--ddd-spacing-5, 20px);
      border-top: 1px solid var(--hax-ui-line);
    }
    .st {
      flex: 1;
      min-width: 0;
      display: flex;
      align-items: center;
      gap: var(--hax-ui-gap-md);
      font-size: 13px;
    }
    .st .muted,
    .st.muted {
      color: var(--hax-ui-text-muted);
    }
    .st .list {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: var(--hax-ui-text-muted);
    }
    .st.error {
      color: var(--hax-ui-danger);
    }
    .st.saved {
      color: var(--hax-ui-text);
    }
    .st.saved simple-icon-lite {
      color: var(--hax-ui-success);
    }
    .dot {
      width: 8px;
      height: 8px;
      flex: none;
      border-radius: 50%;
      background-color: var(--hax-ui-accent-strong);
    }

    /* bulk actions that do not fit a narrow bar */
    .more-wrap {
      position: relative;
    }
    .more-btn simple-icon-lite {
      transform: rotate(-90deg);
    }
    .more-btn[aria-expanded="true"] simple-icon-lite {
      transform: rotate(90deg);
    }
    .more-menu {
      position: absolute;
      right: 0;
      bottom: calc(100% + 6px);
      z-index: 4;
      display: flex;
      flex-direction: column;
      gap: var(--hax-ui-gap);
      min-width: 200px;
      padding: var(--hax-ui-gap-md);
      border: 1px solid var(--hax-ui-line-strong);
      border-radius: var(--hax-ui-radius-lg);
      background-color: var(--hax-ui-surface);
      box-shadow: var(--hax-ui-shadow-popover);
    }
    .more-menu .hax-ui-btn {
      justify-content: flex-start;
      width: 100%;
    }

    /* narrow: a compact page header and bars that stay one row */
    .narrow .ph {
      flex-wrap: wrap;
      padding: var(--hax-ui-gap-md) var(--hax-ui-gap-lg);
      gap: var(--hax-ui-gap-md);
    }
    /* header actions (Views) drop below the title instead of crushing it */
    .narrow .ph-text {
      flex: 1 1 100%;
    }
    .narrow .ph h2 {
      font-size: 18px;
    }
    .narrow .ph p {
      font-size: var(--hax-ui-admin-font-size-xs);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .narrow .ftr {
      gap: var(--hax-ui-gap-md);
      padding: var(--hax-ui-gap-md) var(--hax-ui-gap-lg);
      min-height: 52px;
    }
    .narrow .st {
      font-size: var(--hax-ui-admin-font-size-xs);
    }
    .narrow .st {
      flex: 1 0 auto;
    }
    .narrow .st b {
      white-space: nowrap;
    }
    .narrow .ftr .hax-ui-btn {
      padding: 0 var(--hax-ui-gap-md);
    }

    /* leave prompt */
    .scrim {
      position: absolute;
      inset: 0;
      z-index: 5;
      display: grid;
      place-items: center;
      padding: var(--ddd-spacing-4, 16px);
      background-color: rgba(0, 3, 33, 0.32);
    }
    .leave {
      width: min(460px, 100%);
      padding: var(--ddd-spacing-4, 16px);
      border: 1px solid var(--hax-ui-line-strong);
      border-radius: var(--hax-ui-radius-lg);
      background-color: var(--hax-ui-surface);
      box-shadow: var(--hax-ui-shadow-popover);
    }
    .leave h3 {
      margin: 0;
      font-size: 15px;
      font-weight: var(--ddd-font-weight-bold, 700);
    }
    .leave p {
      margin: var(--hax-ui-gap) 0 var(--hax-ui-gap-lg);
      font-size: 13px;
      color: var(--hax-ui-text-muted);
    }
    .leave .acts {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      gap: var(--hax-ui-gap-md);
    }
    @media (max-width: 768px) {
      .ftr {
        flex-wrap: wrap;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .rail {
        transition: none;
      }
    }
  `,
];

/**
 * Follow the editor's HAX UI theme switch (--hax-ui-color-scheme, set on
 * body by hax-ui-styles) so light-dark() in an admin element agrees with
 * the --hax-ui-* colors; without it the element inherits as before.
 */
export const HaxUiAdminScheme = [
  css`
    :host {
      color-scheme: var(--hax-ui-color-scheme, inherit);
    }
  `,
];

/**
 * Everything an admin surface needs, in order: tokens, scheme, primitives,
 * controls and the simple-fields field style.
 */
export const HaxUiAdminStyles = [
  ...HaxUiAdminTokens,
  ...HaxUiAdminScheme,
  ...HaxUiAdminPrimitives,
  ...HaxUiAdminControls,
  ...HaxUiAdminSimpleFields,
];
