import { LitElement, html, css } from "lit";
import { ResponsiveUtilityBehaviors } from "./responsive-utility-behaviors.js";
/**
 * `responsive-utility-element`
 * A simpler way to use responsive utility.
 *
 * @element responsive-utility-element
 * @extends ResponsiveUtilityBehaviors
 * @see ResponsiveUtility
 * @demo ../demo/index.html
 */
class ResponsiveUtilityElement extends ResponsiveUtilityBehaviors(LitElement) {
  static get tag() {
    return "responsive-utility-element";
  }
}
customElements.define(ResponsiveUtilityElement.tag, ResponsiveUtilityElement);
export { ResponsiveUtilityElement };
