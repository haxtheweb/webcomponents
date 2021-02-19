import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/simple-modal/lib/simple-modal-template.js";
import "./hax-picker.js";
/**
 * `hax-app-picker`
 * `app pop over + picker with options`
 */
class HaxAppPicker extends LitElement {
  static get styles() {
    return [
      css`
        simple-modal-template {
          display: none;
          --simple-modal-z-index: 100000001;
          --simple-modal-titlebar-color: var(--hax-tray-text-color, black);
          --simple-modal-titlebar-background: var(
            --hax-titlebar-background-color,
            #f0f4f8
          );
          --simple-modal-titlebar-padding: var(--hax-tray-spacing-sm);
          --simple-modal-titlebar-height: calc(
            20px + 2 * var(--hax-tray-spacing-sm)
          );
          --simple-modal-content-container-color: var(
            --hax-tray-text-color,
            black
          );
          --simple-modal-content-container-background: var(
            --hax-tray-background-color,
            #fff
          );
          --simple-modal-content-padding: calc(2 * var(--hax-tray-spacing-sm))
            0px 0px;
          --simple-modal-buttons-background: var(
            --hax-tray-background-color,
            #fff
          );
        }
      `,
    ];
  }
  constructor() {
    super();
    this.title = "Select an option";
  }
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("simple-modal-show", this.modalToggle.bind(this));
  }
  disconnectedCallback() {
    window.removeEventListener(
      "simple-modal-show",
      this.modalToggle.bind(this)
    );
    super.disconnectedCallback();
  }
  /**
   * a bit hacky but gets around the cloning element and events issue
   */
  modalToggle(e) {
    if (e.detail.id == "hax-picker") {
      // present options AFTER we know the picker has opened :)
      e.detail.elements.content.children[0].buildOptions(
        this.elements,
        this.type,
        this.title,
        this.pickerType,
        this.target
      );
    }
  }
  static get properties() {
    return {
      /**
       * Title for the dialog
       */
      title: {
        type: String,
      },
    };
  }
  /**
   * Bridge since everything calls here
   */
  presentOptions(
    elements,
    type = "element",
    title = "Select an option",
    pickerType = "gizmo",
    target = window
  ) {
    this.elements = elements;
    this.type = type;
    this.title = title;
    this.pickerType = pickerType;
    this.target = target;
    setTimeout(() => {
      this.shadowRoot
        .querySelector('[modal-id="hax-picker"]')
        .openModal(target);
    }, 0);
  }
  render() {
    return html`
      <simple-modal-template .title="${this.title}" modal-id="hax-picker">
        <hax-picker slot="content"></hax-picker>
      </simple-modal-template>
    `;
  }
  static get tag() {
    return "hax-app-picker";
  }
  /**
   * Attached to the DOM, now fire that we exist.
   */
  firstUpdated() {
    // fire an event that this is a core piece of the system
    this.dispatchEvent(
      new CustomEvent("hax-register-core-piece", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: {
          piece: "haxAppPicker",
          object: this,
        },
      })
    );
  }
}
window.customElements.define(HaxAppPicker.tag, HaxAppPicker);
export { HaxAppPicker };
