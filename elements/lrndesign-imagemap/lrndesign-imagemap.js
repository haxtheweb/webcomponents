import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { sanitizedSvgFromMarkup } from "./lib/lrndesign-imagemap-sanitize.js";
import {
  activityId,
  buildStatement,
  XAPI_ACTIVITY_TYPES,
  XAPI_EXTENSIONS,
} from "@haxtheweb/user-action/lib/xapi.js";

// ids for svg title / desc nodes that came without one
let infoNodeCount = 0;

// hotspot shapes live in the svg in light DOM, where the shadow styles
// cannot reach, so their states are styled from one light DOM stylesheet
const HOTSPOT_STYLE_ID = "lrndesign-imagemap-hotspot-styles";
const HOTSPOT_CSS = `
lrndesign-imagemap .hotspot[role="button"] {
  cursor: pointer;
  transition: opacity var(--ddd-duration-fast, 0.2s) ease-in-out;
}
lrndesign-imagemap .hotspot[role="button"]:hover {
  opacity: 0.8;
}
lrndesign-imagemap .hotspot[role="button"]:focus-visible {
  outline: var(--ddd-focus-ring, 2px solid #005fa9);
  outline-offset: var(--ddd-focus-offset, 2px);
}
lrndesign-imagemap .hotspot.selected {
  stroke: var(--ddd-theme-primary, var(--ddd-theme-default-link, #005fa9));
  stroke-width: var(--ddd-border-size-md, 2px);
}
@media (prefers-reduced-motion: reduce) {
  lrndesign-imagemap .hotspot[role="button"] {
    transition: none;
  }
}
`;

/**
 * `lrndesign-imagemap`
 * @element lrndesign-imagemap
 * creates an accessible image map
 *
 * Learner data: opening a hotspot for the first time sends progressed (one
 * step of exploring the map); opening the last unseen one sends completed.
 *
 * @demo demo/index.html
 */
