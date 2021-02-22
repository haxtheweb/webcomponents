import { css, html, LitElement } from "lit-element/lit-element.js";

export const HaxUiText = [
  css`
    :host {
      --hax-ui-font-family: sans-serif;
      --hax-ui-font-size: 16px;
      --hax-ui-font-size-sm: 13px;
      --hax-ui-font-size-xs: 12px;
      --hax-ui-font-size-lg: calc(1.1 * var(--hax-ui-font-size, 16px));
      --hax-ui-font-size-xl: calc(1.2 * var(--hax-ui-font-size, 16px));
    }
  `,
];
export const HaxUiSpacing = [
  css`
    :host {
      --hax-tray-width: 300px;
      --hax-ui-spacing-xs: 4px;
      --hax-ui-spacing-sm: calc(1 * var(--hax-ui-spacing-xs, 4px));
      --hax-ui-spacing: calc(2 * var(--hax-ui-spacing-xs, 4px));
      --hax-ui-spacing-lg: calc(3 * var(--hax-ui-spacing-xs, 4px));
      --hax-ui-spacing-xl: calc(4 * var(--hax-ui-spacing-xs, 4px));
      --hax-ui-focus-z-index: 1001;
      --simple-toolbar-focus-z-index: var(--hax-ui-focus-z-index);
      --a11y-menu-button-focus-z-index: var(--hax-ui-focus-z-index);
    }
  `,
];
export const HaxUiColors = [
  css`
    :host {
      --hax-ui-color: #222;
      --hax-ui-color-focus: #000;
      --hax-ui-color-faded: #444;

      --hax-ui-background-color: #fff;
      --hax-ui-background-color-secondary: #e8e8e8;
      --hax-ui-background-color-faded: #b0b8bb;

      --hax-ui-color-accent: #009dc7;
      --hax-ui-color-accent-secondary: #007999;
      --hax-ui-background-color-accent: #ddf8ff;

      --hax-ui-color-danger: #ee0000;
      --hax-ui-color-danger-secondary: #850000;
      --hax-ui-background-color-danger: #ffdddd;

      --hax-ui-border-color: #ddd;
    }
    @media (prefers-color-scheme: dark) {
      :host {
        --hax-ui-color: #eeeae6;
        --hax-ui-color-focus: #fff;
        --hax-ui-color-faded: #c5c3be;

        --hax-ui-background-color: #333;
        --hax-ui-background-color-secondary: #111;
        --hax-ui-background-color-faded: #222;

        --hax-ui-color-accent: #77e2ff;
        --hax-ui-color-accent-secondary: #00c9ff;
        --hax-ui-background-color-accent: #000;

        --hax-ui-color-danger: #ff8f8f;
        --hax-ui-color-danger-secondary: #ff2222;
        --hax-ui-background-color-danger: #000;

        --hax-ui-border-color: #000;
      }
    }
  `,
];
export const HaxTrayButton = [
  css`
    :host {
      text-transform: capitalize;
    }
    absolute-position-behavior {
      color: var(--hax-ui-color);
      background-color: var(--hax-ui-background-color);
      border: 1px solid transparent;
    }
    :host[aria-expanded="true"] {
      border: 1px solid var(--hax-ui-border-color);
    }
    button[part="button"] {
      text-transform: capitalize;
      font-size: var(--hax-ui-font-size-sm);
      padding: var(--hax-ui-spacing-sm);
      color: var(--hax-ui-color);
      background-color: var(--hax-ui-background-color);
      border: 1px solid var(--hax-ui-border-color);
    }
    :host(.toolbar) button[part="button"] {
      background-color: var(--hax-ui-background-color-accent);
    }
    :host(:hover) button[part="button"],
    :host(:focus-within) button[part="button"] {
      color: var(--hax-ui-color);
      background-color: var(--hax-ui-background-color-accent);
      border-color: var(--hax-ui-color-accent);
    }
    button[part="button"][aria-pressed="true"] {
      color: var(--hax-ui-color-accent-secondary);
      border-color: var(--hax-ui-color-accent-secondary);
    }
    :host([feature]) button[part="button"],
    :host([danger]) button[part="button"] {
      color: var(--hax-ui-background-color-secondary);
    }
    :host([feature]) button[part="button"] {
      background-color: var(--hax-ui-color-accent);
      border-color: var(--hax-ui-color-accent);
    }
    :host([danger]) button[part="button"] {
      background-color: var(--hax-ui-color-danger);
      border-color: var(--hax-ui-color-danger);
    }
    :host([feature]) button[part="button"][aria-pressed="true"],
    :host([danger]) button[part="button"][aria-pressed="true"] {
      color: var(--hax-ui-background-color);
    }
    :host([feature]) button[part="button"][aria-pressed="true"] {
      background-color: var(--hax-ui-color-accent-secondary);
      border-color: var(--hax-ui-color-accent);
    }
    :host([danger]) button[part="button"][aria-pressed="true"] {
      background-color: var(--hax-ui-color-danger-secondary);
      border-color: var(--hax-ui-color-danger);
    }
    :host([feature]:hover) button[part="button"],
    :host([feature]:focus-within) button[part="button"],
    :host([danger]:hover) button[part="button"],
    :host([danger]:focus-within) button[part="button"] {
      color: var(--hax-ui-background-color);
    }
    :host([feature]:hover) button[part="button"],
    :host([feature]:focus-within) button[part="button"] {
      background-color: var(--hax-ui-color-accent-secondary);
      border-color: var(--hax-ui-color-accent-secondary);
    }
    :host([danger]:hover) button[part="button"],
    :host([danger]:focus-within) button[part="button"] {
      background-color: var(--hax-ui-color-danger-secondary);
      border-color: var(--hax-ui-color-danger-secondary);
    }
    :host([large]) button[part="button"] {
      font-size: var(--hax-ui-font-size);
      padding: var(--hax-ui-spacing);
      border-width: 2px;
    }
    :host([disabled]) button[part="button"][disabled] {
      opacity: 0.5;
      background-color: rgba(127, 127, 127, 0.2);
    }

    ::part(label) {
      text-transform: capitalize;
      margin: var(--hax-ui-spacing-sm);
    }
  `,
];

