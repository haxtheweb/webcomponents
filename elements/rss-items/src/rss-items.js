/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 *
 * Based on https://github.com/TherapyChat/rss-items
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/es-global-bridge/es-global-bridge.js";
import "@polymer/iron-ajax/iron-ajax.js";
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
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

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
    import("@polymer/iron-image/iron-image.js");
    import("@polymer/paper-icon-button/paper-icon-button.js");
    import("@polymer/iron-icons/iron-icons.js");
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
