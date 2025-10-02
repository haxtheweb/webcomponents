import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { IntersectionObserverMixin } from "@haxtheweb/intersection-element/lib/IntersectionObserverMixin.js";
/**
 * `wikipedia-query`
 * `Query and present information from wikipedia.`
 * @demo demo/index.html
 * @element wikipedia-query
 */
class WikipediaQuery extends IntersectionObserverMixin(DDD) {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          --wikipedia-query-body-height: var(--ddd-spacing-32);
          --wikipedia-query-background-color: var(
            --ddd-theme-default-limestoneMaxLight
          );
        }
        :host [hidden] {
          display: none;
        }
        h3 {
          color: var(--ddd-theme-primary);
          font-size: var(--ddd-font-size-l);
          font-weight: var(--ddd-font-weight-medium);
          margin: 0 0 var(--ddd-spacing-2) 0;
        }
        #result {
          height: var(--wikipedia-query-body-height);
          overflow: auto;
          border: var(--ddd-border-sm);
          border-color: var(--ddd-theme-default-limestoneGray);
          border-radius: var(--ddd-radius-xs);
          padding: var(--ddd-spacing-2) var(--ddd-spacing-4);
          background-color: var(--ddd-theme-default-white);
          line-height: var(--ddd-lh-150);
          font-size: var(--ddd-font-size-s);
        }
        citation-element {
          background-color: var(--wikipedia-query-background-color);
          padding: var(--ddd-spacing-4) var(--ddd-spacing-2);
          font-size: var(--ddd-font-size-xs);
          border-radius: var(--ddd-radius-xs);
          margin-top: var(--ddd-spacing-2);
        }
      `,
    ];
  }
  constructor() {
    super();
    this.hideTitle = false;
    const FALLBACK_LANG = "en";
    const language =
      globalThis.document.body.getAttribute("xml:lang") ||
      globalThis.document.body.getAttribute("lang") ||
      globalThis.document.documentElement.getAttribute("xml:lang") ||
      globalThis.document.documentElement.getAttribute("lang") ||
      globalThis.navigator.language ||
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
  // LitElement render function
  render() {
    return html` ${this.elementVisible
      ? html` <h3 .hidden="${this.hideTitle}" part="heading-3">
            ${this._title}
          </h3>
          <div id="result"></div>
          <citation-element
            creator="{Wikipedia contributors}"
            scope="sibling"
            license="by-sa"
            title="${this.search} --- {Wikipedia}{,} The Free Encyclopedia"
            source="https://${this
              .language}.wikipedia.org/w/index.php?title=${this.search}"
            date="${this.__now}"
          ></citation-element>`
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
      if (propName == "search") {
        if (this.title) {
          this._title = this.title;
        } else {
          this._title = this[propName].replace("_", " ") + " Wikipedia article";
        }
      }
      if (propName == "title") {
        if (this.title) {
          this._title = this.title;
        }
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
      for (var key in response.query.pages) {
        // skip anything that's prototype object
        if (!response.query.pages.hasOwnProperty(key)) continue;
        // load object response, double check we have an extract
        if (
          response.query.pages[key].extract &&
          this.shadowRoot &&
          this.shadowRoot.querySelector("#result")
        ) {
          let html = response.query.pages[key].extract;
          html = html.replace(/<script[\s\S]*?>/gi, "&lt;script&gt;");
          html = html.replace(/<\/script>/gi, "&lt;/script&gt;");
          html = html.replace(/<style[\s\S]*?>/gi, "&lt;style&gt;");
          html = html.replace(/<\/style>/gi, "&lt;/style&gt;");
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
      gizmoRegistration: "haxgizmoRegistration",
    };
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
      store.appList.filter((el, i) => {
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
