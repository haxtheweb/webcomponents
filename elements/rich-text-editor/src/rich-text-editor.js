/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { HAXWiring } from "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import { ResponsiveUtility } from "@lrnwebcomponents/responsive-utility/responsive-utility.js";
import "./lib/rich-text-editor-button.js";
import "./lib/rich-text-editor-more-button.js";
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
    document.addEventListener("selectionchange", function(e) {
      root.getUpdatedSelection();
    });
  }

  /**
   * life cycle, element is disconnected
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    let root = this;
    document.removeEventListener("selectionchange", function() {
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

      console.log(editableElement);
    }
  }

  /**
   * Gets the updated selection.
   */
  getUpdatedSelection(updatedSaved) {
    let root = this;
    root.selection =
      root.editableElement === undefined || root.editableElement === null
        ? null
        : root.editableElement.getSelection
        ? root.editableElement.getSelection()
        : root._getRange();
    this.buttons.forEach(function(button) {
      button.selection = root.selection;
      if(updatedSaved) button.savedSelection = root.selection;
    });
    return root.selection;
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
        item[0].removeEventListener("click", function(e) {
          root.editTarget(editableElement);
        });
        editableElement.removeEventListener('blur',function(){
          root.getUpdatedSelection(true);
        });
        editableElement.removeEventListener('mouseout',function(){
          root.getUpdatedSelection(true);
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
      observer = new MutationObserver(function() {
        root.getUpdatedSelection();
      });
    editableElement.addEventListener("click", function(e) {
      root.editTarget(editableElement);
    });
    editableElement.addEventListener('blur',function(){
      root.getUpdatedSelection(true);
    });
    editableElement.addEventListener('mouseout',function(){
      root.getUpdatedSelection(true);
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
    config.forEach(function(item) {
      let addButton = function(child, parent) {
        let button = document.createElement(child.type);
        for (var key in child) {
          button.setAttribute(key, child[key]);
        }
        max = Math.max(max, sizes.indexOf(item.collapsedUntil));
        button.setAttribute("class", "button");
        parent.appendChild(button);
        temp.push(button);
      };
      if (item.type === "button-group") {
        let group = document.createElement("div");
        group.setAttribute("class", "group");
        if (item.collapsedUntil !== undefined && item.collapsedUntil !== null)
          group.setAttribute("collapsed-until", item.collapsedUntil);
        max = Math.max(max, sizes.indexOf(item.collapsedUntil));
        item.buttons.forEach(function(button) {
          addButton(button, group);
        });
        toolbar.appendChild(group);
      } else {
        addButton(item, toolbar);
      }
      toolbar.appendChild(more);
      more.collapseMax = sizes[max];
    });
    return temp;
  }
  /**
   * Normalizes selection data.
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
   * Determines the maximum responsive size where the more button is needed.
   *
   * @param {array} an array the buttons grouped by size
   * @returns {string} the largest size in the array
   */
  _getMax(buttons) {
    return buttons !== undefined && buttons !== null
      ? buttons[buttons.length - 1].size
      : null;
  }

  /**
   * Toggles collapsed mode
   */
  _toggleMore(e) {
    console.log("toggle more");
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
window.customElements.define(RichTextEditor.tag, RichTextEditor);
export { RichTextEditor };
