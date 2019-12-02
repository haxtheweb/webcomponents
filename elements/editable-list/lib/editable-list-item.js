/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit-element/lit-element.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@polymer/paper-input/paper-input.js";
/**
 * @deprecatedApply - required for @apply / invoking @apply css var convention
 */
import "@polymer/polymer/lib/elements/custom-style.js";
/**
 * `editable-list-item`
 * `an individual list item`
 *
 * @microcopy - language worth noting:
 *  - an item is a thing in a list of many which can be modified
 *
 * @demo demo/index.html
 * @customElement editable-list-item
 */
class EditableListItem extends SimpleColors {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      ...super.styles,
      css`
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
      `
    ];
  }
  // render function
  render() {
    return html`
      <custom-style>
        <style>
          paper-input {
            --paper-input-container-shared-input-style: {
              height: 40px;
              padding: 0;
              margin: 0;
            }
          }
        </style>
      </custom-style>
      <paper-input
        id="input"
        class="input"
        value="${this.value}"
        @value-changed="${this.valueChanged}"
        ?hidden="${!this.editing}"
      ></paper-input>
      <div class="input" ?hidden="${!this.editing}">${this.value}</div>
      <div class="ops" ?hidden="${!this.editMode}">
        <paper-icon-button
          @click="${this._editToggle}"
          id="edit"
          icon="icons:create"
        ></paper-icon-button>
        <paper-icon-button
          @click="${this._editToggle}"
          id="add"
          icon="icons:add"
        ></paper-icon-button>
        <paper-icon-button
          @click="${this._editToggle}"
          id="duplicate"
          icon="icons:content-copy"
        ></paper-icon-button>
        <paper-icon-button
          @click="${this._deleteModal}"
          id="delete"
          icon="icons:delete"
        ></paper-icon-button>
      </div>
    `;
  }
  valueChanged(e) {
    this.value = e.detail.value;
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "editMode") {
        // notify
        this.dispatchEvent(
          new CustomEvent("edit-mode-changed", {
            detail: {
              value: this[propName]
            }
          })
        );
      }
      if (propName == "editing") {
        this._editModeChanged(this[propName]);
      }
    });
  }
  constructor() {
    super();
    this.editMode = false;
    this.editing = false;
    this.canEdit = false;
    this.canDelete = false;
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * The value that gets bound into the text field
       */
      value: {
        type: String
      },
      /**
       * ability to edit the items in the list
       */
      editMode: {
        type: Boolean,
        reflect: true,
        attribute: "edit-mode"
      },
      /**
       * Editing state of the item
       */
      editing: {
        type: Boolean
      },
      /**
       * Permission to edit this
       */
      canEdit: {
        type: Boolean,
        reflect: true,
        attribute: "can-edit"
      },
      /**
       * Permission to delete this
       */
      canDelete: {
        type: Boolean,
        reflect: true,
        attribute: "can-delete"
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
   * life cycle, element is removed from the DOM
   */
  //disconnectedCallback() {}
  _editToggle(e) {
    this.editing = !this.editing;
    if (this.editing) {
      this.shadowRoot.querySelector("#input").focus();
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
        this.shadowRoot.querySelector("#edit").icon = "icons:save";
      } else {
        this.shadowRoot.querySelector("#edit").icon = "icons:create";
      }
    }
  }
}
window.customElements.define(EditableListItem.tag, EditableListItem);
export { EditableListItem };
