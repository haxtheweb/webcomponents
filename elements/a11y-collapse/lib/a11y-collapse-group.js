import { LitElement, html, css } from "lit";
import { A11yCollapse } from "../a11y-collapse.js";
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
 * @extends LitElement
 * @see ../a11y-collapse.js
 * @demo ./demo/group.html collapse groups
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
        :host([hidden]) {
          display: none;
        }
        #heading {
          font-weight: bold;
        }
        .wrapper {
          border-radius: 0;
          display: block;
          --a11y-collapse-margin: 0 0;
          --a11y-collapse-border-between: none;
        }
      `,
    ];
  }
  render() {
    return html` <div class="wrapper"><slot></slot></div> `;
  }
  constructor() {
    super();
    this.globalOptions = {};
    this.radio = false;
    this.__items = [];
    this.addEventListener("a11y-collapse-attached", (e) => {
      e.stopPropagation();
      e.stopImmediatePropagation();
      this._attachItem(e.detail);
    });
    this.addEventListener("a11y-collapse-detached", (e) => {
      e.stopPropagation();
      e.stopImmediatePropagation();
      this._detachItem(e.detail);
    });
    this.addEventListener("a11y-collapse-click", (e) => {
      e.stopPropagation();
      e.stopImmediatePropagation();
      this.radioToggle(e.detail);
    });
    this.addEventListener("toggle", (e) => {
      e.stopPropagation();
      e.stopImmediatePropagation();
      this.radioToggle(e.detail);
    });
  }
  static get tag() {
    return "a11y-collapse-group";
  }

  static get properties() {
    return {
      ...super.properties,
      ...A11yCollapse.properties,
      /**
       * an array of globalProperties to override every a11y-collapse item
       * For example, {"icon": "arrow-drop-down"} would set every item's icon to "arrow-drop-down"
       */
      globalOptions: {
        type: Object,
        attribute: "global-options",
        reflect: true,
      },
      /**
       * Acts like a radio button. (Items can only be expanded one at a time.)
       */
      radio: {
        type: Boolean,
        reflect: true,
      },
      /**
       * is radio button
       */
      __items: {
        type: Array,
      },
    };
  }
  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./${this.tag}.haxProperties.json`, import.meta.url).href;
  }

  get items() {
    return this.__items;
  }

  /**
   * Adds a11y-collapse item to __items array.
   * @param {object} item an a11y-collapse item
   */
  _attachItem(item) {
    this.__items.push(item);
    Object.keys(A11yCollapseGroup.properties || {}).forEach((propName) =>
      this._updateItem(item, propName),
    );
  }
  /**
   * Updates a11y-collapse item when properties change
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      this.__items.forEach((item) =>
        this._updateItem(item, propName, oldValue),
      );
    });
  }
  _updateItem(item, propName, oldValue = undefined) {
    if (propName === "globalOptions" || propName === "__items") {
      if (this.globalOptions != {})
        for (let key in this.globalOptions) {
          if (this.globalOptions.hasOwnProperty(key)) {
            item[key] = this.globalOptions[key];
          }
        }
    } else if (propName === "radio" && this.radio) {
      item.expanded = false;
    } else {
      if (this[propName] !== null || typeof this[propName] !== typeof undefined)
        item[propName] = this[propName];
    }
  }

  /**
   * Removes a detached item from __items array.
   * @param {object} item an a11y-collapse item
   */
  _detachItem(item) {
    if (this.__items && item) {
      for (let i = 0; i < this.__items.length; i++) {
        if (this.__items[i] === item) this.__items.splice(i, 1);
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
}
customElements.define(A11yCollapseGroup.tag, A11yCollapseGroup);
export { A11yCollapseGroup };
