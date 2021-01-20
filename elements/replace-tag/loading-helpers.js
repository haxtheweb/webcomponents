/**
 * Copyright 2021 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */

/**
 * `replace-tag`
 * `Loading helpers and css`
 * @demo demo/index.html
 * @element replace-tag
 */
const ReplaceTagSuper = function (SuperClass) {
  return class extends SuperClass {
    // define the scafold for how this will self-replace when updated
  };
};
class ReplaceTag extends ReplaceTagSuper(HTMLElement) {
  /**
   * Convention we use
   */
  static get tag() {
    return "replace-tag";
  }

  /**
   * HTMLElement
   */
  constructor() {
    super();
  }
}
customElements.define(ReplaceTag.tag, ReplaceTag);
export { ReplaceTag };
