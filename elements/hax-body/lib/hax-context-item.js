import { LitElement, html, css } from "lit";
import { HaxToolbarItemBehaviors } from "@haxtheweb/hax-body/lib/hax-toolbar-item.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import { HAXStore } from "./hax-store.js";
/**
 * `hax-context-item`
 * A single button in the hax context menu for consistency.
 *
 * @element hax-context-item
 * @extends HaxToolbarItemBehaviors
 *
 * @microcopy - the mental model for this element
 * - context - menu in the page the user can select an item from, this being 1 option in that list
 * - button - an item that expresses what interaction you will have with the content.
 */
class HaxContextItem extends HaxToolbarItemBehaviors(LitElement) {
  constructor() {
    super();
    this.haxUIElement = true;
    this.action = false;
    this.more = false;
    this.eventName = "button";
    this.inputMethod = null;
    this.propertyToBind = null;
    this.slotToBind = null;
    this.value = "";
  }
  static get tag() {
    return "hax-context-item";
  }

  static get properties() {
    return {
      ...super.properties,
      /**
       * more implies there's an action after pressing the button
       * so it'll put a visual indicator as such
       */
      more: {
        type: Boolean,
      },
      action: {
        type: Boolean,
      },
      /**
       * Label for the button.
       */
      label: {
        type: String,
        reflect: true,
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
      /**
       * Is this button concidered a primary interaction
       */
      default: {
        type: Boolean,
      },
      /**
       * an optional value to send along in the press. Allows for
       * reusing events more easily
       */
      value: {
        type: String,
      },
    };
  }
  /**
   * Store the selection object. This helps fix issues with safari
   * and holding focus on non-text elements actually stealing
   * the selection priority, making it impossible to know what's
   * been selected if clicking a button to try and apply something to.
   */
  _handleMousedown(e) {
    if (!this.disabled) HAXStore._tmpSelection = HAXStore.getSelection();
  }
  /**
   * Fire an event that includes the eventName of what was just pressed.
   */
  _handleClick(e) {
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

customElements.define(HaxContextItem.tag, HaxContextItem);
export { HaxContextItem };
