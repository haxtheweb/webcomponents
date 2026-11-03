import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { IntersectionObserverMixin } from "@haxtheweb/intersection-element/lib/IntersectionObserverMixin.js";
import { sanitizeHTMLString } from "@haxtheweb/utils/utils.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
/**
 * `wikipedia-query`
 * `Query and present information from wikipedia.`
 * @demo demo/index.html
 * @element wikipedia-query
 */
const escapeAttr = (value) =>
  String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

class WikipediaQuery extends IntersectionObserverMixin(I18NMixin(DDD)) {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          --wikipedia-query-body-height: auto;
          --wikipedia-query-background-color: transparent;
        }
        :host [hidden] {
          display: none;
        }
        /* labelled frame shared with the other DDD learning blocks */
        .frame {
          box-sizing: border-box;
          border: var(--ddd-border-xs);
          border-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
          border-radius: var(--ddd-radius-md);
          overflow: hidden;
          font-family: var(--ddd-font-primary);
          background-color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-potentialMidnight)
          );
        }
        .frame-header {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-3);
          padding-block: var(--ddd-spacing-2);
          padding-inline: var(--ddd-spacing-4) var(--ddd-spacing-2);
          border-bottom: var(--ddd-border-xs);
          border-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
          min-height: var(--ddd-control-height-sm);
        }
        .frame-chip {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: none;
          width: var(--ddd-icon-xs);
          height: var(--ddd-icon-xs);
          border-radius: var(--ddd-radius-circle);
          background-color: light-dark(
            var(--ddd-theme-default-beaverBlue),
            var(--ddd-theme-default-skyBlue)
          );
          color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-potentialMidnight)
          );
          font-family: Georgia, "Times New Roman", serif;
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-bold);
          line-height: 1;
        }
        .frame-heading {
          display: flex;
          flex-direction: column;
          flex: 1 1 auto;
          min-width: 0;
        }
        .frame-label {
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-5xs);
          font-weight: var(--ddd-font-weight-medium);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneLight)
          );
        }
        :host(:lang(ar)) .frame-label,
        :host(:lang(fa)) .frame-label,
        :host(:lang(he)) .frame-label,
        :host(:lang(ur)) .frame-label {
          letter-spacing: 0;
        }
        h3 {
          color: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-white)
          );
          font-family: var(--ddd-font-primary);
          font-size: var(--ddd-font-size-3xs);
          font-weight: var(--ddd-font-weight-bold);
          line-height: var(--ddd-lh-140);
          margin: var(--ddd-spacing-0);
          overflow-wrap: anywhere;
        }
        :host([data-primary]) h3 {
          color: var(--ddd-theme-primary);
        }
        .frame-open {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: none;
          width: var(--ddd-control-height-sm);
          height: var(--ddd-control-height-sm);
          border: var(--ddd-border-xs);
          border-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
          border-radius: var(--ddd-radius-rounded);
          color: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-linkLight)
          );
          --simple-icon-width: var(--ddd-icon-4xs);
          --simple-icon-height: var(--ddd-icon-4xs);
        }
        .frame-open:hover {
          border-color: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-linkLight)
          );
        }
        .frame-open:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
        }
        #result {
          height: var(--wikipedia-query-body-height);
          overflow: auto;
          padding: var(--ddd-spacing-3) var(--ddd-spacing-4);
          line-height: var(--ddd-lh-150);
          font-size: var(--ddd-font-size-4xs);
        }
        #result > :first-child {
          margin-top: var(--ddd-spacing-0);
        }
        #result > :last-child {
          margin-bottom: var(--ddd-spacing-0);
        }
        citation-element {
          background-color: var(--wikipedia-query-background-color);
          padding: var(--ddd-spacing-2) var(--ddd-spacing-4);
          border-top: var(--ddd-border-xs);
          border-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
          font-size: var(--ddd-font-size-5xs);
          line-height: var(--ddd-lh-150);
          color: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneLight)
          );
        }
      `,
    ];
  }
  constructor() {
    super();
    this.t = this.t || {};
    this.t = {
      ...this.t,
      fromWikipedia: "From Wikipedia",
      reading: "Reading",
      readFullArticle: "Read the full article on Wikipedia",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("./locales/", import.meta.url).href,
    });
    this.hideTitle = false;
    const FALLBACK_LANG = "en";
    const docBody = globalThis.document && globalThis.document.body;
    const docRoot = globalThis.document && globalThis.document.documentElement;
    const language =
      (docBody && docBody.getAttribute("xml:lang")) ||
      (docBody && docBody.getAttribute("lang")) ||
      (docRoot && docRoot.getAttribute("xml:lang")) ||
      (docRoot && docRoot.getAttribute("lang")) ||
      (globalThis.navigator && globalThis.navigator.language) ||
      FALLBACK_LANG;
    this.language = language.split("-")[0];
    this.headers = {
      cache: "force-cache",
    };
    let date = new Date(Date.now());
    this.__now =
      date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
  }
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "wikipedia-query";
  }
  /**
   * Link to the full article on Wikipedia, or empty without a search
   */
  get articleUrl() {
    if (!this.search) {
      return "";
    }
    return `https://${this.language || "en"}.wikipedia.org/wiki/${encodeURIComponent(String(this.search).replace(/ /g, "_"))}`;
  }
  // LitElement render function
  render() {
    const articleUrl = this.articleUrl;
    return html` ${this.elementVisible
      ? html`<div class="frame">
          <div class="frame-header">
            <span class="frame-chip" aria-hidden="true">W</span>
            <div class="frame-heading">
              <span class="frame-label"
                >${this.hideTitle ? this.t.fromWikipedia : this.t.reading}</span
              >
              <h3 .hidden="${this.hideTitle}" part="heading-3">
                ${this._title}
              </h3>
            </div>
            ${articleUrl
              ? html`<a
                  class="frame-open"
                  href="${articleUrl}"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="${this.t.readFullArticle}"
                  title="${this.t.readFullArticle}"
                  ><simple-icon-lite
                    icon="icons:open-in-new"
                    aria-hidden="true"
                  ></simple-icon-lite
                ></a>`
              : ``}
          </div>
          <div id="result"></div>
          <citation-element
            creator="{Wikipedia contributors}"
            scope="sibling"
            license="by-sa"
            title="${this.search} --- {Wikipedia}{,} The Free Encyclopedia"
            source="https://${this
              .language}.wikipedia.org/w/index.php?title=${this.search}"
            date="${this.__now}"
          ></citation-element>
        </div>`
      : ``}`;
  }
  updateArticle(search, headers, language) {
    fetch(
      `https://${language}.wikipedia.org/w/api.php?origin=*&action=query&titles=${search}&prop=extracts&format=json`,
      headers,
    )
      .then((response) => {
        if (response.ok) return response.json();
      })
      .then((json) => {
        this.handleResponse(json);
      });
  }
  /**
   * LitElement properties updated
   */
  willUpdate(changedProperties) {
    if (super.willUpdate) super.willUpdate(changedProperties);
    // Derive _title from search/title in willUpdate so the reactive set
    // batches into the current update cycle. Setting it in updated()
    // scheduled a redundant second update (Lit change-in-update warning).
    if (changedProperties.has("search")) {
      if (this.title) {
        this._title = this.title;
      } else {
        this._title = this.search.replace("_", " ") + " Wikipedia article";
      }
    }
    if (changedProperties.has("title")) {
      if (this.title) {
        this._title = this.title;
      }
    }
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      // element is visible, now we can search
      if (propName == "elementVisible" && this[propName]) {
        import("@haxtheweb/citation-element/citation-element.js");
      }
      if (
        ["elementVisible", "search", "headers", "language"].includes(
          propName,
        ) &&
        this.search &&
        this.headers &&
        this.elementVisible &&
        this.language
      ) {
        clearTimeout(this._debounce);
        this._debounce = setTimeout(() => {
          this.updateArticle(this.search, this.headers, this.language);
        }, 10);
      }
    });
  }
  static get properties() {
    let props = {};
    if (super.properties) {
      props = super.properties;
    }
    return {
      ...props,
      title: {
        type: String,
      },
      __now: {
        type: String,
      },
      _title: {
        type: String,
      },
      headers: {
        type: Object,
      },
      /**
       * hideTitle
       */
      hideTitle: {
        type: Boolean,
        attribute: "hide-title",
      },
      /**
       * Search string.
       */
      search: {
        type: String,
      },
      /**
       * Two letter language abbreviation used by
       * Wikipedia (ex: Spanish = "es").
       */
      language: {
        type: String,
      },
    };
  }
  /**
   * Process response from wikipedia.
   */
  handleResponse(response) {
    // the key of pages is a number so need to look for it
    if (typeof response !== typeof undefined && response.query) {
      for (let key in response.query.pages) {
        // skip anything that's prototype object
        if (!Object.prototype.hasOwnProperty.call(response.query.pages, key))
          continue;
        // load object response, double check we have an extract
        if (
          response.query.pages[key].extract &&
          this.shadowRoot &&
          this.shadowRoot.querySelector("#result")
        ) {
          let html = response.query.pages[key].extract;
          // security (F1/JS-XSS-001): sanitize network HTML from Wikipedia API
          // before assigning to innerHTML (neutralizes onerror/javascript:/iframe/svg)
          html = sanitizeHTMLString(html);
          // need to innerHTML this or it won't set
          this.shadowRoot.querySelector("#result").innerHTML = html;
        }
      }
    }
  }
  /**
   * Implements haxHooks to tie into life-cycle if hax exists.
   */
  haxHooks() {
    return {
      progressiveEnhancement: "haxprogressiveEnhancement",
      gizmoRegistration: "haxgizmoRegistration",
    };
  }
  /**
   * Hook for HAX progressive enhancement: a link to the article for RSS, bots
   * and readers without JavaScript (the article itself is fetched client side).
   */
  haxprogressiveEnhancement(_el) {
    const search = this.search || this.title;
    if (!search) {
      return "";
    }
    const language = this.language || "en";
    return `<a href="https://${escapeAttr(language)}.wikipedia.org/wiki/${encodeURIComponent(String(search).replace(/ /g, "_"))}">${escapeAttr(this.title || search)}</a>`;
  }
  /**
   * @see haxHooks: gizmoRegistration
   */
  haxgizmoRegistration(store) {
    globalThis.dispatchEvent(
      new CustomEvent("i18n-manager-register-element", {
        detail: {
          namespace: `wikipedia-query.haxProperties`,
          localesPath: new URL(`./locales`, import.meta.url).href,
        },
      }),
    );
    // ensure that this is a valid type of gizmo for endpoints
    // this is nessecary because wikipedia-query wants to be the sole
    // provider of display for things coming off the API
    store.validGizmoTypes.push("wikipedia");
    if (
      store.appList.filter((el, _i) => {
        // ensure we don't double load the endpoint if already defined
        if (el.connection.url === this.language + ".wikipedia.org") {
          return true;
        }
        return false;
      }).length === 0
    ) {
      globalThis.dispatchEvent(
        new CustomEvent("hax-register-app", {
          bubbles: false,
          composed: false,
          cancelable: false,
          detail: this.haxAppDetails,
        }),
      );
    }
  }
  // return valid appStore spec for how to connect to the wikipedia API
  get haxAppDetails() {
    return {
      details: {
        title: "Wikipedia",
        icon: "account-balance",
        color: "grey",
        author: "Wikimedia",
        description: "Encyclopedia of the world.",
        status: "available",
        tags: [
          "Search",
          "source",
          "wikipedia",
          "content",
          "encyclopedia",
          "wiki",
        ],
      },
      connection: {
        protocol: "https",
        url: this.language + ".wikipedia.org",
        data: {
          action: "query",
          list: "search",
          format: "json",
          origin: "*",
        },
        operations: {
          browse: {
            method: "GET",
            endPoint: "w/api.php",
            pagination: {
              style: "offset",
              props: {
                offset: "sroffset",
              },
            },
            search: {
              srsearch: {
                title: "Search",
                type: "string",
              },
            },
            data: {},
            resultMap: {
              image:
                "https://" +
                this.language +
                ".wikipedia.org/static/images/project-logos/enwiki.png",
              defaultGizmoType: "wikipedia",
              items: "query.search",
              preview: {
                title: "title",
                details: "snippet",
                id: "title",
              },
              gizmo: {
                _url_source:
                  "https://" + this.language + ".wikipedia.org/wiki/<%= id %>",
                id: "title",
                title: "title",
                caption: "snippet",
                description: "snippet",
              },
            },
          },
        },
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
}
globalThis.customElements.define(WikipediaQuery.tag, WikipediaQuery);
export { WikipediaQuery };
