import { css } from "lit";
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
      background-color: var(--simple-fields-background-color, white);
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
      border-radius: var(--simple-fields-border-radius, 2px);
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
      border-radius: var(--simple-fields-border-radius, 2px);
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
