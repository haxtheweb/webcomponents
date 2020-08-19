import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/simple-popover/simple-popover.js";
/**
 * `lrndesign-imagemap-hotspot`
 * creates an accessible image map
 * @demo demo/index.html
 * @element lrndesign-imagemap-hotspot
 */
class LrndesignImagemapHotspot extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
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
      `
    ];
  }
  /**
   * LitElement render
   */
  render() {
    return html`
      <simple-popover for="${this.hotspotId}" auto>
        <relative-heading
          id="heading"
          ?hidden="${!this.label}"
          text="${this.label}"
        >
        </relative-heading>
        <div id="desc"><slot></slot></div>
      </simple-popover>
    `;
  }
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.label = null;
    this.hotspotId = null;
    this.for = null;
    import("@lrnwebcomponents/relative-heading/relative-heading.js");
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
        type: String
      },

      /**
       * Id of hotspot element inside the SVG
       */
      hotspotId: {
        type: String,
        attribute: "hotspot-id"
      }
    };
  }

  setParentHeading(parent) {
    this.shadowRoot.querySelector("#heading").parent = parent;
  }
}
window.customElements.define(
  LrndesignImagemapHotspot.tag,
  LrndesignImagemapHotspot
);
export { LrndesignImagemapHotspot };
