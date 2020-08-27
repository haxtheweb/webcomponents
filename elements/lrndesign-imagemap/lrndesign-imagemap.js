import { LitElement, html, css } from "lit-element/lit-element.js";

/**
 * `lrndesign-imagemap`
 * @element lrndesign-imagemap
 * creates an accessible image map
 *
 *
 * @demo demo/index.html
 */
class LrndesignImagemap extends LitElement {
  constructor() {
    super();
    import("@lrnwebcomponents/relative-heading/relative-heading.js");
    import("@lrnwebcomponents/lrndesign-imagemap/lib/lrndesign-imagemap-hotspot.js");
    import("@lrnwebcomponents/simple-popover/simple-popover.js");
  }
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
        :host #buttons {
          position: absolute;
          left: -999999px;
          top: 0;
          overflow: hidden;
          opacity: 0;
        }

        simple-popover {
          max-width: 300px;
          max-height: 200px;
        }
        simple-popover[for=""] {
          display: none;
        }
        simple-popover .sub-heading > *:first-child {
          margin: 0 0 10px;
        }

        @media print {
          #svg,
          simple-popover {
            display: none;
          }
        }
      `
    ];
  }

  render() {
    return html`
      <figure id="figure">
        <figcaption>
          <relative-heading
            id="heading"
            parent="${this.parent || this.subtopicOf}"
          >
            ${this.label
              ? html`
                  <h1>${this.label}</h1>
                `
              : html`
                  <slot name="heading"></slot>
                `}
          </relative-heading>
          <div id="desc"><slot name="desc"></slot></div>
          <slot name="source" hidden></slot>
          <div id="buttons"></div>
        </figcaption>
        <slot id="svg"></slot>
        <simple-popover
          auto
          ?hidden="${!this.__activeHotspot}"
          .for="${!this.__activeHotspot ? undefined : this.__activeHotspot.id}"
        >
          <relative-heading
            class="sub-heading"
            parent="heading"
            id="subheading-${!this.__activeHotspot
              ? undefined
              : this.__activeHotspot.id}"
          >
            <h2>${!this.__activeHotspot ? "" : this.__activeHotspot.label}</h2>
          </relative-heading>
          <slot id="details" name="details"></slot>
        </simple-popover>
      </figure>
      <slot></slot>
    `;
  }
  static get tag() {
    return "lrndesign-imagemap";
  }
  static get properties() {
    return {
      /**
       * Label for the imagemap
       */
      label: {
        type: String
      },
      /**
       * @deprecated: (8/27/2020, after v.2.6.24) Using slot instead of the path of the SVG
       */
      src: {
        type: String
      },
      /**
       * The path of the SVG
       */
      hotspotDetails: {
        type: Array,
        attribute: "hotspot-details"
      },
      /**
       * @deprecated: (8/27/2020, after v.2.6.24) the id of the heading element that this imagemap is a subtopic of
       */
      subtopicOf: {
        type: String,
        reflect: true,
        attribute: "subtopic-of"
      },

      parent: {
        type: String,
        reflect: true,
        attribute: "parent"
      },

      __activeHotspot: {
        type: Object
      }
    };
  }

  firstUpdated(changeProperties) {
    if (super.firstUpdated) super.firstUpdated(changeProperties);
    this._fetchSvg(
      this.querySelector("[slot=src]")
        ? this.querySelector("[slot=src]")
        : this.src
    );
  }

  _fetchSvg(src) {
    fetch(src)
      .then(response => response.text())
      .then(data => this._getSVGHandler(data));
  }

  /**
   * Convert from svg text to an array in the table function
   */
  _getSVGHandler(data) {
    let loader = document.createElement("div");
    let hotspots = [];
    loader.innerHTML = data;
    let svg = loader.querySelector("svg");
    svg.slot = "svg";
    this.prepend("svg");
    svg.setAttribute("aria-labelledBy", this._getInfoNode(svg, "title"));
    svg.setAttribute("aria-describedBy", this._getInfoNode(svg));
    this.hotspotDetails = [];
    // this is scrape the printable hotspots for info
    this.querySelectorAll("lrndesign-imagemap-hotspot").forEach(hotspot => {
      let obj = {
        id: hotspot.hotspotId,
        print: hotspot,
        hotspot: svg.querySelector(`#${hotspot.hotspotId}`),
        label: hotspot.label,
        position: hotspot.position || "bottom",
        details: document.createElement("div")
      };
      // Turning main svg interactive hotspots into buttons
      obj.hotspot.classList.add("hotspot");
      obj.hotspot.setAttribute("role", "button");
      obj.hotspot.setAttribute("controls", "figure");
      obj.hotspot.addEventListener("click", e => this.openHotspot(obj));

      //Copy hotspot details from printable hotspots

      hotspot.childNodes.forEach(node => {
        obj.details.appendChild(node.cloneNode(true));
      });
      obj.details.slot = "details";
      this.append(obj.details);

      // Get array data for hotspot
      this.hotspotDetails.push(obj);
      hotspots.push(hotspot.hotspotId);
    });

    this.hotspotDetails.forEach(obj => {
      obj.print.loadSvg(data, hotspots);
    });
  }
  /**
   * Gets / Sets description and label
   * @param {object} svg an svg element
   * @param {string} nodeName  the name of the info element (title or desc)
   * @returns {string}
   */
  _getInfoNode(svg, nodeName = "desc") {
    let nodeId = nodeName === "title" ? "heading" : nodeName;
    let node = svg.querySelector(nodeName);
    let query = this.shadowRoot.querySelector(`#${nodeId}`);
    if (!node) {
      node = document.createElement(nodeName);
      svg.prepend(node);
      if (query && query.innerHTML != "") {
        node.innerHTML == query.html;
      }
    }
    return this._getId(node);
  }

  _getId(el) {
    let id = el ? el.getAttribute("id") : undefined;
    if (!id) {
      id = "ss-s-s-s-sss".replace(
        /s/g,
        Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1)
      );
      el.setAttribute("id", id);
    }
    return id;
  }
  /**
   * Selects a hotspot and opens dialog with details about it.
   */
  openHotspot(hotspot) {
    this.__activeHotspot = undefined;
    this.hotspotDetails.forEach(obj => {
      if (obj.id === hotspot.id) {
        obj.hotspot.classList.add("selected");
        obj.details.style.display = "block";
        this.__activeHotspot = obj;
      } else {
        obj.hotspot.classList.remove("selected");
        obj.details.style.display = "none";
      }
    });
  }
  /**
   * Closes a hotspot.
   */
  closeHotspot() {
    this.resetHotspots();
    this.__activeHotspot.focus();
  }
  /**
   * Closes dialog and deselects all hotspots.
   */
  resetHotspots() {
    let hotspots = this.querySelectorAll('.hotspot[role="button"]');
    for (let i = 0; i < hotspots.length; i++) {
      hotspots[i].classList.remove("selected");
    }
  }
}
window.customElements.define(LrndesignImagemap.tag, LrndesignImagemap);
export { LrndesignImagemap };
