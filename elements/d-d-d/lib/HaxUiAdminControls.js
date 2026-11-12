/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 *
 * HAX UI admin layer: shared controls (buttons, segmented controls, chips,
 * switches, inputs, field rows) and the simple-fields field style.
 * Part of @haxtheweb/d-d-d/lib/HaxUiAdminStyles.js, which re-exports it
 * with the rest of the layer. Import this file directly when an element
 * needs only this piece, so a page does not download the whole layer.
 */
import { css } from "lit";

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
 * - .hax-ui-input, .hax-ui-select: 40px field controls;
 *   add .compact for a 32px toolbar control (search, filters)
 * - .hax-ui-field-row with .hax-ui-field-label (label + p help) and
 *   .hax-ui-field-control
 * - .hax-ui-message[data-tone="warning|danger|info"] under a control
 * - .hax-ui-callout[data-tone="warning|info"]
 * - .hax-ui-message with no tone: a muted note box (status, hints);
 *   .hax-ui-note: the same note as plain muted text
 * - .hax-ui-empty: empty state
 * - .hax-ui-tool-field: a labelled toolbar field, a bordered row holding
 *   a short muted label and a bare select or input; .grow to fill
 * - .hax-ui-seg.fill: a segmented control whose buttons share the width
 *   equally; .hax-ui-seg.wrap lets a long one wrap
 * - .hax-ui-chip[aria-pressed]: a toggle chip (solid; pressed is the
 *   accent), with an optional .n count
 * - .hax-ui-tokens / .hax-ui-token: removable tokens in a field, each
 *   with a remove button, and a bare input to add more
 * - .hax-ui-input-group: an input joined to its unit (.unit); .warning
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
    /* danger buttons carry the hatch as well as the color, so Delete
       never reads as a second Save in greyscale or with red/green color
       vision (primary and danger-fill are under 3:1 apart by luminance) */
    .hax-ui-btn.danger {
      color: var(--hax-ui-danger);
      border-color: var(--hax-ui-danger);
      background-image: var(--hax-ui-danger-hatch);
    }
    .hax-ui-btn.danger:hover {
      background-color: var(--hax-ui-danger-soft);
    }
    .hax-ui-btn.danger-fill {
      font-weight: var(--ddd-font-weight-bold, 700);
      color: var(--hax-ui-on-accent);
      background-color: var(--hax-ui-danger);
      background-image: var(--hax-ui-danger-hatch-on-fill);
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
      background-image: none;
      border-color: var(--hax-ui-line-strong);
    }
    .hax-ui-btn.hax-ui-btn.ghost:is([disabled], [aria-disabled="true"]),
    .hax-ui-btn.hax-ui-btn.ghost:is([disabled], [aria-disabled="true"]):hover {
      border-color: transparent;
      background-color: transparent;
      opacity: 0.6;
    }
    /* an action that is coming: dashed and muted, with its Soon pill */
    .hax-ui-btn.hax-ui-btn.soon,
    .hax-ui-btn.hax-ui-btn.soon:is([disabled], [aria-disabled="true"]) {
      border-style: dashed;
      opacity: 1;
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
    /* pressed also gets an underline bar: bold type and a 12% wash alone
       are close to invisible in greyscale */
    .hax-ui-seg button[aria-pressed="true"] {
      font-weight: var(--ddd-font-weight-bold, 700);
      background-color: var(--hax-ui-accent-soft);
      box-shadow: inset 0 -3px 0 var(--hax-ui-accent-strong);
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
    .hax-ui-select {
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
    .hax-ui-input.compact,
    .hax-ui-select.compact {
      height: var(--hax-ui-row-height);
      padding: 0 var(--hax-ui-gap-md);
      font-size: 13px;
    }
    .hax-ui-input:hover,
    .hax-ui-select:hover {
      border-color: var(--hax-ui-text-muted);
    }
    .hax-ui-input::placeholder {
      color: var(--hax-ui-text-muted);
      opacity: 1;
    }
    .hax-ui-input[aria-invalid="true"],
    .hax-ui-select[aria-invalid="true"] {
      border-color: var(--hax-ui-danger);
    }
    .hax-ui-input[disabled],
    .hax-ui-select[disabled] {
      cursor: default;
      color: var(--hax-ui-text-muted);
      background-color: var(--hax-ui-hover);
    }
    .hax-ui-btn:focus-visible,
    .hax-ui-icon-btn:focus-visible,
    .hax-ui-chip:focus-visible,
    .hax-ui-switch:focus-visible,
    .hax-ui-input:focus-visible,
    .hax-ui-select:focus-visible {
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
    /* a muted note: .hax-ui-message with no tone is a quiet box; .hax-ui-note
       is the same words without the box */
    .hax-ui-message:not([data-tone]) {
      color: var(--hax-ui-text-muted);
      background-color: var(--hax-ui-hover);
    }
    .hax-ui-note {
      margin: 0;
      font-size: var(--hax-ui-admin-font-size-xs);
      line-height: 1.4;
      color: var(--hax-ui-text-muted);
    }
    /* a labelled toolbar field: one bordered row, the label muted beside a
       bare select or input */
    .hax-ui-tool-field {
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      flex: none;
      gap: var(--hax-ui-gap-md);
      height: var(--hax-ui-row-height);
      min-width: 0;
      padding: 0 var(--hax-ui-gap-md);
      border: 1px solid var(--hax-ui-line-strong);
      border-radius: var(--hax-ui-radius);
      font-family: var(--hax-ui-admin-font-family);
      font-size: var(--hax-ui-admin-font-size-xs);
      white-space: nowrap;
      color: var(--hax-ui-text-muted);
      background-color: var(--hax-ui-surface);
    }
    .hax-ui-tool-field:hover {
      border-color: var(--hax-ui-text-muted);
    }
    .hax-ui-tool-field:focus-within {
      outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
      outline-offset: 1px;
    }
    .hax-ui-tool-field input,
    .hax-ui-tool-field select {
      all: unset;
      min-width: 0;
      font-family: var(--hax-ui-admin-font-family);
      font-size: var(--hax-ui-admin-font-size);
      color: var(--hax-ui-text);
    }
    /* the open list is drawn by the browser: give it and its options the
       HAX UI text and surface pair, so it reads in light and dark (an
       unset option takes the dark-scheme text color over a light list) */
    .hax-ui-tool-field select {
      cursor: pointer;
      background-color: var(--hax-ui-surface);
    }
    .hax-ui-tool-field select option {
      color: var(--hax-ui-text);
      background-color: var(--hax-ui-surface);
    }
    .hax-ui-tool-field input::placeholder {
      color: var(--hax-ui-text-muted);
      opacity: 1;
    }
    .hax-ui-tool-field.grow {
      flex: 1 1 240px;
    }
    .hax-ui-tool-field.grow input {
      flex: 1;
      width: 100%;
    }
    /* segmented control variants */
    .hax-ui-seg.fill {
      display: flex;
      width: 100%;
    }
    .hax-ui-seg.fill button {
      flex: 1 1 0;
      min-width: 0;
      justify-content: center;
      white-space: nowrap;
    }
    .hax-ui-seg.wrap {
      flex-wrap: wrap;
      max-width: 100%;
    }
    .hax-ui-seg.wrap button {
      flex: 1 1 auto;
      justify-content: center;
    }
    .hax-ui-seg button[disabled] {
      opacity: 0.55;
    }
    /* a toggle chip: solid, the accent when pressed */
    .hax-ui-chip[aria-pressed] {
      border-style: solid;
      color: var(--hax-ui-text);
      background-color: var(--hax-ui-surface);
    }
    .hax-ui-chip[aria-pressed]:hover {
      background-color: var(--hax-ui-hover);
    }
    .hax-ui-chip[aria-pressed="true"] {
      font-weight: var(--ddd-font-weight-bold, 700);
      border-color: var(--hax-ui-accent-strong);
      background-color: var(--hax-ui-accent-soft);
    }
    .hax-ui-chip .n {
      font-variant-numeric: tabular-nums;
      font-weight: var(--ddd-font-weight-regular, 400);
      color: var(--hax-ui-text-muted);
    }
    .hax-ui-chip:focus-visible,
    .hax-ui-seg button:focus-visible {
      outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
      outline-offset: 2px;
    }
    /* removable tokens in a field (formats, tags): each token has a remove
       button; a bare input after them adds more */
    .hax-ui-tokens {
      box-sizing: border-box;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 6px;
      width: 100%;
      min-height: var(--hax-ui-field-height);
      padding: 3px 6px;
      border: 1px solid var(--hax-ui-line-strong);
      border-radius: var(--hax-ui-radius);
      background-color: var(--hax-ui-surface);
    }
    .hax-ui-tokens:focus-within {
      outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
      outline-offset: 2px;
    }
    .hax-ui-token {
      display: inline-flex;
      align-items: center;
      gap: 2px;
      height: 24px;
      padding: 0 2px 0 8px;
      border-radius: var(--hax-ui-radius-pill);
      font-family: var(--ddd-font-mono, monospace);
      font-size: var(--hax-ui-admin-font-size-xs);
      color: var(--hax-ui-text);
      background-color: var(--hax-ui-hover);
    }
    .hax-ui-token button {
      all: unset;
      cursor: pointer;
      width: 20px;
      height: 20px;
      display: grid;
      place-items: center;
      border-radius: 50%;
      color: var(--hax-ui-text-muted);
      --simple-icon-width: 12px;
      --simple-icon-height: 12px;
    }
    .hax-ui-token button:hover {
      color: var(--hax-ui-text);
      background-color: var(--hax-ui-line);
    }
    .hax-ui-token button:focus-visible {
      outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
    }
    .hax-ui-tokens input {
      flex: 1;
      min-width: 120px;
      height: 24px;
      border: 0;
      font-family: var(--hax-ui-admin-font-family);
      font-size: 13px;
      color: var(--hax-ui-text);
      background: transparent;
    }
    .hax-ui-tokens input:focus-visible {
      outline: none;
    }
    /* an input joined to its unit (84px number, then "%", "MB") */
    .hax-ui-input-group {
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      height: var(--hax-ui-field-height);
      border: 1px solid var(--hax-ui-line-strong);
      border-radius: var(--hax-ui-radius);
      overflow: hidden;
      background-color: var(--hax-ui-surface);
    }
    .hax-ui-input-group:focus-within {
      outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
      outline-offset: 2px;
    }
    .hax-ui-input-group.warning {
      border-color: var(--hax-ui-warning);
    }
    .hax-ui-input-group input {
      width: 84px;
      height: 100%;
      border: 0;
      padding: 0 8px;
      font-family: var(--hax-ui-admin-font-family);
      font-size: var(--hax-ui-admin-font-size);
      font-variant-numeric: tabular-nums;
      color: var(--hax-ui-text);
      background: transparent;
    }
    .hax-ui-input-group input:focus-visible {
      outline: none;
    }
    .hax-ui-input-group .unit {
      height: 100%;
      display: grid;
      place-items: center;
      padding: 0 8px;
      font-size: var(--hax-ui-admin-font-size-xs);
      color: var(--hax-ui-text-muted);
      background-color: var(--hax-ui-sunken);
      border-left: 1px solid var(--hax-ui-line);
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
      .hax-ui-select {
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
      /* a select's open list: the HAX UI text and surface pair */
      --simple-fields-select-option-background-color: var(--hax-ui-surface);
      --simple-fields-select-option-selected-background-color: var(
        --hax-ui-selected
      );
    }
    simple-fields-field.hax-ui-simple-field.compact,
    simple-fields.hax-ui-simple-field.compact simple-fields-field {
      min-height: var(--hax-ui-row-height);
    }
    /* the field above sets --simple-fields-border-color transparent, which
       the icon picker also reads for its trigger; keep the trigger bordered */
    simple-fields-field.hax-ui-simple-field simple-icon-select,
    simple-fields.hax-ui-simple-field simple-icon-select {
      --simple-icon-select-border-color: var(--hax-ui-line-strong);
    }
    simple-fields-field.hax-ui-simple-field:focus-within,
    simple-fields.hax-ui-simple-field simple-fields-field:focus-within {
      outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
      outline-offset: 1px;
    }
  `,
];

/**
 * A settings form in a narrow side panel (the editor tray's Configure
 * form): put class="hax-ui-side-panel" on the simple-fields form. Each
 * setting is one 46px row: the label with its (i) button right after it,
 * then the control in a column that lines up across rows. Text fields,
 * selects (drawn with the admin chevron) and the icon and color pickers
 * are one 32px control; booleans are 40px rows with a switch at the end
 * (still a checkbox to assistive tech); media and list fields keep their
 * buttons at 32px. Set infoIcon (info-icon) on the fields to use the admin
 * info icon. The admin field row (240px label column, 40px inputs) does
 * not fit a 300px panel, so this is its compact form. Opt-in: not part of
 * HaxUiAdminStyles.
 */
export const HaxUiAdminSidePanelFields = [
  css`
    simple-fields.hax-ui-side-panel {
      --hax-ui-field-label-width-compact: var(--ddd-spacing-28, 112px);
      /* the admin chevron (hax:admin-chevron), drawn as a mask so it takes
         the token color */
      --hax-ui-side-panel-chevron: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z'/%3E%3C/svg%3E");
      /* hax:admin-upload, for the phone Upload button */
      --hax-ui-side-panel-upload: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z'/%3E%3C/svg%3E");
      /* hax:admin-search, for the icon list's search row */
      --hax-ui-side-panel-search: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z'/%3E%3C/svg%3E");
      --simple-fields-font-family: var(--ddd-font-primary, sans-serif);
      --simple-fields-font-size: var(--hax-ui-admin-font-size);
      --simple-fields-detail-font-family: var(--ddd-font-primary, sans-serif);
      --simple-fields-detail-font-size: var(--hax-ui-admin-font-size-xs);
      --simple-fields-color: var(--hax-ui-text);
      --simple-fields-meta-color: var(--hax-ui-text-muted);
      --simple-fields-accent-color: var(--hax-ui-text);
      --simple-fields-border-radius: var(--hax-ui-radius);
      --simple-fields-border-color: var(--hax-ui-line-strong);
      --simple-fields-background-color: var(--hax-ui-surface);
      --simple-fields-input-background-color: var(--hax-ui-surface);
      /* each control draws its own border (below) */
      --simple-fields-input-border: none;
      --simple-fields-input-max-width: 100%;
      --simple-fields-select-max-width: 100%;
      --simple-fields-number-max-width: 100%;
      /* focus is drawn on the control, not around the whole row */
      --simple-fields-row-focus-outline-width: 0;
      --simple-fields-row-hover-background-color: transparent;
      --simple-fields-placeholder-color: var(--hax-ui-text-muted);
      --simple-fields-placeholder-opacity: 1;
      --simple-fields-placeholder-font-style: normal;
      --simple-fields-select-option-selected-background-color: var(
        --hax-ui-selected
      );
      font-family: var(--ddd-font-primary, sans-serif);
      font-size: var(--hax-ui-admin-font-size);
      color: var(--hax-ui-text);
    }
    /* rows: label column, then the control; 46px with the divider */
    simple-fields.hax-ui-side-panel simple-fields-field,
    simple-fields.hax-ui-side-panel simple-fields-container,
    simple-fields.hax-ui-side-panel hax-upload-field,
    simple-fields.hax-ui-side-panel simple-fields-array {
      box-sizing: border-box;
      margin: 0;
      padding: calc((var(--hax-ui-gap-lg) + 1px) / 2) var(--hax-ui-gap-lg);
      border-bottom: 1px solid var(--hax-ui-line);
    }
    simple-fields.hax-ui-side-panel simple-fields-field::part(field-main),
    simple-fields.hax-ui-side-panel simple-fields-container::part(field-main) {
      justify-content: space-between;
      gap: var(--hax-ui-gap-md);
      align-items: center;
      min-height: var(--hax-ui-row-height);
    }
    simple-fields.hax-ui-side-panel simple-fields-field::part(label),
    simple-fields.hax-ui-side-panel simple-fields-container::part(label) {
      flex: 0 1 auto;
      max-width: var(--hax-ui-field-label-width-compact);
      min-width: 0;
      white-space: nowrap;
      gap: var(--hax-ui-gap);
      font-size: var(--hax-ui-admin-font-size);
      font-weight: 700;
      line-height: 1.2;
      color: var(--hax-ui-text);
    }
    simple-fields.hax-ui-side-panel simple-fields-field::part(field-main-inner),
    simple-fields.hax-ui-side-panel simple-fields-container::part(field-inner) {
      position: relative;
      flex: 0 0
        calc(
          100% - var(--hax-ui-field-label-width-compact) - var(--hax-ui-gap-md)
        );
      min-width: 0;
    }
    /* the (i) button sits right after the label: a 24px target, 14px icon */
    simple-fields.hax-ui-side-panel simple-fields-field::part(info-toggle),
    simple-fields.hax-ui-side-panel simple-fields-container::part(info-toggle),
    simple-fields.hax-ui-side-panel hax-upload-field::part(info-toggle) {
      flex: 0 0 auto;
      width: var(--hax-ui-target);
      height: var(--hax-ui-target);
      margin: 0;
      color: var(--hax-ui-text-muted);
      --simple-icon-width: calc(var(--hax-ui-icon) - 2px);
      --simple-icon-height: calc(var(--hax-ui-icon) - 2px);
    }
    /* one control: 32px, one border, one radius, one focus ring */
    simple-fields.hax-ui-side-panel
      simple-fields-field:not([type="checkbox"]):not([type="radio"])::part(
        option-input
      ),
    simple-fields.hax-ui-side-panel simple-fields-field::part(select) {
      box-sizing: border-box;
      width: 100%;
      height: var(--hax-ui-row-height);
      padding: 0 var(--hax-ui-gap-md);
      border: 1px solid var(--hax-ui-line-strong);
      border-radius: var(--hax-ui-radius);
      background-color: var(--hax-ui-surface);
      color: var(--hax-ui-text);
      font-size: var(--hax-ui-admin-font-size);
    }
    simple-fields.hax-ui-side-panel
      simple-fields-field:not([type="checkbox"]):not([type="radio"])::part(
        option-input
      ):focus-visible,
    simple-fields.hax-ui-side-panel
      simple-fields-field::part(select):focus-visible {
      border-color: var(--hax-ui-accent-strong);
      outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
      outline-offset: 1px;
    }
    simple-fields.hax-ui-side-panel
      simple-fields-field[type="number"]::part(option-input) {
      text-align: end;
      font-variant-numeric: tabular-nums;
    }
    /* selects draw the admin chevron instead of the native arrow */
    simple-fields.hax-ui-side-panel simple-fields-field::part(select) {
      appearance: none;
      padding-inline-end: calc(var(--hax-ui-gap-md) * 2 + var(--hax-ui-icon));
    }
    simple-fields.hax-ui-side-panel simple-fields-field::part(select-icon) {
      display: none;
    }
    simple-fields.hax-ui-side-panel
      simple-fields-field[type="select"]::part(field-main-inner)::after {
      content: "";
      position: absolute;
      inset-inline-end: var(--hax-ui-gap-md);
      top: calc(50% - var(--hax-ui-icon) / 2);
      width: var(--hax-ui-icon);
      height: var(--hax-ui-icon);
      background-color: var(--hax-ui-text-muted);
      mask: var(--hax-ui-side-panel-chevron) center / contain no-repeat;
      transform: rotate(90deg);
      pointer-events: none;
    }
    simple-fields.hax-ui-side-panel simple-fields-field::part(textarea) {
      box-sizing: border-box;
      width: 100%;
      padding: var(--hax-ui-gap-md);
      border: 1px solid var(--hax-ui-line-strong);
      border-radius: var(--hax-ui-radius);
      background-color: var(--hax-ui-surface);
      color: var(--hax-ui-text);
    }
    simple-fields.hax-ui-side-panel
      simple-fields-field[disabled]:not([type="checkbox"]):not(
        [type="radio"]
      )::part(option-input),
    simple-fields.hax-ui-side-panel
      simple-fields-field[readonly]:not([type="checkbox"]):not(
        [type="radio"]
      )::part(option-input) {
      background-color: var(--hax-ui-sunken);
      color: var(--hax-ui-text-muted);
      border-color: var(--hax-ui-line);
    }
    /* booleans are switches: the label takes the row, the switch sits at
       the end. The input stays a checkbox for assistive tech. */
    simple-fields.hax-ui-side-panel simple-fields-field[type="checkbox"] {
      padding-block: calc(
        (var(--ddd-spacing-10, 40px) - 1px - var(--hax-ui-target)) / 2
      );
    }
    simple-fields.hax-ui-side-panel
      simple-fields-field[type="checkbox"]::part(field-main) {
      min-height: 0;
    }
    simple-fields.hax-ui-side-panel
      simple-fields-field[type="checkbox"]::part(label) {
      flex: 1 1 auto;
      max-width: none;
    }
    simple-fields.hax-ui-side-panel
      simple-fields-field[type="checkbox"]::part(field-main-inner) {
      flex: 0 0 auto;
    }
    simple-fields.hax-ui-side-panel
      simple-fields-field[type="checkbox"]::part(option-icon) {
      display: none;
    }
    simple-fields.hax-ui-side-panel
      simple-fields-field[type="checkbox"]::part(option-inner) {
      display: flex;
    }
    simple-fields.hax-ui-side-panel
      simple-fields-field[type="checkbox"]::part(option-input) {
      appearance: none;
      position: relative;
      z-index: auto;
      flex: 0 0 auto;
      box-sizing: border-box;
      width: var(--hax-ui-row-height);
      min-width: var(--hax-ui-row-height);
      height: calc(var(--hax-ui-icon) + 2px);
      margin: 0;
      padding: 0;
      border: 0;
      border-radius: var(--hax-ui-radius-pill);
      background-color: var(--hax-ui-line-strong);
      opacity: 1;
      cursor: pointer;
      transition: background-color var(--hax-ui-duration) var(--hax-ui-easing);
    }
    simple-fields.hax-ui-side-panel
      simple-fields-field[type="checkbox"]::part(option-input)::before {
      content: "";
      position: absolute;
      top: 2px;
      left: 2px;
      width: calc(var(--hax-ui-icon) - 2px);
      height: calc(var(--hax-ui-icon) - 2px);
      border-radius: var(--hax-ui-radius-pill);
      background-color: var(--hax-ui-surface);
      transition: left var(--hax-ui-duration) var(--hax-ui-easing);
    }
    simple-fields.hax-ui-side-panel
      simple-fields-field[type="checkbox"]::part(option-input):checked {
      background-color: var(--hax-ui-accent-strong);
    }
    simple-fields.hax-ui-side-panel
      simple-fields-field[type="checkbox"]::part(option-input):checked::before {
      left: calc(var(--hax-ui-row-height) - var(--hax-ui-icon));
    }
    simple-fields.hax-ui-side-panel
      simple-fields-field[type="checkbox"]::part(option-input):focus-visible {
      outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
      outline-offset: 2px;
    }
    /* pickers are one trigger: tile, value, chevron */
    simple-fields.hax-ui-side-panel simple-fields-container > [slot="field"] {
      flex: 1 1 auto;
      width: 100%;
      min-width: 0;
    }
    simple-fields.hax-ui-side-panel simple-icon-select {
      --simple-icon-select-row-size: var(--hax-ui-row-height);
      --simple-icon-select-border-color: var(--hax-ui-line-strong);
      --simple-icon-select-background-color: var(--hax-ui-surface);
      --simple-icon-select-accent-color: var(--hax-ui-accent-strong);
      --simple-icon-select-active-background-color: var(--hax-ui-selected);
    }
    simple-fields.hax-ui-side-panel simple-icon-select::part(trigger) {
      height: var(--hax-ui-row-height);
      padding: 0 var(--hax-ui-gap-md);
      gap: var(--hax-ui-gap-md);
      color: var(--hax-ui-text);
    }
    simple-fields.hax-ui-side-panel
      simple-icon-select[expanded]::part(trigger) {
      border-color: var(--hax-ui-accent-strong);
      outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
      outline-offset: 1px;
    }
    simple-fields.hax-ui-side-panel simple-icon-select::part(tile) {
      box-sizing: border-box;
      width: calc(var(--hax-ui-icon) + 4px);
      height: calc(var(--hax-ui-icon) + 4px);
      border-radius: var(--hax-ui-radius);
      --simple-icon-width: var(--hax-ui-icon);
      --simple-icon-height: var(--hax-ui-icon);
    }
    simple-fields.hax-ui-side-panel simple-icon-select:not([value])::part(tile),
    simple-fields.hax-ui-side-panel simple-icon-select[value=""]::part(tile) {
      border: 1px dashed var(--hax-ui-line-strong);
    }
    simple-fields.hax-ui-side-panel simple-icon-select::part(name) {
      font-style: normal;
      opacity: 1;
    }
    simple-fields.hax-ui-side-panel simple-icon-select::part(chevron) {
      color: var(--hax-ui-text-muted);
      --simple-icon-width: var(--hax-ui-icon);
      --simple-icon-height: var(--hax-ui-icon);
    }
    /* the icon list: a search row, 40px options, a count under a line */
    simple-fields.hax-ui-side-panel simple-icon-select::part(panel) {
      padding: 0;
      border-color: var(--hax-ui-line-strong);
      border-radius: var(--hax-ui-radius-lg);
      overflow: hidden;
    }
    simple-fields.hax-ui-side-panel simple-icon-select::part(panel)::before {
      content: "";
      position: absolute;
      top: calc((var(--ddd-spacing-10, 40px) - var(--hax-ui-icon)) / 2);
      inset-inline-start: var(--hax-ui-gap-lg);
      width: var(--hax-ui-icon);
      height: var(--hax-ui-icon);
      background-color: var(--hax-ui-text-muted);
      mask: var(--hax-ui-side-panel-search) center / contain no-repeat;
      pointer-events: none;
    }
    simple-fields.hax-ui-side-panel simple-icon-select::part(search) {
      height: var(--ddd-spacing-10, 40px);
      min-height: 0;
      padding: 0 var(--hax-ui-gap-lg) 0
        calc(var(--hax-ui-gap-lg) + var(--hax-ui-icon) + var(--hax-ui-gap-md));
      border: 0;
      border-bottom: 1px solid var(--hax-ui-line);
      border-radius: 0;
      background-color: transparent;
      outline: none;
    }
    simple-fields.hax-ui-side-panel simple-icon-select::part(listbox) {
      margin: 0;
      padding: var(--hax-ui-gap);
    }
    simple-fields.hax-ui-side-panel simple-icon-select::part(option) {
      min-height: var(--ddd-spacing-10, 40px);
      padding: 0 var(--hax-ui-gap-md);
      border-radius: var(--hax-ui-radius);
    }
    simple-fields.hax-ui-side-panel simple-icon-select::part(status) {
      display: flex;
      align-items: center;
      height: var(--hax-ui-row-height);
      padding: 0 var(--hax-ui-gap-lg);
      border-top: 1px solid var(--hax-ui-line);
      color: var(--hax-ui-text-muted);
      font-size: var(--hax-ui-admin-font-size-xs);
      font-variant-numeric: tabular-nums;
      opacity: 1;
    }
    simple-fields.hax-ui-side-panel simple-colors-picker {
      --simple-picker-option-size: calc(var(--hax-ui-icon) + 4px);
      --simple-picker-sample-padding: 0 var(--hax-ui-gap-md);
      --simple-picker-border-radius: var(--hax-ui-radius);
      --simple-picker-border-color: var(--hax-ui-line-strong);
      --simple-colors-picker-min-width: 0;
      --simple-colors-picker-none-color: var(--hax-ui-danger);
    }
    simple-fields.hax-ui-side-panel simple-colors-picker::part(sample) {
      box-sizing: border-box;
      height: var(--hax-ui-row-height);
      gap: var(--hax-ui-gap-md);
    }
    simple-fields.hax-ui-side-panel simple-colors-picker::part(sample-option) {
      flex: 1 1 auto;
      min-width: 0;
      color: var(--hax-ui-text);
      --simple-picker-option-label-padding: 0;
    }
    simple-fields.hax-ui-side-panel
      simple-colors-picker::part(sample-option)::before {
      width: calc(var(--hax-ui-icon) + 4px);
      height: calc(var(--hax-ui-icon) + 4px);
      margin-inline-end: var(--hax-ui-gap-md);
      border-radius: var(--hax-ui-radius);
      border-color: var(--hax-ui-line-strong);
    }
    simple-fields.hax-ui-side-panel simple-colors-picker::part(arrow) {
      display: none;
    }
    simple-fields.hax-ui-side-panel simple-colors-picker::part(sample)::after {
      content: "";
      flex: 0 0 auto;
      width: var(--hax-ui-icon);
      height: var(--hax-ui-icon);
      background-color: var(--hax-ui-text-muted);
      mask: var(--hax-ui-side-panel-chevron) center / contain no-repeat;
      transform: rotate(90deg);
    }
    /* media: the label on its own line, then URL and the sources */
    simple-fields.hax-ui-side-panel hax-upload-field::part(fieldset) {
      display: flex;
      flex-direction: column;
      gap: var(--hax-ui-gap);
      min-inline-size: 0;
      margin: 0;
      padding: var(--hax-ui-gap) 0;
      border: 0;
    }
    simple-fields.hax-ui-side-panel hax-upload-field::part(legend) {
      display: flex;
      align-items: center;
      gap: var(--hax-ui-gap);
      float: left;
      width: 100%;
      margin: 0;
      padding: 0;
      font-size: var(--hax-ui-admin-font-size);
      font-weight: 700;
      line-height: 1.2;
      color: var(--hax-ui-text);
    }
    simple-fields.hax-ui-side-panel hax-upload-field::part(url-label) {
      flex: 0 0 var(--ddd-spacing-10, 40px);
      font-size: var(--hax-ui-admin-font-size);
      font-weight: 400;
      color: var(--hax-ui-text-muted);
    }
    simple-fields.hax-ui-side-panel hax-upload-field::part(url-main) {
      display: flex;
      align-items: center;
      gap: var(--hax-ui-gap);
      margin: 0;
      padding: 0;
    }
    simple-fields.hax-ui-side-panel hax-upload-field::part(url-inner) {
      flex: 1 1 auto;
      min-width: 0;
    }
    simple-fields.hax-ui-side-panel hax-upload-field::part(url-input) {
      box-sizing: border-box;
      width: 100%;
      height: var(--hax-ui-row-height);
      padding: 0 var(--hax-ui-gap-md);
      border: 1px solid var(--hax-ui-line-strong);
      border-radius: var(--hax-ui-radius);
      background-color: var(--hax-ui-surface);
      color: var(--hax-ui-text);
      font-size: var(--hax-ui-admin-font-size);
    }
    simple-fields.hax-ui-side-panel hax-upload-field::part(source-row) {
      justify-content: space-between;
      flex-wrap: nowrap;
      gap: var(--hax-ui-gap-md);
      width: 100%;
      margin: 0;
      padding: 0;
    }
    /* phones pick files with the wide Upload button (the toolbar's upload
       source does not open the picker there); draw it as a HAX UI button */
    simple-fields.hax-ui-side-panel hax-upload-field::part(add-button) {
      float: none;
      box-sizing: border-box;
      width: 100%;
      height: var(--hax-ui-row-height);
      margin: 0 0 var(--hax-ui-gap);
      justify-content: center;
      align-items: center;
      gap: var(--hax-ui-gap-md);
      border: 1px solid var(--hax-ui-line-strong);
      border-radius: var(--hax-ui-radius);
      background-color: var(--hax-ui-surface);
      color: var(--hax-ui-text);
      font-family: var(--hax-ui-admin-font-family);
      font-size: var(--hax-ui-admin-font-size);
    }
    simple-fields.hax-ui-side-panel hax-upload-field::part(add-button)::before {
      content: "";
      display: inline-block;
      width: var(--hax-ui-icon);
      height: var(--hax-ui-icon);
      margin-inline-end: var(--hax-ui-gap-md);
      vertical-align: middle;
      background-color: currentColor;
      mask: var(--hax-ui-side-panel-upload) center / contain no-repeat;
    }
    simple-fields.hax-ui-side-panel hax-upload-field::part(drop-area-text) {
      flex: 1 1 auto;
      color: var(--hax-ui-text-muted);
      font-size: var(--hax-ui-admin-font-size-xs);
    }
    simple-fields.hax-ui-side-panel hax-upload-field::part(upload),
    simple-fields.hax-ui-side-panel hax-upload-field::part(drop-zone) {
      padding: 0;
    }
    simple-fields.hax-ui-side-panel hax-upload-field::part(sources) {
      display: flex;
      gap: var(--hax-ui-gap);
    }
    simple-fields.hax-ui-side-panel simple-fields-array::part(expand),
    simple-fields.hax-ui-side-panel simple-fields-array::part(add),
    simple-fields.hax-ui-side-panel hax-upload-field::part(merlin),
    simple-fields.hax-ui-side-panel hax-upload-field::part(browse),
    simple-fields.hax-ui-side-panel hax-upload-field::part(take-photo),
    simple-fields.hax-ui-side-panel hax-upload-field::part(record-audio),
    simple-fields.hax-ui-side-panel hax-upload-field::part(record-screen) {
      margin: 0;
      --simple-toolbar-button-height: var(--hax-ui-icon);
      --simple-toolbar-button-width: var(--hax-ui-icon);
      --simple-toolbar-button-min-width: calc(var(--hax-ui-row-height) - 2px);
      --simple-toolbar-button-padding: calc(
        (var(--hax-ui-row-height) - var(--hax-ui-icon) - 2px) / 2
      );
    }
    /* a list field with nothing in it is one row: label, then its buttons */
    simple-fields.hax-ui-side-panel simple-fields-array::part(fieldset) {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--hax-ui-gap);
      min-inline-size: 0;
      margin: 0;
      padding: 0;
      border: 0;
    }
    simple-fields.hax-ui-side-panel simple-fields-array::part(legend) {
      float: left;
      flex: 1 1 auto;
      margin: 0;
      padding: 0;
      font-size: var(--hax-ui-admin-font-size);
      font-weight: 700;
      line-height: 1.2;
      color: var(--hax-ui-text);
    }
    simple-fields.hax-ui-side-panel simple-fields-array::part(top),
    simple-fields.hax-ui-side-panel simple-fields-array::part(items) {
      display: flex;
      align-items: center;
      gap: var(--hax-ui-gap);
      margin: 0;
      padding: 0;
    }
    simple-fields.hax-ui-side-panel
      simple-fields-array:has(simple-fields-array-item)::part(items) {
      flex: 1 0 100%;
      flex-direction: column;
      align-items: stretch;
    }
    /* their buttons are 32px icon buttons, as everywhere in HAX UI */
    simple-fields.hax-ui-side-panel simple-fields-array,
    simple-fields.hax-ui-side-panel hax-upload-field {
      --simple-toolbar-button-height: var(--hax-ui-icon);
      --simple-toolbar-button-width: var(--hax-ui-icon);
      --simple-toolbar-button-min-width: calc(var(--hax-ui-row-height) - 2px);
      --simple-toolbar-button-padding: calc(
        (var(--hax-ui-row-height) - var(--hax-ui-icon) - 2px) / 2
      );
      --simple-toolbar-button-border-color: var(--hax-ui-line-strong);
      --simple-toolbar-button-border-radius: var(--hax-ui-radius);
      --simple-toolbar-button-bg: var(--hax-ui-surface);
      --simple-toolbar-button-color: var(--hax-ui-text);
      --simple-toolbar-button-hover-bg: var(--hax-ui-hover);
      --simple-toolbar-button-hover-color: var(--hax-ui-text);
      --simple-toolbar-button-hover-border-color: var(--hax-ui-line-strong);
    }
    @media (max-width: 600px) {
      simple-fields.hax-ui-side-panel {
        --hax-ui-field-label-width-compact: var(--ddd-spacing-25, 100px);
      }
    }
  `,
];
