/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 *
 * Based on https://github.com/TherapyChat/rss-items
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/es-global-bridge/es-global-bridge.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "@lrnwebcomponents/simple-icon/simple-icon.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-button.js";
/**
 * `rss-items`
 * `visualize RSS items`
 * 
 * Example:
  ```html
  <rss-items
    url="https://content.therapychat.com/rss.xml"
    max="4"
    auto
  ></rss-items>
  ```
 * It will retrieve the items from the url automatically.
 * @demo demo/index.html
 * @element rss-items
 */
class RssItems extends LitElement {
  //styles function
  static get styles() {
    return [
      css`
        :host([hidden]) {
          display: none;
        }

        :host {
          display: flex;
          flex-wrap: wrap;
          flex-direction: row;
          align-items: flex-start;
          justify-content: space-between;
        }

        :host * {
          box-sizing: border-box;
        }

        h3,
        p {
          margin: 0;
        }

        a {
          color: var(--primary-color, inherit);
          text-decoration: none;
        }

        article {
          margin-bottom: 2em;
        }

        .thumbnail-container {
          display: block;
          overflow: hidden;
          width: 100%;
          height: 180px;
        }

        .thumbnail {
          width: 100%;
          height: 100%;
          transition: transform 0.5s ease-out;
        }

        .thumbnail-container:hover .thumbnail,
        .thumbnail-container:focus .thumbnail {
          transform: scale3d(1.3, 1.3, 1);
        }

        .title {
          min-height: 3em;
          margin: 1em 0 0.5em;
        }

        .excerpt {
          min-height: 6em;
          margin: 0.5em 0 2em;
        }

        @media (max-width: 599px) {
          .title,
          .excerpt {
            min-height: 0;
          }
        }

        @media (min-width: 600px) {
          article {
            flex: 1 1 40%;
            margin-right: 2em;
          }

          article:nth-of-type(2n),
          article:last-of-type {
            margin-right: 0;
          }
        }

        @media (min-width: 900px) {
          article {
            flex: 1 1 30%;
          }

          article:nth-of-type(2n) {
            margin-right: 2em;
          }

          article:nth-of-type(3n) {
            margin-right: 0;
          }
        }
      `,
    ];
  }

  // render function
  render() {
    return html` <iron-ajax
        id="rssajax"
        url="${this.url}"
        handle-as="xml"
        @last-response-changed="${this.xmlEvent}"
      ></iron-ajax>
      ${this.items.map(
        (item) => html`
          <article>
            ${item.imageSrc
              ? html`
                  <a
                    class="thumbnail-container"
                    href="${item.link}"
                    title="${item.title}"
                  >
                    <img
                      class="thumbnail"
                      src="${item.imageSrc}"
                      alt="${item.title}"
                      loading="lazy"
                    />
                  </a>
                `
              : ``}
            <a href="${item.link}" title="${item.title}">
              <span class="title"
                >${this._truncateText(item.title, this.maxTitleLength)}</span
              >
            </a>
            <div class="excerpt">
              ${this._truncateText(item.excerpt, this.maxExcerptLength)}
            </div>
            ${this.showReadMore
              ? html`
                  <a
                    tabindex="-1"
                    href="${item.link}"
                    class="read-more"
                    title="${item.title}"
                    >${this.readMoreAnchorText}
                    <simple-icon-button
                      icon="icons:arrow-forward"
                      class="read-more-icon"
                      alt="${this.readMoreImageAlt}"
                    ></simple-icon-button>
                  </a>
                `
              : ``}
          </article>
        `
      )}`;
  }

  // haxProperty definition
  static get haxProperties() {
    return {
      canScale: true,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "Rss feed",
        description: "visualize RSS items",
        icon: "communication:rss-feed",
        color: "orange",
        groups: ["RSS"],
        handles: [
          {
            type: "rss",
            source: "source",
          },
        ],
        meta: {
          author: "btopro",
          owner: "The Pennsylvania State University",
        },
      },
      settings: {
        quick: [],
        configure: [
          {
            property: "url",
            title: "Feed URL",
            description: "URL to the XML feed",
            inputMethod: "textfield",
          },
          {
            property: "max",
            title: "Max items",
            description: "Max number of feed items to display",
            inputMethod: "number",
          },
        ],
        advanced: [],
      },
    };
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,

