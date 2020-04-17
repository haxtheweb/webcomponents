import { LitElement, html, css } from "lit-element/lit-element.js";
import "@polymer/iron-ajax/iron-ajax.js";
/**
 * `wikipedia-query`
 * `Query and present information from wikipedia.`
 * @demo demo/index.html
 * @element wikipedia-query
 */
class WikipediaQuery extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
          --wikipedia-query-body-height: 160px;
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
          background-color: #f8f8f8;
          padding: 16px 8px;
          font-size: 12px;
        }
      `
    ];
  }
  constructor() {
    super();
    this.hideTitle = false;
    let date = new Date(Date.now());
    this.__now =
      date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
    setTimeout(() => {
      import("@lrnwebcomponents/citation-element/citation-element.js");
    }, 0);
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
    return html`
      ${this.search
        ? html`
            <iron-ajax
              auto
              url="https://en.wikipedia.org/w/api.php?origin=*&amp;action=query&amp;titles=${this
                .search}&amp;prop=extracts&amp;format=json"
              handle-as="json"
              @response="${this.handleResponse}"
              debounce-duration="25"
              @last-response-changed="${this.searchResponseChanged}"
            ></iron-ajax>
            <h3 .hidden="${this.hideTitle}">${this._title}</h3>
            <div id="result"></div>
            <citation-element
              creator="{Wikipedia contributors}"
              scope="sibling"
              license="by-sa"
              title="${this.search} --- {Wikipedia}{,} The Free Encyclopedia"
              source="https://en.wikipedia.org/w/index.php?title=${this.search}"
              date="${this.__now}"
            ></citation-element>
          `
        : ``}
    `;
  }
  searchResponseChanged(e) {
    this.searchResponse = e.detail.value;
  }
  /**
   * LitElement properties updated
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
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
    return {
      title: {
        type: String
      },
      __now: {
        type: String
      },
      _title: {
        type: String
      },
      /**
       * hideTitle
       */
      hideTitle: {
        type: Boolean,
        attribute: "hide-title"
      },
      /**
       * Search string.
       */
      search: {
        type: String
      }
    };
  }
  /**
   * HAXproperties
   */
  static get haxProperties() {
    return {
      canScale: true,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "Wikipedia article",
        description:
          "This can display a wikipedia article in context in a variety of formats.",
        icon: "book",
        color: "green",
        groups: ["Content", "Creative Commons"],
        handles: [
          {
            type: "content",
            title: "search"
          },
          {
            type: "wikipedia",
            type_exclusive: true,
            title: "search"
          }
        ],
        meta: {
          author: "ELMS:LN"
        }
      },
      settings: {
        quick: [
          {
            property: "search",
            title: "Search term",
            description: "Word to search wikipedia for.",
            inputMethod: "textfield",
            icon: "editor:title",
            required: true
          },
          {
            property: "hideTitle",
            title: "Hide title",
            description: "Whether or not to render the title of the article.",
            inputMethod: "boolean",
            icon: "editor:title"
          }
        ],
        configure: [
          {
            property: "search",
            title: "Article name",
            description: "Word to search wikipedia for.",
            inputMethod: "textfield",
            icon: "editor:title",
            required: true
          },
          {
            property: "hideTitle",
            title: "Hide title",
            description: "Whether or not to render the title of the article.",
            inputMethod: "boolean",
            icon: "editor:title"
          }
        ]
      },
      saveOptions: {
        wipeSlot: true,
        unsetAttributes: ["_title"]
      },
      demoSchema: [
        {
          "tag": "wikipedia-query",
          "properties": {
            "hideTitle": false,
            "search": "Internet"
          },
          "content": ""
        }
      ]
    };
  }
  /**
   * Process response from wikipedia.
   */
  handleResponse(response) {
    // the key of pages is a number so need to look for it
    if (
      typeof this.searchResponse !== typeof undefined &&
      this.searchResponse.query
    ) {
      for (var key in this.searchResponse.query.pages) {
        // skip anything that's prototype object
        if (!this.searchResponse.query.pages.hasOwnProperty(key)) continue;
        // load object response, double check we have an extract
        if (this.searchResponse.query.pages[key].extract) {
          let html = this.searchResponse.query.pages[key].extract;
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
