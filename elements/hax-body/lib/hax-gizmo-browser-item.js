import { LitElement, html, css } from "lit-element/lit-element.js";
import "./hax-item-button-inner.js";
/**
 * `hax-gizmo-browser-item`
 * `A button on the hax-gizmo-browser app display`
 */
class HaxGizmoBrowserItem extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          display: block;
          max-width: 90px;
        }
        paper-button {
          text-transform: none;
          min-width: unset;
          cursor: pointer;
          width: 80px;
          padding: 5px;
          margin: 5px;
          box-shadow: none;
          transition: 0.2s all linear;
          --paper-button-ink-color: var(--hax-ink-color, #000000);
        }
        paper-button:hover,
        paper-button:focus {
          box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.14),
            0 2px 10px 0 rgba(0, 0, 0, 0.12), 0 6px 2px -4px rgba(0, 0, 0, 0.2);
        }
        paper-button:active {
          box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
            0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
        }
      `
    ];
  }
  render() {
    return html`
      <paper-button
        @click="${this._fireEvent}"
        .data-voicecommand="select ${this.title}"
      >
        <hax-item-button-inner
          color="${this.color}"
          icon="${this.icon}"
          label="${this.title}"
        >
        </hax-item-button-inner>
      </paper-button>
    `;
  }
  static get tag() {
    return "hax-gizmo-browser-item";
  }
  static get properties() {
    return {
      /**
       * Title
       */
      title: {
        type: String
      },
      /**
       * Index position in the original list of imports
       */
      index: {
        type: Number
      },
      /**
       * Icon for the button, optional.
       */
      icon: {
        type: String
      },
      /**
       * color name of the item
       */
      color: {
        type: String
      },
      /**
       * Author related to this gizmo
       */
      author: {
        type: String
      },
      /**
       * Description for this.
       */
      description: {
        type: String
      },
      /**
       * Examples, a list of image links, optional.
       */
      examples: {
        type: Array
      },
      /**
       * Status, whether disabled, enabled, or other future states.
       */
      status: {
        type: Array
      },
      /**
       * Tag
       */
      tagToInsert: {
        type: String,
        attribute: "tag-to-insert"
      }
    };
  }

  /**
   * Fire an event that includes the eventName of what was just pressed.
   */
  _fireEvent(e) {
    let gizmo = {
      tag: this.tagToInsert
    };
    let element = window.HaxStore.haxElementPrototype(gizmo);
    window.HaxStore.write("activeHaxElement", element, this);
  }
}
window.customElements.define(HaxGizmoBrowserItem.tag, HaxGizmoBrowserItem);
export { HaxGizmoBrowserItem };
