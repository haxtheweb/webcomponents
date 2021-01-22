/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { RichTextStyles } from "../buttons/rich-text-editor-button.js";
import "@lrnwebcomponents/rich-text-editor/lib/singletons/rich-text-editor-selection.js";
import "./rich-text-editor-breadcrumb.js";

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

  static get styles() {
    return [
      ...RichTextStyles,
      css`
        :host {
          display: block;
          background-color: var(--rich-text-editor-bg);
          color: var(--rich-text-editor-button-color);
          border: var(--rich-text-editor-border);
          padding: 3px 10px;
        }
        :host([sticky]) {
          position: sticky;
          bottom: 0;
        }
        .selectednode {
          background-color: var(--rich-text-editor-bg);
        }
      `,
    ];
  }
  render() {
    return html`
      ${this.label}
      ${!this.selectionAncestors
        ? ""
        : (this.selectionAncestors || []).map(
            (ancestor, i) => html`
              <rich-text-editor-breadcrumb
                controls="${this.controls}"
                label="${ancestor.nodeName.toLowerCase()}"
                .target="${ancestor}"
                @breadcrumb-tap="${this._handleBreadcrumb}"
              >
              </rich-text-editor-breadcrumb>
              ${i + 1 >= (this.selectionAncestors || []).length
                ? ""
                : html` <span class="divider"> &gt; </span> `}
            `
          )}
    `;
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
    this.label = `Expand selection: `;
  }

  selectNode(node) {
    this.dispatchEvent(
      new CustomEvent("selectnode", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: node,
      })
    );
  }

  /**
   * handle a breadcrumb tap by updating the selected text
   *
   * @param {object} e the breadcrumb tap event
   * @returns {void}
   */
  _handleBreadcrumb(e) {
    if (e.detail.target) {
      this.selectNode(e.detail.target);
    }
  }
}
window.customElements.define(
  RichTextEditorBreadcrumbs.tag,
  RichTextEditorBreadcrumbs
);
export { RichTextEditorBreadcrumbs };
