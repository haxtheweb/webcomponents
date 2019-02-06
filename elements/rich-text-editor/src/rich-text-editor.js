/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { HAXWiring } from "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import { ResponsiveUtility } from "@lrnwebcomponents/responsive-utility/responsive-utility.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-icons/editor-icons.js";
import "@polymer/iron-icons/image-icons.js";
import "@lrnwebcomponents/md-extra-icons/md-extra-icons.js";
import { RichTextEditorButton } from "./lib/rich-text-editor-button.js";
import "./lib/rich-text-editor-styles.js";
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
 * @demo demo/content.html simple method
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
    document.designMode = "on";
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
    document.addEventListener("selectionchange", function() {
      root._updateToggleButtons();
    });
  }
  /**
   * life cycle, element is removed to the DOM
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    let root = this;
    document.removeEventListener("selectionchange", function() {
      root._updateToggleButtons();
    });
  }
  /**
   * makes a editableElement editable
   *
   * @param {object} an HTML object that can be edited
   */
  editTarget(editableElement) {
    let root = this,
      test = document.createElement("RichTextEditorButton");
    console.log(RichTextEditorButton.properties, test);
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
      root.editableElement.contentEditable = true;
      root._updateToggleButtons();
      root.controls = editableElement.getAttribute("id");
    }
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
        root._updateToggleButtons();
      });
    editableElement.addEventListener("click", function(e) {
      root.editTarget(editableElement);
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
    let buttons = [],
      sizes = ["xs", "sm", "md", "lg", "xl"];
    sizes.forEach(function(size) {
      if (config[size] !== undefined && config[size] !== null)
        buttons.push({ size: size, groups: config[size] });
    });
    return buttons;
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
   * Respond to simple modifications.
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
   * Respond to simple modifications.
   */
  _handleTextOperation(e) {
    this.selection = this.editableElement.getSelection
      ? this.editableElement.getSelection()
      : this._getRange();
    //refresh buttons
    // support a simple insert event to bubble up or everything else
    if (e.detail.command !== undefined && e.detail.command !== null) {
      document.execCommand(e.detail.command);
    } else {
      this.dispatchEvent(
        new CustomEvent("rich-text-event", {
          detail: { button: e.detail, selection: this.selection }
        })
      );
    }
    this._updateToggleButtons();
    /*switch (detail.event) {
      case "text-link":
        var href = "";
        if (typeof selection.focusNode.parentNode.href !== typeof undefined) {
          href = selection.focusNode.parentNode.href;
        }
        // @todo put in a dialog instead of this
        let url = prompt("Enter a URL:", href);
        if (url) {
          document.execCommand("createLink", false, url);
        }
        break;
      case "text-unlink":
        document.execCommand("unlink");
        break;*/
    /**
       * Our bad actors when it comes to polyfill'ed shadowDOM.
       * Naughty, naughty shadyDOM. Fortunately this is only IE11/Edge
       * /
      //catch-all for custom buttons
      default:
    }*/
  }

  /**
   * Is button toggled?
   */
  _toggledButton(button = null, trigger) {
    let sel = window.getSelection(),
      state =
        button.command !== null && button.toggles === true
          ? document.queryCommandState(button.command)
          : false;
    return state;
  }

  /**
   * Toggles collapsed mode
   */
  _toggleMore(e) {
    this.collapsed = !this.collapsed;
  }

  /**
   * Updates toggled buttons based on selection.
   */
  _updateToggleButtons() {
    this.__trigger = this.__trigger === false;
  }

  _uuidPart() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
}
window.customElements.define(RichTextEditor.tag, RichTextEditor);
export { RichTextEditor };
