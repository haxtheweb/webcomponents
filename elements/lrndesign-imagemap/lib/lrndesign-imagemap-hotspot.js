import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/iron-a11y-keys/iron-a11y-keys.js";
import "@lrnwebcomponents/relative-heading/relative-heading.js";
/**
 * `lrndesign-imagemap-hotspot`
 * @customElement lrndesign-imagemap-hotspot
 * creates an accessible image map
 *

 * @polymer
 * @demo demo/index.html
 */
class LrndesignImagemapHotspot extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: none;
        }
        :host #desc {
          margin: 0 0 15px;
        }
        @media print {
          :host {
            display: block;
          }
        }
      </style>
      <relative-heading hidden\$="[[!label]]" id="heading" text\$="[[label]]">
      </relative-heading>
      <div id="desc"><slot></slot></div>
    `;
  }

  static get tag() {
    return "lrndesign-imagemap-hotspot";
  }

  static get properties() {
    return {
      /**
       * Label for the hotspot
       */
      label: {
        type: String,
        value: null
      },
      /**
       * Id of hotspot element inside the SVG
       */
      hotspotId: {
        type: String,
        value: null
      }
    };
  }

  setParentHeading(parent) {
    this.shadowRoot.querySelector("#heading")._setParent(parent);
  }
}
window.customElements.define(
  LrndesignImagemapHotspot.tag,
  LrndesignImagemapHotspot
);
export { LrndesignImagemapHotspot };
