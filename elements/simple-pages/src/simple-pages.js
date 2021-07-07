/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";

/**
 * `simple-pages`
 * `toggle between pages`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @demo demo/index.html
 * @element simple-pages
 */
class SimplePages extends LitElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Convention we use
   */
  static get tag() {
    return "simple-pages";
  }

  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.selected = 0;
    setTimeout(() => {
      import("@polymer/iron-pages/iron-pages.js");
    }, 0);
  }
  /**
   * Selected changed
   */
  _selectedChanged(e) {
    if (
      this.children &&
      this.children[e.detail.value] &&
      this.children[e.detail.value].tagName &&
      this.children[e.detail.value].getAttribute("data-dimport")
    ) {
      let el = this.children[e.detail.value];
      if (!window.customElements.get(el.tagName.toLowerCase())) {
        const basePath = this.pathFromUrl(decodeURIComponent(import.meta.url));
        import(`${basePath}../../${el.getAttribute("data-dimport")}`).then(
          (response) => {
            setTimeout(() => {
              window.dispatchEvent(new Event("resize"));
            }, 0);
          }
        );
      }
    }
  }
  // simple path from a url modifier
  pathFromUrl(url) {
    return url.substring(0, url.lastIndexOf("/") + 1);
  }
  /**
   * LitElement ready
   */
  firstUpdated(changedProperties) {}
  /**
   * LitElement life cycle - property changed
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      /* notify example
      // notify
      if (propName == 'format') {
        this.dispatchEvent(
          new CustomEvent(`${propName}-changed`, {
            detail: {
              value: this[propName],
            }
          })
        );
      }
      */
      /* observer example
      if (propName == 'activeNode') {
        this._activeNodeChanged(this[propName], oldValue);
      }
      */
      /* computed example
      if (['id', 'selected'].includes(propName)) {
        this.__selectedChanged(this.selected, this.id);
      }
      */
    });
  }
}
customElements.define(SimplePages.tag, SimplePages);
export { SimplePages };
