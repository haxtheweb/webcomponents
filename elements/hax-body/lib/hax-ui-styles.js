import { css, html, LitElement } from "lit";

export const HaxUiText = [
  css`
    body {
      --hax-ui-font-family: var(--ddd-font-navigation);
      --hax-ui-font-size-xs: 12px;
      --hax-ui-font-size-sm: 14px;
      --hax-ui-font-size: 16px;
      --hax-ui-font-size-lg: 18px;
      --hax-ui-font-size-xl: 24px;
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
      --hax-ui-border-radius: 4px;
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

      /* beaverBlue keeps 4.5:1 contrast both as white-text background and
         as text on white (skyBlue failed at 3.08:1) */
      --hax-ui-color-accent: var(--ddd-theme-default-beaverBlue, #1e407c);
      --hax-ui-color-accent-secondary: #007999;
      --hax-ui-background-color-accent: #e5f6fd;

      --hax-ui-color-danger: #ee0000;
      --hax-ui-color-danger-secondary: #850000;
      --hax-ui-background-color-danger: #fdeded;

      --hax-ui-border-color: #ddd;
    }
    body[hax-ui-theme="haxdark"] {
      --hax-ui-color: #eeeae6;
      --hax-ui-color-focus: #fff;
      --hax-ui-color-faded: #c5c3be;

      --hax-ui-background-color: #111;
      --hax-ui-background-color-secondary: #111;
      --hax-ui-background-color-faded: #222;

      /* light cyan keeps 4.5:1 on dark backgrounds in both accent roles */
      --hax-ui-color-accent: #00c9ff;
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

        /* light cyan keeps 4.5:1 on dark backgrounds in both accent roles */
        --hax-ui-color-accent: #00c9ff;
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
      --simple-tooltip-duration-in: 300ms;
      --simple-tooltip-duration-out: 0;
      --simple-tooltip-border-radius: 2px;
      --simple-tooltip-font-size: var(--hax-ui-font-size-xs);
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
      --simple-fields-button-disabled-opacity: var(
        --ddd-state-disabled-opacity,
        0.5
      );
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
      --simple-modal-height: 80vh;
      --simple-modal-width: 80vw;
      --simple-popover-background-color: light-dark(
        var(--ddd-primary-4),
        var(--ddd-accent-6)
      );
      --simple-popover-padding: var(--hax-ui-spacing);
      --simple-popover-border-color: light-dark(
        var(--ddd-accent-6),
        var(--ddd-primary-4)
      );
      --simple-popover-color: light-dark(
        var(--ddd-accent-6),
        var(--ddd-primary-4)
      );
      --simple-modal-border-color: var(--hax-ui-color);
    }
    rich-text-editor-prompt {
      z-index: calc(var(--hax-ui-focus-z-index) - 1);
    }
    /* the link prompt themes itself with light-dark(), so pin its scheme to
       the HAX UI theme instead of the OS preference */
    body[hax-ui-theme="hax"] rich-text-editor-prompt {
      color-scheme: light;
    }
    body[hax-ui-theme="haxdark"] rich-text-editor-prompt {
      color-scheme: dark;
    }
    simple-modal[mode="hax-ui"]::part(dialog) {
      --simple-modal-z-index: 100000001 !important;
    }
    simple-modal[opened] {
      z-index: 100000001 !important;
      position: fixed;
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
    simple-popover-manager[mode="hax"]::part(simple-popover-nav) {
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
      opacity: var(--ddd-state-disabled-opacity, 0.5);
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
      opacity: var(--ddd-opacity-80, 0.8);
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
      opacity: var(--ddd-state-disabled-opacity, 0.5);
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
      margin: 0;
      padding: var(--ddd-spacing-2);
      width: stretch;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      height: 32px;
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
globalThis.customElements.define(HaxUiStyles.tag, HaxUiStyles);
