import { html, css, nothing } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import {
  DDDBlockStyles,
  DDDCompletionTracker,
  celebrateDDDCompletion,
  renderDDDBlockHeader,
} from "@haxtheweb/d-d-d/lib/DDDBlock.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import { sanitizedSvgFromMarkup } from "./lib/lrndesign-imagemap-sanitize.js";
import {
  activityId,
  buildStatement,
  legacyActivityId,
  XAPI_ACTIVITY_TYPES,
  XAPI_EXTENSIONS,
  XAPI_ITEM_DELIMITER,
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
  stroke: var(
    --ddd-theme-primary,
    light-dark(
      var(--ddd-theme-default-beaverBlue, #1e407c),
      var(--ddd-theme-default-skyBlue, #009cde)
    )
  );
  stroke-width: var(--ddd-border-size-md, 3px);
  fill: color-mix(
    in srgb,
    var(--ddd-theme-primary, var(--ddd-theme-default-beaverBlue, #1e407c)) 12%,
    transparent
  );
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
 * Each statement carries the ids of the hotspots opened so far as its
 * result.response, so the learner profile can hand them back: on load the
 * map asks for them (`learner-progress-request`, as questions and
 * checklists do) and the footer and done chip pick up where the learner
 * left off.
 *
 * @demo demo/index.html
 */
class LrndesignImagemap extends I18NMixin(DDD) {
  constructor() {
    super();
    this._haxstate = false;
    this._opened = new Set();
    this._completion = new DDDCompletionTracker();
    this._progressChecked = false;
    this._keydown = this._keydown.bind(this);
    this.t = {
      ...this.t,
      imageMap: "Image map",
      interactive: "Interactive",
      hotspot: "Hotspot",
      hotspotPosition: "{n} of {total}",
      hotspotsExplored: "{n} of {total} hotspots explored",
      explored: "Explored",
      close: "Close",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("./locales/", import.meta.url).href,
    });
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
      DDDBlockStyles,
      css`
        :host {
          display: block;
          font-family: var(--ddd-font-primary);
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          margin: var(--ddd-spacing-4) 0;
        }
        figure {
          margin: var(--ddd-spacing-0);
          padding: var(--ddd-spacing-0);
        }
        /* the hotspot popover may reach past the frame */
        figure.ddd-block {
          overflow: visible;
        }
        figcaption {
          margin: var(--ddd-spacing-0);
        }
        /* the label keeps its relative-heading level and reads as the
           block title */
        #heading :is(h1, h2, h3, h4, h5, h6),
        #heading ::slotted(*) {
          margin: 0;
          font-family: var(--ddd-font-primary);
          font-size: var(--ddd-font-size-xs);
          font-weight: var(--ddd-font-weight-bold);
          line-height: var(--ddd-lh-120);
          overflow-wrap: anywhere;
          color: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-white)
          );
        }
        #desc {
          padding: var(--ddd-spacing-3) var(--ddd-spacing-4) 0;
          font-size: var(--ddd-font-size-4xs);
          line-height: var(--ddd-lh-150, 1.5);
        }
        #desc ::slotted(*) {
          margin-top: var(--ddd-spacing-0);
        }
        .map {
          position: relative;
          padding: var(--ddd-spacing-3) var(--ddd-spacing-4)
            var(--ddd-spacing-4);
        }
        #svg::slotted(svg) {
          display: block;
          max-width: 100%;
          height: auto;
          border-radius: var(--ddd-radius-sm);
        }
        /* always empty; kept so existing selectors still find it */
        :host #buttons {
          display: none;
        }

        /* the vocab-term popover look */
        simple-popover {
          max-width: var(--lrndesign-imagemap-popover-maxWidth, 525px);
          max-height: var(--lrndesign-imagemap-popover-maxHeight, 300px);
          font-family: var(--ddd-font-primary);
          font-size: var(--ddd-font-size-4xs);
          line-height: var(--ddd-lh-140, 1.4);
          --simple-popover-padding: var(--ddd-spacing-3);
          --simple-popover-border-radius: var(--ddd-radius-md);
          --simple-popover-border-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
          --simple-popover-background-color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
          );
          --simple-popover-color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          --simple-popover-box-shadow: var(--ddd-boxShadow-sm);
        }
        simple-popover[for=""] {
          display: none;
        }
        .popover-header {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
          margin: 0 0 var(--ddd-spacing-1);
        }
        .popover-chip {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: none;
          width: var(--ddd-icon-xxs);
          height: var(--ddd-icon-xxs);
          border-radius: var(--ddd-radius-circle);
          background-color: light-dark(
            var(--ddd-theme-default-beaverBlue),
            var(--ddd-theme-default-skyBlue)
          );
          color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-potentialMidnight)
          );
          --simple-icon-color: currentColor;
          --simple-icon-width: var(--ddd-icon-4xs);
          --simple-icon-height: var(--ddd-icon-4xs);
        }
        .popover-header .ddd-block-label {
          flex: 1 1 auto;
        }
        .popover-header .ddd-block-action {
          min-width: var(--ddd-icon-xs);
          height: var(--ddd-icon-xs);
        }
        simple-popover .sub-heading > *:first-child {
          font-family: var(--ddd-font-primary);
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-bold);
          margin: 0 0 var(--ddd-spacing-1);
          color: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-white)
          );
        }
        .progress {
          display: inline-flex;
          gap: var(--ddd-spacing-1);
        }
        .progress span {
          width: var(--ddd-spacing-5);
          height: var(--ddd-spacing-1);
          border-radius: var(--ddd-radius-xs);
          background-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
        }
        .progress span[data-explored] {
          background-color: light-dark(
            var(--ddd-theme-default-beaverBlue),
            var(--ddd-theme-default-skyBlue)
          );
        }
        .ddd-block-footer {
          font-family: var(--ddd-font-navigation);
          font-weight: var(--ddd-font-weight-medium);
          color: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneLight)
          );
        }

        @media print {
          #svg,
          simple-popover,
          .ddd-block-chip,
          .ddd-block-label,
          .ddd-block-footer {
            display: none;
          }
          .ddd-block,
          .ddd-block-header {
            border: none;
          }
        }
      `,
    ];
  }

  /**
   * How many hotspots there are and how many the learner has opened
   */
  get _progress() {
    const hotspots = this.hotspotDetails || [];
    const total = hotspots.length;
    const explored = hotspots.filter((h) => this._opened.has(h.id)).length;
    return { total, explored, done: total > 0 && explored >= total };
  }
  /**
   * fill {placeholders} in a translated string
   */
  _format(str, values) {
    return Object.keys(values).reduce(
      (out, key) => out.split(`{${key}}`).join(String(values[key])),
      String(str || ""),
    );
  }
  render() {
    const { total, explored, done } = this._progress;
    const active = this.__activeHotspot;
    const position = active
      ? (this.hotspotDetails || []).findIndex((h) => h.id === active.id) + 1
      : 0;
    return html`
      <figure id="figure" class="ddd-block">
        <figcaption>
          ${renderDDDBlockHeader({
            icon: "image:image",
            label: `${this.t.imageMap} · ${this.t.interactive}`,
            done,
            doneLabel: this.t.explored,
            after: html`<relative-heading
              disable-link
              id="heading"
              parent="${this.parent || this.subtopicOf}"
            >
              ${
                this.label
                  ? html` <h1>${this.label}</h1> `
                  : html` <slot name="heading"></slot> `
              }
            </relative-heading>`,
          })}
          <div id="desc"><slot name="desc"></slot></div>
          <slot name="source" hidden></slot>
          <div id="buttons"></div>
        </figcaption>
        <div class="map ddd-block-body">
          <slot id="svg" name="svg"></slot>
        </div>
        <simple-popover
          auto
          ?hidden="${!active}"
          position="${!active ? "bottom" : active.position}"
          .for="${!active ? undefined : active.id}"
        >
          <div class="popover-header">
            <span class="popover-chip" aria-hidden="true"
              ><simple-icon-lite icon="image:adjust"></simple-icon-lite
            ></span>
            <span class="ddd-block-label"
              >${this.t.hotspot} ·
              ${this._format(this.t.hotspotPosition, {
                n: position,
                total,
              })}</span
            >
            <button
              class="ddd-block-action close"
              aria-label="${this.t.close}"
              title="${this.t.close}"
              @click="${this._closeClicked}"
            >
              <simple-icon-lite icon="close"></simple-icon-lite>
            </button>
          </div>
          <relative-heading
            disable-link
            class="sub-heading"
            parent="heading"
            id="subheading-${!active ? undefined : active.id}"
          >
            <h2>${!active ? "" : active.label}</h2>
          </relative-heading>
          <slot id="details" name="details"></slot>
        </simple-popover>
        ${
          total
            ? html`<div class="ddd-block-footer">
                <span class="progress" aria-hidden="true"
                  >${(this.hotspotDetails || []).map(
                    (h) =>
                      html`<span
                        ?data-explored="${this._opened.has(h.id)}"
                      ></span>`,
                  )}</span
                >
                <span class="explored" aria-live="polite"
                  >${this._format(this.t.hotspotsExplored, {
                    n: explored,
                    total,
                  })}</span
                >
              </div>`
            : nothing
        }
      </figure>
      <slot></slot>
    `;
  }
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    // the burst plays once, the first time the learner explores the last
    // hotspot; never for a map already explored when it loads
    if (this._progressChecked && (this.hotspotDetails || []).length) {
      if (this._completion.update("map", this._progress.done)) {
        celebrateDDDCompletion(
          this.shadowRoot.querySelector(".ddd-block-chip"),
        );
      }
    }
  }
  /**
   * Close button in the popover: same as Escape
   */
  _closeClicked() {
    this.closeHotspot();
    this.__activeHotspot = undefined;
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
      result: ["completion", "score", "response"],
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
    if (!this._progressListeners) {
      this._progressListeners = new AbortController();
      const opts = { signal: this._progressListeners.signal };
      globalThis.addEventListener(
        "learner-progress-ready",
        () => this._requestLearnerProgress(),
        opts,
      );
      globalThis.addEventListener(
        "learner-progress-cleared",
        () => this._clearLearnerProgress(),
        opts,
      );
    }
  }
  disconnectedCallback() {
    this.removeEventListener("keydown", this._keydown);
    if (this._progressListeners) {
      this._progressListeners.abort();
      this._progressListeners = null;
    }
    super.disconnectedCallback();
  }
  /**
   * Ask a learner progress listener (the HAXcms learner profile) which
   * hotspots this visitor opened before, so the footer and done chip
   * survive a reload. Needs the hotspots, since they are part of the
   * activity id.
   */
  _requestLearnerProgress() {
    if (
      !this.isConnected ||
      this._haxstate ||
      !(this.hotspotDetails || []).length
    ) {
      return;
    }
    const fingerprint = this._xapiFingerprint();
    const detail = {
      activityId: activityId(this, fingerprint),
      tag: LrndesignImagemap.tag,
      record: null,
    };
    const legacy = legacyActivityId(this, fingerprint);
    if (legacy !== detail.activityId) {
      detail.legacyActivityId = legacy;
    }
    globalThis.dispatchEvent(
      new CustomEvent("learner-progress-request", { detail }),
    );
    const record = detail.record;
    if (record && typeof record === "object") {
      this._applyLearnerRecord(record);
    }
    this._progressChecked = true;
    this.requestUpdate();
  }
  /**
   * Put back the hotspots a saved record says were opened. The response
   * lists their ids; a record with no response (sent before ids were
   * kept) still restores "done" when the map was completed.
   */
  _applyLearnerRecord(record) {
    const ids = (this.hotspotDetails || []).map((h) => h.id);
    let opened = [];
    if (typeof record.response === "string" && record.response) {
      opened = record.response
        .split(XAPI_ITEM_DELIMITER)
        .filter((id) => ids.includes(id));
    } else if (record.done) {
      opened = ids;
    }
    opened.forEach((id) => this._opened.add(id));
    // what was restored is not a new completion
    this._completion.forget("map");
  }
  /**
   * The learner cleared their progress: start exploring again
   */
  _clearLearnerProgress() {
    this._opened.clear();
    this._completion.forget("map");
    this.requestUpdate();
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
    this._requestLearnerProgress();
    // without a learner profile there is nothing to restore; start
    // watching for completion from here
    this._progressChecked = true;
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
                // which hotspots were opened, read back on the next visit
                response: [...this._opened].join(XAPI_ITEM_DELIMITER),
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
    this.requestUpdate();
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
