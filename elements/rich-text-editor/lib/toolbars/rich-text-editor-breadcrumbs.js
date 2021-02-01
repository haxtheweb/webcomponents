/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { RichTextStyles } from "../buttons/rich-text-editor-button.js";

/**
 * `rich-text-editor-breadcrumbs`
 * `A utility that manages state of multiple rich-text-prompts on one page.`
 *
 *  @element rich-text-editor-breadcrumbs
 */
class RichTextEditorBreadcrumbs extends LitElement {
  /**
   * Store tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "rich-text-editor-breadcrumbs";
  }

  static get properties() {
    return {
      /**
       * active rict-text-editor.
       */
      controls: {
        type: String,
      },
      /**
       * Hide breadcrumbs
       */
      hidden: {
        type: Boolean,
        attribute: "hidden",
        reflect: true,
      },
      /**
       * breadcrumb labels.
       */
      label: {
        type: String,
      },
      /**
       * Should breadcrumbs stick to top so that it is always visible?
       */
      sticky: {
        type: Boolean,
        reflect: true,
      },
      /**
       * array of ancestors of currently selected node
       */
      selectionAncestors: {
        type: Array,
      },
    };
  }

  constructor() {
    super();
    this.hidden = true;
    this.sticky = false;
    this.label = "Select";
  }
  /**
   * Handles button tap;
   * @param {event} e the button tab event
   * @returns {void}
   */
  _handleClick(ancestor) {
    this.dispatchEvent(
      new CustomEvent("breadcrumb-click", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: ancestor,
      })
    );
  }
  render() {
    return html`
      ${this.label}:
      ${!this.selectionAncestors
        ? ""
        : (this.selectionAncestors || []).map(
            (ancestor, i) => html`
              <button
                class="${ancestor.selectAll ? "" : "selectnode"}"
                controls="${this.controls}"
                @click="${(e) => this._handleClick(ancestor)}"
                tabindex="0"
              >
                ${ancestor.nodeName.toLowerCase()}
              </button>
              ${i + 1 >= (this.selectionAncestors || []).length
                ? ""
                : html` <span class="divider"> &gt; </span> `}
            `
          )}
    `;
  }

  static get styles() {
    return [
      ...RichTextStyles,
      css`
        :host {
          display: block;
          background-color: var(--simple-toolbar-button-bg, #ffffff);
          color: var(--simple-toolbar-button-color #444);
          border: var(--simple-toolbar-border-width, 1px) solid var(--simple-toolbar-border-color, #ddd);
          padding: 3px 10px;
        }
        :host([sticky]) {
          position: sticky;
          bottom: 0;
        }
        .selectednode {
          background-color: var(--simple-toolbar-button-bg, #ffffff);
        }
        button {
          display: inline-block;
          text-align: center;
          min-width: 25px;
          margin: 0;
          padding: 2px 5px;
        }
        .selectNode {
          font-family: monospace;
        }
      `,
    ];
  }
}
window.customElements.define(
  RichTextEditorBreadcrumbs.tag,
  RichTextEditorBreadcrumbs
);
export { RichTextEditorBreadcrumbs };
