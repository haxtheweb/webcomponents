/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { RichTextToolbarStyles } from "@haxtheweb/rich-text-editor/lib/buttons/rich-text-editor-button.js";
import { RichTextEditorRangeBehaviors } from "@haxtheweb/rich-text-editor/lib/singletons/rich-text-editor-range-behaviors.js";

/**
 * `rich-text-editor-breadcrumbs`
 * a toolbar of selection's ancestor breadcrumbs
 *
 * ### Styling
`<rich-text-editor-breadcrumbs>` uses RichTextToolbarStyles constant 
from rich-text-editor-toolbar to set SimpleToolbarBehaviors's 
simple-toolbar/simple-toolbar-button variables.
 *
 * @customElement
 * @extends LitElement
 * @extends RichTextToolbarStyles
 * @lit-html
 * @lit-element
 *  @element rich-text-editor-breadcrumbs
 */
class RichTextEditorBreadcrumbs extends RichTextEditorRangeBehaviors(
  LitElement,
) {
  /**
   * Store tag name to make it easier to )obtain directly.
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
  _handleClick(breadcrumb) {
    if (breadcrumb.selectAll) {
      this.selectNodeContents(breadcrumb.selectAll);
    } else {
      this.selectNode(breadcrumb);
    }
    if (this.editor) this.editor.focus();
  }

  render() {
    return html`
      ${this.label}:
      ${!this.selectionAncestors
        ? ""
        : (this.selectionAncestors || []).map(
            (ancestor, i) => html`
              <button
                class="${!!ancestor.selectAll ? "" : "selectnode"}"
                controls="${this.controls}"
                @click="${(e) => this._handleClick(ancestor)}"
                tabindex="0"
              >
                ${ancestor.nodeName.toLowerCase()}
              </button>
              ${i + 1 >= (this.selectionAncestors || []).length
                ? ""
                : html` <span class="divider"> &gt; </span> `}
            `,
          )}
    `;
  }

  static get styles() {
    return [
      ...RichTextToolbarStyles,
      css`
        :host {
          display: block;
          background-color: var(--rich-text-editor-bg, #ffffff);
          color: var(--rich-text-editor-button-color #444);
          border: var(--rich-text-editor-border-width, 1px) solid var(--rich-text-editor-border-color, #ddd);
          padding: 3px 10px;
        }
        :host([sticky]) {
          position: sticky;
          bottom: 0;
        }
        .selectednode {
          background-color: var(--rich-text-editor-button-bg, #ffffff);
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
customElements.define(RichTextEditorBreadcrumbs.tag, RichTextEditorBreadcrumbs);
export { RichTextEditorBreadcrumbs };
