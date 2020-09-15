/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { RichTextEditorStyles } from "../rich-text-editor-styles.js";
/**
 * `rich-text-editor-selection`
 * `a button for rich text editor (custom buttons can extend this)`
 *
 * @element rich-text-editor-selection
 * @demo ./demo/selection.html
 */
class RichTextEditorSelection extends RichTextEditorStyles(LitElement) {
  /**
   * Store tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "rich-text-editor-selection";
  }

  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          background-color: var(--rich-text-editor-selection-bg);
          margin: 0;
          padding: 0;
          display: inline;
        }
        :host([hidden]) {
          display: none;
        }
        :host([collapsed]):after {
          content: '|';
          color: var(--rich-text-editor-selection-bg);
          background-color: transparent;
        }
      `
    ];
  }
  render() {
    return html`
      <slot></slot>
    `;
  }

  static get properties() {
    return {
      editor: {
        type: Object
      },
      collapsed: {
        type: Boolean,
        reflect: true,
        attribute: "collapsed"
      },
      hidden: {
        type: Boolean,
        reflect: true,
        attribute: "hidden"
      },
      observer: {
        type: Object
      },
      range: {
        type: Object
      },
      toolbar: {
        type: Object
      }
    };
  }
  constructor() {
    super();
    this.hidden = true;
    document.addEventListener("selectionchange", e => {
      if(this.editor) this.range = this.getRange();
      console.log("selectionchange",this.range,this.editor,this);
    });
    document.addEventListener("select-rich-text-editor-editor", e => {
      this._editorChange(e);
    });
    document.addEventListener("deselect-rich-text-editor-editor", e => {
      this._editorChange(e);
    });
    this.setAttribute("id", this._generateUUID());
  }
  updated(changedProperties) {
    super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "range") this._updateToolbar();
    });
  }

  /**
   * life cycle, element is disconnected
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("selectionchange", e => {
      this.range = this.getRange();
    });
    document.removeEventListener("select-rich-text-editor-editor", e => {
      this._editorChange(e);
    });
    document.removeEventListener("deselect-rich-text-editor-editor", e => {
      this._editorChange(e);
    });
  }

  /**
   * expands selection to a specific ancestor or wraps selection in a default tag
   * @param {string} selector ancestor selector to find
   * @param {string} wrapTag tagName to use if ancestor cannot be found
   * @returns {object} selected node
   */
  expandSelection(selector, range = this.range, wrapTag) {
    console.log('expandSelection',this.range);
    return (
      this.selectAncestor(selector, range) ||
      this.wrap(!!wrapTag ? document.createElement(wrapTag) : undefined)
    );
  }
  _getRoot(node){
    return !node ? document : node.parentNode ? this._getRoot(node.parentNode) : node;
  }

  get editorRoot(){
    return this._getRoot(this.editor);
  }

  /**
   * Normalizes selected range data.
   *
   * @returns {object} selected range
   */
  getRange() {
    let sel = !this.editorRoot || !this.editorRoot.getSelection 
      ? false : this.editorRoot.getSelection(), 
    range; 
    if (sel.getRangeAt && sel.rangeCount) {
      range = sel.getRangeAt(0);
    } else if (sel) {
      range = sel;
    } else { 
      range =  false;
    }
    console.log('getRange',this.editorRoot,range);
    return range;
  }

  /**
   * adds or removes hightlight
   * @param {object} contents contents to be highlighted
   * @returns {void}
   */
  addHighlight() {
    console.log('addHighlight',this.range);
    if (!this.hidden) return;
    this.hidden = !this.range || this.range.collapsed;
    if (!this.hidden) {
      this.range.surroundContents(this);
      this.normalize();
      this.innerHTML = this.innerHTML.trim();
      this.range.selectNodeContents(this);
      this.dispatchEvent(new CustomEvent("highlight", { detail: this }));
      this.hidden = false;
    }
    console.log('addHighlight 2',this.range);
  }

  /**
   * gets contents of selected range
   * @returns {object} range contents
   */
  getRangeContents() {
    return this.range ? this.range.cloneContents() : null;
  }

  /**
   * searches for a closest ancestor by tagname,
   * expands selection to matching ancestor,
   * and returns ancestor, or returns null if not found
   * @param {string} tag tag to expand selection to
   * @returns {object} selected node
   */
  getAncestor(selector, range = this.range) {
    let wrapper,
      tags = selector.toLowerCase().split(","),
      getMatchingTag = ancestor => {
        if (
          !!ancestor &&
          !!ancestor.tagName &&
          (!selector || tags.includes(ancestor.tagName.toLowerCase()))
        ) {
          return ancestor;
        } else if (
          !!ancestor &&
          !!ancestor.parentNode &&
          ancestor.parentNode.childNodes.length === 1
        ) {
          return getMatchingTag(ancestor.parentNode);
        } else {
          return undefined;
        }
      };
    //try to find an ancestor that matches tag
    if (range) {
      let ancestor = range.commonAncestorContainer;
      wrapper = getMatchingTag(ancestor);
    }
    return wrapper;
  }

