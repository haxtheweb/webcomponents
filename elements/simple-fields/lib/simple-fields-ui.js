import { css } from "lit-element/lit-element.js";
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
      background-color: var(--simple-fields-background-color, transparent);
      color: var(--simple-fields-color, currentColor);
      margin: 0 0
        var(--simple-fields-field-margin, var(--simple-fields-margin, 16px));
    }
    :host([hidden]),
    :host [hidden],
    :host([type="hidden"]) {
      display: none !important;
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
    simple-toolbar-button::part(button) {
      color: var(--simple-fields-button-color, var(--simple-fields-color));
      background-color: var(
        --simple-fields-button-background-color,
        var(--simple-fields-background-color)
      );
      border-color: var(
        --simple-fields-button-border-color,
        var(--simple-fields-border-color, #999)
      );
      opacity: var(--simple-fields-button-focus-opacity, unset);
      font-family: var(--simple-fields-detail-font-family);
      font-size: var(--simple-fields-detail-font-size);
      line-height: var(--simple-fields-detail-line-height);
      text-transform: var(--simple-fields-button-text-transform, unset);
      border-width: 1px;
      border-radius: var(--simple-fields-border-radius, 2px);
      padding: var(--simple-fields-button-padding-sm, 1px)
        var(--simple-fields-button-padding, 2px);
    }
    button[aria-pressed="true"],
    simple-toolbar-button[toggled]::part(button) {
      color: var(--simple-fields-button-toggled-color, unset);
      background-color: var(
        --simple-fields-button-toggled-background-color,
        unset
      );
      border-color: var(
        --simple-fields-button-toggled-border-color,
        var(--simple-fields-color, currentColor)
      );
      opacity: var(--simple-fields-button-toggled-opacity, unset);
    }
    button:focus,
    button:hover,
    simple-toolbar-button:focus-within::part(button),
    simple-toolbar-button:hover::part(button) {
      color: var(--simple-fields-button-focus-color, unset);
      background-color: var(
        --simple-fields-button-focus-background-color,
        unset
      );
      border-color: var(
        --simple-fields-button-focus-border-color,
        var(--simple-fields-accent-color, #3f51b5)
      );
      opacity: var(--simple-fields-button-focus-opacity, unset);
    }
    button:disabled,
    simple-toolbar-button[disabled] {
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
      color: var(--simple-fields-error-color, #dd2c00);
      transition: all 0.3s ease-in-out;
    }
  `,
];
