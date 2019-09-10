/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import "@polymer/paper-button/paper-button.js";

/**
 * `editable-table-editor-insdel`
 * `A button in the editable-table-editor-rowcol menu (editable-table-editor-rowcol.html) that inserts or deletes a row or column.`
 *
 * @microcopy - language worth noting:
 * ```
 <editable-table-editor-insdel 
  action="insert"               //The action this button performs, as in "insert" or "delete"  
  before                        //If the action is insert, should row or column be inserted before the index? Default is false (after).
  index="1"                     //The index of the row or column where this button is located
  type="Row">                   //The type of menu, as in "Row" or "Column"
  Insert Row Before             //The text of the button
</editable-table-editor-insdel>```
 *  
 * @demo demo/editor.html
 * 
 * @polymer
 * @customElement
 */
class EditableTableEditorInsdel extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
        :host paper-button {
          display: block;
          text-transform: none;
          text-align: left;
        }
      </style>
      <paper-button><slot></slot></paper-button>
    `;
  }

  static get tag() {
    return "editable-table-editor-insdel";
  }

  connectedCallback() {
    super.connectedCallback();
    afterNextRender(this, function() {
      this.addEventListener("click", this._onTap.bind(this));
    });
  }
  disconnectedCallback() {
    this.removeEventListener("click", this._onTap.bind(this));
    super.disconnectedCallback();
  }

  static get properties() {
    return {
      /**
       * The action of the menu item
       */
      action: {
        type: String,
        value: null
      },
      /**
       * The index of the row or column
       */
      index: {
        type: Number,
        value: null,
        reflectToAttribute: true
      },
      /**
       * If insert, does it insert before? Default is insert after.
       */
      before: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      /**
       * Is it row or column?
       */
      type: {
        type: String,
        value: null
      }
    };
  }

  /**
   * Handle item tap
   */
  _onTap(e) {
    let action = this.action,
      type = this.type,
      before = this.before,
      index = this.index,
      event = action + "-" + type.toLowerCase();
    if (action === "insert" && before && type === "Row") {
      index--;
    } else if (action === "insert" && !before && type !== "Row") {
      index++;
    }
    this.dispatchEvent(
      new CustomEvent(event, {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: index
      })
    );
  }
}
window.customElements.define(
  EditableTableEditorInsdel.tag,
  EditableTableEditorInsdel
);
export { EditableTableEditorInsdel };
