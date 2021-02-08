import { LitElement, html, css } from "lit-element/lit-element.js";
import { IntersectionObserverMixin } from "@lrnwebcomponents/intersection-element/lib/IntersectionObserverMixin.js";
/**
 * `wikipedia-query`
 * `Query and present information from wikipedia.`
 * @demo demo/index.html
 * @element wikipedia-query
 */
class WikipediaQuery extends IntersectionObserverMixin(LitElement) {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
          --wikipedia-query-body-height: 160px;
          --wikipedia-query-background-color: #f8f8f8;
        }
        :host [hidden] {
          display: none;
        }
        #result {
          height: var(--wikipedia-query-body-height);
          overflow: scroll;
          border: 1px grey solid;
          padding: 8px 16px;
        }
        citation-element {
          background-color: var(--wikipedia-query-background-color);
          padding: 16px 8px;
          font-size: 12px;
        }
      `,
    ];
  }
  constructor() {
    super();
    this.hideTitle = false;
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
            source="https://en.wikipedia.org/w/index.php?title=${this.search}"
            date="${this.__now}"
          ></citation-element>`
      : ``}`;
  }
  updateArticle(search, headers) {
    fetch(
      `https://en.wikipedia.org/w/api.php?origin=*&action=query&titles=${search}&prop=extracts&format=json`,
      headers
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
        import("@lrnwebcomponents/citation-element/citation-element.js");
      }
      if (
        ["elementVisible", "search", "headers"].includes(propName) &&
        this.search &&
        this.headers &&
        this.elementVisible
      ) {
        clearTimeout(this._debounce);
        this._debounce = setTimeout(() => {
          this.updateArticle(this.search, this.headers);
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
    };
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
    // ensure that this is a valid type of gizmo for endpoints
    // this is nessecary because wikipedia-query wants to be the sole
    // provider of display for things coming off the API
    store.validGizmoTypes.push("wikipedia");
    if (
      store.appList.filter((el, i) => {
        // ensure we don't double load the endpoint if already defined
        if (el.connection.url === "en.wikipedia.org") {
          return true;
        }
        return false;
      }).length === 0
    ) {
      window.dispatchEvent(
        new CustomEvent("hax-register-app", {
          bubbles: false,
          composed: false,
          cancelable: false,
          detail: this.haxAppDetails,
        })
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
        tags: ["content", "encyclopedia", "wiki"],
      },
      connection: {
        protocol: "https",
        url: "en.wikipedia.org",
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
                "https://en.wikipedia.org/static/images/project-logos/enwiki.png",
              defaultGizmoType: "wikipedia",
              items: "query.search",
              preview: {
                title: "title",
                details: "snippet",
                id: "title",
              },
              gizmo: {
                _url_source: "https://en.wikipedia.org/wiki/<%= id %>",
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
   * HAXproperties
   */
  static get haxProperties() {
    return {
      canScale: true,
      canPosition: true,
      canEditSource: true,
      gizmo: {
        title: "Wikipedia article",
        description:
          "This can display a wikipedia article in context in a variety of formats.",
        icon: "book",
        color: "green",
        groups: ["Content", "Creative Commons"],
        handles: [
          {
            type: "wikipedia",
            type_exclusive: true,
            title: "search",
          },
          {
            type: "content",
            title: "search",
          },
        ],
        meta: {
          author: "ELMS:LN",
        },
      },
      settings: {
        configure: [
          {
            property: "search",
            title: "Article name",
            description: "Word to search wikipedia for.",
            inputMethod: "textfield",
            icon: "editor:title",
            required: true,
          },
          {
            property: "hideTitle",
            title: "Hide title",
            description: "Whether or not to render the title of the article.",
            inputMethod: "boolean",
            icon: "editor:title",
          },
        ],
      },
      saveOptions: {
        wipeSlot: true,
        unsetAttributes: ["_title"],
      },
      demoSchema: [
        {
          tag: "wikipedia-query",
          properties: {
            hideTitle: false,
            search: "Internet",
          },
          content: "",
        },
      ],
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
        if (response.query.pages[key].extract) {
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
}
window.customElements.define(WikipediaQuery.tag, WikipediaQuery);
export { WikipediaQuery };
