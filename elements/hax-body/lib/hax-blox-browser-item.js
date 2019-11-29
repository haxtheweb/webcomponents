import { LitElement, html, css } from "lit-element/lit-element.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/iron-icon/iron-icon.js";
/**
 * `hax-blox-browser-item`
 * @customElement hax-blox-browser-item
 * `A button on the hax-gizmo-browser app display`
 */
class HaxBloxBrowserItem extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          display: flex;
        }
        paper-button {
          color: black;
          background-color: #ffffff;
          border: 2px solid var(--hax-color-border-outline);
          text-transform: none;
          margin: 0;
          height: 80px !important;
          width: 100%;
          display: flex;
          border-radius: 0;
          min-width: unset;
          --paper-button-ink-color: var(--hax-ink-color, black);
          box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
            0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
          transition: box-shadow 0.3s;
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
        paper-button .item-title {
          font-size: 14px;
          display: inline-flex;
        }
        .flip-icon {
          transform: rotateY(180deg);
        }
        iron-icon {
          width: 40px;
          height: 40px;
          display: inline-block;
          color: black;
        }
        @media screen and (max-width: 550px) {
          paper-button .item-title {
            font-size: 12px;
          }
        }
      `
    ];
  }
  render() {
    return html`
      <paper-button
        id="button"
        @click="${this._fireEvent}"
        .data-voicecommand="select ${this.title}"
      >
        <div class="button-inner">
          <iron-icon icon="${this.icon}"></iron-icon>
          <div class="item-title">${this.title}</div>
        </div>
      </paper-button>
    `;
  }
  static get tag() {
    return "hax-blox-browser-item";
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
      bloxReference: {
        type: Object
      },
      /**
       * icon for the button, optional.
       */
      icon: {
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
       * Examples, optional.
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
       * Layout string to use
       */
      layout: {
        type: String
      },
      /**
       * Tag
       */
      tag: {
        type: String
      }
    };
  }

  /**
   * Fire an event that includes the eventName of what was just pressed.
   */
  _fireEvent(e) {
    let content = "";
    for (var i = 0; i < this.blox.length; i++) {
      let node = window.HaxStore.haxElementToNode(
        this.blox[i].tag,
        this.blox[i].content,
        this.blox[i].properties
      );
      content += window.HaxStore.nodeToContent(node);
    }
    // generate a hax element
    let blox = {
      tag: "grid-plate",
      properties: {
        layout: this.layout
      },
      content: content
    };
    this.dispatchEvent(
      new CustomEvent("hax-insert-content", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: blox
      })
    );
    window.HaxStore.instance.haxBloxPicker.close();
  }
}
window.customElements.define(HaxBloxBrowserItem.tag, HaxBloxBrowserItem);
export { HaxBloxBrowserItem };
