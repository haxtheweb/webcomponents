import { LitElement, html, css } from "lit-element/lit-element.js";
import "@polymer/paper-button/paper-button.js";
/**
 * `hax-stax-browser-item`
 * @customElement hax-stax-browser-item
 * `A button on the hax-gizmo-browser app display`
 */
class HaxStaxBrowserItem extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          display: flex;
        }
        paper-card {
          margin: 4px 0;
          border-radius: 10px;
          display: flex;
          width: 100%;
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
        paper-button .item-title {
          font-size: 14px;
          display: inline-flex;
        }
        paper-button .button-inner {
          text-align: center;
        }
        .flip-icon {
          transform: rotateY(180deg);
        }
        @media screen and (max-width: 550px) {
          paper-button .item-title {
            font-size: 10px;
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
          ${this.image
            ? html`
                <iron-image
                  src="${this.image}"
                  preload=""
                  sizing="cover"
                ></iron-image>
              `
            : ``}
          <div class="item-title">${this.title}</div>
        </div>
      </paper-button>
    `;
  }

  static get tag() {
    return "hax-stax-browser-item";
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
      staxReference: {
        type: Object
      },
      /**
       * Image for the button, optional.
       */
      image: {
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
      tag: {
        type: String
      }
    };
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "image") {
        import("@polymer/iron-image/iron-image.js");
      }
    });
  }
  /**
   * Fire an event that includes the eventName of what was just pressed.
   */
  _fireEvent(e) {
    this.dispatchEvent(
      new CustomEvent("hax-insert-content-array", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: this.stax
      })
    );
    window.HaxStore.write("openDrawer", false, this);
  }
}

window.customElements.define(HaxStaxBrowserItem.tag, HaxStaxBrowserItem);
export { HaxStaxBrowserItem };
