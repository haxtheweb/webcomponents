import { LitElement, html, css, unsafeCSS } from "lit";
import "@haxtheweb/simple-icon/lib/simple-icon-button.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/hax-iconset/lib/simple-hax-iconset.js";
import "@haxtheweb/simple-tooltip/simple-tooltip.js";
import { HAXCMSI18NMixin } from "./HAXCMSI18NMixin.js";
import { HAXCMSThemeParts } from "./HAXCMSThemeParts.js";
const ButtonBGLight = new URL(
  "../../../../app-hax/lib/assets/images/ButtonBGLM.svg",
  import.meta.url,
).href;
const ButtonBGDark = new URL(
  "../../../../app-hax/lib/assets/images/ButtonBGDM.svg",
  import.meta.url,
).href;

// translation support baked in, use this class to reduce
// complexity in adding new buttons to the HAXcms UI for editors
export class HAXCMSButton extends HAXCMSThemeParts(
  HAXCMSI18NMixin(LitElement),
) {
  constructor() {
    super();
    this.icon = null;
    this.label = "";
    this.voiceCommand = "";
  }
  static get properties() {
    return {
      ...super.properties,
      icon: { type: String },
      label: { type: String },
      voiceCommand: { type: String },
    };
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