class LrndesignImagemap extends DDD {
  constructor() {
    super();
    this._haxstate = false;
    this._opened = new Set();
    this._keydown = this._keydown.bind(this);
    import("@haxtheweb/relative-heading/relative-heading.js");
    // prettier-ignore
    import(
      "@haxtheweb/lrndesign-imagemap/lib/lrndesign-imagemap-hotspot.js"
    );
    import("@haxtheweb/simple-popover/simple-popover.js");
  }
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          font-family: var(--ddd-font-primary);
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-limestoneGray)
          );
          margin: var(--ddd-spacing-4) 0;
        }
        figure {
          margin: var(--ddd-spacing-0);
          padding: var(--ddd-spacing-0);
        }
        figcaption {
          margin: 0 0 var(--ddd-spacing-4);
        }
        #heading h1,
        #heading ::slotted(*) {
          font-family: var(--ddd-font-navigation);
          font-weight: var(--ddd-font-weight-bold);
          margin: 0 0 var(--ddd-spacing-2);
        }
        #desc {
          font-size: var(--ddd-font-size-s);
          line-height: var(--ddd-lh-150, 1.5);
        }
        #svg::slotted(svg) {
          display: block;
          max-width: 100%;
          height: auto;
        }
        /* always empty; kept so existing selectors still find it */
        :host #buttons {
          display: none;
        }

        simple-popover {
          max-width: var(--lrndesign-imagemap-popover-maxWidth, 525px);
          max-height: var(--lrndesign-imagemap-popover-maxHeight, 300px);
          font-family: var(--ddd-font-primary);
          font-size: var(--ddd-font-size-s);
          line-height: var(--ddd-lh-150, 1.5);
          --simple-popover-padding: var(--ddd-spacing-4);
          --simple-popover-border-radius: var(--ddd-radius-sm);
          --simple-popover-box-shadow: var(--ddd-boxShadow-sm);
        }
        simple-popover[for=""] {
          display: none;
        }
        simple-popover .sub-heading > *:first-child {
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-xs);
          font-weight: var(--ddd-font-weight-bold);
          margin: 0 0 var(--ddd-spacing-2);
        }

        @media print {
          #svg,
          simple-popover {
            display: none;
          }
        }
      `,
    ];
  }

  render() {
    return html`
      <figure id="figure">
        <figcaption>
          <relative-heading
            disable-link
            id="heading"
            parent="${this.parent || this.subtopicOf}"
          >
            ${
              this.label
                ? html` <h1>${this.label}</h1> `
                : html` <slot name="heading"></slot> `
            }
          </relative-heading>
          <div id="desc"><slot name="desc"></slot></div>
          <slot name="source" hidden></slot>
          <div id="buttons"></div>
        </figcaption>
        <slot id="svg" name="svg"></slot>
        <simple-popover
          auto
          ?hidden="${!this.__activeHotspot}"
          position="${
            !this.__activeHotspot ? "bottom" : this.__activeHotspot.position
          }"
          .for="${!this.__activeHotspot ? undefined : this.__activeHotspot.id}"
        >
          <relative-heading
            disable-link
            class="sub-heading"
            parent="heading"
            id="subheading-${
              !this.__activeHotspot ? undefined : this.__activeHotspot.id
            }"
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
  /**
   * xAPI statements this element sends (see scripts/generate-xapi-vocabulary.mjs)
   */
  static get xapiVocabulary() {
    return {
      tag: "lrndesign-imagemap",
      event: "user-engagement",
      verbs: ["progressed", "completed"],
      objectType: "http://adlnet.gov/expapi/activities/interaction",
      result: ["completion", "score"],
      countsTowardCompletion: false,
      done: "never required; completed once every hotspot has been opened",
    };
  }
  /**
   * HAX: authors exploring the map while editing are not learners
   */
  haxHooks() {
    return {
      editModeChanged: "haxeditModeChanged",
      activeElementChanged: "haxactiveElementChanged",
    };
  }
  haxactiveElementChanged(el, val) {
    if (val) {
      this._haxstate = val;
    }
  }
  haxeditModeChanged(val) {
    this._haxstate = val;
  }
  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("keydown", this._keydown);
    this._addHotspotStyles();
  }
  disconnectedCallback() {
    this.removeEventListener("keydown", this._keydown);
    super.disconnectedCallback();
  }
  /**
   * One light DOM stylesheet for the hotspot shapes in the slotted svg
   */
  _addHotspotStyles() {
    const root = this.getRootNode ? this.getRootNode() : globalThis.document;
    const host = root && root.nodeType === 11 ? root : globalThis.document.head;
    if (!host || host.querySelector(`#${HOTSPOT_STYLE_ID}`)) {
      return;
    }
    const style = globalThis.document.createElement("style");
    style.id = HOTSPOT_STYLE_ID;
    style.textContent = HOTSPOT_CSS;
    host.appendChild(style);
  }
  /**
   * Keyboard: Enter or Space opens the focused hotspot, Escape closes it
   */
  _keydown(e) {
    const hotspots = this.hotspotDetails || [];
    if (e.key === "Escape" && this.__activeHotspot) {
      e.preventDefault();
      this.closeHotspot();
      this.__activeHotspot = undefined;
      return;
    }
    if (e.key !== "Enter" && e.key !== " ") {
      return;
    }
    const path = typeof e.composedPath === "function" ? e.composedPath() : [];
    const obj = hotspots.find(
      (h) => h.hotspot && (path.includes(h.hotspot) || e.target === h.hotspot),
    );
    if (obj) {
      e.preventDefault();
      this.openHotspot(obj);
    }
  }
  static get properties() {
    return {
      /**
       * Label for the imagemap
       */
      label: {
        type: String,
      },
      /**
       * @deprecated: (8/27/2020, after v.2.6.24) Using slot instead of the path of the SVG
       */
      src: {
        type: String,
      },
      /**
       * The path of the SVG
       */
      hotspotDetails: {
        type: Array,
        attribute: "hotspot-details",
      },
      /**
       * @deprecated: (8/27/2020, after v.2.6.24) the id of the heading element that this imagemap is a subtopic of
       */
      subtopicOf: {
        type: String,
        reflect: true,
        attribute: "subtopic-of",
      },

      parent: {
        type: String,
        reflect: true,
        attribute: "parent",
      },

      __activeHotspot: {
        type: Object,
      },
    };
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }

  firstUpdated(changeProperties) {
    if (super.firstUpdated) super.firstUpdated(changeProperties);
    this._fetchSvg(
      this.querySelector("[slot=src]")
        ? this.querySelector("[slot=src]")
        : this.src,
    );
  }

  _fetchSvg(src) {
    fetch(src)
      .then((response) => response.text())
      .then((data) => this._getSVGHandler(data));
  }

  /**
   * Convert from svg text to an array in the table function
   */
  _getSVGHandler(data) {
    let hotspots = [];
    // security: parse inertly and strip script-capable parts before the svg
    // reaches the page (was loader.innerHTML = data)
    let svg = sanitizedSvgFromMarkup(data);
    if (!svg) {
      return;
    }

    svg.slot = "svg";
    this.prepend(svg);
    svg.setAttribute("aria-labelledby", this._getInfoNode(svg, "title"));
    svg.setAttribute("aria-describedby", this._getInfoNode(svg));
    this.hotspotDetails = [];
    // this is scrape the printable hotspots for info
    this.querySelectorAll("lrndesign-imagemap-hotspot").forEach((hotspot) => {
      let obj = {
        id: hotspot.hotspotId,
        print: hotspot,
        hotspot: svg.querySelector(`#${hotspot.hotspotId}`),
        label: hotspot.label,
        position: hotspot.position || "bottom",
        details: globalThis.document.createElement("div"),
      };
      // Turning main svg interactive hotspots into buttons
      obj.hotspot.classList.add("hotspot");
      obj.hotspot.setAttribute("role", "button");
      obj.hotspot.setAttribute("aria-label", obj.label);
      // aria-controls cannot point into the shadow root from this light DOM
      // svg, so the button says whether its details are open instead
      obj.hotspot.removeAttribute("aria-controls");
      obj.hotspot.setAttribute("aria-expanded", "false");
      obj.hotspot.setAttribute("tabindex", "0");
      obj.hotspot.addEventListener("click", (_e) => this.openHotspot(obj));

      //Copy hotspot details from printable hotspots

      hotspot.childNodes.forEach((node) => {
        obj.details.appendChild(node.cloneNode(true));
      });
      obj.details.slot = "details";
      this.append(obj.details);

      // Get array data for hotspot
      this.hotspotDetails.push(obj);
      hotspots.push(hotspot.hotspotId);
    });

    this.hotspotDetails.forEach((obj) => {
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
      node = globalThis.document.createElement(nodeName);
      svg.prepend(node);
      if (query && query.innerHTML !== "") {
        node.innerHTML = query.innerHTML;
      }
    }
    return this._getId(node);
  }

  _getId(el) {
    let id = el ? el.getAttribute("id") : undefined;
    if (!id) {
      // a page wide counter is unique enough for an IDREF and, unlike a
      // random value, is not mistaken for something security sensitive
      do {
        infoNodeCount++;
        id = `lrndesign-imagemap-info-${infoNodeCount}`;
      } while (globalThis.document.getElementById(id));
      el.setAttribute("id", id);
    }
    return id;
  }
  /**
   * Selects a hotspot and opens dialog with details about it.
   */
  openHotspot(hotspot) {
    this.__activeHotspot = undefined;
    this.hotspotDetails.forEach((obj) => {
      if (obj.id === hotspot.id) {
        obj.hotspot.classList.add("selected");
        obj.hotspot.setAttribute("aria-expanded", "true");
        obj.details.style.display = "block";
        this.__activeHotspot = obj;
      } else {
        obj.hotspot.classList.remove("selected");
        obj.hotspot.setAttribute("aria-expanded", "false");
        obj.details.style.display = "none";
      }
    });
    if (this.__activeHotspot) {
      this._announceOpened(this.__activeHotspot);
    }
  }
  /**
   * Learner data: the first time each hotspot is opened is one step of
   * exploring the map (progressed); the last unseen one completes it. Never
   * while HAX is editing.
   */
  _announceOpened(obj) {
    const total = (this.hotspotDetails || []).length;
    if (this._haxstate || !obj.id || this._opened.has(obj.id) || !total) {
      return;
    }
    this._opened.add(obj.id);
    const seen = this._opened.size;
    const done = seen >= total;
    const name =
      this.label ||
      (this.shadowRoot &&
      this.shadowRoot.querySelector("#heading") &&
      this.shadowRoot.querySelector("#heading").textContent
        ? this.shadowRoot.querySelector("#heading").textContent.trim()
        : "") ||
      "Image map";
    const send = (verb) => {
      this.dispatchEvent(
        new CustomEvent("user-engagement", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: {
            activityDisplay: verb,
            objectName: name.slice(0, 120),
            objectDetail: obj.label,
            resultCompletion: done,
            resultScore: seen / total,
            statement: buildStatement({
              verb,
              object: {
                id: activityId(this, this._xapiFingerprint()),
                name: name.slice(0, 120),
                description: String(obj.label || "").slice(0, 120),
                type: XAPI_ACTIVITY_TYPES.interactionGeneric,
              },
              result: {
                completion: done,
                score: { raw: seen, min: 0, max: total },
              },
              context: {
                extensions: {
                  [XAPI_EXTENSIONS.element]: LrndesignImagemap.tag,
                },
              },
            }),
          },
        }),
      );
    };
    send("progressed");
    if (done) {
      send("completed");
    }
  }
  /**
   * Author content that identifies this map for its xAPI activity id
   */
  _xapiFingerprint() {
    const hotspots = (this.hotspotDetails || []).map((h) => h.id).join(",");
    return `lrndesign-imagemap\u0001${this.src || this.label || ""}\u0001${hotspots}`;
  }
  /**
   * Closes a hotspot.
   */
  closeHotspot() {
    let hotspot =
      this.__activeHotspot && this.__activeHotspot.hotspot
        ? this.__activeHotspot.hotspot
        : undefined;
    this.resetHotspots();
    // restore focus to the hotspot's svg shape, guarding against a missing
    // or plain-object active hotspot instead of calling focus on it
    if (hotspot && typeof hotspot.focus === "function") hotspot.focus();
  }
  /**
   * Closes dialog and deselects all hotspots.
   */
  resetHotspots() {
    let hotspots = this.querySelectorAll('.hotspot[role="button"]');
    for (let i = 0; i < hotspots.length; i++) {
      hotspots[i].classList.remove("selected");
      hotspots[i].setAttribute("aria-expanded", "false");
    }
  }
}
globalThis.customElements.define(LrndesignImagemap.tag, LrndesignImagemap);
export { LrndesignImagemap };
