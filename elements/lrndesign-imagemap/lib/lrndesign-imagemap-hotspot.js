import { LitElement, html, css } from "lit-element/lit-element.js";
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
      <figure class="hotspot-print">
        <figcaption>
          <relative-heading id="sub-heading" parent="heading">
            <h2>${this.label}</h2>
          </relative-heading>
          <div id="desc"><slot></slot></div>
        </figcaption>
        <slot id="svg" name="svg"></slot>
      </figure>
    `;
  }
  /**
   * HTMLElement
   */
  constructor() {
    super();
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
        attribute: "hotspot-id",
        reflect: true
      },

      position: {
        type: String
      },

      __hotspots: {
        type: Array
      }
    };
  }

  loadSvg(svg, hotspots) {
    let div = document.createElement("div");
    div.innerHTML = svg;
    let slot = div.children[0];
    slot.slot = svg;
    slot.setAttribute("aria-labelledBy", "sub-heading");
    slot.setAttribute("aria-describedBy", "sub-heading desc");
    (hotspots || []).forEach(hotspot => {
      let svgHotspot = slot.querySelector(`#${hotspot}`);
      svgHotspot.classList.add("hotspot");
      if (hotspot === this.hotspotId) {
        svgHotspot.classList.add("selected");
      }
    });

    this.appendChild(slot);
    div.remove();
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
