/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
/**
 * `paper-stepper`
 * `steps to completion in a vertical display`
 * @demo demo/index.html
 */
class PaperStepper extends PolymerElement {
  static get tag() {
    return "paper-stepper";
  }
  static get properties() {
    return {
      selected: {
        type: Number,
        notify: true,
        value: 0
      },

      /**
       * True if a progress bar is shown instead of dots.
       *
       * Use a progress bar when there are many steps, or if there are
       * steps that need to be inserted during the process (based o
       * responses to earlier steps).
       */
      progressBar: {
        type: Boolean,
        value: false
      },

      /**
       * Text for the back button. Use this property to localize the element.
       */
      backLabel: {
        type: String,
        value: "Back"
      },

      /**
       * Text for the back button. Use this property to localize the element.
       */
      nextLabel: {
        type: String,
        value: "Next"
      },
      /**
       * Boolean for disabling the previous button.
       */
      disablePrevious: {
        type: Boolean,
        value: false
      },
      /**
       * Boolean for disabling the next button.
       */
      disableNext: {
        type: Boolean,
        value: false
      },

      /**
       * Hide back/next buttons
       */
      noButtons: {
        type: Boolean,
        value: false
      }
    };
  }

  // Private methods
  _tapPrevious() {
    this.shadowRoot.querySelector("#selector").selectPrevious();
  }
  _tapNext() {
    this.shadowRoot.querySelector("#selector").selectNext();
  }

  /**
   * Returns true if there is a step before the current and if
   * _getDisablePrevious is set to false
   */
  _getDisablePrevious(selected, disablePrevious) {
    return selected > 0 && !disablePrevious;
  }

  /**
   * Returns true if there is a step after the current and if
   * _getDisableNext is set to false
   */
  _getDisableNext(selected, nrItems, disableNext) {
    return selected < nrItems - 1 && !disableNext;
  }

  /**
   * Returns the current progress value
   *
   * Depends on items to ensure that `max` is already set. Otherwise
   * `paper-progress` doesn't show the bar on startup.
   * TODO: Remove parameter `items` once paper-progress can handle
   * setting the property `value` before property `max`.
   */
  _computeProgressValue(selected, items) {
    return selected + 1;
  }

  _onItemsChanged(e) {
    this._items = this.shadowRoot.querySelector("#selector").items;
  }
}
window.customElements.define(PaperStepper.tag, PaperStepper);
export { PaperStepper };
