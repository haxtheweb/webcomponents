import { css, html, LitElement } from "lit-element/lit-element.js";

export const HaxTrayText = [
  css`
    :host {
      --hax-tray-font-family: sans-serif;
      --hax-tray-font-size: 16px;
      --hax-tray-font-size-sm: 13px;
      --hax-tray-font-size-xs: 12px;
      --hax-tray-font-size-lg: calc(1.1 * var(--hax-tray-font-size, 16px));
      --hax-tray-font-size-xl: calc(1.2 * var(--hax-tray-font-size, 16px));
    }
  `,
];
export const HaxTraySpacing = [
  css`
    :host {
      --hax-tray-width: 300px;
      --hax-tray-spacing-xs: 4px;
      --hax-tray-spacing-sm: calc(1 * var(--hax-tray-spacing-xs, 4px));
      --hax-tray-spacing: calc(2 * var(--hax-tray-spacing-xs, 4px));
      --hax-tray-spacing-lg: calc(3 * var(--hax-tray-spacing-xs, 4px));
      --hax-tray-spacing-xl: calc(4 * var(--hax-tray-spacing-xs, 4px));
      --hax-tray-focus-z-index: 100000001;
      --simple-toolbar-focus-z-index: var(--hax-tray-focus-z-index);
      --a11y-menu-button-focus-z-index: var(--hax-tray-focus-z-index);
    }
  `,
];
export const HaxTrayColors = [
  css`
    :host {
      --hax-tray-color: #222;
      --hax-tray-color-focus: #000;
      --hax-tray-color-faded: #444;

      --hax-tray-background-color: #fff;
      --hax-tray-background-color-secondary: #e8e8e8;
      --hax-tray-background-color-faded: #b0b8bb;

      --hax-tray-color-accent: #009dc7;
      --hax-tray-color-accent-secondary: #007999;
      --hax-tray-background-color-accent: #ddf8ff;

      --hax-tray-color-danger: #ee0000;
      --hax-tray-color-danger-secondary: #850000;
      --hax-tray-background-color-danger: #ffdddd;

      --hax-tray-border-color: #ddd;
    }
    @media (prefers-color-scheme: dark) {
      :host {
        --hax-tray-color: #eeeae6;
        --hax-tray-color-focus: #fff;
        --hax-tray-color-faded: #c5c3be;

        --hax-tray-background-color: #333;
        --hax-tray-background-color-secondary: #111;
        --hax-tray-background-color-faded: #222;

        --hax-tray-color-accent: #77e2ff;
        --hax-tray-color-accent-secondary: #00c9ff;
        --hax-tray-background-color-accent: #000;

        --hax-tray-color-danger: #ff8f8f;
        --hax-tray-color-danger-secondary: #ff2222;
        --hax-tray-background-color-danger: #000;

        --hax-tray-border-color: #000;
      }
    }
  `,
];
export const HaxTrayButtonTheme = [
  css`
    :host {
      text-transform: capitalize;
    }
    absolute-position-behavior {
      color: var(--hax-tray-color);
      background-color: var(--hax-tray-background-color);
      border: 1px solid var(--hax-tray-border-color);
    }
    button[part="button"] {
      font-size: var(--hax-tray-font-size-sm);
      padding: var(--hax-tray-spacing-sm);
      color: var(--hax-tray-color);
      background-color: var(--hax-tray-background-color);
      border: 1px solid var(--hax-tray-border-color);
    }
    :host(:hover) button[part="button"],
    :host(:focus-within) button[part="button"] {
      color: var(--hax-tray-color);
      background-color: var(--hax-tray-background-color-accent);
      border-color: var(--hax-tray-color-accent);
    }
    button[part="button"][aria-pressed="true"] {
      color: var(--hax-tray-color-accent-secondary);
      border-color: var(--hax-tray-color-accent-secondary);
    }
    :host([feature]) button[part="button"],
    :host([danger]) button[part="button"] {
      color: var(--hax-tray-background-color-secondary);
    }
    :host([feature]) button[part="button"] {
      background-color: var(--hax-tray-color-accent);
      border-color: var(--hax-tray-color-accent);
    }
    :host([danger]) button[part="button"] {
      background-color: var(--hax-tray-color-danger);
      border-color: var(--hax-tray-color-danger);
    }
    :host([feature]) button[part="button"][aria-pressed="true"],
    :host([danger]) button[part="button"][aria-pressed="true"] {
      color: var(--hax-tray-background-color);
    }
    :host([feature]) button[part="button"][aria-pressed="true"] {
      background-color: var(--hax-tray-color-accent-secondary);
      border-color: var(--hax-tray-color-accent);
    }
    :host([danger]) button[part="button"][aria-pressed="true"] {
      background-color: var(--hax-tray-color-danger-secondary);
      border-color: var(--hax-tray-color-danger);
    }
    :host([feature]:hover) button[part="button"],
    :host([feature]:focus-within) button[part="button"],
    :host([danger]:hover) button[part="button"],
    :host([danger]:focus-within) button[part="button"] {
      color: var(--hax-tray-background-color);
    }
    :host([feature]:hover) button[part="button"],
    :host([feature]:focus-within) button[part="button"] {
      background-color: var(--hax-tray-color-accent-secondary);
      border-color: var(--hax-tray-color-accent-secondary);
    }
    :host([danger]:hover) button[part="button"],
    :host([danger]:focus-within) button[part="button"] {
      background-color: var(--hax-tray-color-danger-secondary);
      border-color: var(--hax-tray-color-danger-secondary);
    }
    :host([large]) button[part="button"] {
      font-size: var(--hax-tray-font-size);
      padding: var(--hax-tray-spacing);
      border-width: 2px;
    }
    :host([disabled]) button[part="button"][disabled] {
      opacity: 0.5;
      background-color: rgba(127, 127, 127, 0.2);
    }

    ::part(label) {
      margin: var(--hax-tray-spacing-sm);
    }
  `,
];

