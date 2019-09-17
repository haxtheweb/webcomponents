/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import "@polymer/paper-menu-button/paper-menu-button.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/paper-listbox/paper-listbox.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "./editable-table-editor-insdel.js";
import { cellBehaviors } from "./editable-table-behaviors.js";

/**
 * `editable-table-editor-rowcol`
 * `A header label and menu for inserting and deleting a row or a column of the editable-table interface (editable-table.html).`
 *
 * @microcopy - language worth noting:
 * ```
 <editable-table-editor-rowcol 
  condensed                       //Decrease the padding to match the rest of the table cells when table is condensed? Default is false.         
  index="1"                       //The index of the row or column
  type="Column">                  //The type of menu, as in "Row" or "Column"
</editable-table-editor-rowcol>```
 *  
 * @demo demo/editor.html
 * 
 * @polymer
 * @customElement
 * @appliesMixin cellBehaviors
 */
class EditableTableEditorRowcol extends cellBehaviors(PolymerElement) {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
        :host #label {
          margin: 0;
          padding: 0;
        }
        :host paper-menu-button {
          margin: 0;
          padding: 0;
          width: 100%;
        }
        :host paper-button {
          margin: 0;
          display: block;
          background-color: transparent;
          padding-top: var(--editable-table-row-vertical-padding);
          padding-bottom: var(--editable-table-row-vertical-padding);
          font-family: var(--editable-table-secondary-font-family);
        }
        :host([condensed]) paper-button {
          padding-top: var(--editable-table-row-vertical-padding-condensed);
          padding-bottom: var(--editable-table-row-vertical-padding-condensed);
        }
      </style>
      <paper-menu-button id="menu">
        <paper-button slot="dropdown-trigger">
          <span id="label">[[label]]</span>
          <iron-icon icon="arrow-drop-down"></iron-icon>
        </paper-button>
        <paper-listbox slot="dropdown-content" label\$="[[label]]">
          <editable-table-editor-insdel
            action="insert"
            index\$="[[index]]"
            type\$="[[type]]"
            before="true"
            >Insert [[type]] Before</editable-table-editor-insdel
          >
          <editable-table-editor-insdel
            action="insert"
            index\$="[[index]]"
            type\$="[[type]]"
            >Insert [[type]] After</editable-table-editor-insdel
          >
          <editable-table-editor-insdel
            action="delete"
            index\$="[[index]]"
            type\$="[[type]]"
            >Delete [[type]]</editable-table-editor-insdel
          >
        </paper-listbox>
      </paper-menu-button>
    `;
  }
  static get tag() {
    return "editable-table-editor-rowcol";
  }
  static get properties() {
    return {
      /**
       * The index of the row or column
       */
      index: {
        type: Number,
        value: null
      },
      /**
       * The index of the row or column
       */
      label: {
        type: String,
        computed: "_getLabel(index,type)"
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
  connectedCallback() {
    super.connectedCallback();
    afterNextRender(this, function() {
      this.addEventListener("insdel-tapped", this._onTap.bind(this));
    });
  }
  disconnectedCallback() {
    this.removeEventListener("insdel-tapped", this._onTap.bind(this));
    super.disconnectedCallback();
  }
  _onTap(e) {}
}
window.customElements.define(
  EditableTableEditorRowcol.tag,
  EditableTableEditorRowcol
);
export { EditableTableEditorRowcol };
