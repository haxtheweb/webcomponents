import { html, css, LitElement } from "lit";
import { HaxToolbarItemBehaviors } from "@haxtheweb/hax-body/lib/hax-toolbar-item.js";
/**
 * `hax-tray-button`
 * `A button in the tray`
 */
class HaxButton extends HaxToolbarItemBehaviors(LitElement) {
  static get tag() {
    return "hax-tray-button";
  }
  constructor() {
    super();
    this.eventData = null;
  }
  static get properties() {
    return {
      ...super.properties,
      /**
       * Voice command to append for things that support data-voicecommand.
       */
      voiceCommand: {
        type: String,
        attribute: "voice-command",
      },
      wide: {
        type: Boolean,
        reflect: true,
      },
      /**
       * Index position in the original list of imports
       */
      index: {
        type: Number,
      },
      eventData: {
        type: String,
        attribute: "event-data",
      },
    };
  }
  _voiceEvent(e) {
    this._handleClick(e);
    this.click();
  }
  /**
   * Fire an event that includes the eventName of what was just pressed.
   */
  _handleClick(e) {
    this.dispatchEvent(
      new CustomEvent("hax-tray-button-click", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: {
          eventName: this.eventName,
          index: this.index,
          value: this.eventData,
        },
      }),
    );
  }
  /**
   * LitElement life cycle - properties changed
   */
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "voiceCommand") {
        this.dispatchEvent(
          new CustomEvent("super-daemon-voice-command", {
            bubbles: true,
            composed: true,
            cancelable: false,
            detail: {
              command: this[propName],
              context: this,
              callback: "_voiceEvent",
            },
          }),
        );
      }
    });
  }
}
customElements.define(HaxButton.tag, HaxButton);
export { HaxButton };
