import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import "./hax-shared-styles.js";
/**
 * `hax-blox-browser-item`
 * `A button on the hax-gizmo-browser app display`
 */
class HaxBloxBrowserItem extends PolymerElement {
  constructor() {
    super();
    import("@polymer/paper-button/paper-button.js");
    import("@polymer/paper-card/paper-card.js");
    import("@polymer/iron-icon/iron-icon.js");
    this.addEventListener("mousedown", this.tapEventOn.bind(this));
    this.addEventListener("mouseover", this.tapEventOn.bind(this));
    this.addEventListener("mouseout", this.tapEventOff.bind(this));
    this.addEventListener("focusin", this.tapEventOn.bind(this));
    this.addEventListener("focusout", this.tapEventOff.bind(this));
  }
  static get template() {
    return html`
      <style include="hax-shared-styles">
        :host {
          display: inline-flex;
        }
        :host([elevation="1"]) {
          -webkit-transform: scale(1, 1);
          transform: scale(1, 1);
        }
        :host([elevation="2"]) {
          -webkit-transform: scale(1.4, 1.4);
          transform: scale(1.4, 1.4);
        }
        paper-card {
          margin: 4px 0;
          border-radius: 10px;
        }
        paper-button {
          color: var(--hax-color-text);
          background-color: #ffffff;
          border: 2px solid var(--hax-color-border-outline);
          text-transform: none;
          margin: 0;
          height: 80px !important;
          width: 200px !important;
          display: flex;
          border-radius: 10px;
          min-width: unset;
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
          color: var(--hax-color-text);
        }
        @media screen and (max-width: 550px) {
          paper-button .item-title {
            font-size: 12px;
          }
        }
      </style>
      <paper-card id="card" elevation="[[elevation]]">
        <paper-button
          id="button"
          on-click="_fireEvent"
          data-voicecommand\$="select [[title]]"
        >
          <div class="button-inner">
            <iron-icon icon="[[icon]]"></iron-icon>
            <div class="item-title">[[title]]</div>
          </div>
        </paper-button>
      </paper-card>
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
      },
      /**
       * Elevation off the UI
       */
      elevation: {
        type: Number,
        value: 1,
        reflectToAttribute: true
      }
    };
  }

  /**
   * special handling for taps on the thing
   */
  tapEventOn(e) {
    this.elevation = 2;
  }

  /**
   * Hover off stop showing the deeper shadow.
   */
  tapEventOff(e) {
    this.elevation = 1;
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
