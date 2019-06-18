/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "./rich-text-editor-breadcrumb.js";
import "../rich-text-editor-styles.js";
import "../buttons/rich-text-editor-button-styles.js";

/**
 * `rich-text-editor-breadcrumbs`
 * `A utility that manages the state of multiple rich-text-prompts on one page.`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 */
class RichTextEditorBreadcrumbs extends PolymerElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */ // render function
  static get template() {
    return html`
      <style include="rich-text-editor-styles"></style>
      <style include="rich-text-editor-button-styles">
        :host([sticky]) {
          position: sticky;
          bottom: 0;
        }
        :host {
          display: block;
          background-color: var(--rich-text-editor-bg);
          color: var(--rich-text-editor-button-color);
          border: var(--rich-text-editor-border);
          padding: 3px 10px;

          --rich-text-editor-breadcrumb: {
            font-family: monospace;
            display: inline-block;
            text-align: center;
            min-width: 30px;
            line-height: 30px;
            margin: 0;
            padding: 2px 5px;
          }
        }
        :host .selectednode {
          background-color: var(--rich-text-editor-bg);
          @apply --rich-text-editor-breadcrumb;
        }
      </style>
      [[label]]
      <template is="dom-repeat" items="[[ancestorNodes]]" as="crumb">
        <rich-text-editor-breadcrumb
          controls$="[[controls]]"
          tag$="[[crumb.tag]]"
          target="[[crumb.target]]"
        >
        </rich-text-editor-breadcrumb>
      </template>
    `;
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "rich-text-editor-breadcrumbs";
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * fields for the prompt popover.
       */
      ancestorNodes: {
        type: Array,
        computed: "_getAncestorNodes(range,controls)"
      },
      /**
       * The active rict-text-editor.
       */
      controls: {
        type: String,
        value: null
      },
      /**
       * Hide breadcrumbs
       */
      hidden: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      /**
       * The breadcrumb labels.
       */
      label: {
        name: "label",
        type: String,
        value: "Expand selection: "
      },
      /**
       * The selected text.
       */
      range: {
        type: Object,
        value: null
      },
      /**
       * Should the breadcrumbs stick to the top so that it is always visible?
       */
      sticky: {
        name: "sticky",
        type: Boolean,
        value: false,
        reflectToAttribute: true
      }
    };
  }

  /**
   * life cycle, element is afixed to the DOM
   * Makes sure there is a utility ready and listening for elements.
   * @returns {void}
   */
  connectedCallback() {
    super.connectedCallback();
  }
  /**
   * updates the breadcrumbs
   * @param {object} the selected range
   * @param {string} controls id of what the breadcrumbs control
   * @returns {void}
   */
  _getAncestorNodes(range, controls) {
    let nodes = [],
      node = "",
      ancestor = false,
      parent = false;
    if (range) ancestor = range.commonAncestorContainer;
    if (ancestor) parent = ancestor;
    this.hidden = !ancestor;
    while (parent && parent.nodeName !== "RICH-TEXT-EDITOR") {
      nodes.unshift({
        tag: parent.nodeName.toLowerCase(),
        target: parent
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