export const HaxUiHexagon = [
  css`
    hexagon-loader {
      display: none;
      margin: 0 auto;
      z-index: 1000;
      --hexagon-color: var(--hax-ui-color-accent);
    }
    hexagon-loader[loading] {
      display: block;
      opacity: 0.8;
    }
  `,
];
export const HaxUiTour = [css``];
export const HaxTrayUploadField = [];

export const HaxUiFields = [
  css`
    simple-fields,
    #tray-detail * {
      --simple-fields-field-margin: calc(2 * var(--hax-ui-font-size));
      --simple-fields-font-size: var(--hax-ui-font-size);
      --simple-fields-line-height: 135%;
      --simple-fields-detail-font-size: var(--hax-ui-font-size-sm);
      --simple-fields-detail-line-height: 120%;
      --simple-fields-margin: var(--hax-ui-spacing);
      --simple-fields-font-family: var(--hax-ui-font-family);
      --simple-fields-color: var(--hax-tray-text-color);
      --simple-fields-accent-color: var(--hax-ui-color-accent);
      --simple-fields-error-color: var(--hax-ui-color-danger-secondary);
      --simple-fields-secondary-accent-color: var(
        --hax-ui-color-accent-secondary
      );
      --simple-fields-border-color: var(--hax-ui-color-faded);
      --simple-toolbar-focus-z-index: var(--hax-ui-focus-z-index);
    }
    simple-fields *::part(field-desc),
    hax-tray-upload::part(description),
    hax-upload-field::part(description) {
      opacity: 0.7;
      font-size: var(--hax-ui-font-size-xs);
      line-height: 120%;
    }
    simple-fields *:focus-within::part(field-desc),
    hax-upload-field:focus-within::part(description),
    hax-tray-upload:focus-within::part(description) {
      opacity: 1;
    }
    simple-fields-tabs::part(content) {
      padding: var(--hax-ui-spacing-sm) 0 0;
      border: none;
      margin-left: calc(0 - var(--hax-ui-spacing-sm));
      margin-right: calc(0 - var(--hax-ui-spacing-sm));
    }
    simple-fields-tabs::part(tab),
    simple-fields-tabs::part(tab-active),
    simple-fields-tabs::part(tab-disabled),
    hax-preferences-dialog::part(haxlink),
    hax-tray-upload::part(option-icon),
    hax-upload-field::part(option-icon),
    hax-tray-upload::part(option-icon-selected),
    hax-upload-field::part(option-icon-selected) {
      border: 1px solid var(--hax-ui-border-color);
      text-decoration: none;
      border-radius: 3px;
      color: var(--hax-ui-color);
      background-color: var(--hax-ui-background-color);
      outline: unset;
    }
    simple-fields-tabs::part(tab),
    simple-fields-tabs::part(tab-active),
    simple-fields-tabs::part(tab-disabled),
    hax-preferences-dialog::part(haxlink) {
      text-transform: capitalize;
      font-size: var(--hax-ui-font-size-sm);
      padding: var(--hax-ui-spacing-xs);
      flex: 1 1 auto;
    }
    hax-preferences-dialog::part(haxlink) {
      font-size: var(--hax-ui-font-size-xl);
      display: block;
      padding: var(--hax-ui-spacing-lg);
    }
    hax-preferences-dialog::part(haxlink):hover,
    hax-preferences-dialog::part(haxlink):focus,
    simple-fields-tabs::part(tab):hover,
    simple-fields-tabs::part(tab):focus,
    hax-tray-upload::part(option-icon):hover,
    hax-upload-field::part(option-icon):hover,
    hax-tray-upload::part(option-icon):focus,
    hax-upload-field::part(option-icon):focus {
      color: var(--hax-ui-color);
      background-color: var(--hax-ui-background-color-accent);
      border-color: var(--hax-ui-color-accent);
    }
    simple-fields-tabs::part(tab-active),
    hax-tray-upload::part(option-icon-selected),
    hax-upload-field::part(option-icon-selected) {
      background-color: var(--hax-ui-background-color);
      color: var(--hax-ui-color-accent-secondary);
      border-color: var(--hax-ui-color-accent-secondary);
    }
    simple-fields-tabs::part(tab-disabled) {
      opacity: 0.5;
      background-color: rgba(127, 127, 127, 0.2);
    }
    simple-fields-tabs::part(content) {
      border: none;
    }
    simple-fields-tab {
      padding: 0;
    }
    simple-fields *::part(fieldset),
    hax-tray-upload::part(fieldset),
    hax-upload-field::part(fieldset) {
      border-color: rgba(127, 127, 127, 0.2);
    }
    simple-fields *::part(legend),
    hax-tray-upload::part(legend),
    hax-upload-field::part(legend),
    simple-fields *::part(label),
    hax-tray-upload::part(label),
    hax-upload-field::part(label) {
      text-transform: capitalize;
    }
    simple-fields *::part(legend),
    hax-tray-upload::part(legend),
    hax-upload-field::part(legend) {
      font-size: var(--hax-ui-font-size-xs);
    }
    hax-tray-upload,
    hax-upload-field {
      color: var(--hax-tray-text-color);
    }
  `,
];
export const HaxUiTooltip = [
  css`
    :host {
      --simple-tooltip-background: var(--hax-ui-color);
      --simple-tooltip-text-color: var(--hax-ui-background-color);
      --simple-tooltip-opacity: 1;
      --simple-tooltip-delay-in: 0;
      --simple-tooltip-duration-in: 100ms;
      --simple-tooltip-duration-out: 0;
      --simple-tooltip-border-radius: 2px;
      --simple-tooltip-font-size: var(--hax-ui-font-size-sm);
    }
  `,
];
export const HaxTrayDetail = [
  css`
    #tray-detail {
      --hax-tray-detail-title-font-size: var(--hax-ui-font-size-xl);
      --hax-tray-detail-topic-font-size: var(--hax-ui-font-size-lg);
      --hax-tray-detail-subtopic-font-size: var(--hax-ui-font-size);
      --hax-tray-detail-heading-text-transform: capitalize;
      --hax-tray-detail-heading-font-weight: normal;
    }
    #tray-detail h4,
    #tray-detail h5,
    #tray-detail h6 {
      text-transform: var(--hax-tray-detail-heading-text-transform);
      font-weight: var(--hax-tray-detail-heading-font-weight);
      margin: var(--hax-ui-spacing-lg) 0 var(--hax-ui-spacing-xs);
      color: var(--hax-ui-color-accent);
    }
    #tray-detail h4 {
      font-size: var(--hax-tray-detail-title-font-size);
      margin: var(--hax-ui-spacing-sm) 0 var(--hax-ui-spacing-lg);
    }
    #tray-detail h5 {
      font-size: var(--hax-tray-detail-topic-font-size);
    }
    #tray-detail h6 {
      font-size: var(--hax-tray-detail-subtopic-font-size);
    }
  `,
];
export const HaxTrayDetailHeadings = [
  css`
    h4 {
      font-size: var(--hax-tray-detail-title-font-size);
    }
    h5 {
      font-size: var(--hax-tray-detail-topic-font-size);
    }
    h6 {
      font-size: var(--hax-tray-detail-subtopic-font-size);
    }
    h4,
    h5,
    h6 {
      color: var(--hax-ui-color-accent);
      text-transform: var(--hax-tray-detail-heading-text-transform);
      font-weight: var(--hax-tray-detail-heading-font-weight);
      margin: var(--hax-ui-spacing-lg) 0 var(--hax-ui-spacing-xs);
    }
  `,
];
/**
 * controls text spacing and colors throughout Hax UI (but not content)
 */
