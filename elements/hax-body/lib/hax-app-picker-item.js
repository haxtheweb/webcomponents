import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import "./hax-shared-styles.js";
/**
 `hax-app-picker-item`
 An item for displaying in a picker

* @demo demo/index.html
*/
class HaxAppPickerItem extends PolymerElement {
  constructor() {
    super();
    import("@polymer/iron-icon/iron-icon.js");
    import("@polymer/paper-button/paper-button.js");
  }
  static get template() {
    return html`
      <style include="hax-shared-styles">
        :host {
          display: inline-block;
          color: var(--hax-color-text);
        }
        :host([elevation="1"]) {
          -webkit-transform: scale(1, 1);
          transform: scale(1, 1);
        }
        :host([elevation="2"]) {
          -webkit-transform: scale(1.4, 1.4);
          transform: scale(1.4, 1.4);
        }
        :host > div {
          @apply --paper-font-caption;
          margin-top: 8px;
          color: var(--hax-color-text);
          width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          @apply --hax-app-picker-hax-element-text;
        }
        .icon {
          cursor: pointer;
          display: flex;
          width: 50px;
          height: 50px;
          padding: 5px;
          margin: 10px;
          color: #ffffff;
          border-radius: 50%;
          box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
            0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
          -webkit-transition: box-shadow 0.3s;
          -moz-transition: box-shadow 0.3s;
          -ms-transition: box-shadow 0.3s;
          -o-transition: box-shadow 0.3s;
          transition: box-shadow 0.3s;
          @apply --hax-app-picker-hax-element--icon;
        }
        .icon:hover,
        .icon:focus {
          box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.14),
            0 2px 10px 0 rgba(0, 0, 0, 0.12), 0 6px 2px -4px rgba(0, 0, 0, 0.2);
        }
        .icon:active {
          box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
            0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
        }
        paper-button {
          min-width: unset;
        }
        iron-icon {
          display: inline-flex;
          padding: 0;
          margin: 0;
          width: 36px;
          height: 36px;
        }
      </style>
      <paper-button
        class="icon"
        title="[[label]]"
        style$="background-color:[[hexColor]];"
      >
        <iron-icon icon="[[icon]]"></iron-icon>
      </paper-button>
      <div aria-hidden="true">[[label]]</div>
    `;
  }
  ready() {
    super.ready();
    afterNextRender(this, function() {
      this.addEventListener("mousedown", this.tapEventOn.bind(this));
      this.addEventListener("mouseover", this.tapEventOn.bind(this));
      this.addEventListener("mouseout", this.tapEventOff.bind(this));
      this.addEventListener("focusin", this.tapEventOn.bind(this));
      this.addEventListener("focusout", this.tapEventOff.bind(this));
    });
  }
  static get tag() {
    return "hax-app-picker-item";
  }
  static get properties() {
    return {
      /**
       * Color
       */
      color: {
        type: String
      },
      /**
       * Class for the color
       */
      hexColor: {
        type: String,
        computed: "_getHexColor(color)"
      },
      /**
       * Icon
       */
      icon: {
        type: String
      },
      /**
       * Label
       */
      label: {
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
  _getHexColor(color) {
    let name = color.replace("-text", "");
    let tmp = new SimpleColors();
    if (tmp.colors[name]) {
      return tmp.colors[name][6];
    }
    return "#000000";
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
}
window.customElements.define(HaxAppPickerItem.tag, HaxAppPickerItem);
export { HaxAppPickerItem };