  /**
   * searches for a closest ancestor by tagname,
   * expands selection to matching ancestor,
   * and returns ancestor, or returns null if not found
   * @param {string} tag tag to expand selection to
   * @returns {object} selected node
   */
  selectAncestor(selector, range = this.range) {
    console.log('selectAncestor',this.range);
    let wrapper = this.getAncestor(selector, range);
    if (wrapper) range.selectNode(wrapper);
    console.log('selectAncestor 2',this.range);
    return wrapper;
  }

  /**
   * sets selection range to specified node
   * @param {object} node node to select
   * @returns {void}
   */
  selectNode(node = null) {
    console.log('selectNode',this.range);
    if (node) {
      if (!this.range) {
        let sel = window.getSelection();
        this.range = document.createRange();
        sel.removeAllRanges();
        sel.addRange(this.range);
      }
      this.range.selectNode(node);
    }
    console.log('selectNode 2',this.range);
    return this.range;
  }
  /**
   * sets selection range to specified node's contents
   * @param {object} node node to select
   * @returns {void}
   */
  selectNodeContents(node = null) {
    console.log('selectNodeContents',this.range);
    if (node) {
      if (!this.range) {
        let sel = window.getSelection();
        this.range = document.createRange();
        sel.removeAllRanges();
        sel.addRange(this.range);
        console.log(sel,this.range);
      }
      this.range.selectNodeContents(node);
    }
    console.log('selectNodeContents 2',this.range);
  }
  /**
   * selects a range
   *
   * @param {object} range
   * @memberof RichTextEditorSelection
   */
  selectRange(range) {
    console.log('selectRange',this.range);
    if (range) {
      let sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
    console.log('selectRange 2',this.range);
  }

  /**
   * collapses range
   *
   * @memberof RichTextEditorSelection
   */
  deselectRange() {
    let sel = this.getRange();
    if (!sel.isCollapsed) sel.collapse();
  }

  /**
   * removes highlight from range
   *
   * @memberof RichTextEditorSelection
   */
  removeHighlight() {
    console.log('removeHighlight',this.range);
    if (this.hidden) return;
    this.normalize();
    let children = this.childNodes;
    if (children.length > 0) {
      children.forEach((child, i) => {
        this.parentNode.insertBefore(child, this);
        if (i === 0) this.range.setStart(child, 0);
        this.range.setEnd(child, 0);
      });
    } else if (this.previousSibling) {
      this.range.selectNode(this.previousSibling);
      this.range.collapse();
    } else if (this.nextSibling) {
      this.range.selectNode(this.nextSibling);
      this.range.collapse(true);
    } else if (this.parentNode) {
      this.range.selectNode(this.c);
      this.range.collapse(true);
    }
    this.hidden = true;
    console.log('removeHighlight 2',this.range);
  }

  /**
   * gets range contents in specified wrapper
   * @param {object} wrapper a node to wrap range contents in
   * @returns {object} range which oncludes wrapper and wrapped contents
   */
  wrap(wrapper) {
    console.log('wrap',this.range);
    wrapper = wrapper || document.createElement("span");
    this.range.surroundContents(wrapper);
    console.log('wrap 2',this.range);
    return wrapper;
  }

  /**
   * Updates selected range based on toolbar and editor
   * @param {event} e editor change event
   * @param {deselect} if editor is being deselected
   * @returns {void}
   */
  _editorChange(e, deselect = false) {
    console.log('_editorChange',this.range);
    let root = this,
      editorChange = root.editor !== e.detail.editor,
      toolbarChange = root.toolbar !== e.detail.toolbar;
    if (deselect || editorChange || toolbarChange) {
      console.log('_editorChange 2',deselect,editorChange,toolbarChange);
      let sel = window.getSelection();
      sel.removeAllRanges();
      root.editor = e.detail.editor;
      root.toolbar = e.detail.toolbar;
      if (root.observer) root.observer.disconnect();
      if (!deselect && e.detail.editor) {
        root.observer = new MutationObserver(evt => {
          console.log('MutationObserver',evt,root.getRange());
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
    console.log('_editorChange 2',this.range);
  }

  /**
   * Generate a UUID
   * @returns {string} unique id
   */
  _generateUUID() {
    let hex = Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
    return "rte-" + "ss-s-s-s-sss".replace(/s/g, hex);
  }

  /**
   * Updates toolbar
   */
  _updateToolbar() {
    console.log('_updateToolbar',this.toolbar.range,this.range);
    if (this.toolbar) this.toolbar.range = this.range;
    console.log('_updateToolbar 2',this.toolbar.range,this.range);
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
    window.RichTextEditorSelection.instance = new RichTextEditorSelection();
    document.body.appendChild(window.RichTextEditorSelection.instance);
  }
  return window.RichTextEditorSelection.instance;
};
