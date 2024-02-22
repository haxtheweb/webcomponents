/**
 * Copyright 2018 Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
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
          margin-right: -0.2em;
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
    this.haxUIElement = true;
    let hex = Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
    this.id = "rte-" + "ss-s-s-s-sss".replace(/s/g, hex);
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
  }
  emptyContents() {
    let nodes = [...this.childNodes];
    nodes.forEach((node) => {
      if (this.parentNode) this.parentNode.insertBefore(node, this);
    });
    globalThis.document.body.append(this);
    this.hidden = true;
    this.range = undefined;
  }
  wrap(range) {
    if (!range) return;
    if (!this.hidden && range !== this.range) this.emptyContents();
    this.range = range;
    let contents = range.extractContents();
    this.append(contents);
    try {
      range.insertNode(this);
    } catch (e) {}
    range.selectNodeContents(this);
    this.hidden = false;
  }
  unwrap(range) {
    let nodes = [...this.childNodes].reverse(),
      collapse = nodes.length < 1;
    if (range) range.setStartBefore(this);
    nodes.forEach((node, i) => {
      if (range) range.insertNode(node);
    });
    globalThis.document.body.append(this);
    this.hidden = true;
    this.range = range;
  }
}
customElements.define(RichTextEditorHighlight.tag, RichTextEditorHighlight);
export { RichTextEditorHighlight };

// register globally so we can make sure there is only one
globalThis.RichTextEditorHighlight = globalThis.RichTextEditorHighlight || {};
// request if this exists. This helps invoke element existing in dom
// as well as that there is only one of them. That way we can ensure everything
// is rendered through same modal
globalThis.RichTextEditorHighlight.requestAvailability = () => {
  if (!globalThis.RichTextEditorHighlight.instance) {
    globalThis.RichTextEditorHighlight.instance =
      globalThis.document.createElement("rich-text-editor-highlight");
    globalThis.document.body.appendChild(
      globalThis.RichTextEditorHighlight.instance,
    );
  }
  return globalThis.RichTextEditorHighlight.instance;
};
