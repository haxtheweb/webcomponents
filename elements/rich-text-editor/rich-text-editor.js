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
  
  //styles function
  static get styles() {
    return  [
      ...super.styles,
      css`
:host([hidden]) {
  display: none;
}

:host {
  display: block;
  cursor: pointer;
  min-height: 40px;
}

:host([contenteditable="true"]) {
  border: var(--rich-text-editor-border);
  overflow: auto;
}

:host([contenteditable="true"]):focus-within,
:host([contenteditable="true"]):focus {
  padding: 2px;
  margin-bottom: 2px;
}

:host(.heightmax[contenteditable="true"]) {
  max-height: calc(100vh - 200px);
  overflow-y: scroll;
}

:host(:empty) {
  border: 1px dashed var(--rich-text-editor-border-color);
  outline: 1px dashed var(--rich-text-editor-border-color);
}

:host(:empty):before {
  content: attr(placeholder);
  padding: 0 5px;
  display: block;
  z-index: -1;
  color: var(--rich-text-editor-button-disabled-color);
}
      `
    ];
  }

// render function
  render() {
    return html`

<slot></slot>`;
  }

  // haxProperty definition
  static get haxProperties() {
    return {
  "canScale": true,
  "canPosition": true,
  "canEditSource": false,
  "gizmo": {
    "title": "Rich text-editor",
    "description": "a standalone rich text editor",
    "icon": "icons:android",
    "color": "green",
    "groups": ["Text"],
    "handles": [
      {
        "type": "todo:read-the-docs-for-usage"
      }
    ],
    "meta": {
      "author": "nikkimk",
      "owner": "Penn State University"
    }
  },
  "settings": {
    "quick": [],
    "configure": [
      {
        "property": "title",
        "description": "",
        "inputMethod": "textfield",
        "required": false,
        "icon": "icons:android"
      }
    ],
    "advanced": []
  }
}
;
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
  
  ...super.properties,
  
  /**
   * editor's unique id
   */
  "id": {
    "name": "id",
    "type": String,
    "reflect": true,
    "attribute": "id"
  },
  /**
   * Maps to contenteditable attribute
   */
  "contenteditable": {
    "name": "contenteditable",
    "type": Boolean,
    "reflect": true,
    "attribute": "contenteditable"
  },
  /**
   * Placeholder text for empty editable regions
   */
  "placeholder": {
    "name": "placeholder",
    "type": String,
    "reflect": true,
    "attribute": "placeholder"
  },

  /**
   * id for toolbar
   */
  "toolbar": {
    "name": "toolbar",
    "type": String,
    "reflect": true,
    "attribute": "toolbar"
  },

  /**
   * type of editor toolbar, i.e.
   * full - full for full toolbar with breadcrumb,
   * mini - mini for mini floating toolbar, or
   * default toolbar if neither.
   */
  "type": {
    "name": "type",
    "type": String,
    "reflect": true,
    "attribute": "type"
  },

  /**
   * connected toolbar
   */
  "__connectedToolbar": {
    "type": Object
  }//,
  /**
   * highlight surrounding selected range
   * /
  "__selection": {
    "type": Object
  }*/
}
;
  }

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