export const HaxTrayHexagon = [
  css`
    hexagon-loader {
      display: none;
      margin: 0 auto;
      z-index: 1000;
      --hexagon-color: var(--hax-tray-color-accent);
    }
    hexagon-loader[loading] {
      display: block;
      opacity: 0.8;
    }
  `,
];

export const HaxTrayUploadField = [];

export const HaxTraySimpleFields = [
  css`
    simple-fields,
    #tray-detail * {
      --simple-fields-field-margin: calc(2 * var(--hax-tray-font-size));
      --simple-fields-font-size: var(--hax-tray-font-size);
      --simple-fields-line-height: 135%;
      --simple-fields-detail-font-size: var(--hax-tray-font-size-sm);
      --simple-fields-detail-line-height: 120%;
      --simple-fields-margin: var(--hax-tray-spacing);
      --simple-fields-font-family: var(--hax-tray-font-family);
      --simple-fields-color: var(--hax-tray-text-color);
      --simple-fields-accent-color: var(--hax-tray-color-accent);
      --simple-fields-error-color: var(--hax-tray-color-danger-secondary);
      --simple-fields-secondary-accent-color: var(
        --hax-tray-color-accent-secondary
      );
      --simple-fields-border-color: var(--hax-tray-color-faded);
      --simple-toolbar-focus-z-index: var(--hax-tray-focus-z-index);
    }
    simple-fields *::part(field-desc),
    hax-tray-upload::part(description),
    hax-upload-field::part(description) {
      opacity: 0.7;
      font-size: var(--hax-tray-font-size-xs);
      line-height: 120%;
    }
    simple-fields *:focus-within::part(field-desc),
    hax-upload-field:focus-within::part(description),
    hax-tray-upload:focus-within::part(description) {
      opacity: 1;
    }
    simple-fields-tabs::part(content) {
      padding: var(--hax-tray-spacing-sm) 0 0;
      border: none;
      margin-left: calc(0 - var(--hax-tray-spacing-sm));
      margin-right: calc(0 - var(--hax-tray-spacing-sm));
    }
    simple-fields-tabs::part(tab),
    simple-fields-tabs::part(tab-active),
    simple-fields-tabs::part(tab-disabled),
    hax-preferences-dialog::part(haxlink),
    hax-tray-upload::part(option-icon),
    hax-upload-field::part(option-icon),
    hax-tray-upload::part(option-icon-selected),
    hax-upload-field::part(option-icon-selected) {
      border: 1px solid var(--hax-tray-border-color);
      text-decoration: none;
      border-radius: 3px;
      color: var(--hax-tray-color);
      background-color: var(--hax-tray-background-color);
      outline: unset;
    }
    simple-fields-tabs::part(tab),
    simple-fields-tabs::part(tab-active),
    simple-fields-tabs::part(tab-disabled),
    hax-preferences-dialog::part(haxlink) {
      text-transform: capitalize;
      font-size: var(--hax-tray-font-size-sm);
      padding: var(--hax-tray-spacing-xs);
      flex: 1 1 auto;
    }
    hax-preferences-dialog::part(haxlink) {
      font-size: var(--hax-tray-font-size-xl);
      display: block;
      padding: var(--hax-tray-spacing-lg);
    }
    hax-preferences-dialog::part(haxlink):hover,
    hax-preferences-dialog::part(haxlink):focus,
    simple-fields-tabs::part(tab):hover,
    simple-fields-tabs::part(tab):focus,
    hax-tray-upload::part(option-icon):hover,
    hax-upload-field::part(option-icon):hover,
    hax-tray-upload::part(option-icon):focus,
    hax-upload-field::part(option-icon):focus {
      color: var(--hax-tray-color);
      background-color: var(--hax-tray-background-color-accent);
      border-color: var(--hax-tray-color-accent);
    }
    simple-fields-tabs::part(tab-active),
    hax-tray-upload::part(option-icon-selected),
    hax-upload-field::part(option-icon-selected) {
      background-color: var(--hax-tray-background-color);
      color: var(--hax-tray-color-accent-secondary);
      border-color: var(--hax-tray-color-accent-secondary);
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
    hax-upload-field::part(legend) {
      font-size: var(--hax-tray-font-size-xs);
    }
    hax-tray-upload,
    hax-upload-field {
      color: var(--hax-tray-text-color);
    }
  `,
];
export const HaxTraySimpleTooltip = [
  css`
    :host {
      --simple-tooltip-background: var(--hax-tray-color);
      --simple-tooltip-text-color: var(--hax-tray-background-color);
      --simple-tooltip-opacity: 1;
      --simple-tooltip-delay-in: 0;
      --simple-tooltip-duration-in: 100ms;
      --simple-tooltip-duration-out: 0;
      --simple-tooltip-border-radius: 2px;
      --simple-tooltip-font-size: var(--hax-tray-font-size-sm);
    }
  `,
];
export const HaxTrayDetail = [
  css`
    #tray-detail {
      --hax-tray-detail-title-font-size: var(--hax-tray-font-size-xl);
      --hax-tray-detail-topic-font-size: var(--hax-tray-font-size-lg);
      --hax-tray-detail-subtopic-font-size: var(--hax-tray-font-size);
      --hax-tray-detail-heading-text-transform: capitalize;
      --hax-tray-detail-heading-font-weight: normal;
    }
    #tray-detail h4,
    #tray-detail h5,
    #tray-detail h6 {
      text-transform: var(--hax-tray-detail-heading-text-transform);
      font-weight: var(--hax-tray-detail-heading-font-weight);
      margin: var(--hax-tray-spacing-lg) 0 var(--hax-tray-spacing-xs);
      color: var(--hax-tray-color-accent);
    }
    #tray-detail h4 {
      font-size: var(--hax-tray-detail-title-font-size);
      margin: var(--hax-tray-spacing-sm) 0 var(--hax-tray-spacing-lg);
    }
    #tray-detail h5 {
      font-size: var(--hax-tray-detail-topic-font-size);
    }
    #tray-detail h6 {
      font-size: var(--hax-tray-detail-subtopic-font-size);
    }
    #content-add,
    #tray-detail[selected-detail="content-add"] {
      --hax-tray-color-accent: var(--simple-colors-default-theme-purple-8);
      --hax-tray-color-accent-secondary: var(
        --simple-colors-default-theme-purple-7
      );
      --hax-tray-background-color-accent: var(
        --simple-colors-default-theme-purple-1
      );
    }
    #content-edit,
    #tray-detail[selected-detail="content-edit"] {
      --hax-tray-color-accent: var(--simple-colors-default-theme-pink-8);
      --hax-tray-color-accent-secondary: var(
        --simple-colors-default-theme-pink-7
      );
      --hax-tray-background-color-accent: var(
        --simple-colors-default-theme-pink-1
      );
    }
    #media-add,
    #tray-detail[selected-detail="media-add"] {
      --hax-tray-color-accent: var(--simple-colors-default-theme-indigo-8);
      --hax-tray-color-accent-secondary: var(
        --simple-colors-default-theme-indigo-7
      );
      --hax-tray-background-color-accent: var(
        --simple-colors-default-theme-indigo-1
      );
    }
    #content-map,
    #tray-detail[selected-detail="content-map"] {
      --hax-tray-color-accent: var(--simple-colors-default-theme-light-blue-8);
      --hax-tray-color-accent-secondary: var(
        --simple-colors-default-theme-light-blue-7
      );
      --hax-tray-background-color-accent: var(
        --simple-colors-default-theme-light-blue-1
      );
    }
    #advanced-settings,
    #tray-detail[selected-detail="advanced-settings"] {
      --hax-tray-color-accent: var(--simple-colors-default-theme-green-8);
      --hax-tray-color-accent-secondary: var(
        --simple-colors-default-theme-green-7
      );
      --hax-tray-background-color-accent: var(
        --simple-colors-default-theme-green-2
      );
    }
    @media (prefers-color-scheme: dark) {
      #content-add,
      #tray-detail[selected-detail="content-add"] {
        --hax-tray-color-accent: var(--simple-colors-default-theme-purple-5);
        --hax-tray-color-accent-secondary: var(
          --simple-colors-default-theme-purple-3
        );
        --hax-tray-background-color-accent: #000;
      }
      #content-edit,
      #tray-detail[selected-detail="content-edit"] {
        --hax-tray-color-accent: var(--simple-colors-default-theme-pink-5);
        --hax-tray-color-accent-secondary: var(
          --simple-colors-default-theme-pink-3
        );
        --hax-tray-background-color-accent: #000;
      }
      #media-add,
      #tray-detail[selected-detail="media-add"] {
        --hax-tray-color-accent: var(--simple-colors-default-theme-indigo-5);
        --hax-tray-color-accent-secondary: var(
          --simple-colors-default-theme-indigo-3
        );
        --hax-tray-background-color-accent: #000;
      }
      #content-map,
      #tray-detail[selected-detail="content-map"] {
        --hax-tray-color-accent: var(
          --simple-colors-default-theme-light-blue-5
        );
        --hax-tray-color-accent-secondary: var(
          --simple-colors-default-theme-light-blue-3
        );
        --hax-tray-background-color-accent: #000;
      }
      #advanced-settings,
      #tray-detail[selected-detail="advanced-settings"] {
        --hax-tray-color-accent: var(--simple-colors-default-theme-green-5);
        --hax-tray-color-accent-secondary: var(
          --simple-colors-default-theme-green-3
        );
        --hax-tray-background-color-accent: #000;
      }
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
      color: var(--hax-tray-color-accent);
      text-transform: var(--hax-tray-detail-heading-text-transform);
      font-weight: var(--hax-tray-detail-heading-font-weight);
      margin: var(--hax-tray-spacing-lg) 0 var(--hax-tray-spacing-xs);
    }
  `,
];
export const HaxTrayBaseStyles = [
  ...HaxTrayText,
  ...HaxTraySpacing,
  ...HaxTraySimpleFields,
  ...HaxTraySimpleTooltip,
  ...HaxTrayHexagon,
  ...HaxTrayColors,
];
export const HaxTraySimpleModal = [
  ...HaxTrayBaseStyles,
  css`
    simple-modal-template {
      --simple-modal-z-index: 100000001;
      --simple-modal-titlebar-color: var(--hax-tray-text-color);
      --simple-modal-titlebar-background: var(--hax-tray-color-accent);
      --simple-modal-titlebar-padding: var(--hax-tray-spacing-xs);
      --simple-modal-titlebar-height: calc(
        20px + 2 * var(--hax-tray-spacing-xs)
      );
      --simple-modal-content-container-color: var(--hax-tray-text-color);
      --simple-modal-content-container-background: var(
        --hax-tray-background-color
      );
      --simple-modal-content-padding: var(--hax-tray-spacing-sm) 0px 0px;
      --simple-modal-buttons-background: var(--hax-tray-background-color);
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
