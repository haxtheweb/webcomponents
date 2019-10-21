import { LitElement, html, css } from "lit-element/lit-element.js";
/**
 * `hax-app-browser-item`
 * `A button on the hax-app-browser display`
 * @microcopy - the mental model for this element
 * - hax-app - data wiring for an app, this element uses the visual side of this
 */
class HAXAppBrowserItem extends LitElement {
  static get tag() {
    return "hax-app-browser-item";
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
       * Image for the button, optional.
       */
      image: {
        type: String
      },
      /**
       * MaterializeCSS color name of the item
       */
      color: {
        type: String
      },
      /**
       * Author related to this app
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
      }
    };
  }
  constructor() {
    super();
    this.image = false;
    import("@polymer/paper-button/paper-button.js");
    import("@polymer/iron-icon/iron-icon.js");
  }
  static get styles() {
    return [
      css`
        :host {
          display: block;
          max-width: 90px;
        }
        paper-button {
          color: var(--hax-color-text);
          text-transform: none;
          background-color: var(--hax-color-bg-accent);
          min-width: unset;
          cursor: pointer;
          display: flex;
          width: 80px;
          padding: 5px;
          margin: 5px;
          color: #ffffff;
          border-radius: 0;
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
        paper-button iron-icon {
          height: 32px;
          width: 32px;
          color: var(--simple-colors-default-theme-grey-1);
          display: inline-block;
        }
        .item-title {
          margin-top: 8px;
          color: var(--hax-color-text);
          width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 12px;
          line-height: 12px;
          height: 12px;
          text-align: center;
        }
        .button-inner {
          display: flex;
        }
        .flip-icon {
          transform: rotateY(180deg);
        }
      `
    ];
  }

  render() {
    return html`
      <paper-button
        @click="${this._fireEvent}"
        .data-voicecommand="select ${this.title}"
        title="${this.title}"
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
  /**
   * Fire an event that includes the eventName of what was just pressed.
   */
  _fireEvent(e) {
    this.dispatchEvent(
      new CustomEvent("hax-app-selected", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: this.index
      })
    );
  }
}
customElements.define(HAXAppBrowserItem.tag, HAXAppBrowserItem);
export { HAXAppBrowserItem };
