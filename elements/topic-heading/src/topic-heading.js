/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-icon/iron-icon.js";
import "@lrnwebcomponents/relative-heading/relative-heading.js";
/**
 * `topic-heading`
 * @customElement topic-heading
 * `Semantic and visual meaning behind a heading break`
 *
 * @microcopy - language worth noting:
 *  -
 *

 * @polymer
 * @demo demo/index.html
 */
class TopicHeading extends PolymerElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "topic-heading";
  }
  /**
   * life cycle, element is removed from the DOM
   */
  //disconnectedCallback() {}
}
window.customElements.define(TopicHeading.tag, TopicHeading);
export { TopicHeading };
