/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { wipeSlot } from "@lrnwebcomponents/utils/utils.js";
/**
 * `relative-heading`
 * `outputs the correct heading hierarchy based on parent heading`
 *
 * @demo demo/index.html
 * @customElement relative-heading
 */
class RelativeHeading extends LitElement {
  //styles function
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
        :host([hidden]) {
          display: none;
        }
      `
    ];
  }
  // render function
  render() {
    return html`
      <div><slot></slot></div>
    `;
  }

  // haxProperty definition
  static get haxProperties() {
    return {
      canScale: true,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "Relative heading",
        description:
          "outputs the correct heading hierarchy based on parent's heading",
        icon: "icons:android",
        color: "green",
        groups: ["Heading"],
        handles: [
          {
            type: "todo:read-the-docs-for-usage"
          }
        ],
        meta: {
          author: "nikkimk",
          owner: "The Pennsylvania State University"
        }
      },
      settings: {
        quick: [],
        configure: [
          {
            property: "parentHeading",
            description: "",
            inputMethod: "array",
            required: false,
            icon: "icons:android"
          },
          {
            property: "tag",
            description: "",
            inputMethod: "textfield",
            required: false,
            icon: "icons:android"
          }
        ],
        advanced: []
      }
    };
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,

      /**
       * The default heading level (1-6), eg., 1 for <h1>, if there  is no parent.
       */
      defaultLevel: {
        type: Number,
        attribute: "default-level"
      },
      /**
       * The relative-heading's UUID.
       */
      id: {
        type: String
      },
      /**
       * The parent relative-heading's UUID.
       */
      parentId: {
        type: String,
        attribute: "parent-id"
      },
      /**
       * The heading text.
       */
      text: {
        type: String
      },
      /**
       * The heading level (1-6), eg., 1 for <h1>
       */
      level: {
        type: Number,
        reflect: true
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "relative-heading";
  }
  /**
   * update this level when the parent id changes
   */
  _getLevel(parentId, defaultLevel) {
    let parent = document.querySelector("#" + parentId),
      parentLvl =
        parent !== null && parent.level !== undefined
          ? parent.level
          : defaultLevel - 1,
      level = parentLvl < 6 ? parentLvl + 1 : 6;
    return level;
  }
  _updateChildren() {
    document
      .querySelectorAll('relative-heading[parent-id="' + this.id + '"]')
      .forEach(child => {
        child.parentId = null;
        child.parentId = this.id;
      });
  }
  /**
   * determines if the level matches a specific level
   *
   * @param {number} the heading level
   * @param {number} the level it might match
   * @returns {boolean} whether or not they match
   */
  _isLevel(level, testLevel) {
    return level === testLevel;
  }
  constructor() {
    super();
    this.defaultLevel = 1;
    this.parentId = null;
    this.text = "";
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "id") {
        this._updateChildren(this[propName], oldValue);
      }
      if (propName == "level" || propName == "text") {
        wipeSlot(this);
        let level = document.createElement(`h${this.level}`);
        level.innerText = this.text;
        this.appendChild(level);
        this._updateChildren(this.level, oldValue);
      }
      if (["parentId", "defaultLevel"].includes(propName)) {
        this.level = this._getLevel(this.parentId, this.defaultLevel);
      }
    });
  }
}
window.customElements.define(RelativeHeading.tag, RelativeHeading);
export { RelativeHeading };
