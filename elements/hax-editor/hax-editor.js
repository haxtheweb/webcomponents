/**
 * Copyright 2021 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element";
import "@lrnwebcomponents/rich-text-editor/rich-text-editor.js";
import "./lib/hax-editor-toolbar.js";

/**
 * `hax-editor`
 * `HAX-specific implementation of rich-text-editor`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @lit-html
 * @lit-element
 * @demo demo/index.html
 */
class HaxEditor extends LitElement {
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
      `,
    ];
  }

  // render function
  render() {
    return html` <rich-text-editor
      ?disableHover="${this.disableHover}"
      .placeholder="${this.placeholder}"
      .toolbar="${this.toolbar}"
      type="${this.type || "hax-editor-toolbar"}"
    >
      <slot></slot>
    </rich-text-editor>`;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,
      /**
       * editor's unique id
       */
      id: {
        name: "id",
        type: String,
        reflect: true,
        attribute: "id",
      },
      /**
       * don't reveal toolbar on mouseover
       */
      disableHover: {
        name: "disableHover",
        type: Boolean,
        attribute: "disable-hover",
      },
      /**
       * Placeholder text for empty editable regions
       */
      placeholder: {
        name: "placeholder",
        type: String,
        reflect: true,
        attribute: "placeholder",
      },

      /**
       * id for toolbar
       */
      toolbar: {
        name: "toolbar",
        type: String,
        reflect: true,
        attribute: "toolbar",
      },

      /**
       * type of editor toolbar, i.e.
       * full - full for full toolbar with breadcrumb,
       * mini - mini for mini floating toolbar, or
       * default toolbar if neither.
       */
      type: {
        name: "type",
        type: String,
        reflect: true,
        attribute: "type",
      },
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  tag() {
    return "hax-editor";
  }

  // life cycle
  constructor() {
    super();

    this.tag = HaxEditor.tag;
    this.type = "hax-editor-toolbar";
    // map our imported properties json to real props on the element
    // @notice static getter of properties is built via tooling
    // to edit modify src/hax-editor-properties.json
    let obj = HaxEditor.properties;
    for (let p in obj) {
      if (obj.hasOwnProperty(p)) {
        if (this.hasAttribute(p)) {
          this[p] = this.getAttribute(p);
        } else {
          this.setAttribute(p, obj[p].value);
          this[p] = obj[p].value;
        }
      }
    }
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
  }
  // static get observedAttributes() {
  //   return [];
  // }
  // disconnectedCallback() {}

  // attributeChangedCallback(attr, oldValue, newValue) {}
}
customElements.define("hax-editor", HaxEditor);
export { HaxEditor };
