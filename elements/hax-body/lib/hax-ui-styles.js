import { css } from "lit-element/lit-element.js";

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
      --hax-tray-background-color-tertiary: #b0b8bb;
      --hax-tray-background-color-accent: #ddf8ff;

      --hax-tray-border-color: #ddd;

      --hax-tray-danger-color: #ee0000;
      --hax-tray-danger-color-secondary: #850000;
      --hax-tray-danger-color-contrast: #ffdddd;

      --hax-tray-accent-color: #009dc7;
      --hax-tray-accent-color-secondary: #007999;
    }
    @media (prefers-color-scheme: dark) {
      :host {
        --hax-tray-color: #eeeae6;
        --hax-tray-color-focus: #fff;
        --hax-tray-color-faded: #c5c3be;

        --hax-tray-background-color: #333;
        --hax-tray-background-color-secondary: #111;
        --hax-tray-background-color-tertiary: #222;

        --hax-tray-border-color: #000;

        --hax-tray-danger-color: #ff8f8f;
        --hax-tray-danger-color-secondary: #ff2222;
        --hax-tray-danger-color-contrast: #000;

        --hax-tray-accent-color: #77e2ff;
        --hax-tray-accent-color-secondary: #00c9ff;
        --hax-tray-background-color-accent: #000;
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
      padding: var(--hax-tray-spacing);
      color: var(--hax-tray-color);
      background-color: var(--hax-tray-background-color);
      border: var(--hax-tray-border-width) var(--hax-tray-border-style)
        var(--hax-tray-border-color);
    }
    :host(:hover) button[part="button"],
    :host(:focus-within) button[part="button"] {
      color: var(--hax-tray-color);
      background-color: var(--hax-tray-background-color-accent);
      border-color: var(--hax-tray-accent-color);
    }
    button[part="button"][aria-pressed="true"] {
      color: var(--hax-tray-accent-color-secondary);
      border-color: var(--hax-tray-accent-color-secondary);
    }
    :host([feature]) button[part="button"],
    :host([danger]) button[part="button"] {
      color: var(--hax-tray-background-color-secondary);
    }
    :host([feature]) button[part="button"] {
      background-color: var(--hax-tray-accent-color);
      border-color: var(--hax-tray-accent-color);
    }
    :host([danger]) button[part="button"] {
      background-color: var(--hax-tray-danger-color);
      border-color: var(--hax-tray-danger-color);
    }
    :host([feature]) button[part="button"][aria-pressed="true"],
    :host([danger]) button[part="button"][aria-pressed="true"] {
      color: var(--hax-tray-background-color);
    }
    :host([feature]) button[part="button"][aria-pressed="true"] {
      background-color: var(--hax-tray-accent-color-secondary);
      border-color: var(--hax-tray-accent-color);
    }
    :host([danger]) button[part="button"][aria-pressed="true"] {
      background-color: var(--hax-tray-danger-color-secondary);
      border-color: var(--hax-tray-danger-color);
    }
    :host([feature]:hover) button[part="button"],
    :host([feature]:focus-within) button[part="button"],
    :host([danger]:hover) button[part="button"],
    :host([danger]:focus-within) button[part="button"] {
      color: var(--hax-tray-background-color);
    }
    :host([feature]:hover) button[part="button"],
    :host([feature]:focus-within) button[part="button"] {
      background-color: var(--hax-tray-accent-color-secondary);
      border-color: var(--hax-tray-accent-color-secondary);
    }
    :host([danger]:hover) button[part="button"],
    :host([danger]:focus-within) button[part="button"] {
      background-color: var(--hax-tray-danger-color-secondary);
      border-color: var(--hax-tray-danger-color-secondary);
    }
    :host([large]) button[part="button"] {
      font-size: var(--hax-tray-font-size);
      padding: var(--hax-tray-spacing);
      border-width: 2px;
    }
    :host([disabled]) button[part="button"][disabled] {
      opacity: 0.5;
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
      --hexagon-color: var(--hax-tray-accent-color);
    }
    hexagon-loader[loading] {
      display: block;
      opacity: 0.8;
    }
  `,
];

export const HaxTraySimpleFields = [
  css`
    simple-fields,
    #tray-detail * {
      --simple-fields-field-margin: calc(2 * var(--hax-tray-font-size));
      --simple-fields-font-size: var(--hax-tray-font-size);
      --simple-fields-line-height: 135%;
      --simple-fields-detail-font-size: var(--hax-tray-font-size-sm);
      --simple-fields-detail-line-height: 120%;
      --simple-fields-meta-font-size: var(--hax-tray-font-size-xs);
      --simple-fields-meta-line-height: 120%;
      --simple-fields-margin: var(--hax-tray-spacing);
      --simple-fields-font-family: var(--hax-tray-font-family);
      --simple-fields-color: var(--hax-tray-text-color);
      --simple-fields-accent-color: var(--hax-tray-accent-color);
      --simple-fields-error-color: var(--hax-tray-danger-color-secondary);
      --simple-fields-secondary-accent-color: var(
        --hax-tray-accent-color-secondary
      );
      --simple-fields-border-color: var(--hax-tray-color-faded);
      --simple-toolbar-focus-z-index: var(--hax-tray-focus-z-index);
      --a11y-tabs-horizontal-background: var(--a11y-tabs-background);
      --a11y-tabs-horizontal-button-padding: var(--hax-tray-spacing-xs);
      --a11y-tabs-border-radius: 3px;
      --a11y-tabs-horizontal-border-radius: var(--a11y-tabs-border-radius);
      --a11y-tabs-vertical-border-radius: var(--a11y-tabs-border-radius);
      --a11y-tabs-content-padding: var(--hax-tray-spacing);
      --a11y-tabs-button-padding: var(--hax-tray-spacing-xs);
      --a11y-tabs-vertical-button-padding: var(--hax-tray-spacing-xs);
      --a11y-tabs-border-color: transparent;
      --a11y-tabs-faded-background: var(--hax-tray-background-color-tertiary);
      --a11y-tabs-faded-color: var(--hax-tray-color-focus);
      --a11y-tabs-disabled-background: transparent;
      --a11y-tabs-disabled-color: var(--hax-tray-border-color);
      --a11y-tabs-border-accent: transparent;
      /*--a11y-tabs-color: var(--hax-tray-color-faded);
      --a11y-tabs-focus-color: var(--hax-tray-accent-color);
      ;*/
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
    #tray-detail h4 {
      font-size: var(--hax-tray-detail-title-font-size);
    }
    #tray-detail h5 {
      font-size: var(--hax-tray-detail-topic-font-size);
    }
    #tray-detail h6 {
      font-size: var(--hax-tray-detail-subtopic-font-size);
    }
    #tray-detail h4,
    #tray-detail h5,
    #tray-detail h6 {
      text-transform: var(--hax-tray-detail-heading-text-transform);
      font-weight: var(--hax-tray-detail-heading-font-weight);
      margin: var(--hax-tray-spacing-sm) 0 var(--hax-tray-spacing-xs);
      color: var(--hax-tray-accent-color);
    }
    #content-add,
    #tray-detail[selected-detail="content-add"] {
      --hax-tray-accent-color: var(--simple-colors-default-theme-purple-8);
      --hax-tray-accent-color-secondary: var(
        --simple-colors-default-theme-purple-7
      );
      --hax-tray-background-color-accent: var(
        --simple-colors-default-theme-purple-1
      );
    }
    #content-edit,
    #tray-detail[selected-detail="content-edit"] {
      --hax-tray-accent-color: var(--simple-colors-default-theme-pink-8);
      --hax-tray-accent-color-secondary: var(
        --simple-colors-default-theme-pink-7
      );
      --hax-tray-background-color-accent: var(
        --simple-colors-default-theme-pink-1
      );
    }
    #media-add,
    #tray-detail[selected-detail="media-add"] {
      --hax-tray-accent-color: var(--simple-colors-default-theme-indigo-8);
      --hax-tray-accent-color-secondary: var(
        --simple-colors-default-theme-indigo-7
      );
      --hax-tray-background-color-accent: var(
        --simple-colors-default-theme-indigo-1
      );
    }
    #content-map,
    #tray-detail[selected-detail="content-map"] {
      --hax-tray-accent-color: var(--simple-colors-default-theme-light-blue-8);
      --hax-tray-accent-color-secondary: var(
        --simple-colors-default-theme-light-blue-7
      );
      --hax-tray-background-color-accent: var(
        --simple-colors-default-theme-light-blue-1
      );
    }
    #advanced-settings,
    #tray-detail[selected-detail="advanced-settings"] {
      --hax-tray-accent-color: var(--simple-colors-default-theme-green-8);
      --hax-tray-accent-color-secondary: var(
        --simple-colors-default-theme-green-7
      );
      --hax-tray-background-color-accent: var(
        --simple-colors-default-theme-green-2
      );
    }
    @media (prefers-color-scheme: dark) {
      #content-add,
      #tray-detail[selected-detail="content-add"] {
        --hax-tray-accent-color: var(--simple-colors-default-theme-purple-5);
        --hax-tray-accent-color-secondary: var(
          --simple-colors-default-theme-purple-3
        );
        --hax-tray-background-color-accent: #000;
      }
      #content-edit,
      #tray-detail[selected-detail="content-edit"] {
        --hax-tray-accent-color: var(--simple-colors-default-theme-pink-5);
        --hax-tray-accent-color-secondary: var(
          --simple-colors-default-theme-pink-3
        );
        --hax-tray-background-color-accent: #000;
      }
      #media-add,
      #tray-detail[selected-detail="media-add"] {
        --hax-tray-accent-color: var(--simple-colors-default-theme-indigo-5);
        --hax-tray-accent-color-secondary: var(
          --simple-colors-default-theme-indigo-3
        );
        --hax-tray-background-color-accent: #000;
      }
      #content-map,
      #tray-detail[selected-detail="content-map"] {
        --hax-tray-accent-color: var(
          --simple-colors-default-theme-light-blue-5
        );
        --hax-tray-accent-color-secondary: var(
          --simple-colors-default-theme-light-blue-3
        );
        --hax-tray-background-color-accent: #000;
      }
      #advanced-settings,
      #tray-detail[selected-detail="advanced-settings"] {
        --hax-tray-accent-color: var(--simple-colors-default-theme-green-5);
        --hax-tray-accent-color-secondary: var(
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
      color: var(--hax-tray-accent-color);
      text-transform: var(--hax-tray-detail-heading-text-transform);
      font-weight: var(--hax-tray-detail-heading-font-weight);
      margin: var(--hax-tray-spacing-sm) 0 var(--hax-tray-spacing-xs);
    }
  `,
];
export const HaxTraySimpleModal = [
  css`
    simple-modal-template {
      display: none;
      --simple-modal-z-index: 100000001;
      --simple-modal-titlebar-color: var(--hax-tray-text-color);
      --simple-modal-titlebar-background: var(--hax-background-color-secondary);
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
export const HaxTrayBaseStyles = [
  ...HaxTrayText,
  ...HaxTraySpacing,
  ...HaxTraySimpleFields,
  ...HaxTraySimpleTooltip,
  ...HaxTrayHexagon,
  ...HaxTrayColors,
];
