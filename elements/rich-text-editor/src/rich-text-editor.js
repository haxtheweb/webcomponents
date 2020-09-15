/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { RichTextEditorStyles } from "./lib/rich-text-editor-styles.js";
import "./lib/toolbars/rich-text-editor-toolbar.js";
import "./lib/toolbars/rich-text-editor-toolbar-mini.js";
import "./lib/toolbars/rich-text-editor-toolbar-full.js";
/**
 * `rich-text-editor`
 * @element rich-text-editor
 * `a standalone rich text editor`
 *
 * @microcopy - language worth noting:
 *  -
 *

 * @polymer
 * @demo ./demo/index.html demo
 * @demo ./demo/mini.html mini floating toolbar
 * @demo ./demo/full.html toolbar with breadcrumb
 * @demo ./demo/config.html custom configuration
 */
class RichTextEditor extends RichTextEditorStyles(LitElement) {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "rich-text-editor";
  }
  constructor() {
    super();
    this.placeholder = "Click to edit";
    this.toolbar = "";
    this.type = "rich-text-editor-toolbar";
    this.id = "";
    this.__connectedToolbar = undefined;
    window.RichTextEditorStyleManager.requestAvailability();
  }
  firstUpdated() {
    if(super.firstUpdated) super.firstUpdated();
    if (!this.id) this.id = this._generateUUID();
    if(this.isEmpty()) this.innerHTML = "";
    this.getToolbar();
  }
  
  isEmpty(){
    return !this.innerHTML || this.innerHTML.replace(/[\s\t\r\n]/gim,'') == "";
  }
  /**
   * connects the mini-toolbar to a mini editor
   * @returns {void}
   */
  getToolbar() {
    if(!this.__connectedToolbar){
      //get toolbar by id
      let toolbar, filter = !this.toolbar ? [] : (window.RichTextEditorToolbars || []).filter(toolbar=>toolbar.id === this.toolbar);
      //get toolbar by type
      if(filter.length === 0){
        filter = !this.type ? [] : (window.RichTextEditorToolbars || []).filter(toolbar=>toolbar.type === this.type);
      }
      if(filter[0]){
        toolbar = filter[0];
      } else if(filter.length === 0){
        //make toolbar
        toolbar = document.createElement(this.type || 'rich-text-editor-toolbar');
        this.parentNode.insertBefore(toolbar,this);
      } 
      toolbar.id = this.toolbar || this._generateUUID();
      this.toolbar = toolbar.id;
      this.__connectedToolbar = toolbar;
    }
    this.__connectedToolbar.addEditableRegion(this);
    return this.__connectedToolbar;
  }

  /**
   * Generate a UUID
   * @returns {string} a unique id
   */
  _generateUUID() {
    let hex = Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
    return "rte-" + "ss-s-s-s-sss".replace(/s/g, hex);
  }
}

window.customElements.define(RichTextEditor.tag, RichTextEditor);
export { RichTextEditor };