export const HaxUiBaseStyles = [
  ...HaxUiText,
  ...HaxUiSpacing,
  ...HaxUiFields,
  ...HaxUiTooltip,
  ...HaxUiColors,
];
/**
 * Hax Tray Specific Styles
 */
export const HaxTrayBaseStyles = [...HaxUiBaseStyles, ...HaxUiHexagon];
export const HaxTourStyles = [];
export const HaxUiSimpleModal = [
  ...HaxTrayBaseStyles,
  css`
    simple-modal-template {
      --simple-modal-z-index: 100000000;
      --simple-modal-height: 70vh;
      --simple-modal-width: 70vw;
      --simple-modal-titlebar-color: var(--hax-ui-background-color);
      --simple-modal-titlebar-background: var(--hax-ui-color-accent);
      --simple-modal-titlebar-padding: var(--hax-ui-spacing-xs);
      --simple-modal-titlebar-height: calc(20px + 2 * var(--hax-ui-spacing-xs));
      --simple-modal-content-container-color: var(--hax-ui-color);
      --simple-modal-content-container-background: var(
        --hax-ui-background-color
      );
      --simple-modal-content-padding: var(--hax-ui-spacing-sm) 0px 0px;
      --simple-modal-buttons-background: var(--hax-ui-background-color);
    }
  `,
];
/**
 * an empty wrapper to ensure modal content has the same base styles
 *
 * @class HaxBaseStylesWrapper
 * @extends {LitElement}
 */
export class HaxUiStyles extends LitElement {
  static get styles() {
    return HaxTrayBaseStyles;
  }
  render() {
    return html`<slot></slot>`;
  }
  static get tag() {
    return "hax-ui-styles";
  }
}
window.customElements.define(HaxUiStyles.tag, HaxUiStyles);
