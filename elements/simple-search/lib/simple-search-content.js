/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";

/**
 * `simple-search-content`
 * content that can be searched with simple-search (DEPRECATED)
 *
 *

 * @demo ./demo/index.html
 */
class SimpleSearchContent extends LitElement {
  static get tag() {
    return "simple-search-content";
  }

  /**
   * associates simple-search-content with a simple-search
   *
   * @param {object} the simple-search element
   */
  enableSearch(searchObject) {
    searchObject.addEventListener("simple-search", (e) =>
      this._searchContent(searchObject),
    );
    searchObject.addEventListener("goto-result", (e) => this.focus(e.detail));
  }

  /**
   * sets focus on a matched result based on match number
   */
  _searchContent(searchObject) {
    let html = this.innerHTML;
    this.innerHTML = searchObject.findMatches(html);
  }

  /**
   * sets focus on a matched result based on match number
   *
   * @param {number} the number of a search result
   */
  focus(matchNumber) {
    let result = this.querySelector('[match-number="' + matchNumber + '"]');
    if (result !== undefined && result !== null) result.focus();
  }

  render() {
    return html` <slot></slot> `;
  }
}
customElements.define(SimpleSearchContent.tag, SimpleSearchContent);

export { SimpleSearchContent };
