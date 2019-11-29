/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@lrnwebcomponents/simple-modal/simple-modal.js";
import "@polymer/iron-list/iron-list.js";
import "./lib/editable-list-item.js";
/**
 * `editable-list`
 * @customElement editable-list
 * `a listing of items that can be edited in place with operations`
 *
 * @microcopy - language worth noting:
 *  -
 *

 * @polymer
 * @demo demo/index.html
 */
class EditableList extends PolymerElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "editable-list";
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    const modal = window.SimpleModal.requestAvailability();
    this.shadowRoot
      .querySelector("#list")
      .addEventListener(
        "editable-list-item-delete",
        this.triggerDeleteModal.bind(this)
      );
  }
  /**
   * life cycle, element is removed from the DOM
   */
  disconnectedCallback() {
    this.shadowRoot
      .querySelector("#list")
      .removeEventListener(
        "editable-list-item-delete",
        this.triggerDeleteModal.bind(this)
      );
  }

  triggerDeleteModal(e) {
    this.activeElement = e.detail.element;
    let c = document.createElement("div");
    c.innerHTML = `<div>Are you sure you want to delete <strong>${
      e.detail.element.value
    }</strong>?</div>`;
    let button1 = document.createElement("paper-button");
    button1.raised = true;
    button1.addEventListener("click", this._deleteItemConfirm.bind(this));
    button1.appendChild(document.createTextNode("Delete"));
    let button2 = document.createElement("paper-button");
    button2.raised = true;
    button2.setAttribute("dialog-dismiss", "dialog-dismiss");
    button2.appendChild(document.createTextNode("cancel"));
    let b = document.createElement("div");
    b.appendChild(button1);
    b.appendChild(button2);
    const evt = new CustomEvent("simple-modal-show", {
      bubbles: true,
      cancelable: true,
      detail: {
        title: `Delete ${e.detail.element.value}`,
        elements: {
          content: c,
          buttons: b
        },
        invokedBy: e.detail.element.shadowRoot.querySelector("#delete"),
        clone: false
      }
    });
    this.dispatchEvent(evt);
  }
  /**
   * Confirm deleting the active item
   */
  _deleteItemConfirm(e) {
    // @todo delete the thing
    const evt = new CustomEvent("simple-modal-hide", {
      bubbles: true,
      cancelable: true,
      detail: {}
    });
    this.dispatchEvent(evt);
  }
  // Observer editMode for changes
  _editModeChanged(newValue, oldValue) {
    if (typeof newValue !== typeof undefined) {
      this._itemsChanged(this.items);
      for (var i in this.items) {
        if (this.items[i].metadata) {
          this.items[i].metadata.canEdit = newValue;
          this.notifyPath(`items.${i}.metadata.canEdit`);
        }
      }
    }
  }
  // Observer items for changes
  _itemsChanged(newValue, oldValue) {
    if (typeof newValue !== typeof undefined && typeof newValue === "string") {
      this.set("items", JSON.parse(newValue));
    }
  }
}
window.customElements.define(EditableList.tag, EditableList);
export { EditableList };