      /**
       * If true init rss request.
       */
      auto: {
        type: Boolean,
      },
      /**
       * The retrieved items array.
       */
      items: {
        type: Array,
      },
      /**
       * Max number of items to show. If it is undefined shows all items.
       */
      max: {
        type: Number,
      },
      /**
       * Max length for item excerpts. If the excerpt exceeds this length it will be trimed and will have an ellipsis appended.
       */
      maxExcerptLength: {
        type: Number,
        attribute: "max-excerpt-length",
      },
      /**
       * Max length for item titles. If the title exceeds this length it will be trimed and will have an ellipsis appended.
       */
      maxTitleLength: {
        type: Number,
        attribute: "max-title-length",
      },
      /**
       * Read more anchor text.
       */
      readMoreAnchorText: {
        type: Boolean,
        attribute: "read-more-anchor-text",
      },
      /**
       * Read more image alternative text.
       */
      readMoreImageAlt: {
        type: Boolean,
        attribute: "read-more-image-alt",
      },
      /**
       * If true the items elements will display a read more link.
       */
      showReadMore: {
        type: Boolean,
        attribute: "show-read-more",
      },
      /**
       * The URL of the RSS.
       */
      url: {
        type: String,
      },
      xml: {
        type: Object,
      },
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "rss-items";
  }
  /**
   * Init ajax request to get rss.
   */
  initRequest() {
    this.shadowRoot.querySelector("#rssajax").generateRequest();
  }
  _maxChanged(newValue) {
    if (this.xml && newValue && this._x2js && this.__ready) {
      this.xmlToItems(this.xml);
    }
  }
  /**
   * Receives a xml and set this.items as json.
   * @param {Object} xml XML element.
   */
  xmlToItems(newValue) {
    if (newValue && this._x2js && this.__ready) {
      // parse xml to json and get items
      var conversor = new X2JS();
      var json = conversor.xml2json(newValue);
      if (json) {
        var items = json.rss ? json.rss.channel.item : json.channel.item;
        // truncate with this.max and parse items
        items = this.max === undefined ? items : items.splice(0, this.max);
        this.items = [...this._parseItems(items)];
      }
    }
  }
  _urlChanged(newValue) {
    if (newValue && this._x2js && this.__ready) {
      this.initRequest();
    }
  }
  xmlEvent(e) {
    this.xml = {};
    setTimeout(() => {
      this.xml = e.detail.value;
    }, 0);
  }
  /**
   * Parse items by getting excerpt and image source.
   * @param {Array} items RSS items.
   */
  _parseItems(items) {
    return items.map((item) => {
      item.excerpt = this._getItemExcerpt(item);
      item.imageSrc = this._getItemImageScr(item);
      return item;
    });
  }
  /**
   * Get excerpt from item description.
   * @param {Object} item Item where find excerpt.
   */
  _getItemExcerpt(item) {
    var element = document.createElement("div");
    element.innerHTML = item.description;
    return element.textContent.trim();
  }
  /**
   * Get image source from item description.
   * @param {Object} item Item where find image.
   */
  _getItemImageScr(item) {
    if (item.thumbnail && item.thumbnail._url) {
      return item.thumbnail._url;
    } else {
      var element = document.createElement("div");
      element.innerHTML = item.description;
      var image = element.querySelector("img") || {};
      return image.src || "";
    }
  }
  /**
   * Truncate a text and concatenate with ellipsis if needed.
   * @param {String} text Text to truncate.
   * @param {Number} maxLength Max length of the text.
   * @return {String} Truncated text.
   */
  _truncateText(text, maxLength) {
    if (text) {
      return maxLength && text.length > maxLength
        ? text.substr(0, maxLength) + "..."
        : text;
    }
  }
  // simple path from a url modifier
  pathFromUrl(url) {
    return url.substring(0, url.lastIndexOf("/") + 1);
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      let notifiedProps = ["items"];
      if (notifiedProps.includes(propName)) {
        // notify
        let eventName = `${propName
          .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2")
          .toLowerCase()}-changed`;
        this.dispatchEvent(
          new CustomEvent(eventName, {
            detail: {
              value: this[propName],
            },
          })
        );
      }
      if (propName == "max") {
        this._maxChanged(this[propName], oldValue);
      }
      if (propName == "url") {
        this._urlChanged(this[propName], oldValue);
      }
      if (propName == "xml") {
        this.xmlToItems(this[propName], oldValue);
      }
    });
  }
  constructor() {
    super();
    this.items = [];
    this.auto = false;
    this.max = 10;
    this.maxExcerptLength = 100;
    this.maxTitleLength = 50;
    this.readMoreAnchorText = "Read more";
    this.readMoreImageAlt = "";
    this.showReadMore = false;
    const name = "x2js";
    const basePath = this.pathFromUrl(decodeURIComponent(import.meta.url));
    const location = `${basePath}lib/x2js.js`;
    window.ESGlobalBridge.requestAvailability();
    window.ESGlobalBridge.instance.load(name, location);
    window.addEventListener(
      `es-bridge-${name}-loaded`,
      this._x2jsLoaded.bind(this)
    );
  }
  _x2jsLoaded(e) {
    this._x2js = true;
    if (this.__ready) {
      if (this.auto) {
        this.shadowRoot.querySelector("#rssajax").auto = this.auto;
      } else {
        this.initRequest();
      }
    }
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  firstUpdated() {
    this.__ready = true;
    if (this._x2js) {
      if (this.auto) {
        this.shadowRoot.querySelector("#rssajax").auto = this.auto;
      } else {
        this.initRequest();
      }
    }
  }
  /**
   * life cycle, element is removed from the DOM
   */
  disconnectedCallback() {
    window.removeEventListener(
      `es-bridge-${name}-loaded`,
      this._x2jsLoaded.bind(this)
    );
    super.disconnectedCallback();
  }
}
window.customElements.define(RssItems.tag, RssItems);
export { RssItems };
