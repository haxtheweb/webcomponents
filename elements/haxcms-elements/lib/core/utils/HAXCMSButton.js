import { LitElement, html, css } from "lit";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-button.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/hax-iconset/lib/simple-hax-iconset.js";
import "@lrnwebcomponents/simple-tooltip/simple-tooltip.js";
import { HAXCMSI18NMixin } from "./HAXCMSI18NMixin.js";
// translation support baked in, use this class to reduce
// complexity in adding new buttons to the HAXcms UI for editors
export class HAXCMSButton extends HAXCMSI18NMixin(LitElement) {
  constructor() {
    super();
    this.icon = "mdextra:hexagon-multiple";
    this.label = "button";
    this.voiceCommand = "";
    this.dark = false;
  }
  static get properties() {
    let props = super.properties || {};
    return {
      ...props,
      icon: { type: String },
      label: { type: String },
      dark: { type: Boolean, reflect: true },
      voiceCommand: { type: String },
    };
  }
  static get styles() {
    let styles = super.styles || [];
    return [
      ...styles,
      css`
        :host {
          display: block;
        }
        simple-icon-button {
          display: block;
          --simple-icon-width: 24px;
          --simple-icon-height: 24px;
          border-radius: 50%;
          border: none;
          background-color: var(--simple-colors-default-theme-accent-1, black);
          color: var(--simple-colors-default-theme-accent-12, white);
          text-align: center;
          line-height: 40px;
          min-width: unset;
          padding: 0;
          margin: 4px 2px;
          width: 40px;
          height: 40px;
          transition: 0.2s all ease-in-out;
          position: relative;
          box-shadow: 0 8px 10px 1px rgba(0, 0, 0, 0.14),
            0 3px 14px 2px rgba(0, 0, 0, 0.12),
            0 5px 5px -3px rgba(0, 0, 0, 0.4);
        }
        simple-icon-button:hover,
        simple-icon-button:focus,
        simple-icon-button:active {
          background-color: var(--haxcms-color);
          color: var(--simple-colors-default-theme-accent-1, white);
        }
        simple-tooltip:not(:defined) {
          display: none !important;
        }
        simple-tooltip {
          --simple-tooltip-background: #000000;
          --simple-tooltip-opacity: 1;
          --simple-tooltip-text-color: #ffffff;
          --simple-tooltip-delay-in: 0;
          --simple-tooltip-duration-in: 200ms;
          --simple-tooltip-duration-out: 0;
          --simple-tooltip-border-radius: 0;
          --simple-tooltip-font-size: 14px;
          --simple-tooltip-width: 145px;
        }
      `,
    ];
  }
  HAXCMSButtonClick(e) {
    // stub, the classes implementing this will actually do something
  }

  renderButton(label, tooltip) {
    return html`
      <simple-icon-button
        id="button"
        label="${label}"
        @click="${this.HAXCMSButtonClick}"
        ?dark="${this.dark}"
        icon="${this.icon}"
        voice-command="${this.voiceCommand}"
      ></simple-icon-button>
      <simple-tooltip for="button" position="right" offset="14">
        ${tooltip}
      </simple-tooltip>
    `;
  }
}
