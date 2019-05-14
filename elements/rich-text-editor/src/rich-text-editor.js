/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { HAXWiring } from "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "@polymer/iron-a11y-keys/iron-a11y-keys.js";
import "./lib/rich-text-editor-styles.js";
import "./lib/rich-text-editor-toolbar.js";
/**
 * `rich-text-editor`
 * `a standalone rich text editor`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html demo
 * @demo demo/config.html custom configuration
 */
class RichTextEditor extends PolymerElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "rich-text-editor";
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    let style = document.createElement("style");
    style.setAttribute("is", "custom-style");
    style.setAttribute("include", "rich-text-editor-styles");
    document.head.append(style);
  }
  /**
   * ready
   */
  ready() {
    super.ready();
    let root = this;
    console.log("ready");
    //find an editor by id
    let id = document.querySelector(
        "rich-text-editor-toolbar#" + this.editorId
      ),
      editor =
        id !== null ? id : document.querySelector("rich-text-editor-toolbar");
    if (editor === null) {
      editor = document.createElement("rich-text-editor-toolbar");
      root.parentNode.appendChild(editor);
    }
    editor.addEditableRegion(root);

    window.addEventListener("paste", root._systemPasteListener);

    root.addEventListener("keydown", root._handleKeyboard);
    root.addEventListener("keydown", root._handleKeyboard);
  }

  paste() {
    let root = this;
    console.log("paste", root.__pasteTarget);

    if (window.clipboardData) {
      root.__pasteTarget.innerText = window.clipboardData.getData("Text");
      console.log(
        "window.clipboardData",
        window.clipboardData,
        root.__pasteTarget.innerText
      );
      return;
    }
    // FireFox requires at least one editable
    // element on the screen for the paste event to fire
    this.__textarea = document.createElement("textarea");
    this.__textarea.setAttribute("style", "width:1px;border:0;opacity:0;");
    document.body.appendChild(this.__textarea);
    this.__textarea.select();
    document.execCommand("paste");
    console.log("this.__textarea", root.__pasteTarget, this.__textarea);

    //this.__waitForPaste();
  }
  _handlePaste(content) {
    console.log("waitForPaste", content);
    /*if (!root.__pasteContentReady) {
      setTimeout(waitForPaste, 250);
      return;
    }*/
    if (content) {
      this.__pasteTarget.innerHTML = content;
      console.log(
        "waitForPaste 2",
        this.__textarea,
        this.__pasteTarget.innerHTML
      );
      //root.__pasteContentReady = false;
      document.body.removeChild(this.__textarea);
      this.__textarea = null;
      console.log(
        "waitForPaste 3",
        this.__textarea,
        this.__pasteTarget.innerHTML
      );
    }
  }

  copy() {
    let root = this;
    console.log("copy", this.__copyTarget);
    // standard way of copying
    this.__textarea = document.createElement("textarea");
    this.__textarea.setAttribute("style", "width:1px;border:0;opacity:0;");
    document.body.appendChild(this.__textarea);
    this.__textarea.value = this.__copyTarget.innerHTML;
    console.log(
      "copy",
      this.__textarea,
      this.__textarea.value,
      this.__copyTarget.innerHTML
    );
    //textArea.innerHTML = target.innerHTML;
    this.__textarea.select();
    document.execCommand("copy");
    document.body.removeChild(this.__textarea);
  }
  _systemPasteListener(evt) {
    console.log("_systemPasteListener", this._handlePaste);
    this._handlePaste(evt.clipboardData.getData("text/plain"));
    evt.preventDefault();
  }
  _handleKeyboard(evt) {
    console.log("keyBoardListener", evt, evt.keyCode);
    if (evt.ctrlKey || evt.metaKey) {
      switch (evt.keyCode) {
        case 67: // c
          this._getCopyTarget();
          this.copy();
          break;
        case 86: // v
          this._getPasteTarget();
          this.paste();
          break;
      }
    }
  }
  _getPasteTarget() {
    let range = this._getRange(),
      div = document.createElement("div");
    div.appendChild(range.extractContents());
    console.log("_getPasteTarget", range, div);
    this.__pasteTarget = div;
  }
  _getCopyTarget() {
    let range = this._getRange(),
      div = document.createElement("div");
    if (range && range.cloneContents) div.appendChild(range.cloneContents());
    console.log("_getCopyTarget", range, div);
    this.__copyTarget = div;
  }

  /**
   * Normalizes selection data.
   *
   * @returns {object} the selection
   */
  _getRange() {
    let sel = window.getSelection();
    if (sel.getRangeAt && sel.rangeCount) {
      return sel.getRangeAt(0);
    } else if (sel) {
      return sel;
    } else false;
  }

  /**
   * life cycle, element is removed from the DOM
   */
  //disconnectedCallback() {}
}

export { RichTextEditor };

window.customElements.define(RichTextEditor.tag, RichTextEditor);
