/**
 * Copyright 2018 Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
/**
 * `rich-text-editor-highlight`
 * `A highlights range when toolbar UI has focus.`
 *
 * @customElement
 * @lit-html
 * @lit-element
 * @element rich-text-editor-highlight
 */
class RichTextEditorHighlight extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          outline: 1px dotted currentColor;
        }
        :host(:empty) {
          outline: none;
          border-left: 1px dotted currentColor;
          margin-right: 0.25em;
        }
        :host([hidden]) {
          display: none !important;
        }
      `,
    ];
  }

  static get properties() {
    return {
      hidden: {
        type: Boolean,
        reflect: true,
      },
      id: {
        type: String,
        reflect: true,
      },
      range: {
        type: Object,
      },
    };
  }

  render() {
    return html`<slot></slot>`;
  }

  /**
   * Store tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "rich-text-editor-highlight";
  }

  /**
   * Makes sure there is a utility ready and listening for elements.
   */
  constructor() {
    super();
    let hex = Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
    this.id = "rte-" + "ss-s-s-s-sss".replace(/s/g, hex);
  }

  firstUpdated(changedProperties) {
    this.emptyContents();
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
  }
  emptyContents() {
    let nodes = [...this.childNodes];
    nodes.forEach((node) => {
      this.parentNode.insertBefore(node, this);
    });
    document.body.append(this);
    this.hidden = true;
    this.range = undefined;
  }
  wrap(range) {
    if (!range) return;
    if (!this.hidden && range !== this.range) this.emptyContents();
    this.range = range;
    console.log(
      "wrap 1",
      range,
      !range || !range.cloneContents()
        ? false
        : range.cloneContents().textContent
    );
    let contents = range.extractContents();
    console.log(
      "wrap 2",
      contents,
      this.innerHTML,
      range,
      !range || !range.cloneContents()
        ? false
        : range.cloneContents().textContent
    );
    this.append(contents);
    console.log(
      "wrap 3",
      this.innerHTML,
      range,
      !range || !range.cloneContents()
        ? false
        : range.cloneContents().textContent
    );
    try {
      range.insertNode(this);
    } catch (e) {}
    console.log(
      "wrap 4",
      this.innerHTML,
      range,
      !range || !range.cloneContents()
        ? false
        : range.cloneContents().textContent
    );
    range.selectNodeContents(this);
    console.log(
      "wrap 5",
      this.innerHTML,
      range,
      !range || !range.cloneContents()
        ? false
        : range.cloneContents().textContent
    );
    this.hidden = false;
  }
  unwrap(range) {
    let nodes = [...this.childNodes].reverse(),
      collapse = nodes.length < 1;
    console.log(
      "unwrap 1",
      range,
      !range || !range.cloneContents()
        ? false
        : range.cloneContents().textContent,
      nodes,
      this.innerHTML
    );
    if (range) range.setStartBefore(this);
    console.log(
      "unwrap 2",
      range,
      !range || !range.cloneContents()
        ? false
        : range.cloneContents().textContent,
      nodes,
      this.innerHTML
    );
    nodes.forEach((node, i) => {
      if (range) range.insertNode(node);
    });
    console.log(
      "unwrap 3",
      range,
      !range || !range.cloneContents()
        ? false
        : range.cloneContents().textContent,
      nodes,
      this.innerHTML
    );
    document.body.append(this);
    this.hidden = true;
    this.range = range;
    console.log(
      "unwrap 4",
      range,
      !range || !range.cloneContents()
        ? false
        : range.cloneContents().textContent,
      nodes,
      this.innerHTML
    );
  }
}
window.customElements.define(
  RichTextEditorHighlight.tag,
  RichTextEditorHighlight
);
export { RichTextEditorHighlight };

// register globally so we can make sure there is only one
window.RichTextEditorHighlight = window.RichTextEditorHighlight || {};
// request if this exists. This helps invoke element existing in dom
// as well as that there is only one of them. That way we can ensure everything
// is rendered through same modal
window.RichTextEditorHighlight.requestAvailability = () => {
  if (!window.RichTextEditorHighlight.instance) {
    window.RichTextEditorHighlight.instance = document.createElement(
      "rich-text-editor-highlight"
    );
    document.body.appendChild(window.RichTextEditorHighlight.instance);
  }
  return window.RichTextEditorHighlight.instance;
};
