/**
 * Copyright 2021 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element";
import { RichTextEditor } from "@lrnwebcomponents/rich-text-editor/rich-text-editor.js";
import "./lib/hax-text-editor-toolbar.js";

/**
 * `hax-text-editor`
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
class HaxTextEditor extends LitElement {
  //styles function
  static get styles() {
    return [
      css`
        :host,
        rich-text-editor {
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
      type="${this.type || "hax-text-editor-toolbar"}"
    >
      <slot></slot>
    </rich-text-editor>`;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...RichTextEditor.properties,
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  tag() {
    return "hax-text-editor";
  }

  // life cycle
  constructor() {
    super();

    this.tag = HaxTextEditor.tag;
    this.type = "hax-text-editor-toolbar";
    // map our imported properties json to real props on the element
    // @notice static getter of properties is built via tooling
    // to edit modify src/hax-text-editor-properties.json
    let obj = HaxTextEditor.properties;
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
customElements.define("hax-text-editor", HaxTextEditor);
export { HaxTextEditor };
