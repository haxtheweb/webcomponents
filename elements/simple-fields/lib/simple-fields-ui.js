import { css } from "lit";
/**
 * Descriptions at or below this many words render as plain subtext
 * under the label (Ubuntu-style settings row, issue #2996). Longer
 * descriptions collapse behind an (i) info icon whose tooltip shows on
 * hover/focus (positioned above) and hides on blur/mouseleave.
 * Shared by simple-fields-container (shadow + slotted fields),
 * simple-fields-field (radio/checkbox fieldsets), and
 * simple-fields-upload (hax-upload-field) so every field type uses the
 * same threshold for the inline-description-vs-info-icon behavior.
 */
export const SIMPLE_FIELDS_INLINE_DESCRIPTION_MAX_WORDS = 4;
export const SimpleFieldsBaseStyles = [
  css`
    :host {
      visibility: visible;
      box-sizing: border-box;
      display: block;
      margin: 0 0 var(--simple-fields-margin, 16px);
      padding: 0;
      font-size: var(--simple-fields-font-size);
      font-family: var(--simple-fields-font-family, sans-serif);
      line-height: var(--simple-fields-line-height);
      font-size: var(--simple-fields-detail-font-size, 12px);
      font-family: var(--simple-fields-detail-font-family, sans-serif);
      line-height: var(--simple-fields-detail-line-height, 130%);
      background-color: var(
        --simple-fields-background-color,
        light-dark(
          var(--ddd-theme-default-white, #ffffff),
          var(--ddd-theme-default-coalyGray, #262626)
        )
      );
      color: var(--simple-fields-color, currentColor);
      margin: 0 0
        var(--simple-fields-field-margin, var(--simple-fields-margin, 16px));
      --simple-picker-options-border: 1px solid
        var(
          --simple-fields-button-border-color,
          var(--simple-fields-border-color, #999)
        );
      --simple-picker-options-focus-border: 1px solid
        var(--simple-fields-accent-color, #3f51b5);
    }
    ::slotted([slot="field"]) {
      --simple-picker-options-left: 0;
      --simple-picker-options-right: 0;
      --simple-picker-options-border: 1px
        var(
          --simple-fields-button-border-color,
          var(--simple-fields-border-color, #999)
        )
        solid;
      --simple-picker-options-focus-border: 1px
        var(--simple-fields-accent-color, #3f51b5) solid;
    }
    :host([hidden]),
    :host [hidden],
    :host([type="hidden"]) {
      display: none !important;
    }
    ul[role="listbox"] {
      z-index: 2;
      opacity: 0;
      margin: 0;
      padding: 0;
      top: 100%;
      background-color: var(--simple-fields-background-color, white);
      color: var(--simple-fields-color, currentColor);
      border: 1px
        var(
          --simple-fields-button-border-color,
          var(--simple-fields-border-color, #999)
        )
        solid;
      overflow: auto;
    }

    ul[role="listbox"].focus,
    ul[role="listbox"]:focus,
    ul[role="listbox"]:focus-within {
      border-color: var(--simple-fields-accent-color, #3f51b5);
    }
    :host([disabled]),
    *[disabled] {
      pointer-events: none !important;
    }
  `,
];
export const SimpleFieldsLabelStyles = [
  css`
    :host .label-main:after {
      content: var(--simple-fields-label-flag, "");
    }
    :host([focused]) .label-main,
    :host(:focus-within) .label-main {
      color: var(--simple-fields-accent-color, #3f51b5);
      transition: color 0.3s ease-in-out;
      font-weight: var(--ddd-font-weight-bold);
    }
    .label-main {
      font-weight: var(--ddd-font-weight-medium);
    }
    .inline {
      --simple-fields-radio-option-display: flex;
      --simple-fields-radio-option-flex-wrap: wrap;
    }
    label {
      margin: 0 0 0 0;
    }
    .inline label,
    .option label {
      margin: 0 var(--simple-fields-margin-small, 8px) 0 0;
      flex: 0 1 var(--simple-fields-label-width, auto);
    }
    .inline label,
    .option label,
    .field-main > div,
    .field,
    ::slotted([slot="field"]) {
      font-size: var(--simple-fields-font-size, 16px);
      text-align: var(--simple-fields-text-align);
      font-family: var(--simple-fields-font-family, sans-serif);
      line-height: var(--simple-fields-line-height, 22px);
    }
  `,
];
export const SimpleFieldsTooltipStyles = [
  css`
    simple-tooltip,
    simple-toolbar-button::part(tooltip) {
      text-transform: var(--simple-fields-tooltip-text-transform, unset);
      font-family: var(
        --simple-fields-detail-font-family,
        var(--simple-fields-font-family, sans-serif)
      );
      font-size: var(
        --simple-fields-tooltip-font-size,
        var(--simple-fields-detail-font-size, 12px)
      );
      line-height: var(
        --simple-fields-tooltip-line-height,
        var(--simple-fields-detail-line-height, 22px)
      );
      border-radius: var(
        --simple-fields-border-radius,
        var(--simple-fields-tooltip-border-radius, 2px)
      );
    }
  `,
];
export const SimpleFieldsButtonStyles = [
  ...SimpleFieldsTooltipStyles,
  css`
    button,
    button[aria-selected],
    simple-toolbar-button::part(button),
    simple-toolbar-menu::part(button) {
      color: var(--simple-fields-button-color, var(--simple-fields-color));
      background-color: var(
        --simple-fields-button-background-color,
        var(--simple-fields-background-color)
      );
      border-width: 1px;
      border-style: solid;
      border-color: var(
        --simple-fields-button-border-color,
        var(--simple-fields-border-color, #999)
      );
      opacity: var(--simple-fields-button-focus-opacity, 1);
      font-family: var(
        --simple-fields-button-font-family,
        var(--simple-fields-font-family, sans-serif)
      );
      font-size: var(--simple-fields-button-font-size, 14px);
      line-height: var(--simple-fields-button-line-height 22px);
      text-transform: var(--simple-fields-button-text-transform, unset);
      border-radius: var(--simple-fields-border-radius, 4px);
      padding: var(--simple-fields-button-padding-sm, 1px)
        var(--simple-fields-button-padding, 2px);
      min-height: calc(
        24px + 2 * var(--simple-fields-button-padding-sm, 2px) + 2px
      );
    }
    simple-toolbar-menu-item > simple-toolbar-button::part(button) {
      border-color: transparent;
      border-radius: 0 !important;
    }
    simple-toolbar-button.danger::part(button),
    simple-toolbar-menu.danger::part(button) {
      background-color: var(
        --simple-fields-button-danger-color,
        var(--simple-fields-error-color, #b40000)
      );
      color: var(--simple-fields-button-danger-background-color, white);
    }
    button[aria-pressed="true"],
    button[aria-selected="true"],
    simple-toolbar-button[toggled]::part(button) {
      color: var(
        --simple-fields-button-toggled-color,
        var(--simple-fields-accent-color, #3f51b5)
      );
      background-color: var(
        --simple-fields-button-toggled-background-color,
        unset
      );
      border-color: var(
        --simple-fields-button-toggled-border-color,
        var(--simple-fields-color, currentColor)
      );
      opacity: var(--simple-fields-button-toggled-opacity, 1);
    }
    simple-toolbar-menu-item
      > simple-toolbar-button.danger:hover::part(button[aria-pressed="true"]),
    simple-toolbar-menu-item
      > simple-toolbar-button.danger:focus-within::part(
        button[aria-pressed="true"]
      ) {
      background-color: var(
        --simple-fields-button-danger-color,
        var(--simple-fields-error-color, #b40000)
      );
      color: var(--simple-fields-button-danger-background-color, white);
      border-color: var(--simple-fields-button-danger-focus-color, #8a0000);
    }
    button:focus,
    button:hover,
    button[aria-selected="false"]:not([disabled]):focus,
    button[aria-selected="false"]:not([disabled]):hover,
    simple-toolbar-button:focus-within::part(button),
    simple-toolbar-button:hover::part(button),
    simple-toolbar-menu:focus-within::part(button),
    simple-toolbar-menu:hover::part(button),
    simple-toolbar-menu-item > simple-toolbar-button:hover::part(button),
    simple-toolbar-menu-item
      > simple-toolbar-button:focus-within::part(button) {
      color: var(--simple-fields-button-focus-color, unset);
      background-color: var(
        --simple-fields-button-focus-background-color,
        var(--simple-fields-accent-color-light, #d9eaff)
      );
      border-color: var(
        --simple-fields-button-focus-border-color,
        var(--simple-fields-accent-color, #3f51b5)
      );
      opacity: var(--simple-fields-button-focus-opacity, 1);
      text-decoration: var(--simple-fields-button-focus-text-decoration, unset);
    }
    simple-toolbar-menu.danger:focus-within::part(button),
    simple-toolbar-menu.danger:hover::part(button),
    simple-toolbar-menu-item > simple-toolbar-button.danger:hover::part(button),
    simple-toolbar-menu-item
      > simple-toolbar-button.danger:focus-within::part(button) {
      background-color: var(--simple-fields-button-danger-focus-color, #8a0000);
      color: var(--simple-fields-button-danger-background-color, white);
      border-color: var(--simple-fields-button-danger-focus-color, #8a0000);
    }
    button:disabled,
    button[disabled],
    simple-toolbar-button[disabled],
    simple-toolbar-menu[disabled] {
      color: var(--simple-fields-button-disabled-color, unset);
      background-color: var(
        --simple-fields-button-disabled-background-color,
        unset
      );
      border-color: var(--simple-fields-button-disabled-border-color, unset);
      opacity: var(
        --simple-fields-button-disabled-opacity,
        var(--simple-fields-disabled-opacity, 0.7)
      );
    }
  `,
];
export const SimpleFieldsDescriptionStyles = [
  css`
    *[part="field-desc"],
    *[part="error-desc"],
    *[part="error-meta"] {
      color: var(--simple-fields-meta-color);
      font-size: var(--simple-fields-meta-font-size, 10px);
      line-height: var(--simple-fields-meta-line-height, 110%);
      opacity: var(--simple-fields-meta-opacity, unset);
      text-transform: none;
    }
    :host:hover *[part="field-desc"],
    :host:hover-within *[part="error-desc"],
    :host:hover-within *[part="error-meta"],
    :host:hover *[part="field-desc"],
    :host:hover *[part="error-desc"],
    :host:hover *[part="error-meta"] {
      color: var(--simple-fields-focus-meta-color);
      opacity: var(--simple-fields-focus-meta-opacity, unset);
    }
    /* Row-based fields (Ubuntu-style settings layout, issue #2996):
       description text is relocated as subtext under the label (or behind
       an (i) info icon for long text), so the field-desc shown here is
       not gated by hover. The host carries a [row-layout] attribute
       (mirrored from isRowBasedField) so this auto-applies to every
       field type as later phases convert it. */
    :host([row-layout]) *[part="field-desc"] {
      opacity: var(--simple-fields-meta-opacity, 1);
    }
  `,
];
export const SimpleFieldsRowStyles = [
  css`
    /* Ubuntu-style settings row hover/focus affordance (issue #2996).
       Scoped to the [row-layout] host attribute so it applies to every
       row-based field type (checkbox, single select, bounded number, and
       future phases) without affecting non-row fields. */
    :host([row-layout]:hover) {
      background-color: var(
        --simple-fields-row-hover-background-color,
        light-dark(rgba(0, 0, 0, 0.08), rgba(255, 255, 255, 0.12))
      );
      transition: background-color 0.3s ease-in-out;
    }
    :host([row-layout]:focus-within) {
      outline: var(--simple-fields-row-focus-outline-width, 1px) solid
        var(
          --simple-fields-row-focus-outline-color,
          var(--simple-fields-accent-color, #3f51b5)
        );
      outline-offset: -1px;
      transition: outline-color 0.3s ease-in-out;
    }
    /* Ubuntu-style settings rows are start-aligned (issue #2996).
       The pre-existing .inline label rule sets text-align to
       var(--simple-fields-text-align) with no fallback, so when that
       custom property is unset the value inherits from the host page.
       The .label-text wrapper stretches its children to a shared width,
       which exposes any inherited ambient center alignment. Force start
       here so row-layout labels and descriptions never inherit center. */
    .field-main.row-layout .label-main,
    .field-main.row-layout .label-text {
      text-align: start;
    }
    /* Row-layout labels grow to fill the left side so the (i) info icon
       (fixed-size, flex: 0 0 auto) is pushed to the right edge of the
       label and sits next to the field control (issue #2996). Without
       this, the pre-existing .inline label flex rule in
       SimpleFieldsLabelStyles keeps checkbox/color/radio labels at
       content width, stranding the info icon at the far left while
       text/select labels grow and place it next to the field. */
    .field-main.row-layout .label-main,
    .field-main.row-layout > label {
      flex: 1 1 auto;
    }
    /* Base row-layout flex (issue #2996). Declared in the shared styles so
       every consumer that writes the row-layout class gets the horizontal
       label-left / control-right row, including elements that do NOT
       inherit simple-fields-field.js styles (e.g. simple-fields-code, which
       extends the container directly) and slotted-field containers. Elements
       that also inherit field.js carry an identical rule; the duplication is
       harmless and keeps each module self-consistent. */
    .field-main.row-layout {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  `,
];
export const SimpleFieldsFieldsetStyles = [
  css`
    fieldset {
      padding: var(--simple-fields-margin-small, 8px)
        var(--simple-fields-margin, 16px);
      margin: var(--simple-fields-margin-small, 8px) 0
        var(--simple-fields-margin, 16px);
      border-width: 1px;
      border-style: solid;
      border-color: var(
        --simple-fields-fieldset-border-color,
        var(--simple-fields-border-color-light, #ccc)
      );
      border-radius: var(--simple-fields-border-radius, 4px);
      transition: all 0.3s ease-in-out;
      max-width: calc(100% - 2 * var(--simple-fields-margin, 16px) - 2px);
    }
    :host(:last-of-type) {
      margin-bottom: 0;
    }
    *[part="legend"] {
      font-family: var(--simple-fields-font-family, sans-serif);
      font-size: var(
        --simple-fields-legend-font-size,
        var(--simple-fields-font-size, 16px)
      );
      line-height: var(--simple-fields-line-height, 22px);
      text-transform: var(--simple-fields-legend-text-transform, unset);
    }
    :host([error]) *[part="legend"] {
      color: var(--simple-fields-error-color, #b40000);
      transition: all 0.3s ease-in-out;
    }
  `,
];
