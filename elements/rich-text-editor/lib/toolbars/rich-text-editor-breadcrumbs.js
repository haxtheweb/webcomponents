/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { RichTextEditorStyles } from "../rich-text-editor-styles.js";
import "./rich-text-editor-breadcrumb.js";

/**
 * `rich-text-editor-breadcrumbs`
 * `A utility that manages the state of multiple rich-text-prompts on one page.`
 *
 *  @element rich-text-editor-breadcrumbs
 */
class RichTextEditorBreadcrumbs extends RichTextEditorStyles(LitElement) {
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "rich-text-editor-breadcrumbs";
  }

  static get styles() {
    return [
      ...super.styles,
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
      ${!this.ancestorNodes
        ? ""
        : (this.ancestorNodes || []).map(
            (crumb, i) => html`
              <rich-text-editor-breadcrumb
                controls="${this.controls}"
                tag="${crumb.tag}"
                .target="${crumb.target}"
              >
              </rich-text-editor-breadcrumb>
              ${i + 1 >= this.ancestorNodes.length
                ? ""
                : html` <span class="divider"> &gt; </span> `}
            `
          )}
    `;
  }

  static get properties() {
    return {
      /**
       * The active rict-text-editor.
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
       * The breadcrumb labels.
       */
      label: {
        type: String,
      },
      /**
       * The selected text.
       */
      range: {
        type: Object,
      },
      /**
       * Should the breadcrumbs stick to the top so that it is always visible?
       */
      sticky: {
        type: Boolean,
        reflect: true,
      },
    };
  }

  constructor() {
    super();
    this.hidden = false;
    this.sticky = false;
    this.label = `Expand selection: `;
  }
  /**
   * updates the breadcrumbs
   * @param {object} the selected range
   * @param {string} controls id of what the breadcrumbs control
   * @returns {void}
   */
  get ancestorNodes() {
    let nodes = [],
      ancestor = false,
      parent = false,
      controls = this.controls;
    if (!!this.range) ancestor = this.range.commonAncestorContainer;
    if (!!ancestor) parent = ancestor;
    this.hidden = !ancestor;
    while (!!parent && parent.nodeName !== "RICH-TEXT-EDITOR") {
      nodes.unshift({
        tag: parent.nodeName.toLowerCase(),
        target: parent,
      });
      parent = parent.parentNode;
    }
    return nodes;
  }
}
window.customElements.define(
  RichTextEditorBreadcrumbs.tag,
  RichTextEditorBreadcrumbs
);
export { RichTextEditorBreadcrumbs };
