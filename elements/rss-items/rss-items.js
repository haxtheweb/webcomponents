/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 *
 * Based on https://github.com/TherapyChat/rss-items
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import { HAXWiring } from "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import { pathFromUrl } from "@polymer/polymer/lib/utils/resolve-url.js";
import "@lrnwebcomponents/es-global-bridge/es-global-bridge.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "@polymer/polymer/lib/elements/dom-repeat.js";
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
   ### Styling

    The following custom properties and mixins are available for styling:

    Custom property | Description | Default
    ----------------|-------------|----------
    `--rss-items` | Mixin applied to the component | `{}`
    `--rss-items-article` | Mixin applied to the articles | `{}`
    `--rss-items-article-mq-m-up` | Mixin applied to the articles on `min-width: 600px` | `{}`
    `--rss-items-article-mq-l-up` | Mixin applied to the articles on `min-width: 900px` | `{}`
    `--rss-items-thumbnail` | Mixin applied to the image thumbnails | `{}`
    `--rss-items-thumbnail-hover` | Mixin applied to the image thumbnails when hover | `{}`
    `--rss-items-thumbnail-container` | Mixin applied to the image thumbnails container | `{}`
    `--rss-items-title` | Mixin applied to the title | `{}`
    `--rss-items-excerpt` | Mixin applied to the excerpt | `{}`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class RssItems extends PolymerElement {
  // render function
  static get template() {
    return html`
      <style>
        :host([hidden]) {
          display: none;
        }
        :host {
          display: flex;
          flex-wrap: wrap;
          flex-direction: row;
          align-items: flex-start;
          justify-content: space-between;
          @apply --rss-items;
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

          @apply --rss-items-article;
        }

        .thumbnail-container {
          display: block;
          overflow: hidden;
          width: 100%;
          height: 180px;

          @apply --rss-items-thumbnail-container;
        }

        .thumbnail {
          width: 100%;
          height: 100%;
          transition: transform 0.5s ease-out;

          @apply --rss-items-thumbnail;
        }

        .thumbnail-container:hover .thumbnail,
        .thumbnail-container:focus .thumbnail {
          transform: scale3d(1.3, 1.3, 1);

          @apply --rss-items-thumbnail-hover;
        }

        .title {
          min-height: 3em;
          margin: 1em 0 0.5em;

          @apply --rss-items-title;
        }

        .excerpt {
          min-height: 6em;
          margin: 0.5em 0 2em;

          @apply --rss-items-excerpt;
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

            @apply --rss-items-article-mq-m-up;
          }

          article:nth-of-type(2n),
          article:last-of-type {
            margin-right: 0;
          }
        }

        @media (min-width: 900px) {
          article {
            flex: 1 1 30%;

            @apply --rss-items-article-mq-l-up;
          }

          article:nth-of-type(2n) {
            margin-right: 2em;
          }

          article:nth-of-type(3n) {
            margin-right: 0;
          }
        }
      </style>
      <iron-ajax
        id="rssajax"
        url="[[url]]"
        handle-as="xml"
        last-response="{{xml}}"
      ></iron-ajax>
      <dom-repeat items="[[items]]">
        <template>
          <article>
            <a
              class="thumbnail-container"
              href="[[item.link]]"
              title="[[item.title]]"
            >
              <iron-image
                class="thumbnail"
                src="[[item.imageSrc]]"
                alt="[[item.title]]"
                sizing="cover"
              ></iron-image>
            </a>
            <a href="[[item.link]]" title="[[item.title]]">
              <span class="title"
                >[[_truncateText(item.title, maxTitleLength)]]</span
              >
            </a>
            <div class="excerpt">
              [[_truncateText(item.excerpt, maxExcerptLength)]]
            </div>
            <template is="dom-if" if="[[showReadMore]]">
              <a
                tabindex="-1"
                href="[[item.link]]"
                class="read-more"
                title="[[item.title]]"
                >[[readMoreAnchorText]]
                <paper-icon-button
                  icon="icons:arrow-forward"
                  class="read-more-icon"
                  alt="[[readMoreImageAlt]]"
                ></paper-icon-button>
              </a>
            </template>
          </article>
        </template>
      </dom-repeat>
    `;
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
            source: "source"
          }
        ],
        meta: {
          author: "btopro",
          owner: "The Pennsylvania State University"
        }
      },
      settings: {
        quick: [],
        configure: [
          {
            property: "url",
            title: "Feed URL",
            description: "URL to the XML feed",
            inputMethod: "textfield"
          },
          {
            property: "max",
            title: "Max items",
            description: "Max number of feed items to display",
            inputMethod: "number"
          }
        ],
        advanced: []
      }
    };
  }
  // properties available to the custom element for data binding
  static get properties() {
    let props = {
      /**
       * If true init rss request.
       */
      auto: {
        type: Boolean,
        value: false
      },
      /**
       * The retrieved items array.
       */
      items: {
        type: Array,
        notify: true
      },
      /**
       * Max number of items to show. If it is undefined shows all items.
       */
      max: {
        type: Number,
        value: 10,
        observer: "_maxChanged"
      },
      /**
       * Max length for item excerpts. If the excerpt exceeds this length it will be trimed and will have an ellipsis appended.
       */
      maxExcerptLength: {
        type: Number,
        value: 100
      },
      /**
       * Max length for item titles. If the title exceeds this length it will be trimed and will have an ellipsis appended.
       */
      maxTitleLength: {
        type: Number,
        value: 50
      },
      /**
       * Read more anchor text.
       */
      readMoreAnchorText: {
        type: Boolean,
        value: "Read more"
      },
      /**
       * Read more image alternative text.
       */
      readMoreImageAlt: {
        type: Boolean,
        value: "Icono de flecha"
      },
      /**
       * If true the items elements will display a read more link.
       */
      showReadMore: {
        type: Boolean,
        value: false
      },
      /**
       * The URL of the RSS.
       */
      url: {
        type: String,
        observer: "_urlChanged"
      },
      xml: {
        type: Object,
        observer: "xmlToItems"
      }
    };
    if (super.properties) {
      props = Object.assign(props, super.properties);
    }
    return props;
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
    if (newValue) {
      this.xmlToItems(this.xml);
    }
  }
  /**
   * Receives a xml and set this.items as json.
   * @param {Object} xml XML element.
   */
  xmlToItems(newValue) {
    if (newValue) {
      // parse xml to json and get items
      var conversor = new X2JS();
      var json = conversor.xml2json(newValue);
      var items = json.rss ? json.rss.channel.item : json.channel.item;
      // truncate with this.max and parse items
      items = this.max === undefined ? items : items.splice(0, this.max);
      this.items = this._parseItems(items);
    }
  }
  _urlChanged(newValue) {
    if (newValue && this._x2js && this.__ready) {
      this.initRequest();
    }
  }
  /**
   * Parse items by getting excerpt and image source.
   * @param {Array} items RSS items.
   */
  _parseItems(items) {
    return items.map(
      function(item) {
        item.excerpt = this._getItemExcerpt(item);
        item.imageSrc = this._getItemImageScr(item);
        return item;
      }.bind(this)
    );
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
  constructor() {
    super();
    import("@polymer/iron-image/iron-image.js");
    import("@polymer/paper-icon-button/paper-icon-button.js");
    import("@polymer/iron-icons/iron-icons.js");
    const name = "x2js";
    const basePath = pathFromUrl(decodeURIComponent(import.meta.url));
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
  connectedCallback() {
    super.connectedCallback();
    this.__ready = true;
    afterNextRender(this, function() {
      this.HAXWiring = new HAXWiring();
      this.HAXWiring.setup(RssItems.haxProperties, RssItems.tag, this);
      if (this._x2js) {
        if (this.auto) {
          this.shadowRoot.querySelector("#rssajax").auto = this.auto;
        } else {
          this.initRequest();
        }
      }
    });
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
