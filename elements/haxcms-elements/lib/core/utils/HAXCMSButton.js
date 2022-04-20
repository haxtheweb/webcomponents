import { LitElement, html, css, unsafeCSS } from "lit";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-button.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/hax-iconset/lib/simple-hax-iconset.js";
import "@lrnwebcomponents/simple-tooltip/simple-tooltip.js";
import { HAXCMSI18NMixin } from "./HAXCMSI18NMixin.js";
import { HAXCMSThemeParts } from "./HAXCMSThemeParts.js";
const ButtonBGLight = new URL('../../../../app-hax/lib/assets/images/ButtonBGLM.svg', import.meta.url).href;
const ButtonBGDark = new URL('../../../../app-hax/lib/assets/images/ButtonBGDM.svg', import.meta.url).href;

// translation support baked in, use this class to reduce
// complexity in adding new buttons to the HAXcms UI for editors
export class HAXCMSButton extends HAXCMSThemeParts(
  HAXCMSI18NMixin(LitElement)
) {
  constructor() {
    super();
    this.icon = "mdextra:hexagon-multiple";
    this.label = "button";
    this.voiceCommand = "";
  }
  static get properties() {
    return {
      ...super.properties,
      icon: { type: String },
      label: { type: String },
      voiceCommand: { type: String },
      accentColor: { type: String, attribute: "accent-color"},
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
          --simple-icon-width: 24px;
          --simple-icon-height: 24px;
          border-radius: 50%;
          border: none;
          background-image: url('${unsafeCSS(ButtonBGLight)}');
          background-color: var(--simple-colors-default-theme-accent-5, blue);
          color: var(--simple-colors-default-theme-accent-12, white);
          text-align: center;
          line-height: 40px;
          min-width: unset;
          padding: 0;
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
          opacity: .8;
        }
        :host([dark-mode]) simple-icon-button {
          background-image: url('${unsafeCSS(ButtonBGDark)}');
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
        }
      `,
    ];
  }
  // wrapper on CustomEvent so we include the payload as these are listened for on window
  HAXCMSFireButtonEvent(name, target, payload) {
    // send message off so that the control board hands it off to the CMS
    const evt = new CustomEvent(name, {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: {
        originalTarget: target,
        values: payload,
      },
    });
    this.dispatchEvent(evt);
  }
  // this ensures data binding doesn't fail
  HAXCMSButtonClick(e) {
    // stub, the classes implementing this will actually do something
    // you always will call super.HAXCMS
  }

  renderButton(label, tooltip) {
    return html`
      <simple-icon-button
        .part="${this.editMode ? `edit-mode-active` : ``}"
        tabindex="${this.editMode ? "-1" : ""}"
        id="button"
        label="${label}"
        @click="${this.HAXCMSButtonClick}"
        ?dark="${!this.darkMode}"
        icon="${this.icon}"
        accent-color="${this.accentColor}"
        voice-command="${this.voiceCommand}"
      ></simple-icon-button>
      <simple-tooltip for="button" position="bottom" offset="14">
        ${tooltip}
      </simple-tooltip>
    `;
  }
}
