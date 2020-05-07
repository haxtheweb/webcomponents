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
 * @element a11y-collapse-group
 * @extends A11yCollapse
 * @see ../a11y-collapse.js
 * @demo ./demo/group.html collapse groups
 * @element a11y-collapse-group
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
          --a11y-collapse-margin: 0 0;
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
    this.addEventListener("a11y-collapse-attached", e => {
      e.stopPropagation();
      e.stopImmediatePropagation();
      this._attachItem(e.detail);
      e.stopPropagation();
      e.stopImmediatePropagation();
    });
    this.addEventListener("a11y-collapse-detached", e => {
      e.stopPropagation();
      e.stopImmediatePropagation();
      this._detachItem(e.detail);
      e.stopPropagation();
      e.stopImmediatePropagation();
    });
    this.addEventListener("a11y-collapse-click", e => {
      e.stopPropagation();
      e.stopImmediatePropagation();
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
       * is disabled?
       */
      disabled: {
        type: Boolean,
        reflect: true,
        attribute: "disabled"
      },
      /**
       * is disabled?
       */
      hidden: {
        type: Boolean,
        reflect: true,
        attribute: "hidden"
      },
      /**
       * Acts like a radio button. (Items can only be expanded one at a time.)
       */
      radio: {
        type: Boolean,
        attribute: "radio"
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
    return {
      canScale: false,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "Expand Collapse Group",
        description: "A group of expand collapse elements.",
        icon: "view-day",
        color: "grey",
        groups: ["Content", "Presentation", "Collapse"]
      },
      settings: {
        quick: [
          {
            property: "radio",
            title: "Expand only one",
            description: "Only one item can be expanded.",
            inputMethod: "boolean"
          },
          {
            property: "disabled",
            title: "Disabled",
            description: "Disable items.",
            inputMethod: "boolean"
          }
        ],
        configure: [
          {
            property: "radio",
            title: "Expand only one",
            description: "Only one item can be expanded.",
            inputMethod: "boolean"
          },
          {
            property: "disabled",
            title: "Disabled",
            description: "Disable items.",
            inputMethod: "boolean"
          },
          {
            slot: "",
            title: "Collapse Items",
            description: "The collapse items.",
            inputMethod: "code-editor"
          }
        ],
        advanced: [
          {
            property: "hidden",
            title: "Hidden",
            inputMethod: "boolean"
          }
        ]
      }
    };
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
    this.removeEventListener("a11y-collapse-click", e => {
      e.stopPropagation();
      this.radioToggle(e.detail);
    });
    this.removeEventListener("a11y-collapse-attached", e => {
      e.stopPropagation();
      this.push("__items", e.detail);
    });
    this.removeEventListener("a11y-collapse-detached", e => {
      e.stopPropagation();
      this._detachItem(e.detail);
    });
    super.disconnectedCallback();
  }
}
window.customElements.define(A11yCollapseGroup.tag, A11yCollapseGroup);
export { A11yCollapseGroup };
