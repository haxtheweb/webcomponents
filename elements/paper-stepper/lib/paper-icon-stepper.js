import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
class PaperIconStepper extends PolymerElement {
  static get tag() {
    return "paper-icon-stepper";
  }
  static get properties() {
    return {
      /**
       * Indeces of the steps already selected
       */
      selectedValues: {
        type: Array,
        notify: true,
        value: []
      },
      /**
       * Currently selected step
       */
      _selected: {
        type: Number,
        value: -1
      }
    };
  }

  /**
   * Goes back one step
   */
  previous() {
    //XXX: Multi selector does not offer selectPrevious() function
    if (this._selected < 0) {
      // we are back to start
      return;
    }
    // remove the currently selected from the array
    var index = this.selectedValues.indexOf(this._selected);
    this.splice("selectedValues", index, 1);
    this._selected--;
  }
  /**
   * Goes forward one step
   */
  next() {
    //XXX: Multi selector does not offer selectNext() function
    if (this._selected === this._items.length - 1) {
      // We reached the end
      return;
    }
    if (this._selected >= 0) {
      this._selected++;
    } else if (this.selectedValues.length <= 0) {
      // no items selected yet
      this._selected = 0;
    } else {
      // items selected (e.g. specified by the caller). Default to the element after the last element of the array
      this._selected = this.selectedValues[this.selectedValues.length]++;
    }

    this.push("selectedValues", this._selected);
  }
  /**
   * Clears all the steps
   */
  clear() {
    this.selectedValues = [];
    this._selected = -1;
  }
  _onItemsChanged(e) {
    this._items = this.$.selector.items;
  }
}
window.customElements.define(PaperIconStepper.tag, PaperIconStepper);
export { PaperIconStepper };
