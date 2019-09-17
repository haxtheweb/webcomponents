import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import "./hax-item-button-inner.js";
/**
`hax-gizmo-browser-item`
A button on the hax-gizmo-browser app display

* @demo demo/index.html

@microcopy - the mental model for this element
 - 
*/
class HaxGizmoBrowserItem extends PolymerElement {
  constructor() {
    super();
    afterNextRender(this, function() {
      this.addEventListener("mousedown", this.tapEventOn.bind(this));
      this.addEventListener("mouseover", this.tapEventOn.bind(this));
      this.addEventListener("mouseout", this.tapEventOff.bind(this));
      this.addEventListener("focusin", this.tapEventOn.bind(this));
      this.addEventListener("focusout", this.tapEventOff.bind(this));
    });
  }
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          max-width: 100px;
        }
        :host([elevation="1"]) {
          -webkit-transform: scale(1, 1);
          transform: scale(1, 1);
        }
        :host([elevation="2"]) {
          -webkit-transform: scale(1.4, 1.4);
          transform: scale(1.4, 1.4);
        }
        paper-button {
          color: black;
          text-transform: none;
          min-width: unset;
          cursor: pointer;
          width: 80px;
          padding: 10px;
          margin: 10px;
          box-shadow: none;
          --paper-button-ink-color: var(--hax-ink-color, black);
        }
      </style>
      <paper-button on-click="_fireEvent" data-voicecommand$="select [[title]]">
        <hax-item-button-inner
          color="[[color]]"
          icon="[[icon]]"
          image="[[image]]"
          label="[[title]]"
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
       * Image for the button, optional.
       */
      image: {
        type: String,
        value: false
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
    let gizmo = {
      tag: this.tagToInsert
    };
    let element = window.HaxStore.haxElementPrototype(gizmo);
    window.HaxStore.write("activeHaxElement", element, this);
  }
}
window.customElements.define(HaxGizmoBrowserItem.tag, HaxGizmoBrowserItem);
export { HaxGizmoBrowserItem };
