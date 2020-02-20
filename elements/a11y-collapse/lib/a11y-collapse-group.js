import { LitElement, html, css } from "lit-element/lit-element.js";
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
 * @extends A11yCollapse
 * @see ../a11y-collapse.js
 * @demo ./demo/group.html collapse groups
 * @customElement a11y-collapse-group
 */
class A11yCollapseGroup extends A11yCollapse {
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
    this.accordion = null;
    this.disabled = null;
    this.expanded = null;
    this.icon = null;
    this.iconExpanded = null;
    this.label = null;
    this.labelExpanded = null;
    this.tooltip = null;
    this.tooltipExpanded = null;
    this.globalOptions = {};
    this.radio = false;
    this.__items = [];
    this.addEventListener("a11y-collapse-attached", function(e) {
      this._attachItem(e.detail);
      e.stopPropagation();
      e.stopImmediatePropagation();
    });
    this.addEventListener("a11y-collapse-detached", function(e) {
      this._detachItem(e.detail);
      e.stopPropagation();
      e.stopImmediatePropagation();
    });
    this.addEventListener("a11y-collapse-click", function(e) {
      this.radioToggle(e.detail);
      e.stopPropagation();
      e.stopImmediatePropagation();
    });
  }
  static get tag() {
    return "a11y-collapse-group";
  }

  static get properties() {
    return {
      ...super.properties,
      /**
       * an array of globalProperties to override every a11y-collapse item
       * For example, {"icon": "arrow-drop-down"} would set every item's icon to "arrow-drop-down"
       */
      globalOptions: {
        type: Object,
        attribute: "global-options",
        reflect: true
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
  static get haxProperties() {
    return null;
  }

  /**
   * Adds a11y-collapse item to __items array.
   * @param {object} item an a11y-collapse item
   */
  _attachItem(item) {
    this.__items.push(item);
  }
  /**
   * Updates a11y-collapse item when properties change
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      this.__items.forEach(item => {
        if (propName === "globalOptions" || propName === "__items") {
          if (this.globalOptions !== {})
            for (let key in this.globalOptions) {
              if (this.globalOptions.hasOwnProperty(key)) {
                item[key] = this.globalOptions[key];
              }
            }
        }
        if (propName === "expanded" && this.expanded) {
          item.expanded = true;
        }
        if (propName === "radio" && this.radio) {
          item.expanded = false;
        }
        if (
          propName === "accordion" ||
          propName === "disabled" ||
          propName === "icon" ||
          propName === "iconExpanded" ||
          propName === "label" ||
          propName === "lanelExpanded" ||
          propName === "tooltip" ||
          propName === "tooltipExpanded"
        ) {
          if (this[propName] !== null) item[propName] = this[propName];
        }
      });
    });
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
