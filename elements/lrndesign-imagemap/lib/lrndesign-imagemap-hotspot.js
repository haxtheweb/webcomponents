import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { sanitizedSvgFromMarkup } from "./lrndesign-imagemap-sanitize.js";
/**
 * `lrndesign-imagemap-hotspot`
 * creates an accessible image map
 * @demo demo/index.html
 * @element lrndesign-imagemap-hotspot
 */
class LrndesignImagemapHotspot extends DDD {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: none;
          font-family: var(--ddd-font-primary);
        }
        .hotspot-print {
          margin: 0 0 var(--ddd-spacing-6);
          break-inside: avoid;
        }
        #sub-heading h2 {
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-xs);
          margin: 0 0 var(--ddd-spacing-2);
        }
        @media print {
          :host {
            display: block;
          }
        }
      `,
    ];
  }
  /**
   * LitElement render
   */
  render() {
    return html`
      <figure class="hotspot-print">
        <figcaption>
          <relative-heading
            disable-link
            id="sub-heading"
            parent="heading"
            default-level="2"
          >
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
    import("@haxtheweb/relative-heading/relative-heading.js");
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
      },

      /**
       * Id of hotspot element inside the SVG
       */
      hotspotId: {
        type: String,
        attribute: "hotspot-id",
        reflect: true,
      },

      position: {
        type: String,
      },

      __hotspots: {
        type: Array,
      },
    };
  }

  loadSvg(svg, hotspots) {
    // security: same inert parse + sanitize as the parent element
    let slot = sanitizedSvgFromMarkup(svg);
    if (!slot) {
      return;
    }
    slot.slot = "svg";
    // the print svg sits in light DOM while these labels live in the
    // shadow root, so a cross-boundary IDREF would never resolve; label
    // the svg directly from the hotspot's own label instead
    if (this.label) slot.setAttribute("aria-label", this.label);
    (hotspots || []).forEach((hotspot) => {
      let svgHotspot = slot.querySelector(`#${hotspot}`);
      svgHotspot.classList.add("hotspot");
      if (hotspot === this.hotspotId) {
        svgHotspot.classList.add("selected");
      }
    });

    this.appendChild(slot);
  }

  setParentHeading(parent) {
    this.shadowRoot.querySelector("#sub-heading").parent = parent;
  }
}
globalThis.customElements.define(
  LrndesignImagemapHotspot.tag,
  LrndesignImagemapHotspot,
);
export { LrndesignImagemapHotspot };
