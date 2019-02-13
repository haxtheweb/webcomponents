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
  // render function
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          width: 100%;
          margin: 0;
          padding: 0;
          @apply --rich-text-editor;
        }
        :host([sticky]) {
          position: sticky;
          top: 0;
        }
        :host([hidden]) {
          display: none;
        }
        :host #toolbar {
          display: flex;
          opacity: 1;
          margin: 0;
          align-items: stretch;
          flex-wrap: wrap;
          justify-content: flex-start;
          background-color: var(--rich-text-editor-bg);
          border: var(--rich-text-editor-border);
          font-size: 12px;
          transition: all 0.5s;
          @apply --rich-text-editor-toolbar;
        }
        :host #toolbar[aria-hidden] {
          visibility: hidden;
          opacity: 0;
          height: 0;
        }
        :host #toolbar .group {
          display: flex;
          flex-wrap: nowrap;
          justify-content: space-evenly;
          align-items: stretch;
          padding: 0 3px;
          @apply --rich-text-editor-toolbar-group;
        }
        :host #toolbar .group:not(:last-of-type) {
          margin-right: 3px;
          border-right: var(--rich-text-editor-border);
          @apply --rich-text-editor-toolbar-divider;
        }
        :host #toolbar .more-button {
          flex: 1 0 auto;
          justify-content: flex-end;
        }
        :host .more-button[display-max="xs"],
        :host(:not([responsive-size="xs"])) .more-button[display-max="sm"],
        :host(:not([responsive-size*="s"])) .more-button[display-max="md"],
        :host([responsive-size*="l"]) .more-button[display-max="lg"],
        :host([responsive-size="xl"]) .more-button[display-max="xl"],
        :host([responsive-size="xs"])
          #toolbar[collapsed]
          .group:not([minimum-size="xs"]),
        :host([responsive-size="sm"])
          #toolbar[collapsed]
          .group:not([minimum-size*="s"]),
        :host([responsive-size="md"])
          #toolbar[collapsed]
          .group[minimum-size*="l"],
        :host([responsive-size="lg"])
          #toolbar[collapsed]
          .group[minimum-size="xl"] {
          display: none;
        }
      </style>
      <style include="rich-text-editor-styles"></style>
      <div id="toolbar" aria-hidden$="[[!controls]]" collapsed$="[[collapsed]]">
        <template is="dom-repeat" items="[[buttons]]" as="size">
          <template is="dom-repeat" items="[[size.groups]]" as="group">
            <div class="group" minimum-size$="[[size.size]]">
              <template is="dom-repeat" items="[[group.buttons]]" as="button">
                <rich-text-editor-button
                  controls$="[[controls]]"
                  command$="[[button.command]]"
                  event$="[[button.event]]"
                  icon$="[[button.icon]]"
                  label$="[[button.label]]"
                  toggled$="[[_toggledButton(button,__trigger)]]"
                  on-rich-text-button-tap="_handleTextOperation"
                >
                </rich-text-editor-button>
              </template>
            </div>
          </template>
        </template>
        <rich-text-editor-button
          class="more-button"
          display-max$="[[_getMax(buttons)]]"
          controls="toolbar"
          icon="more-vert"
          label="Toggle More Buttons"
          toggled$="[[!collapsed]]"
          on-rich-text-button-tap="_toggleMore"
        >
        </rich-text-editor-button>
      </div>
    `;
  }

  // haxProperty definition
  static get haxProperties() {
    return {
      canScale: true,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "Rich text-editor",
        description: "a standalone rich text editor",
        icon: "icons:android",
        color: "green",
        groups: ["Text"],
        handles: [
          {
            type: "todo:read-the-docs-for-usage"
          }
        ],
        meta: {
          author: "nikkimk",
          owner: "Penn State University"
        }
      },
      settings: {
        quick: [],
        configure: [
          {
            property: "title",
            description: "",
            inputMethod: "textfield",
            required: false,
            icon: "icons:android"
          }
        ],
        advanced: []
      }
    };
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * The editor buttons.
       */
      buttons: {
        name: "buttons",
        type: "Array",
        computed: "_getButtons(config)"
      },
      /**
       * Is the menu collapsed.
       */
      collapsed: {
        name: "collapsed",
        type: "Boolean",
        value: true
      },
      /**
       * The button config on the toolbar.
       */
      config: {
        name: "config",
        type: "Object",
        value: {
          xs: [
            {
              group: "History",
              buttons: [
                {
                  label: "Undo",
                  icon: "icons:undo",
                  event: "history-undo",
                  command: "undo"
                },
                {
                  label: "Redo",
                  icon: "icons:redo",
                  event: "history-redo",
                  command: "redo"
                }
              ]
            },
            {
              group: "Basic Inline Operations",
              buttons: [
                {
                  label: "Bold",
                  icon: "editor:format-bold",
                  event: "text-bold",
                  command: "bold",
                  toggles: true
                },
                {
                  label: "Italics",
                  icon: "editor:format-italic",
                  event: "text-italic",
                  command: "italic",
                  toggles: true
                },
                {
                  label: "Erase Format",
                  icon: "editor:format-clear",
                  event: "text-remove-format",
                  command: "removeFormat"
                }
              ]
            },
            {
              group: "Links",
              buttons: [
                {
                  label: "Link",
                  icon: "link",
                  command: "link",
                  toggles: true
                }
              ]
            },
            {
              group: "Clipboard Operations",
              buttons: [
                {
                  label: "Cut",
                  icon: "icons:content-cut",
                  event: "clipboard-cut",
                  command: "cut"
                },
                {
                  label: "Copy",
                  icon: "icons:content-copy",
                  event: "clipboard-copy",
                  command: "copy"
                },
                {
                  label: "Paste",
                  icon: "icons:content-paste",
                  event: "clipboard-paste",
                  command: "paste"
                }
              ]
            }
          ],
          sm: [
            {
              group: "Subscript and Superscript",
              buttons: [
                {
                  label: "Subscript",
                  icon: "mdextra:subscript",
                  event: "text-subscript",
                  command: "subscript",
                  toggles: true
                },
                {
                  label: "Superscript",
                  icon: "mdextra:superscript",
                  event: "text-superscript",
                  command: "superscript",
                  toggles: true
                }
              ]
            }
          ],
          md: [
            {
              group: "Lists and Indents",
              buttons: [
                {
                  label: "Ordered List",
                  icon: "editor:format-list-numbered",
                  event: "text-list-numbered",
                  command: "insertOrderedList",
                  toggles: true
                },
                {
                  label: "Unordered List",
                  icon: "editor:format-list-bulleted",
                  event: "text-list-bulleted",
                  command: "insertUnorderedList",
                  toggles: true
                },
                { label: "Blockquote", icon: "editor:format-quote" },
                {
                  label: "Increase Indent",
                  icon: "editor:format-indent-increase",
                  event: "text-indent",
                  command: "indent"
                },
                {
                  label: "Decrease Indent",
                  icon: "editor:format-indent-decrease",
                  event: "text-outdent",
                  command: "outdent"
                }
              ]
            }
          ],
          lg: [
            {
              group: "Insertions",
              buttons: [
                {
                  label: "Insert Inline Image",
                  icon: "editor:insert-photo",
                  command: "insertImage"
                },
                { label: "Insert Symbol", icon: "editor:functions" },
                { label: "Insert Emoji", icon: "image:tag-faces" }
              ]
            }
          ]
        }
      },
      /**
       * The target element's id attribute.
       */
      controls: {
        name: "controls",
        type: "String",
        value: null
      },
      /**
       * The editableElement element for the editor.
       */
      editableElements: {
        name: "editableElements",
        type: "Array",
        value: []
      },
      /**
       * The editableElement element for the editor.
       */
      editableElement: {
        name: "editableElement",
        type: "Object",
        value: null
      },
      /**
       * The the size of the editor.
       */
      responsiveSize: {
        name: "responsiveSize",
        type: "String",
        value: "xs",
        reflectToAttribute: true
      },
      /**
       * The current text selection.
       */
      selection: {
        name: "selection",
        type: "Object",
        value: null
      },
      /**
       * Should the toolbar stick to the top so that it is always visible.
       */
      sticky: {
        name: "sticky",
        type: "Boolean",
        value: false,
        reflectToAttribute: true
      }
    };
  }

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
