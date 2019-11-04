import { LitElement, html, css } from "lit-element/lit-element.js";
import "../a11y-collapse.js";
/**
 * `a11y-collapse-group`
 * a group of `a11y-collapse` elements
 * 
### Styling

`<a11y-collapse-group>` provides the following custom properties
for styling:

Custom property | Description | Default
----------------|-------------|----------
`--a11y-collapse-group-margin` | margin around the a11y-collapse-group | 15px 0
 *
 * @customElement
 * @demo demo/accordion.html collapse groups
 */
class A11yCollapseGroup extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          display: block;
          margin: var(--a11y-collapse-group-margin, 15px 0);
          --a11y-collapse-margin: 15px;
        }
        #heading {
          font-weight: bold;
        }
        .wrapper {
          border-radius: 0;
          --a11y-collapse-margin: 0;
          --a11y-collapse-border-between: none;
        }
      `
    ];
  }
  render() {
    return html`
      <div class="wrapper"><slot></slot></div>
    `;
  }
  constructor() {
    super();
    this.globalOptions = {};
    this.radio = false;
    this.__items = [];
    this.addEventListener("a11y-collapse-attached", function(e) {
      this._attachItem(e.detail);
    });
    this.addEventListener("a11y-collapse-detached", function(e) {
      this._detachItem(e.detail);
    });
    this.addEventListener("a11y-collapse-click", function(e) {
      this.radioToggle(e.detail);
    });
  }
  static get tag() {
    return "a11y-collapse-group";
  }

  static get properties() {
    return {
      /**
       * an array of globalProperties to override every a11y-collapse item
       * For example, {"icon": "arrow-drop-down"} would set every item's icon to "arrow-drop-down"
       */
      globalOptions: {
        type: Object,
        attribute: "global-options"
      },
      /**
       * is every a11y-collapse item radio button?
       */
      radio: {
        type: Boolean
      },
      /**
       * is radio button
       */
      __items: {
        type: Array
      }
    };
  }

  /**
   * Removes a detached item from the _items array.
   * @param {object} item an a11y-collapse item
   */
  _attachItem(item) {
    for (let key in this.globalOptions) {
      if (this.globalOptions.hasOwnProperty(key)) {
        item._overrideProp(key, this.globalOptions[key]);
      }
    }
    this.__items.push(item);
  }

  /**
   * Removes a detached item from the _items array.
   * @param {object} item an a11y-collapse item
   */
  _detachItem(item) {
    if (this.__items && item) {
      for (let i = 0; i < this.__items.length; i++) {
        if (this.__items[i] === item) this.splice("__items", i, 1);
      }
    }
  }

  /**
   * Toggles off all previous choices.
   * @param {object} item an a11y-collapse item
   */
  radioToggle(item) {
    if (this.radio && item.expanded) {
      for (let i = 0; i < this.__items.length; i++) {
        if (this.__items[i] !== item) this.__items[i].toggle(false);
      }
    }
  }

  disconnectedCallback() {
    this.removeEventListener("a11y-collapse-click", function(e) {
      this.radioToggle(e.detail);
    });
    this.removeEventListener("a11y-collapse-attached", function(e) {
      this.push("__items", e.detail);
    });
    this.removeEventListener("a11y-collapse-detached", function(e) {
      this._detachItem(e.detail);
    });
    super.disconnectedCallback();
  }
}
window.customElements.define(A11yCollapseGroup.tag, A11yCollapseGroup);
export { A11yCollapseGroup };
