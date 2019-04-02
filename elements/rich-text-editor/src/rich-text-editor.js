/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { HAXWiring } from "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import { ResponsiveUtility } from "@lrnwebcomponents/responsive-utility/responsive-utility.js";
import "./lib/rich-text-editor-button.js";
import "./lib/rich-text-editor-more-button.js";
import "./lib/rich-text-editor-heading-picker.js";
import "./lib/rich-text-editor-symbol-picker.js";
import "./lib/rich-text-editor-link.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-icons/editor-icons.js";
import "@polymer/iron-icons/image-icons.js";
import "@lrnwebcomponents/md-extra-icons/md-extra-icons.js";
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
 * @demo demo/content.html easy implementation
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
    let root = this;
    window.ResponsiveUtility.requestAvailability();
    window.dispatchEvent(
      new CustomEvent("responsive-element", {
        detail: {
          element: root,
          attribute: "responsive-size",
          relativeToParent: true
        }
      })
    );
    document.designMode = "on";
    document.addEventListener("selectionchange", e => {
      root.getUpdatedSelection();
    });
  }

  /**
   * life cycle, element is disconnected
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    let root = this;
    document.removeEventListener("selectionchange", e => {
      root.getUpdatedSelection();
    });
  }

  /**
   * cancels edits to the active editableElement
   */
  cancel() {
    this.editableElement.innerHTML = this.canceled;
    this.editTarget(null);
  }
  /**
   * makes a editableElement editable
   *
   * @param {object} an HTML object that can be edited
   */
  editTarget(editableElement) {
    let root = this;
    if (
      editableElement.getAttribute("id") === undefined ||
      editableElement.getAttribute("id") === null
    )
      editableElement.setAttribute("id", root._generateUUID());

    if (root.editableElement !== editableElement) {
      //save changes to previous editableElement
      if (root.editableElement !== null) {
        root.editableElement.contentEditable = false;
        root.editableElement = null;
      }
      //activate the editableElement
      editableElement.parentNode.insertBefore(root, editableElement);
      root.editableElement = editableElement;
      root.canceled = editableElement.innerHTML;
      root.editableElement.contentEditable = true;
      root.controls = editableElement.getAttribute("id");
    }
  }

  /**
   * Gets the updated selection.
   */
  getUpdatedSelection() {
    let root = this;
    root.selection =
      root.editableElement === undefined || root.editableElement === null
        ? null
        : root.editableElement.getSelection
        ? root.editableElement.getSelection()
        : root._getRange();
    this.buttons.forEach(button => {
      button.selection = null;
      button.selection = root.selection;
    });
  }

  /**
   * removes an editable region to the list of editableElements
   *
   * @param {object} an HTML object that can be edited
   */
  removeEditableRegion(editableElement) {
    let root = this;
    for (let i = 0; i < this.editableElements.length; i++) {
      let item = this.editableElements[i];
      if (item[0] === editableElement) {
        item[0].removeEventListener("click", e => {
          root.editTarget(editableElement);
        });
        editableElement.removeEventListener("blur", e => {
          root.getUpdatedSelection();
        });
        editableElement.removeEventListener("mouseout", e => {
          root.getUpdatedSelection();
        });
        item[1].disconnect();
        this.set("editableElements", this.editableElements.splice(i, 1));
      }
    }
  }

  /**
   * adds an editable region to the list of editableElements
   *
   * @param {object} an HTML object that can be edited
   */
  addEditableRegion(editableElement) {
    let root = this,
      observer = new MutationObserver(e => {
        root.getUpdatedSelection();
      });
    editableElement.addEventListener("click", e => {
      root.editTarget(editableElement);
    });
    editableElement.addEventListener("blur", e => {
      root.getUpdatedSelection();
    });
    editableElement.addEventListener("mouseout", e => {
      root.getUpdatedSelection();
    });
    observer.observe(editableElement, {
      attributes: false,
      childList: true,
      subtree: true,
      characterData: false
    });
    root.push("editableElements", [editableElement, observer]);
  }

  /**
   * Adds a button to the toolbar
   *
   * @param {object} the child object in the config object
   * @param {object} the parent object in the config object
   */
  _addButton(child, parent) {
    let root = this,
      button = document.createElement(child.type);
    for (var key in child) {
      button[key] = child[key];
    }
    button.setAttribute("class", "button");
    /*button.addEventListener("mousedown", (e) => {
      e.preventDefault();
      root._preserveSelection(button);
    });
    button.addEventListener("keydown", (e) => {
      e.preventDefault();
      root._preserveSelection(button);
    });*/
    button.addEventListener("deselect", e => {
      console.log("deselect");
      root._getRange().collapse(false);
    });
    parent.appendChild(button);
    return button;
  }

  /**
   * Generate a UUID
   */
  _generateUUID() {
    return "ss-s-s-s-sss".replace(/s/g, this._uuidPart);
  }
  /**
   * Gets the groups array for the dom-repeat.
   *
   * @param {object} the toolbar buttons config object
   * @param {array} an array the buttons grouped by size
   */
  _getButtons(config) {
    let root = this,
      toolbar = root.$.toolbar,
      more = this.$.morebutton,
      max = 0,
      sizes = ["xs", "sm", "md", "lg", "xl"],
      temp = [];
    toolbar.innerHTML = "";
    config.forEach(item => {
      if (item.type === "button-group") {
        let group = document.createElement("div");
        group.setAttribute("class", "group");
        if (item.collapsedUntil !== undefined && item.collapsedUntil !== null)
          group.setAttribute("collapsed-until", item.collapsedUntil);
        max = Math.max(max, sizes.indexOf(item.collapsedUntil));
        item.buttons.forEach(button => {
          max = Math.max(max, sizes.indexOf(button.collapsedUntil));
          temp.push(root._addButton(button, group));
        });
        toolbar.appendChild(group);
      } else {
        max = Math.max(max, sizes.indexOf(item.collapsedUntil));
        temp.push(root._addButton(item, toolbar));
      }
      toolbar.appendChild(more);
      more.collapseMax = sizes[max];
    });
    return temp;
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
   * Preserves the selection when a button is pressed
   *
   * @param {object} the button
   */
  _preserveSelection() {
    let sel = window.getSelection(),
      temp = this.selection;
    this.buttons.forEach(button => {
      button.selection = temp;
    });
    sel.removeAllRanges();
    sel.addRange(temp);
  }

  /**
   * Toggles collapsed mode
   */
  _toggleMore(e) {
    this.collapsed = !this.collapsed;
  }

  /**
   * Generate UUID
   */
  _uuidPart() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
}

export { RichTextEditor };

window.customElements.define(RichTextEditor.tag, RichTextEditor);
