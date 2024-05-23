import { LitElement, html, css } from "lit";
import { HaxToolbarItemBehaviors } from "@haxtheweb/hax-body/lib/hax-toolbar-item.js";
/**
 * `hax-context-item-textop`
 * @element hax-context-item-textop
 * `A single button in the hax context menus for consistency. This one uses the mousedown event becasue tap won't work in safari / firefox / IE while maintaining focus inside the contenteditable area (stupid, I know)`
 * @microcopy - the mental model for this element
 * - context - menu in the page the user can select an item from, this being 1 option in that list
 * - button - an item that expresses what interaction you will have with the content.
 */
class HaxContextItemTextop extends HaxToolbarItemBehaviors(LitElement) {
  constructor() {
    super();
    this.action = false;
    this.eventName = "button";
    this.inputMethod = null;
    this.propertyToBind = null;
    this.slotToBind = null;
    this.value = "";
  }
  static get tag() {
    return "hax-context-item-textop";
  }
  static get properties() {
    return {
      ...super.properties,
      /**
       * an optional value to send along in the press. Allows for
       * reusing events more easily
       */
      value: {
        type: String,
      },
      action: {
        type: Boolean,
      },
      /**
       * Name of the event to bubble up as being tapped.
       * This can be used to tell other elements what was
       * clicked so it can take action appropriately.
       */
      eventName: {
        type: String,
        reflect: true,
        attribute: "event-name",
      },
      /**
       * Method of input to display when activated. This is
       * only used when triggered as part of haxProperties
       */
      inputMethod: {
        type: String,
        reflect: true,
        attribute: "input-method",
      },
      /**
       * Optional slot to bind this value to.
       */
      propertyToBind: {
        type: String,
        reflect: true,
        attribute: "property-to-bind",
      },
      /**
       * Optional slot to bind this value to.
       */
      slotToBind: {
        type: String,
        reflect: true,
        attribute: "slot-to-bind",
      },
      /**
       * Optional description for this item.
       */
      description: {
        type: String,
        reflect: true,
      },
    };
  }
  /**
   * Fire an event that includes the eventName of what was just pressed.
   */
  _handleKeys(e) {
    if (e.key == "Enter") this._fireEvent();
  }
  /**
   * Store the selection object. This helps fix issues with safari
   * and holding focus on non-text elements actually stealing
   * the selection priority, making it impossible to know what's
   * been selected if clicking a button to try and apply something to.
   */
  _handleMousedown(e) {
    if (!this.disabled) {
      this.dispatchEvent(
        new CustomEvent("hax-context-item-selected", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: {
            target: this,
            eventName: this.eventName,
            value: this.value,
          },
        }),
      );
    }
  }
}
customElements.define(HaxContextItemTextop.tag, HaxContextItemTextop);
export { HaxContextItemTextop };
