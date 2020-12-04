/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { RichTextEditorStyles } from "../rich-text-editor-styles.js";
import "@lrnwebcomponents/responsive-utility/responsive-utility.js";
import "@lrnwebcomponents/rich-text-editor/lib/singletons/rich-text-editor-selection.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-button-lite.js";
import "@lrnwebcomponents/hax-iconset/lib/simple-hax-iconset.js";

const RichTextEditorToolbarBehaviors = function (SuperClass) {
  return class extends RichTextEditorStyles(SuperClass) {
    /**
     * Store tag name to make it easier to obtain directly.
     */
    static get tag() {
      return "rich-text-editor-toolbar";
    }

    // render function for styles
    static get stickyStyles() {
      return [
        css`
          :host([sticky]) {
            position: sticky;
            top: 0;
          }
        `,
      ];
    }

    // render function for styles
    static get baseStyles() {
      return [
        ...super.styles,
        css`
          #toolbar {
            display: flex;
            opacity: 1;
            z-index: 1;
            margin: 0;
            align-items: stretch;
            flex-wrap: wrap;
            justify-content: flex-start;
            background-color: var(--rich-text-editor-bg);
            border: var(--rich-text-editor-border);
            font-size: 12px;
            transition: all 0.5s;
          }
          #toolbar[aria-hidden="true"] {
            visibility: hidden;
            opacity: 0;
            height: 0;
          }
          #toolbar .group {
            display: flex;
            flex-wrap: nowrap;
            justify-content: space-evenly;
            align-items: stretch;
            padding: 0 3px;
          }
          #toolbar .group:not(:last-of-type) {
            margin-right: 3px;
            border-right: var(--rich-text-editor-border);
          }
          #toolbar .button {
            display: flex;
            flex: 0 0 auto;
            align-items: stretch;
          }
          #toolbar #morebutton {
            flex: 1 0 auto;
            justify-content: flex-end;
          }
          /* hide more button if all buttons are displayed */
          #toolbar[responsive-size="xs"] #morebutton[collapse-max="xs"],
          #toolbar[responsive-size="sm"] #morebutton[collapse-max*="s"],
          #toolbar[responsive-size="md"] #morebutton:not([collapse-max*="l"]),
          #toolbar[responsive-size="lg"] #morebutton:not([collapse-max="xl"]),
          #toolbar[responsive-size="xl"] #morebutton,
          /* hide buttons if they should be collaped until */
          #toolbar[responsive-size="xs"][collapsed] *[collapsed-until*="m"],
          #toolbar[responsive-size="xs"][collapsed] *[collapsed-until*="l"],
          #toolbar[responsive-size="sm"][collapsed] *[collapsed-until="md"],
          #toolbar[responsive-size="sm"][collapsed] *[collapsed-until*="l"],
          #toolbar[responsive-size="md"][collapsed] *[collapsed-until*="l"],
          #toolbar[responsive-size="lg"][collapsed] *[collapsed-until="xl"] {
            display: none;
          }
        `,
      ];
    }

    static get styles() {
      return [...this.baseStyles, ...this.stickyStyles];
    }

    // render function for toolbar
    get toolbarTemplate() {
      return html`
        <div
          id="toolbar"
          aria-live="polite"
          aria-hidden="${!!this.controls || !!this.alwaysVisible
            ? "false"
            : "true"}"
          ?collapsed="${this.collapsed}"
          ?hidden="${!this.controls && !this.alwaysVisible}"
          @focus="${(e) => (this.__focused = true)}"
          @blur="${(e) => (this.__focused = false)}"
          @mouseover="${(e) => (this.__hovered = true)}"
          @mouseout="${(e) => (this.__hovered = false)}"
          @selectnode="${(e) => this.selectNode(e.detail)}"
          @selectnodecontents="${(e) => this.selectNodeContents(e.detail)}"
          @selectrange="${(e) => this.selectRange(e.detail)}"
        >
          <rich-text-editor-more-button
            id="morebutton"
            class="button"
            aria-controls="toolbar"
            icon="${this.moreIcon}"
            label="${this.moreLabel}"
            ?show-text-label="${this.moreShowTextLabel}"
            ?label-toggled="${this.moreLabelToggled}"
            ?toggled="${!this.collapsed}"
            @click="${this._toggleMore}"
          >
          </rich-text-editor-more-button>
        </div>
      `;
    }

    // render function for template
    render() {
      return html` ${this.toolbarTemplate} `;
    }

    // properties available to custom element for data binding
    static get properties() {
      return {
        /**
         * keep toolbar visible even when not editor not focused
         */
        alwaysVisible: {
          type: Boolean,
          attribute: "always-visible",
          reflect: true,
        },
        /**
         * raw array of buttons
         */
        buttons: {
          name: "buttons",
          type: Array,
        },
        /**
         * is toolbar collapsed?
         */
        collapsed: {
          name: "collapsed",
          type: Boolean,
          attribute: "collapsed",
        },
        /**
         * Custom configuration of toolbar groups and buttons.
         * (See default value for example using default configuration.)
         */
        config: {
          name: "config",
          type: Object,
          attribute: "config",
        },
        /**
         * `rich-text-editor` element that is currently in `contenteditable` mode
         */
        editor: {
          name: "editor",
          type: Object,
          attribute: "editor",
        },
        /**
         * `rich-text-editor` unique id
         */
        id: {
          name: "id",
          type: String,
          attribute: "id",
          reflect: true,
        },
        /**
         * icon for more button.
         */
        moreIcon: {
          name: "moreIcon",
          type: String,
          attribute: "more-icon",
        },
        /**
         * label for more button.
         */
        moreLabel: {
          name: "moreLabel",
          type: String,
          attribute: "more-label",
        },
        /**
         * label for more button when toggled.
         */
        moreLabelToggled: {
          name: "moreLabelToggled",
          type: String,
          attribute: "more-label-toggled",
          value: "Fewer Buttons",
        },
        /**
         * show text label for more button.
         */
        moreShowTextLabel: {
          name: "moreShowTextLabel",
          type: Boolean,
          attribute: "more-show-text-label",
        },
        /**
         * size of editor.
         */
        responsiveSize: {
          name: "responsiveSize",
          type: String,
          attribute: "responsive-size",
          reflect: true,
        },
        /**
         * current text selected range.
         */
        savedSelection: {
          name: "savedSelection",
          type: Object,
        },
        /**
         * current text selected range, which is actually a range.
         */
        range: {
          name: "range",
          type: Object,
        },
        /**
         * selection singleton
         */
        registered: {
          type: Boolean,
        },
        /**
         * currently selected node
         */
        selectedNode: {
          type: Object,
        },
        /**
         * array of ancestors of currently selected node
         */
        selectionAncestors: {
          type: Array,
        },
        /**
         * Optional space-sperated list of keyboard shortcuts for editor
         * to fire this button, see iron-a11y-keys for more info.
         */
        shortcutKeys: {
          name: "shortcutKeys",
          type: Array,
        },
        /**
         * Should toolbar stick to top so that it is always visible?
         */
        sticky: {
          name: "sticky",
          type: Boolean,
          attribute: "sticky",
          reflect: true,
        },
        /**
         * Tracks inline widgets that require selection data
         */
        __clickableElement: {
          name: "__clickableElement",
          type: Array,
        },
        /**
         * whether editor has focus
         */
        __editorFocused: {
          name: "__editorFocused",
          type: Boolean,
        },
        /**
         * whether editor is hovered
         */
        __editorHovered: {
          name: "__editorHovered",
          type: Boolean,
        },
        /**
         * whether toolbar has focus
         */
        __focused: {
          name: "__focused",
          type: Boolean,
        },
        /**
         * whether toolbar is hidden
         */
        __hidden: {
          name: "__hidden",
          type: Boolean,
        },
        /**
         * whether toolbar is hovered
         */
        __hovered: {
          name: "__hovered",
          type: Boolean,
        },
        /**
         * selection singleton
         */
        __selection: {
          type: Object,
        },
      };
    }
    constructor() {
      super();
      import("../buttons/rich-text-editor-button.js");
      import("../buttons/rich-text-editor-more-button.js");
      import("../buttons/rich-text-editor-heading-picker.js");
      import("../buttons/rich-text-editor-symbol-picker.js");
      import("../buttons/rich-text-editor-underline.js");
      import("../buttons/rich-text-editor-image.js");
      import("../buttons/rich-text-editor-link.js");
      import("../buttons/rich-text-editor-button-styles.js");
      import("@polymer/iron-icons/iron-icons.js");
      import("@polymer/iron-icons/editor-icons.js");
      import("@polymer/iron-icons/image-icons.js");
      import("@lrnwebcomponents/md-extra-icons/md-extra-icons.js");
      window.ResponsiveUtility.requestAvailability();

      this.alwaysVisible = false;
      this.collapsed = true;
      this.config = [
        {
          label: "History",
          type: "button-group",
          buttons: [
            {
              command: "undo",
              icon: "undo",
              label: "Undo",
              shortcutKeys: "ctrl+z",
              type: "rich-text-editor-button",
            },
            {
              command: "redo",
              icon: "redo",
              label: "Redo",
              shortcutKeys: "ctrl+shift+z",
              type: "rich-text-editor-button",
            },
          ],
        },
        {
          label: "Basic Inline Operations",
          type: "button-group",
          buttons: [
            {
              label: "Format",
              type: "rich-text-editor-heading-picker",
            },
            {
              command: "bold",
              icon: "editor:format-bold",
              label: "Bold",
              shortcutKeys: "ctrl+b",
              toggles: true,
              type: "rich-text-editor-button",
            },
            {
              command: "italic",
              icon: "editor:format-italic",
              label: "Italics",
              shortcutKeys: "ctrl+i",
              toggles: true,
              type: "rich-text-editor-button",
            },
            {
              command: "removeFormat",
              icon: "editor:format-clear",
              label: "Erase Format",
              type: "rich-text-editor-button",
            },
          ],
        },
        {
          label: "Links",
          type: "button-group",
          buttons: [
            {
              icon: "link",
              label: "Link",
              shortcutKeys: "ctrl+k",
              type: "rich-text-editor-link",
            },
          ],
        },
        {
          label: "Clipboard Operations",
          type: "button-group",
          buttons: [
            {
              command: "cut",
              icon: "content-cut",
              label: "Cut",
              shortcutKeys: "ctrl+x",
              type: "rich-text-editor-button",
            },
            {
              command: "copy",
              icon: "content-copy",
              label: "Copy",
              shortcutKeys: "ctrl+c",
              type: "rich-text-editor-button",
            },
            {
              command: "paste",
              icon: "content-paste",
              label: "Paste",
              shortcutKeys: "ctrl+v",
              type: "rich-text-editor-button",
            },
          ],
        },
        {
          collapsedUntil: "md",
          label: "Subscript and Superscript",
          type: "button-group",
          buttons: [
            {
              command: "subscript",
              icon: "mdextra:subscript",
              label: "Subscript",
              toggles: true,
              type: "rich-text-editor-button",
            },
            {
              command: "superscript",
              icon: "mdextra:superscript",
              label: "Superscript",
              toggles: true,
              type: "rich-text-editor-button",
            },
          ],
        },
        {
          collapsedUntil: "sm",
          icon: "editor:functions",
          label: "Insert Symbol",
          symbolTypes: ["symbols"],
          type: "rich-text-editor-symbol-picker",
        },
        {
          collapsedUntil: "sm",
          label: "Lists and Indents",
          type: "button-group",
          buttons: [
            {
              command: "insertOrderedList",
              icon: "editor:format-list-numbered",
              label: "Ordered List",
              toggles: true,
              type: "rich-text-editor-button",
            },
            {
              command: "insertUnorderedList",
              icon: "editor:format-list-bulleted",
              label: "Unordered List",
              toggles: true,
              type: "rich-text-editor-button",
            },
            {
              collapsedUntil: "lg",
              command: "formatBlock",
              commandVal: "blockquote",
              label: "Blockquote",
              icon: "editor:format-quote",
              shortcutKeys: "ctrl+'",
              type: "rich-text-editor-button",
            },
            {
              command: "indent",
              icon: "editor:format-indent-increase",
              event: "text-indent",
              label: "Increase Indent",
              shortcutKeys: "ctrl+]",
              type: "rich-text-editor-button",
            },
            {
              command: "outdent",
              event: "text-outdent",
              icon: "editor:format-indent-decrease",
              label: "Decrease Indent",
              shortcutKeys: "ctrl+[",
              type: "rich-text-editor-button",
            },
          ],
        },
      ];
      this.moreIcon = "more-vert";
      this.moreLabel = "More Buttons";
      this.moreLabelToggled = "Fewer Buttons";
      this.moreShowTextLabel = false;
      this.responsiveSize = "xs";
      this.sticky = false;
      this.__clickableElement = [];
      this.shortcutKeys = [];
    }
    firstUpdated(changedProperties) {
      super.firstUpdated(changedProperties);
      this.buttons = this._getButtons();

      window.dispatchEvent(
        new CustomEvent("responsive-element", {
          detail: { element: this.shadowRoot.querySelector("#toolbar") },
        })
      );
      this.__selection = window.RichTextEditorSelection.requestAvailability();
      this.register();
    }
    get disconnected() {
      return (
        !this.alwaysVisible &&
        (!this.controls || (!this.__focused && !this.__hovered))
      );
    }
    updated(changedProperties) {
      super.updated(changedProperties);
      changedProperties.forEach((oldValue, propName) => {
        if (propName === "range") this._rangeChange();
        if (propName === "editor") this._editorChange();
        if (["alwaysVisible", "controls"].includes(propName))
          this.__hidden = this.disconnected;
        if (
          [
            "__focused",
            "__hovered",
            "__editorFocused",
            "__editorHovered",
          ].includes(propName)
        )
          setTimeout((this.__hidden = this.disconnected), 300);
      });
    }

    connectedCallback() {
      super.connectedCallback();
      this.register();
    }

    /**
     * life cycle, element is disconnected
     * @returns {void}
     */
    disconnectedCallback() {
      super.disconnectedCallback();
      this.register(true);
    }
    /**
     * id of editor currently being controlled
     * @readonly
     */
    get controls() {
      return !this.editor ? undefined : this.editor.getAttribute("id");
    }

    /**
     * cancels edits to active editor
     * @returns {void}
     */
    cancel() {
      this.dispatchEvent(
        new c("cancel", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: this,
        })
      );
    }
    /**
     * uses selection to create a range placeholder that keeps range highlighted
     *
     * @param {boolean} [add=true] add highlight?
     * @returns {void}
     */
    highlight(add = true) {
      this.dispatchEvent(
        new CustomEvent("highlight", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: add,
        })
      );
    }
    /**
     * handles registration to selection singleton's toolbars list
     * @param {boolean} remove whether to remove
     * @event register
     */
    register(remove = false) {
      window.dispatchEvent(
        new CustomEvent("register", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: {
            remove: remove,
            toolbar: this,
          },
        })
      );
    }
    /**
     * selects a given node inside connected editor
     *
     * @param {object} node
     * @returns {void}
     */
    selectNode(node) {
      this.dispatchEvent(
        new CustomEvent("selectnode", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: node,
        })
      );
    }
    /**
     * selects a given node inside connected editor
     *
     * @param {object} node
     * @returns {void}
     */
    selectNodeContents(node) {
      this.dispatchEvent(
        new CustomEvent("selectnodecontents", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: node,
        })
      );
      //if (this.__selection) this.__selection.selectNodeContents(node, this.editor);
    }
    /**
     * selects a given node inside connected editor
     *
     * @param {object} node
     * @returns {void}
     */
    selectRange(range) {
      this.dispatchEvent(
        new CustomEvent("selectrange", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: range,
        })
      );
      //if (this.__selection) this.__selection.selectRange(range, this.editor);
    }

    /**
     * make an new editable element
     *
     * @param {object} editor an HTML object that can be edited
     * @returns {void}
     */
    newEditor(editor) {
      let content = document.createElement("rich-text-editor");
      editor.parentNode.insertBefore(content, editor);
      content.appendChild(editor);
    }

    /**
     * pastes sanitized clipboard contents into current editor's selected range
     * @param {object} editor an HTML object that can be edited
     * @returns {void}
     */
    pasteFromClipboard() {
      this.dispatchEvent(
        new CustomEvent("pastefromclipboard", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: this.editor,
        })
      );
    }

    /**
     * Adds a button to toolbar
     *
     * @param {object} child child object in config object
     * @param {object} parent parent object in config object
     * @returns {object} button
     */
    _addButton(child, parent) {
      let button = document.createElement(child.type),
        keys = button.shortcutKeys
          ? button.shortcutKeys.replace(/ctrl\+[xcv]/g, "")
          : "";
      //disable clipboard keys since we're already listening for them

      this.shortcutKeys[keys] = button;

      for (var key in child) {
        button[key] = child[key];
      }
      button.setAttribute("class", "button");
      button.addEventListener("button-command", this._handleButton);

      if (button.inlineWidget) this.push("__clickableElement", button.tag);
      parent.appendChild(button);
      return button;
    }
    /**
     * creates buttons based on config
     *
     * @returns {array}
     */
    _getButtons() {
      let toolbar =
        this.shadowRoot && this.shadowRoot.querySelector("#toolbar")
          ? this.shadowRoot.querySelector("#toolbar")
          : undefined;
      if (!!toolbar) {
        let more = toolbar.querySelector("#morebutton"),
          max = 0,
          sizes = ["xs", "sm", "md", "lg", "xl"],
          temp = [];
        toolbar.innerHTML = "";
        this.shortcutKeys = [];
        this.config.forEach((item) => {
          if (item.type === "button-group") {
            let group = document.createElement("div");
            group.setAttribute("class", "group");
            if (
              item.collapsedUntil !== undefined &&
              item.collapsedUntil !== null
            )
              group.setAttribute("collapsed-until", item.collapsedUntil);
            max = Math.max(max, sizes.indexOf(item.collapsedUntil));
            item.buttons.forEach((button) => {
              max = Math.max(max, sizes.indexOf(button.collapsedUntil));
              if (navigator.clipboard || button.command !== "paste")
                temp.push(this._addButton(button, group)); //firefox doesn't allow for clipboard button
            });
            toolbar.appendChild(group);
          } else {
            max = Math.max(max, sizes.indexOf(item.collapsedUntil));
            if (navigator.clipboard || item.command !== "paste")
              temp.push(this._addButton(item, toolbar)); //firefox doesn't allow for clipboard button
          }
          toolbar.appendChild(more);
          more.collapseMax = sizes[max];
        });
        return temp;
      }
      return [];
    }
    /**
     * sets up breadcrumbs when editor changes
     * @returns {void}
     */
    _editorChange() {
      this.range = undefined;
      if (this.c) {
        this.breadcrumbs.controls = this.controls;
        this.breadcrumbs.sticky = this.sticky;
        this.breadcrumbs.controls = this.controls;
        this.breadcrumbs.hidden = !this.controls && !this.alwaysVisible;
        if (!!this.editor)
          this.editor.parentNode.insertBefore(
            this.breadcrumbs,
            this.editor.nextSibling
          );
      }
    }

    /**
     * Gets updated selected range.
     * @returns {void}
     */
    _rangeChange() {
      if (
        this.range &&
        this.range.commonAncestorContainer &&
        this.editor &&
        this.editor.contains(this.range.commonAncestorContainer)
      ) {
        this.buttons.forEach((button) => {
          button.range = undefined;
          button.range = this.range;
          button.selectedNode = this.selectedNode;
          button.selectionAncestors = this.selectionAncestors;
        });
        if (this.breadcrumbs) {
          this.breadcrumbs.controls = this.controls;
          this.breadcrumbs.selectionAncestors = this.selectionAncestors;
          this.breadcrumbs.hidden = !this.controls && !this.alwaysVisible;
        }
      }
    }

    /**
     * Toggles collapsed mode when `rich-text-editor-more-button` is tapped
     * @param {event} e `rich-text-editor-more-button` tap event
     * @returns {void}
     */
    _toggleMore(e) {
      this.collapsed = !this.collapsed;
    }
  };
};
/**
 * `rich-text-editor-toolbar`
 * `default toolbar for rich text editor`
 *
 * @element rich-text-editor-toolbar
 */
class RichTextEditorToolbar extends RichTextEditorToolbarBehaviors(
  LitElement
) {}
window.customElements.define(RichTextEditorToolbar.tag, RichTextEditorToolbar);
export { RichTextEditorToolbar, RichTextEditorToolbarBehaviors };
