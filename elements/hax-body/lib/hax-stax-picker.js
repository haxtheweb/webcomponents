import { HaxPicker } from "./hax-blox-picker.js";
/**
 *  `hax-stax-picker`
 * A picker for selecting an item from a list of apps / hax stax which require
 * a decision to be made. This is used when multiple things match either on upload
 * in the add operation of the app or in the stax selection to render through,
 * such as having multiple ways of presenting an image.
 * @microcopy - the mental model for this element
 * - data - this is the app data model for an element which expresses itself to hax
 */
class HaxStaxPicker extends HaxPicker {
  constructor() {
    super();
    import("@lrnwebcomponents/hax-body/lib/hax-stax-browser.js");
    this.picker = "stax";
    this.title = "Templates";
    // this sets everything else in motion correctly
    this.setupPicker();
  }
  static get tag() {
    return "hax-stax-picker";
  }
}
window.customElements.define(HaxStaxPicker.tag, HaxStaxPicker);
export { HaxStaxPicker };
