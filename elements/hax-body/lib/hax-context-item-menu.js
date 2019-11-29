import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/hax-body/lib/hax-toolbar-menu.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "@polymer/paper-item/paper-item.js";
import "@polymer/neon-animation/neon-animation.js";
/**
 * `hax-context-item-menu`
 * @customElement hax-context-item-menu
 * `An icon / button that has support for multiple options via drop down.`
 * @microcopy - the mental model for this element
 * - panel - the flyout from left or right side that has elements that can be placed
 * - button - an item that expresses what interaction you will have with the content.
 */
class HaxContextItemMenu extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: inline-flex;
          height: 36px;
          box-sizing: border-box;
        }
        :host hax-toolbar-menu ::slotted(*):hover {
          background-color: var(--hax-color-bg-accent);
        }
        :host hax-toolbar-menu ::slotted(*) {
          height: 36px;
        }
      `
    ];
  }
  constructor() {
    super();
    this._blockEvent = false;
    this.resetOnSelect = false;
    this.selectedValue = 0;
    this.direction = "top";
    this.icon = "editor:text-fields";
    this.label = "editor:text-fields";
    this.eventName = "button";
  }
  render() {
    return html`
      <hax-toolbar-menu
        id="menu"
        .icon="${this.icon}"
        .tooltip="${this.label}"
        .tooltip-direction="${this.direction}"
        @selected-changed="${this.selectedValueChanged}"
        .selected="${this.selectedValue}"
        .reset-on-select="${this.resetOnSelect}"
      >
        <slot></slot>
      </hax-toolbar-menu>
    `;
  }
  selectedValueChanged(e) {
    this.selectedValue = e.detail;
  }
  static get tag() {
    return "hax-context-item-menu";
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "selectedValue") {
        // observer
        this._selectedUpdated(this[propName], oldValue);
        // notify
        this.dispatchEvent(
          new CustomEvent("selected-value-changed", {
            detail: this[propName]
          })
        );
      }
    });
  }
  static get properties() {
    return {
      /**
       * Internal flag to allow blocking the event firing if machine selects tag.
       */
      _blockEvent: {
        type: Boolean
      },
      /**
       * Should we reset the selection after it is made
       */
      resetOnSelect: {
        type: Boolean,
        attribute: "reset-on-select"
      },
      /**
       * Value.
       */
      selectedValue: {
        type: Number,
        reflect: true,
        attribute: "selected-value"
      },
      /**
       * Direction for the tooltip
       */
      direction: {
        type: String
      },
      /**
       * Icon for the button.
       */
      icon: {
        type: String,
        reflect: true
      },
      /**
       * Label for the button.
       */
      label: {
        type: String,
        reflect: true
      },
      /**
       * Name of the event to bubble up as being tapped.
       * This can be used to tell other elements what was
       * clicked so it can take action appropriately.
       */
      eventName: {
        type: String,
        reflect: true,
        attribute: "event-name"
      }
    };
  }

  /**
   * Notice the selected value has changed.
   */
  _selectedUpdated(newValue, oldValue) {
    if (
      typeof newValue !== typeof null &&
      typeof oldValue !== typeof undefined &&
      typeof oldValue !== typeof null
    ) {
      let children = this.children;
      var item = new Object();
      var j = 0;
      // check for tag match since we have to filter out text nodes
      for (var i = 0, len = children.length; i < len; i++) {
        if (children[i].tagName === "PAPER-ITEM") {
          if (j === newValue) {
            item = children[i];
            len = i;
            continue;
          }
          j++;
        }
      }
      // ensure we have a value; if so, this becomes the event to look for
      // also use our flag to ensure machine setting the tag default doesn't
      // equate to firing off a selected event.
      if (
        !this._blockEvent &&
        typeof item.attributes !== typeof undefined &&
        typeof item.attributes.value !== typeof undefined &&
        typeof item.attributes.value.value !== typeof undefined
      ) {
        // weird but this makes the menu close when we send up an event
        // that indicates something higher should do something. This
        // avoids an annoying UX error where the menu stays open for
        // no reason.
        this.shadowRoot.querySelector("#menu").hideMenu();
        this.dispatchEvent(
          new CustomEvent("hax-context-item-selected", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: {
              target: item,
              eventName: item.attributes.value.value
            }
          })
        );
      }
      // we only block 1 time if it's available
      if (this._blockEvent) {
        this._blockEvent = false;
      }
    }
  }
}
window.customElements.define(HaxContextItemMenu.tag, HaxContextItemMenu);
export { HaxContextItemMenu };
