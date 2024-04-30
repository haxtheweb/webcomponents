import { css, html, LitElement } from "lit";

export const HaxUiText = [
  css`
    body {
      --hax-ui-font-family: var(--ddd-font-navigation);
      --hax-ui-font-size-xs: 11px;
      --hax-ui-font-size-sm: 13px;
      --hax-ui-font-size: 16px;
      --hax-ui-font-size-lg: 16px;
      --hax-ui-font-size-xl: 20px;
    }
  `,
];
export const HaxUiSpacing = [
  css`
    body {
      --hax-tray-width: 350px;
      --hax-tray-menubar-min-width: 44px;
      --hax-tray-menubar-min-height: 34px;
      --hax-ui-spacing-xs: 4px;
      --hax-ui-border-radius: 2px;
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
    body {
      --hax-ui-color: #222;
      --hax-ui-color-focus: #000;
      --hax-ui-color-faded: #444;
      --hax-ui-disabled-color: #bbb;

      --hax-ui-background-color: #fff;
      --hax-ui-background-color-secondary: #e8e8e8;
      --hax-ui-background-color-faded: #b0b8bb;

      --hax-ui-color-accent: #009dc7;
      --hax-ui-color-accent-secondary: #007999;
      --hax-ui-background-color-accent: #ccf3fd;

      --hax-ui-color-danger: #ee0000;
      --hax-ui-color-danger-secondary: #850000;
      --hax-ui-background-color-danger: #ffdddd;

      --hax-ui-border-color: #ddd;
    }
    body[hax-ui-theme="haxdark"] {
      --hax-ui-color: #eeeae6;
      --hax-ui-color-focus: #fff;
      --hax-ui-color-faded: #c5c3be;
      --hax-ui-disabled-color: #666;

      --hax-ui-background-color: #111;
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

    @media (prefers-color-scheme: dark) {
      body[hax-ui-theme="system"] {
        --hax-ui-color: #eeeae6;
        --hax-ui-color-focus: #fff;
        --hax-ui-color-faded: #c5c3be;

        --hax-ui-background-color: #111;
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
export const HaxUiTooltip = [
  css`
    body {
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
export const HaxUiFields = [
  css`
    body {
      --simple-fields-field-margin: calc(2 * var(--hax-ui-font-size));
      --simple-toolbar-focus-z-index: var(--hax-ui-focus-z-index);
      --simple-fields-font-family: var(--hax-ui-font-family);
      --simple-fields-font-size: var(--hax-ui-font-size);
      --simple-fields-line-height: 135%;
      --simple-fields-detail-font-size: var(--hax-ui-font-size-sm);
      --simple-fields-detail-line-height: 120%;
      --simple-fields-margin: var(--hax-ui-spacing);
      --simple-fields-background-color: var(--hax-ui-background-color);
      --simple-fields-color: var(--hax-ui-color);
      --simple-picker-option-active-color: var(--hax-ui-color);
      --simple-picker-color-active: var(--hax-ui-color);
      --simple-picker-color: var(--hax-ui-color);
      --simple-fields-accent-color: var(--hax-ui-color-accent);
      --simple-fields-accent-color-light: var(--hax-ui-background-color-faded);
      --simple-fields-error-color: var(--hax-ui-color-danger-secondary);
      --simple-fields-button-danger-background-color: var(
        --hax-ui-color-danger
      );
      --simple-fields-button-danger-focus-color: var(
        --hax-ui-color-danger-secondary
      );
      --simple-fields-button-danger-background-color: var(
        --hax-ui-background-color
      );
      --simple-fields-secondary-accent-color: var(
        --hax-ui-color-accent-secondary
      );
      --simple-fields-border-color: var(--hax-ui-color-faded);

      --simple-fields-fieldset-border-color: rgba(127, 127, 127, 0.2);
      --simple-fields-legend-text-transform: capitalize;
      --simple-fields-legend-font-size: var(--hax-ui-font-size-xs);

      --simple-fields-meta-font-size: var(--hax-ui-font-size-xs);
      --simple-fields-meta-line-height: 120%;
      --simple-fields-meta-opacity: 0.7;
      --simple-fields-focus-meta-opacity: 1;

      --simple-fields-button-color: var(--hax-ui-color);
      --simple-fields-button-background-color: var(--hax-ui-background-color);
      --simple-fields-button-border-color: var(--hax-ui-border-color);
      --simple-fields-button-text-transform: capitalize;
      --simple-fields-border-radius: var(--hax-ui-border-radius);
      --simple-fields-button-padding-sm: var(--hax-ui-spacing-sm);
      --simple-fields-button-padding: var(--hax-ui-spacing-sm);

      --simple-fields-button-toggled-color: var(--hax-ui-color);
      --simple-fields-button-toggled-background-color: var(
        --hax-ui-background-color-accent
      );
      --simple-fields-button-toggled-border-color: var(--hax-ui-color-accent);

      --simple-fields-button-focus-color: var(--hax-ui-color);
      --simple-fields-button-focus-background-color: var(
        --hax-ui-background-color-accent
      );
      --simple-fields-button-focus-border-color: var(--hax-ui-color-accent);

      --simple-fields-button-disabled-color: unset;
      --simple-fields-button-disabled-background-color: unset;
      --simple-fields-button-disabled-border-color: unset;
      --simple-fields-button-disabled-opacity: 0.5;
      --hexagon-color: var(--hax-ui-color-accent);
    }
  `,
];

export const HaxUiSingletons = [
  css`
    simple-modal[mode="hax-ui"],
    simple-popover-manager[mode="hax"] {
      font-family: var(--hax-ui-font-family);
      font-size: var(--hax-ui-font-size);
      --simple-modal-height: 70vh;
      --simple-modal-width: 70vw;
      --simple-popover-border-color: var(--hax-ui-color);
      --simple-modal-border-color: var(--hax-ui-color);
    }
    rich-text-editor-prompt {
      z-index: calc(var(--hax-ui-focus-z-index) - 1);
    }
    simple-modal[mode="hax-ui"]::part(dialog) {
      --simple-modal-z-index: 100000001 !important;
    }
    simple-modal[opened] {
      z-index: 100000001 !important;
    }
    simple-modal[mode="hax-ui"]::part(titlebar),
    simple-popover-manager[mode="hax"]::part(simple-popover-heading),
    simple-popover-manager[mode="hax"] h1[slot="heading"] {
      color: var(--hax-ui-background-color);
      background-color: var(--hax-ui-color-accent);
      padding: var(--hax-ui-spacing-sm) var(--hax-ui-spacing);
      margin: 0;
    }
    simple-modal[mode="hax-ui"]::part(close),
    simple-popover-manager[mode="hax"] #close {
      color: var(--hax-ui-background-color);
      background-color: var(--hax-ui-color-accent);
      outline: 1px solid var(--hax-ui-color-accent);
      --simple-icon-button-border: 0px solid transparent;
      --simple-icon-button-border-radius: var(--hax-ui-border-radius);
      width: 24px;
      height: 24px;
      padding: 0;
    }
    simple-modal[mode="hax-ui"]:focus-within::part(close),
    simple-modal[mode="hax-ui"]:hover::part(close),
    simple-popover-manager[mode="hax"] #close:focus,
    simple-popover-manager[mode="hax"] #close:hover {
      background-color: var(--hax-ui-color-accent-secondary);
      --simple-icon-button-border: 0px solid transparent;
    }
    simple-modal[mode="hax-ui"]::part(title),
    simple-popover-manager[mode="hax"] h1 {
      font-family: var(--hax-ui-font-family);
      font-size: var(--hax-ui-font-size);
      font-weight: normal;
      margin: 0 var(--hax-ui-spacing-sm) 0 0;
      padding: 0;
    }
    simple-popover-manager[mode="hax"] h2 {
      font-family: var(--hax-ui-font-family);
      font-size: var(--hax-ui-font-size-lg);
      font-weight: normal;
      color: var(--hax-ui-color-accent-secondary);
      margin: 0 0 var(--hax-ui-spacing-lg);
    }
    simple-modal[mode="hax-ui"]::part(content),
    simple-modal[mode="hax-ui"]::part(custom),
    simple-popover-manager[mode="hax"]::part(simple-popover-body) {
      font-size: var(--hax-ui-font-size);
      color: var(--hax-ui-color);
      background-color: var(--hax-ui-background-color);
    }
    simple-modal[mode="hax-ui"]::part(content) {
      padding: 0 var(--hax-ui-spacing);
    }
    simple-modal[mode="hax-ui"]::part(custom) {
      padding: 0;
    }
    simple-popover-manager[mode="hax"]::part(simple-popover-body) {
      padding: var(--hax-ui-spacing);
    }
    simple-modal[mode="hax-ui"]::part(buttons),
    simple-popover-manager[mode="hax"]:part(simple-popover-nav) {
      background-color: var(--hax-ui-background-color);
    }
    #hax-cancel-no,
    #hax-cancel-yes {
      flex: 1 1 auto;
    }
    simple-popover-manager[mode="hax"]
      simple-icon-button-lite[slot="nav"]::part(button) {
      text-transform: capitalize;
      font-size: var(--hax-ui-font-size-sm);
      padding: var(--hax-ui-spacing-sm);
      color: var(--hax-ui-color);
      background-color: var(--hax-ui-background-color);
      border: 1px solid var(--hax-ui-border-color);
      border-radius: var(--hax-ui-border-radius);
      background-color: var(--hax-ui-background-color);
    }
    simple-popover-manager[mode="hax"]
      simple-icon-button-lite[slot="nav"]::part(button):hover,
    simple-popover-manager[mode="hax"]
      simple-icon-button-lite[slot="nav"]::part(button):focus-within {
      color: var(--hax-ui-color);
      background-color: var(--hax-ui-background-color-accent);
      border-color: var(--hax-ui-color-accent);
    }
    simple-popover-manager[mode="hax"]
      simple-icon-button-lite[slot="nav"][disabled]::part(button) {
      opacity: 0.5;
      border: 1px solid var(--hax-ui-border-color);
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
  ...HaxUiSingletons,
  ...HaxUiColors,
];
export const HaxHexagon = [
  css`
    hexagon-loader {
      display: none;
      margin: 0 auto;
      z-index: 1000;
    }
    hexagon-loader[loading] {
      display: block;
      opacity: 0.8;
    }
  `,
];
export const HaxButton = [
  css`
    :host[aria-expanded="true"] {
      border: 1px solid var(--hax-ui-border-color);
    }
    absolute-position-behavior {
      border-color: transparent;
      color: var(--hax-ui-color);
      background-color: var(--hax-ui-background-color);
    }
    :host([expanded]) absolute-position-behavior {
      border: 1px solid var(--hax-ui-border-color);
    }
    button[part="button"] {
      text-transform: capitalize;
      font-size: var(--hax-ui-font-size-sm);
      padding: var(--hax-ui-spacing-sm);
      color: var(--hax-ui-color);
      background-color: var(--hax-ui-background-color);
      border: 1px solid var(--hax-ui-border-color);
      border-radius: var(--hax-ui-border-radius);
    }
    :host([role="menuitem"]) button[part="button"] {
      padding: 1px;
      border-color: transparent;
    }
    :host(:hover) button[part="button"] {
      background-color: var(--hax-ui-background-color-secondary);
      color: var(--hax-ui-color);
    }
    :host([toggled]) button[part="button"],
    button[part="button"][aria-pressed="true"] {
      color: var(--hax-ui-color-accent);
      border-color: var(--hax-ui-color-accent);
    }
    button[part="button"][aria-pressed="true"]:hover,
    :host([toggled]:hover) button[part="button"] {
      background-color: var(--hax-ui-background-color-accent);
    }
    :host([feature]) button[part="button"],
    :host([danger]) button[part="button"] {
      color: var(--hax-ui-background-color);
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
      opacity: 1;
      color: var(--hax-ui-disabled-color);
      border: 1px solid var(--hax-ui-border-color);
    }

    *[show-text-label]::part(label) {
      text-transform: capitalize;
      margin: var(--hax-ui-spacing-sm);
    }
  `,
];
export const HaxFields = [
  css`
    simple-fields-tabs {
      padding: 0;
      border: none;
      margin-left: calc(0 - var(--hax-ui-spacing-sm));
      margin-right: calc(0 - var(--hax-ui-spacing-sm));
    }
    simple-fields-tabs::part(tablist) {
      margin-bottom: var(--hax-ui-spacing);
    }
    simple-fields-tabs::part(tab),
    simple-fields-tabs::part(tab-active),
    simple-fields-tabs::part(tab-disabled) {
      border: 1px solid var(--hax-ui-border-color);
      text-decoration: none;
      border-radius: 3px;
      color: var(--hax-ui-color);
      background-color: var(--hax-ui-background-color);
      outline: unset;
      text-transform: capitalize;
      font-size: var(--hax-ui-font-size-sm);
      padding: var(--hax-ui-spacing-xs);
      flex: 1 1 auto;
    }
    simple-fields-tabs::part(tab-active) {
      color: var(--hax-ui-color-accent);
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
    simple-fields *::part(label) {
      text-transform: captitalize;
      margin: 0;
    }
  `,
];

/**
 * styles that need to be in the shadowRoot of their parent
 */
export const HaxComponentStyles = [...HaxButton, ...HaxHexagon, ...HaxFields];
export const HaxTrayDetail = [
  css`
    #tray-detail {
      font-family: var(--hax-ui-font-family);
      --hax-tray-detail-title-font-size: var(--hax-ui-font-size-xl);
      --hax-tray-detail-topic-font-size: var(--hax-ui-font-size-lg);
      --hax-tray-detail-subtopic-font-size: var(--hax-ui-font-size);
      --hax-tray-detail-heading-text-transform: capitalize;
      --hax-tray-detail-heading-font-weight: normal;
    }
    #tray-detail h5,
    #tray-detail h6 {
      text-transform: var(--hax-tray-detail-heading-text-transform);
      font-weight: var(--hax-tray-detail-heading-font-weight);
      margin: var(--hax-ui-spacing) 0 var(--hax-ui-spacing-xs);
      color: var(--hax-ui-color-faded);
    }
    #tray-detail h4 {
      text-transform: var(--hax-tray-detail-heading-text-transform);
      color: white;
      font-size: var(--hax-tray-detail-title-font-size);
      font-weight: bold;
      font-family: var(--hax-ui-font-family);
      overflow: hidden;
      word-break: break-all;
      text-overflow: ellipsis;
      margin: 0 -8px;
      padding: var(--ddd-spacing-3);
      padding-top: var(--ddd-spacing-4);
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      height: 36px;
      top: 0;
      z-index: 3;
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
    h5 {
      font-size: var(--hax-tray-detail-topic-font-size);
    }
    h6 {
      font-size: var(--hax-tray-detail-subtopic-font-size);
    }
    h5,
    h6 {
      color: var(--hax-ui-color-faded);
      text-transform: var(--hax-tray-detail-heading-text-transform);
      font-weight: var(--hax-tray-detail-heading-font-weight);
      margin: var(--hax-ui-spacing-lg) 0 var(--hax-ui-spacing-xs);
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
    return HaxComponentStyles;
  }
  render() {
    return html`<slot></slot>`;
  }
  static get tag() {
    return "hax-ui-styles";
  }
}
customElements.define(HaxUiStyles.tag, HaxUiStyles);
