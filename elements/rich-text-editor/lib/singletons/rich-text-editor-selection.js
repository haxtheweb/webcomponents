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
    this.setAttribute("id", this._generateUUID());
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
   * expands the selection to a specific ancestor or wraps the selection in a default tag
   * @param {string} searchTag the ancestor tagName to find
   * @param {string} wrapTag the tagName to use if ancestor cannot be found
   * @returns {object} the selected node
   */
  expandSelection(searchTag = null, wrapTag = null) {
    return (
      this.selectAncestor(searchTag) ||
      this.wrap(wrapTag ? document.createElement(wrapTag) : null)
    );
  }

  /**
   * Normalizes selected range data.
   *
   * @returns {object} the selected range
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
   * adds or removes the hightlight
   * @param {object} contents the contents to be highlighted
   * @returns {void}
   */
  addHighlight() {
    let root = this;
    root.range.surroundContents(root);
    root.range.selectNode(root.firstChild);
    root.dispatchEvent(new CustomEvent("highlight", { detail: root }));
    root.hidden = false;
  }

  /**
   * gets the contents of the selected range
   * @returns {object} the range contents
   */
  getRangeContents() {
    return this.range ? this.range.cloneContents() : null;
  }

  /**
   * searches for a closest ancestor by tagname,
   * expands the selection to the matching ancestor,
   * and returns the ancestor, or returns null if not found
   * @param {string} tag the tag to expand the selection to
   * @returns {object} the selected node
   */
  selectAncestor(tagName = null) {
    let wrapper = null,
      getMatchingTag = ancestor => {
        if (
          ancestor &&
          ancestor.tagName &&
          (!tagName || ancestor.tagName.toLowerCase() === tagName.toLowerCase())
        ) {
          return ancestor;
        } else if (
          ancestor.parentNode &&
          ancestor.parentNode.childNodes.length === 1
        ) {
          return getMatchingTag(ancestor.parentNode);
        } else {
          return null;
        }
      };
    //try to find an ancestor that matches the tag
    if (this.range) {
      let ancestor = this.range.commonAncestorContainer;
      wrapper = getMatchingTag(ancestor);
      if (wrapper) this.range.selectNode(wrapper);
    }
    return wrapper;
  }
  /**
   * sets the selection range to the specified node
   * @param {object} node the node to select
   * @returns {void}
   */
  selectNode(node = null) {
    if (node) {
      if (!this.range) {
        let sel = window.getSelection();
        this.range = document.createRange();
        sel.removeAllRanges();
        sel.addRange(this.range);
      }
      this.range.selectNode(node);
    }
  }
  /**
   * sets the selection range to the specified node's contents
   * @param {object} node the node to select
   * @returns {void}
   */
  selectNodeContents(node = null) {
    if (node) {
      if (!this.range) {
        let sel = window.getSelection();
        this.range = document.createRange();
        sel.removeAllRanges();
        sel.addRange(this.range);
      }
      this.range.selectNodeContents(node);
    }
  }

  /**
   * gets the range contents in specified wrapper
   * @param {object} wrapper a node to wrap the range contents in
   * @returns {object} the range which oncludes the wrapper and wrapped contents
   */
  wrap(wrapper) {
    wrapper = wrapper || document.createElement("span");
    this.range.surroundContents(wrapper);
    return wrapper;
  }

  /**
   * Updates the selected range based on toolbar and editor
   * @param {event} e the editor change event
   * @param {deselect} if the editor is being deselected
   * @returns {void}
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
   * Generate a UUID
   * @returns {string} the unique id
   */
  _generateUUID() {
    let hex = Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
    return "rte-" + "ss-s-s-s-sss".replace(/s/g, hex);
  }

  /**
   * Updates the toolbar
   */
  _updateToolbar() {
    if (this.toolbar) this.toolbar.range = this.range;
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
    document.body.appendChild(window.RichTextEditorSelection.instance);
  }
  return window.RichTextEditorSelection.instance;
};
