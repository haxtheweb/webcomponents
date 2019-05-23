import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import "./hax-shared-styles.js";
/**
 * `hax-stax-browser-item`
 * `A button on the hax-gizmo-browser app display`
 */
class HaxStaxBrowserItem extends PolymerElement {
  constructor() {
    super();
    import("@polymer/iron-image/iron-image.js");
    import("@polymer/paper-button/paper-button.js");
    import("@polymer/paper-card/paper-card.js");
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
      </style>
      <paper-card id="card" elevation="[[elevation]]">
        <paper-button
          id="button"
          on-click="_fireEvent"
          data-voicecommand\$="select [[title]]"
        >
          <div class="button-inner">
            <iron-image
              src="[[image]]"
              preload=""
              sizing="cover"
              hidden\$="[[!image]]"
            ></iron-image>
            <div class="item-title">[[title]]</div>
          </div>
        </paper-button>
      </paper-card>
    `;
  }

  static get tag() {
    return "hax-stax-browser-item";
  }
  connectedCallback() {
    super.connectedCallback();
    afterNextRender(this, function() {
      this.addEventListener("mousedown", this.tapEventOn.bind(this));
      this.addEventListener("mouseover", this.tapEventOn.bind(this));
      this.addEventListener("mouseout", this.tapEventOff.bind(this));
      this.addEventListener("focusin", this.tapEventOn.bind(this));
      this.addEventListener("focusout", this.tapEventOff.bind(this));
    });
  }
  disconnectedCallback() {
    this.removeEventListener("mousedown", this.tapEventOn.bind(this));
    this.removeEventListener("mouseover", this.tapEventOn.bind(this));
    this.removeEventListener("mouseout", this.tapEventOff.bind(this));
    this.removeEventListener("focusin", this.tapEventOn.bind(this));
    this.removeEventListener("focusout", this.tapEventOff.bind(this));
    super.disconnectedCallback();
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
        type: String,
        value: false
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
    this.dispatchEvent(
      new CustomEvent("hax-insert-content-array", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: this.stax
      })
    );
    window.HaxStore.instance.haxStaxPicker.close();
  }
}

window.customElements.define(HaxStaxBrowserItem.tag, HaxStaxBrowserItem);
export { HaxStaxBrowserItem };
