/**
 * Copyright 2022 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { sanitizeHTMLString } from "@haxtheweb/utils/utils.js";
/**
 * `enhanced-text`
 * `take text and process it with various enhancements`
 * @demo demo/index.html
 * @element enhanced-text
 */
class EnhancedText extends LitElement {
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.loading = false;
    this.auto = false;
    this.fixationPoint = 4;
    this.vide = false;
    this.wikipedia = false;
    this.haxcmsGlossary = false;
    this.haxcmsSiteLocation = "";
    this.haxcmsSite = null;
    this.haxcmsMarkAll = false;
  }
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    // automatic enhancement if set, otherwise manual
    if (this.auto) {
      this.enhance();
    }
  }

  // apply terms from whatever came back
  applyTermFromList(data) {
    if (data && data.status && data.data && data.data.length) {
      // haxtheweb/issues#3107: the dynamic vocab-term import used to be
      // fire-and-forget, so a module-graph failure (the round-10 swarm saw
      // an unhandled rejection for a bare-lit ifDefined import in this
      // graph) leaked as console noise; a failed load now degrades to the
      // un-wrapped text instead of an unhandled promise rejection
      import("@haxtheweb/vocab-term/vocab-term.js").catch((e) => {
        console.warn(
          "vocab-term failed to load; skipping glossary enhancement",
          e,
        );
      });
      // loop through and apply terms that were found w/ the vocab-term element
      // get all text nodes internally
      let textNodes = [...this.childNodes] // has childNodes inside, including text ones
        .filter((child) => child.nodeType === 3) // get only text nodes
        .filter((child) => child.textContent.trim()); // eliminate empty text
      // no text nodes, look for html
      if (textNodes.length === 0) {
        const content = this.innerText;
        this.innerHTML = "";
        content.split(/\s|\.+/).forEach((item) => {
          const tn = globalThis.document.createTextNode(item);
          this.appendChild(tn);
          this.appendChild(document.createTextNode(" "));
        });
        textNodes = [...this.childNodes] // has childNodes inside, including text ones
          .filter((child) => child.nodeType === 3) // get only text nodes
          .filter((child) => child.textContent.trim()); // eliminate empty text
      }
      // if we only have 1, leverage it
      if (textNodes.length === 1) {
        const content = textNodes[0].textContent;
        textNodes[0].remove();
        content.split(/\s|\.+/).forEach((item) => {
          const tn = globalThis.document.createTextNode(item);
          this.appendChild(tn);
          this.appendChild(document.createTextNode(" "));
        });
        textNodes = [...this.childNodes] // has childNodes inside, including text ones
          .filter((child) => child.nodeType === 3) // get only text nodes
          .filter((child) => child.textContent.trim()); // eliminate empty text
      }
      // loop through data and apply vocab-term wrapper
      for (let i = 0; i < data.data.length; i++) {
        let term = data.data[i];
        let found = false;
        // find textnodes that match the term and apply
        for (let j = 0; j < textNodes.length; j++) {
          let el = textNodes[j];
          if (
            el.textContent.toLowerCase() === term.term.toLowerCase() &&
            (!found || this.haxcmsMarkAll)
          ) {
            // find term in contents of page
            // replace in context
            let termEl = globalThis.document.createElement("vocab-term");
            termEl.term = el.textContent;
            termEl.information = term.definition;
            // support for links from endpoint
            if (term.links && term.links.length > 0) {
              let div = globalThis.document.createElement("div");
              div.classList.add("links");
              for (let t = 0; t < term.links.length; t++) {
                let a = globalThis.document.createElement("a");
                a.href = term.links[t].href;
                a.innerText = term.links[t].title;
                div.appendChild(a);
              }
              termEl.appendChild(div);
            }
            el.parentNode.insertBefore(termEl, el);
            termEl.appendChild(el);
            found = true;
          }
        }
      }
    }
  }

  // apply enhancement to text. if not in auto user must invoke this.
  // Everything runs in the browser: vide with the text-vide library, the
  // glossary from the site's own glossary page. No outside service is
  // called (both used to go through open-apis.hax.cloud, now retired).
  async enhance() {
    const body = this.innerHTML;
    this.loading = true;
    if (this.vide) {
      this.enhancedTextResponse({
        status: 200,
        data: await this.videText(body),
      });
    }
    if (this.haxcmsGlossary && (this.haxcmsSiteLocation || this.haxcmsSite)) {
      this.applyTermFromList({
        status: 200,
        data: await this.siteGlossaryTerms(),
      });
    }
    // all above will run in order
    this.loading = false;
  }

  /**
   * the html with the start of each word in bold (text-vide); "" when the
   * library can't load
   */
  async videText(body) {
    let fixationPoint = parseInt(this.fixationPoint, 10);
    if (!(fixationPoint >= 1 && fixationPoint <= 5)) {
      fixationPoint = 4;
    }
    try {
      const { textVide } = await import("text-vide");
      return textVide(body, { fixationPoint: fixationPoint });
    } catch (e) {
      console.warn("text-vide failed to load; skipping vide enhancement", e);
      return "";
    }
  }

  /**
   * [{ term, definition }] from the HAXcms site's glossary page (the page
   * with the slug "glossary"): each dt with the dd after it. The site comes
   * from haxcmsSite (site.json data) or haxcmsSiteLocation (where the site
   * lives, with or without /site.json); [] when there is no glossary.
   */
  async siteGlossaryTerms() {
    const terms = [];
    try {
      let site = null;
      let base = "";
      if (this.haxcmsSite && Array.isArray(this.haxcmsSite.items)) {
        site = this.haxcmsSite;
        base =
          typeof site.file === "string"
            ? site.file.replace(/\/?site\.json$/, "")
            : "";
      } else if (this.haxcmsSiteLocation) {
        base = String(this.haxcmsSiteLocation).replace(/\/?site\.json$/, "");
        site = await fetch(`${base}/site.json`).then((r) =>
          r.ok ? r.json() : null,
        );
      }
      if (!site || !Array.isArray(site.items)) {
        return terms;
      }
      const item = site.items.find((i) => i && i.slug === "glossary");
      if (!item || typeof item.location !== "string" || !item.location) {
        return terms;
      }
      const url = base ? `${base}/${item.location}` : item.location;
      const html = await fetch(url).then((r) => (r.ok ? r.text() : ""));
      // parsed inert: nothing in the page runs
      const doc = new DOMParser().parseFromString(html, "text/html");
      const dts = doc.querySelectorAll("dt");
      const dds = doc.querySelectorAll("dd");
      if (dts.length && dts.length === dds.length) {
        for (let i = 0; i < dts.length; i++) {
          terms.push({
            term: dts[i].textContent,
            definition: dds[i].textContent,
          });
        }
      }
    } catch (e) {
      console.warn("glossary could not be read; skipping glossary", e);
    }
    return terms;
  }

  static get properties() {
    return {
      /**
       * Kept so older content keeps working; it no longer does anything
       * (glossary terms are not looked up on Wikipedia).
       */
      wikipedia: {
        type: Boolean,
        reflect: true,
      },
      vide: {
        type: Boolean,
        reflect: true,
      },
      fixationPoint: {
        type: Number,
        attribute: "fixation-point",
      },
      /**
       * Wrap terms from the HAXcms site glossary in vocab-term definitions.
       */
      haxcmsGlossary: {
        type: Boolean,
        attribute: "haxcms-glossary",
      },
      haxcmsSiteLocation: {
        type: String,
        attribute: "haxcms-site-location",
      },
      haxcmsSite: {
        type: Object,
        attribute: "haxcms-site",
      },
      /**
       * Mark every match of a glossary term, not only the first one.
       */
      haxcmsMarkAll: {
        type: Boolean,
        attribute: "haxcms-mark-all",
      },
      loading: {
        type: Boolean,
        reflect: true,
      },
      /**
       * Enhance the text as soon as the element loads, without calling
       * enhance().
       */
      auto: {
        type: Boolean,
        reflect: true,
      },
    };
  }

  enhancedTextResponse(data) {
    if (data.status && data.data && data.data.length) {
      // security (JS-XSS): service response is untrusted; sanitize before
      // innerHTML
      this.innerHTML = sanitizeHTMLString(data.data);
    }
  }

  /**
   * LitElement style callback
   */
  static get styles() {
    // support for using in other classes
    let styles = [];
    if (super.styles) {
      styles = super.styles;
    }
    return [
      styles,
      css`
        :host {
          display: block;
          --enhanced-text-loader-color: light-dark(
            var(--ddd-theme-default-coalyGray, #000000),
            var(--ddd-theme-default-white, #ffffff)
          );
        }
        div::slotted(bold) {
          font-weight: 800;
        }
        :host([loading]) .loading {
          margin: 8px 0 0 -12px;
          font-size: 2px;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          position: absolute;
          -webkit-animation: load5 1.1s infinite ease;
          animation: load5 1.1s infinite ease;
          -webkit-transform: translateZ(0);
          -ms-transform: translateZ(0);
          transform: translateZ(0);
        }
        @-webkit-keyframes load5 {
          0%,
          100% {
            box-shadow:
              0em -2.6em 0em 0em
                var(--enhanced-text-color, var(--enhanced-text-loader-color)),
              1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2),
              2.5em 0em 0 0em rgba(255, 255, 255, 0.2),
              1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2),
              0em 2.5em 0 0em rgba(255, 255, 255, 0.2),
              -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2),
              -2.6em 0em 0 0em rgba(255, 255, 255, 0.5),
              -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.7);
          }
          12.5% {
            box-shadow:
              0em -2.6em 0em 0em rgba(255, 255, 255, 0.7),
              1.8em -1.8em 0 0em
                var(--enhanced-text-color, var(--enhanced-text-loader-color)),
              2.5em 0em 0 0em rgba(255, 255, 255, 0.2),
              1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2),
              0em 2.5em 0 0em rgba(255, 255, 255, 0.2),
              -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2),
              -2.6em 0em 0 0em rgba(255, 255, 255, 0.2),
              -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.5);
          }
          25% {
            box-shadow:
              0em -2.6em 0em 0em rgba(255, 255, 255, 0.5),
              1.8em -1.8em 0 0em rgba(255, 255, 255, 0.7),
              2.5em 0em 0 0em
                var(--enhanced-text-color, var(--enhanced-text-loader-color)),
              1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2),
              0em 2.5em 0 0em rgba(255, 255, 255, 0.2),
              -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2),
              -2.6em 0em 0 0em rgba(255, 255, 255, 0.2),
              -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
          }
          37.5% {
            box-shadow:
              0em -2.6em 0em 0em rgba(255, 255, 255, 0.2),
              1.8em -1.8em 0 0em rgba(255, 255, 255, 0.5),
              2.5em 0em 0 0em rgba(255, 255, 255, 0.7),
              1.75em 1.75em 0 0em
                var(--enhanced-text-color, var(--enhanced-text-loader-color)),
              0em 2.5em 0 0em rgba(255, 255, 255, 0.2),
              -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2),
              -2.6em 0em 0 0em rgba(255, 255, 255, 0.2),
              -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
          }
          50% {
            box-shadow:
              0em -2.6em 0em 0em rgba(255, 255, 255, 0.2),
              1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2),
              2.5em 0em 0 0em rgba(255, 255, 255, 0.5),
              1.75em 1.75em 0 0em rgba(255, 255, 255, 0.7),
              0em 2.5em 0 0em
                var(--enhanced-text-color, var(--enhanced-text-loader-color)),
              -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2),
              -2.6em 0em 0 0em rgba(255, 255, 255, 0.2),
              -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
          }
          62.5% {
            box-shadow:
              0em -2.6em 0em 0em rgba(255, 255, 255, 0.2),
              1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2),
              2.5em 0em 0 0em rgba(255, 255, 255, 0.2),
              1.75em 1.75em 0 0em rgba(255, 255, 255, 0.5),
              0em 2.5em 0 0em rgba(255, 255, 255, 0.7),
              -1.8em 1.8em 0 0em
                var(--enhanced-text-color, var(--enhanced-text-loader-color)),
              -2.6em 0em 0 0em rgba(255, 255, 255, 0.2),
              -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
          }
          75% {
            box-shadow:
              0em -2.6em 0em 0em rgba(255, 255, 255, 0.2),
              1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2),
              2.5em 0em 0 0em rgba(255, 255, 255, 0.2),
              1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2),
              0em 2.5em 0 0em rgba(255, 255, 255, 0.5),
              -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.7),
              -2.6em 0em 0 0em
                var(--enhanced-text-color, var(--enhanced-text-loader-color)),
              -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
          }
          87.5% {
            box-shadow:
              0em -2.6em 0em 0em rgba(255, 255, 255, 0.2),
              1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2),
              2.5em 0em 0 0em rgba(255, 255, 255, 0.2),
              1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2),
              0em 2.5em 0 0em rgba(255, 255, 255, 0.2),
              -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.5),
              -2.6em 0em 0 0em rgba(255, 255, 255, 0.7),
              -1.8em -1.8em 0 0em
                var(--enhanced-text-color, var(--enhanced-text-loader-color));
          }
        }
        @keyframes load5 {
          0%,
          100% {
            box-shadow:
              0em -2.6em 0em 0em
                var(--enhanced-text-color, var(--enhanced-text-loader-color)),
              1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2),
              2.5em 0em 0 0em rgba(255, 255, 255, 0.2),
              1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2),
              0em 2.5em 0 0em rgba(255, 255, 255, 0.2),
              -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2),
              -2.6em 0em 0 0em rgba(255, 255, 255, 0.5),
              -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.7);
          }
          12.5% {
            box-shadow:
              0em -2.6em 0em 0em rgba(255, 255, 255, 0.7),
              1.8em -1.8em 0 0em
                var(--enhanced-text-color, var(--enhanced-text-loader-color)),
              2.5em 0em 0 0em rgba(255, 255, 255, 0.2),
              1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2),
              0em 2.5em 0 0em rgba(255, 255, 255, 0.2),
              -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2),
              -2.6em 0em 0 0em rgba(255, 255, 255, 0.2),
              -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.5);
          }
          25% {
            box-shadow:
              0em -2.6em 0em 0em rgba(255, 255, 255, 0.5),
              1.8em -1.8em 0 0em rgba(255, 255, 255, 0.7),
              2.5em 0em 0 0em
                var(--enhanced-text-color, var(--enhanced-text-loader-color)),
              1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2),
              0em 2.5em 0 0em rgba(255, 255, 255, 0.2),
              -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2),
              -2.6em 0em 0 0em rgba(255, 255, 255, 0.2),
              -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
          }
          37.5% {
            box-shadow:
              0em -2.6em 0em 0em rgba(255, 255, 255, 0.2),
              1.8em -1.8em 0 0em rgba(255, 255, 255, 0.5),
              2.5em 0em 0 0em rgba(255, 255, 255, 0.7),
              1.75em 1.75em 0 0em
                var(--enhanced-text-color, var(--enhanced-text-loader-color)),
              0em 2.5em 0 0em rgba(255, 255, 255, 0.2),
              -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2),
              -2.6em 0em 0 0em rgba(255, 255, 255, 0.2),
              -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
          }
          50% {
            box-shadow:
              0em -2.6em 0em 0em rgba(255, 255, 255, 0.2),
              1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2),
              2.5em 0em 0 0em rgba(255, 255, 255, 0.5),
              1.75em 1.75em 0 0em rgba(255, 255, 255, 0.7),
              0em 2.5em 0 0em
                var(--enhanced-text-color, var(--enhanced-text-loader-color)),
              -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2),
              -2.6em 0em 0 0em rgba(255, 255, 255, 0.2),
              -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
          }
          62.5% {
            box-shadow:
              0em -2.6em 0em 0em rgba(255, 255, 255, 0.2),
              1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2),
              2.5em 0em 0 0em rgba(255, 255, 255, 0.2),
              1.75em 1.75em 0 0em rgba(255, 255, 255, 0.5),
              0em 2.5em 0 0em rgba(255, 255, 255, 0.7),
              -1.8em 1.8em 0 0em
                var(--enhanced-text-color, var(--enhanced-text-loader-color)),
              -2.6em 0em 0 0em rgba(255, 255, 255, 0.2),
              -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
          }
          75% {
            box-shadow:
              0em -2.6em 0em 0em rgba(255, 255, 255, 0.2),
              1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2),
              2.5em 0em 0 0em rgba(255, 255, 255, 0.2),
              1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2),
              0em 2.5em 0 0em rgba(255, 255, 255, 0.5),
              -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.7),
              -2.6em 0em 0 0em
                var(--enhanced-text-color, var(--enhanced-text-loader-color)),
              -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
          }
          87.5% {
            box-shadow:
              0em -2.6em 0em 0em rgba(255, 255, 255, 0.2),
              1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2),
              2.5em 0em 0 0em rgba(255, 255, 255, 0.2),
              1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2),
              0em 2.5em 0 0em rgba(255, 255, 255, 0.2),
              -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.5),
              -2.6em 0em 0 0em rgba(255, 255, 255, 0.7),
              -1.8em -1.8em 0 0em
                var(--enhanced-text-color, var(--enhanced-text-loader-color));
          }
        }

        /* nothing moves with prefers-reduced-motion */
        @media (prefers-reduced-motion: reduce) {
          :host,
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            transition-delay: 0ms !important;
          }
        }
      `,
    ];
  }
  /**
   * LitElement render callback
   */
  render() {
    return html`
      <div class="loading"></div>
      <slot></slot>
    `;
  }
  /**
   * Convention we use
   */
  static get tag() {
    return "enhanced-text";
  }
}
globalThis.customElements.define(EnhancedText.tag, EnhancedText);
export { EnhancedText };
