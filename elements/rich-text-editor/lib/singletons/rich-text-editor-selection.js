/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "../rich-text-editor-styles.js";
/**
 * `rich-text-editor-selection`
 * `a button for rich text editor (custom buttons can extend this)`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 */
class RichTextEditorSelection extends PolymerElement {
  // render function
  static get template() {
    return html`
      <style include="rich-text-editor-styles">
        :host {
          background-color: var(--rich-text-editor-selection-bg);
          @apply --rich-text-editor-content-selection;
        }
        :host([hidden]) {
          display: none;
        }
      </style>
      <slot></slot>
    `;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      editor: {
        type: Object,
        value: null
      },
      hidden: {
        type: Boolean,
        value: true,
        reflectToAttribute: true
      },
      observer: {
        type: Object,
        value: null
      },
      range: {
        type: Object,
        value: null,
        observer: "_updateToolbar"
      },
      toolbar: {
        type: Object,
        value: null
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "rich-text-editor-selection";
  }

  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    let root = this;
    document.addEventListener("selectionchange", e => {
      root.range = root.getRange();
    });
    document.addEventListener("select-rich-text-editor-editor", e => {
      root._editorChange(e);
    });
    document.addEventListener("deselect-rich-text-editor-editor", e => {
      root._editorChange(e);
    });
  }

  /**
   * life cycle, element is disconnected
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    let root = this;
    document.removeEventListener("selectionchange", e => {
      root.range = root.getRange();
    });
    document.removeEventListener("select-rich-text-editor-editor", e => {
      root._editorChange(e);
    });
    document.removeEventListener("deselect-rich-text-editor-editor", e => {
      root._editorChange(e);
    });
  }
  /**
   * Normalizes selection data.
   *
   * @returns {object} the selection
   */
  getRange() {
    let sel = window.getSelection();
    if (sel.getRangeAt && sel.rangeCount) {
      return sel.getRangeAt(0);
    } else if (sel) {
      return sel;
    } else false;
  }

  /**
   * Updates the toolbar
   */
  _updateToolbar() {
    let deleteme = "hello";
    this.getWrapper();
    if (this.toolbar) this.toolbar.selection = this.range;
  }

  /**
   * Updates the selection based on toolbar and editor
   */
  _editorChange(e, deselect = false) {
    let root = this,
      editorChange = root.editor !== e.detail.editor,
      toolbarChange = root.toolbar !== e.detail.toolbar;
    if (deselect || editorChange || toolbarChange) {
      let sel = window.getSelection();
      sel.removeAllRanges();
      root.editor = e.detail.editor;
      root.toolbar = e.detail.toolbar;
      if (root.observer) root.observer.disconnect();
      if (!deselect && e.detail.editor) {
        root.observer = new MutationObserver(evt => {
          root.range = root.getRange();
        });
        root.observer.observe(e.detail.editor, {
          attributes: false,
          childList: true,
          subtree: true,
          characterData: false
        });
      }
    }
  }
  /**
   * wraps the range
   */
  getWrapper() {
    if (this.range) {
      let ancestor = this.range.commonAncestorContainer,
        parent = ancestor ? ancestor.parentNode : null;
      return ancestor && ancestor.tagName
        ? ancestor
        : parent && ancestor.parentNode.tagName
        ? ancestor.parentNode
        : null;
    }
  }

  wrapOrGetTag(tag) {
    let wrapper = this.getWrapper();
    if (
      tag &&
      (!wrapper || tag.toLowerCase() !== wrapper.tagName.toLowerCase())
    ) {
      wrapper = document.createElement(tag);
      this.wrap(wrapper);
    }
    return wrapper;
  }

  setRangeContents(node) {
    if (this.range) {
      this.range.deleteContents();
      this.range.insertNode(node);
    }
  }

  expandRange(node) {
    if (this.range) {
      this.range.deleteContents();
      this.range.insertNode(node);
    }
  }

  getRangeContents() {
    return this.range ? this.range.cloneContents() : null;
  }

  /**
   * unwraps the range
   */
  unwrap(wrapper) {
    if (wrapper.parentNode) {
      wrapper.parentNode.insertBefore(wrapper.firstChild, wrapper);
      document.body.appendChild(wrapper);
    }
  }

  /**
   * wraps the range (or unwraps ir)
   */
  wrap(wrapper) {
    wrapper.appendChild(this.range.extractContents());
    this.range.insertNode(wrapper);
  }

  /**
   * adds or removes the hightlight
   * @param {boolean} off if true, turns highlight off
   */
  addHighlight() {
    let root = this;
    root.dispatchEvent(new CustomEvent("highlight", { detail: root }));
    root.appendChild(this.range.extractContents());
    root.range.insertNode(root);
    root.hidden = false;
  }
  /**
   * adds or removes the hightlight
   * @param {boolean} off if true, turns highlight off
   */
  removeHighlight() {
    let root = this;
    while (root.firstChild) root.parentNode.insertBefore(root.firstChild, root);
    document.body.appendChild(root);
    root.hidden = true;
  }

  /**
   * Generate a UUID
   */
  _generateUUID() {
    let hex = Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
    return "rte-" + "ss-s-s-s-sss".replace(/s/g, hex);
  }
}
window.customElements.define(
  RichTextEditorSelection.tag,
  RichTextEditorSelection
);
export { RichTextEditorSelection };

window.RichTextEditorSelection = {};
window.RichTextEditorSelection.instance = null;
/**
 * Checks to see if there is an instance available, and if not appends one
 */
window.RichTextEditorSelection.requestAvailability = function() {
  if (window.RichTextEditorSelection.instance == null) {
    window.RichTextEditorSelection.instance = document.createElement(
      "rich-text-editor-selection"
    );
  }
  document.body.appendChild(window.RichTextEditorSelection.instance);
  return window.RichTextEditorSelection.instance;
};
