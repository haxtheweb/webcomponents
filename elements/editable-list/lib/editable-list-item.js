/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@polymer/paper-input/paper-input.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";

/**
 * `editable-list-item`
 * `an individual list item`
 *
 * @microcopy - language worth noting:
 *  - an item is a thing in a list of many which can be modified
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class EditableListItem extends PolymerElement {
  // render function
  static get template() {
    return html`
      <style include="simple-colors-shared-styles">
        :host {
          display: block;
        }

        :host([hidden]) {
          display: none;
        }
        :host([can-edit]) #edit {
          visibility: visible;
          opacity: 1;
        }
        :host([can-delete]) #delete {
          visibility: visible;
          opacity: 1;
        }
        :host #add,
        #duplicate {
          visibility: visible;
          opacity: 1;
        }
        paper-icon-button {
          visibility: hidden;
          opacity: 0;
          transition: 0.3s all linear;
        }
        paper-input {
          --paper-input-container-shared-input-style: {
            height: 40px;
            padding: 0;
            margin: 0;
          }
        }
        .input {
          display: block;
          height: 40px;
          padding: 0;
          margin: 0;
          line-height: 40px;
        }
        .input[hidden] {
          display: none;
        }
        div.input {
          z-index: 1;
        }
        .ops {
          position: absolute;
          display: block;
          right: 0;
          top: 0;
          z-index: 2;
          background-color: white;
        }
        .ops paper-icon-button {
          border-radius: 50%;
          height: 32px;
          width: 32px;
          padding: 4px;
          margin: 0px;
        }
        .ops[hidden] {
          display: none;
        }
        #edit {
          color: white;
          background-color: var(--simple-colors-default-theme-green-8, #ddffdd);
        }
        #delete {
          color: white;
          background-color: var(--simple-colors-default-theme-red-6, #ff5555);
        }
      </style>
      <paper-input
        id="input"
        class="input"
        value="{{value}}"
        hidden$="[[!editing]]"
      ></paper-input>
      <div class="input" hidden$="[[editing]]">[[value]]</div>
      <div class="ops" hidden$="[[!editMode]]">
        <paper-icon-button
          on-click="_editToggle"
          id="edit"
          icon="icons:create"
        ></paper-icon-button>
        <paper-icon-button
          on-click="_editToggle"
          id="add"
          icon="icons:add"
        ></paper-icon-button>
        <paper-icon-button
          on-click="_editToggle"
          id="duplicate"
          icon="icons:content-copy"
        ></paper-icon-button>
        <paper-icon-button
          on-click="_deleteModal"
          id="delete"
          icon="icons:delete"
        ></paper-icon-button>
      </div>
    `;
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * The value that gets bound into the text field
       */
      value: {
        name: "value",
        type: String
      },
      /**
       * ability to edit the items in the list
       */
      editMode: {
        name: "editMode",
        type: Boolean,
        value: false,
        notify: true,
        reflectToAttribute: true
      },
      /**
       * Editing state of the item
       */
      editing: {
        name: "editing",
        type: Boolean,
        value: false,
        observer: "_editModeChanged"
      },
      /**
       * Permission to edit this
       */
      canEdit: {
        name: "canEdit",
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      /**
       * Permission to delete this
       */
      canDelete: {
        name: "canDelete",
        type: Boolean,
        value: false,
        reflectToAttribute: true
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "editable-list-item";
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
  }
  /**
   * life cycle, element is removed from the DOM
   */
  //disconnectedCallback() {}
  _editToggle(e) {
    this.editing = !this.editing;
    if (this.editing) {
      this.$.input.focus();
    }
  }
  /**
   * Generate a modal to delete this item, parent has to handle that though
   */
  _deleteModal(e) {
    const evt = new CustomEvent("editable-list-item-delete", {
      bubbles: true,
      cancelable: true,
      detail: {
        element: this
      }
    });
    this.dispatchEvent(evt);
  }
  // Observer editMode for changes
  _editModeChanged(newValue, oldValue) {
    if (typeof newValue !== typeof undefined) {
      if (newValue) {
        this.$.edit.icon = "icons:save";
      } else {
        this.$.edit.icon = "icons:create";
      }
    }
  }
}
window.customElements.define(EditableListItem.tag, EditableListItem);
export { EditableListItem };
