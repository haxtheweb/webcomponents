import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { mixinBehaviors } from "@polymer/polymer/lib/legacy/class.js";
import { IronA11yKeysBehavior } from "@polymer/iron-a11y-keys-behavior/iron-a11y-keys-behavior.js";

class PaperSearchBar extends mixinBehaviors(
  [IronA11yKeysBehavior],
  PolymerElement
) {
  static get tag() {
    return "paper-search-bar";
  }
  /**
   * Fired when the user requests to open the filtering dialog
   *
   * @event paper-search-filter
   */
  /**
   * Fired when the user requests to search for a query
   *
   * @event paper-search-search
   */
  /**
   * Fired when the user taps the clear icon
   *
   * @event paper-search-clear
   */

  static get properties() {
    return {
      /**
       * Text for which the user is searching
       */
      query: {
        type: String,
        notify: true,
        value: "",
      },
      /**
       * Whether to hide the Filter button. Set attribute "hide-filter-button" to do so.
       */
      hideFilterButton: {
        type: Boolean,
        value: false,
      },
      /**
       * Whether to disable the Filter button. Set attribute "disable-filter-button" to do so.
       */
      disableFilterButton: {
        type: Boolean,
        value: false,
      },
      /**
       * Number of filters the user has been selected (shown in the badge) (optional)
       */
      nrSelectedFilters: {
        type: Number,
        value: 0,
      },
      /**
       * Icon shown in the search background
       */
      icon: {
        type: String,
        value: "search",
      },
      /**
       * Text shown in the search box if the user didn't enter any query
       */
      placeholder: {
        type: String,
        value: "Search",
      },
    };
  }

  focus() {
    this.shadowRoot.querySelector("#input").focus();
  }
  // Private methods
  _filter(e) {
    this.dispatchEvent(
      new CustomEvent("paper-search-filter", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: true,
      })
    );
  }
  constructor() {
    super();
    setTimeout(() => {
      this.addEventListener("keypress", this._search.bind(this));
    }, 0);
  }
  _clear() {
    this.query = "";
    this.shadowRoot.querySelector("#input").focus();
    this.dispatchEvent(
      new CustomEvent("paper-search-clear", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: true,
      })
    );
  }
  _search(e) {
    if (e.keyCode == 13) {
      //Enter
      this.dispatchEvent(
        new CustomEvent("paper-search-search", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: true,
        })
      );
      return false;
    }
  }
}
window.customElements.define(PaperSearchBar.tag, PaperSearchBar);
export { PaperSearchBar };
