import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/hax-body/lib/hax-toolbar-menu.js";
import "@lrnwebcomponents/simple-tooltip/simple-tooltip.js";
import "@polymer/paper-item/paper-item.js";
import "@polymer/neon-animation/neon-animation.js";
/**
 * `hax-context-item-menu`
 * `An icon / button that has support for multiple options via drop down.`
 * @microcopy - the mental model for this element
 * - panel - the flyout from left or right side that has elements that can be placed
 * - button - an item that expresses what interaction you will have with the content.
 * @element hax-context-item-menu
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
          box-sizing: border-box;
        }
        :host(mini) {
          height: unset;
          width: unset;
        }
      `,
    ];
  }
  constructor() {
    super();
    this._blockEvent = false;
    this.selectedValue = 0;
    this.action = false;
    this.direction = "top";
    this.icon = "editor:text-fields";
    this.label = "editor:text-fields";
  }
  render() {
    return html`
      <hax-toolbar-menu
        id="menu"
        ?mini="${this.mini}"
        ?action="${this.action}"
        .icon="${this.icon}"
        .tooltip="${this.label}"
        .tooltip-direction="${this.direction}"
        @selected-changed="${this.selectedValueChanged}"
        .selected="${this.selectedValue}"
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
            detail: this[propName],
          })
        );
      }
    });
  }
  static get properties() {
    return {
      mini: {
        type: Boolean,
        reflect: true,
      },
      action: {
        type: Boolean,
      },
      /**
       * Internal flag to allow blocking the event firing if machine selects tag.
       */
      _blockEvent: {
        type: Boolean,
      },
      /**
       * Value.
       */
      selectedValue: {
        type: Number,
        reflect: true,
        attribute: "selected-value",
      },
      /**
       * Direction for the tooltip
       */
      direction: {
        type: String,
      },
      /**
       * Icon for the button.
       */
      icon: {
        type: String,
        reflect: true,
      },
      /**
       * Label for the button.
       */
      label: {
        type: String,
        reflect: true,
      },
      /**
       * Name of the event to bubble up as being tapped.
       * This can be used to tell other elements what was
       * clicked so it can take action appropriately.
       */
      eventName: {
        type: String,
        attribute: "event-name",
      },
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
        // only emit if we have an event name
        if (this.eventName) {
          this.dispatchEvent(
            new CustomEvent("hax-context-item-selected", {
              bubbles: true,
              cancelable: true,
              composed: true,
              detail: {
                target: item,
                eventName: this.eventName,
                value: item.attributes.value.value,
              },
            })
          );
        }
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
