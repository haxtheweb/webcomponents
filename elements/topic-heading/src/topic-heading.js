/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
/**
 * `topic-heading`
 * `Semantic and visual meaning behind a heading break`
 * @demo demo/index.html
 * @customElement topic-heading
 */
class TopicHeading extends LitElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */
  constructor() {
    super();
    this.icon = "";
    this.title = "";
    import("@lrnwebcomponents/relative-heading/relative-heading.js");
  }
  firstUpdated() {
    if (this.icon) {
      import("@polymer/iron-icons/iron-icons.js");
      import("@polymer/iron-icon/iron-icon.js");
    }
  }
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "topic-heading";
  }
}
window.customElements.define(TopicHeading.tag, TopicHeading);
export { TopicHeading };
