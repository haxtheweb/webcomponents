/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { SimpleToolbarBehaviors } from "@lrnwebcomponents/simple-toolbar/simple-toolbar.js";
import { SimpleToolbarButtonBehaviors } from "@lrnwebcomponents/simple-toolbar/lib/simple-toolbar-button.js";
import {
  RichTextStyles,
  RichTextToolbarStyles,
} from "../buttons/rich-text-editor-button.js";
import "@lrnwebcomponents/rich-text-editor/lib/singletons/rich-text-editor-selection.js";
import "@lrnwebcomponents/absolute-position-behavior/absolute-position-behavior.js";

/**
 * RichTextEditorToolbarBehaviors
 *
 * @extends SimpleToolbarBehaviors
 * @extends RichTextToolbarStyles
 * @customElement
 * @class
 * @lit-html
 * @lit-element
 */
const RichTextEditorToolbarBehaviors = function (SuperClass) {
  return class extends SimpleToolbarBehaviors(SuperClass) {
    /**
     * Store tag name to make it easier to obtain directly.
     */
    static get tag() {
      return "rich-text-editor-toolbar";
    }
    /**
     * styles for small floating toolbar
     *
     * @readonly
     * @static
     */
    static get miniStyles() {
      return [
        css`
          :host {
            position: relative;
            height: 0;
            margin: 0 auto;
            padding: 0;
            border: none;
            background-color: none;
          }
          #container {
            display: flex;
            position: absolute;
            bottom: 0;
            margin: 0 auto;
            padding: 0;
            border: var(--rich-text-editor-border-width, 1px) solid
              var(--rich-text-editor-border-color, #ddd);
            background-color: var(
              --rich-text-editor-bg,
              var(--rich-text-editor-bg, #ffffff)
            );
          }
        `,
      ];
    }

    /**
     * base styles toolbar: simple toolbar base styles + custom styles for rich text
     *
     * @readonly
     * @static
     */
    static get baseStyles() {
      return [
        ...super.baseStyles,
        ...RichTextStyles,
        css`
          :host {
            border: var(--rich-text-editor-border-width, 1px) solid
              var(--rich-text-editor-border-color, #ddd);
            background-color: var(--rich-text-editor-bg, #ffffff);
          }
        `,
      ];
    }

    /**
     * default styles for toolbar: base + simple-toolbar sticky styles
     *
     * @readonly
     * @static
     */
    static get styles() {
      return [...this.baseStyles, ...super.stickyStyles];
    }
    /**
     * whether or not toolbar breadcrumbs
     * (override to force a toolbar to always use or not use them)
     *
     * @readonly
     */
    get hasBreadcrumbs() {
      return false;
    }
    /**
     * default config for an undo button
     *
     * @readonly
     */
    get undoButton() {
      return {
        command: "undo",
        icon: "undo",
        label: "Undo",
        shortcutKeys: "ctrl+z",
        type: "rich-text-editor-button",
      };
    }
    /**
     * default config for a redo button
     *
     * @readonly
     */
    get redoButton() {
      return {
        command: "redo",
        icon: "redo",
        label: "Redo",
        shortcutKeys: "ctrl+shift+z",
        type: "rich-text-editor-button",
      };
    }
    /**
     * default config for a history button group: undo + redo
     *
     * @readonly
     */
    get historyButtonGroup() {
      return {
        type: "button-group",
        buttons: [this.undoButton, this.redoButton],
      };
    }
    /**
     * default config for a format button
     *
     * @readonly
     */
    get formatButton() {
      return {
        label: "Format",
        type: "rich-text-editor-heading-picker",
      };
    }
    /**
     * default config for a bold button
     *
     * @readonly
     */
    get boldButton() {
      return {
        command: "bold",
        icon: "editor:format-bold",
        label: "Bold",
        shortcutKeys: "ctrl+b",
        toggles: true,
        type: "rich-text-editor-button",
      };
    }
    /**
     * default config for an italic button
     *
     * @readonly
     */
    get italicButton() {
      return {
        command: "italic",
        icon: "editor:format-italic",
        label: "Italics",
        shortcutKeys: "ctrl+i",
        toggles: true,
        type: "rich-text-editor-button",
      };
    }
    /**
     * default config for an underline button
     *
     * @readonly
     */
    get underlineButton() {
      return { type: "rich-text-editor-underline" };
    }
    /**
     * default config for a remove format button
     *
     * @readonly
     */
    get removeFormatButton() {
      return {
        command: "removeFormat",
        icon: "editor:format-clear",
        label: "Erase Format",
        type: "rich-text-editor-button",
      };
    }
    /**
     * default config for a style button group: format, bold, italic, and remove format
     *
     * @readonly
     */
    get basicInlineButtonGroup() {
      return {
        type: "button-group",
        buttons: [
          this.formatButton,
          this.boldButton,
          this.italicButton,
          this.removeFormatButton,
        ],
      };
    }
    /**
     * default config for a link button
     *
     * @readonly
     */
    get linkButton() {
      return {
        icon: "link",
        label: "Link",
        shortcutKeys: "ctrl+k",
        type: "rich-text-editor-link",
      };
    }
    /**
     * default config for a link button group: link
     *
     * @readonly
     */
    get linkButtonGroup() {
      return {
        type: "button-group",
        buttons: [this.linkButton],
      };
    }
    /**
     * default config for a cut button
     *
     * @readonly
     */
    get cutButton() {
      return {
        command: "cut",
        icon: "content-cut",
        label: "Cut",
        shortcutKeys: "ctrl+x",
        type: "rich-text-editor-button",
      };
    }
    /**
     * default config for a copy button
     *
     * @readonly
     */
    get copyButton() {
      return {
        command: "copy",
        icon: "content-copy",
        label: "Copy",
        shortcutKeys: "ctrl+c",
        type: "rich-text-editor-button",
      };
    }
    /**
     * default config for a paste button
     *
     * @readonly
     */
    get pasteButton() {
      return {
        command: "paste",
        icon: "content-paste",
        label: "Paste",
        shortcutKeys: "ctrl+v",
        type: "rich-text-editor-button",
      };
    }
    /**
     * default config for a clipboard button group: cut, copy, and paste
     *
     * @readonly
     */
    get clipboardButtonGroup() {
      return {
        type: "button-group",
        buttons: [this.cutButton, this.copyButton, this.pasteButton],
      };
    }
    /**
     * default config for a subscript button
     *
     * @readonly
     */
    get subscriptButton() {
      return {
        command: "subscript",
        icon: "mdextra:subscript",
        label: "Subscript",
        toggles: true,
        type: "rich-text-editor-button",
      };
    }
    /**
     * default config for a superscript button
     *
     * @readonly
     */
    get superscriptButton() {
      return {
        command: "superscript",
        icon: "mdextra:superscript",
        label: "Superscript",
        toggles: true,
        type: "rich-text-editor-button",
      };
    }
    /**
     * default config for a script button group: subscript & superscript
     *
     * @readonly
     */
    get scriptButtonGroup() {
      return {
        type: "button-group",
        buttons: [this.subscriptButton, this.superscriptButton],
      };
    }
    /**
     * default config for a symbol button
     *
     * @readonly
     */
    get symbolButton() {
      return {
        symbolTypes: ["symbols"],
        type: "rich-text-editor-symbol-picker",
      };
    }
    /**
     * default config for an emoji button
     *
     * @readonly
     */
    get emojiButton() {
      return {
        type: "rich-text-editor-emoji-picker",
      };
    }
    /**
     * default config for an image button
     *
     * @readonly
     */
    get imageButton() {
      return {
        type: "rich-text-editor-image",
      };
    }
    /**
     * default config for an insert button group: image
     *
     * @readonly
     */
    get insertButtonGroup() {
      return {
        type: "button-group",
        buttons: [this.imageButton, this.symbolButton],
      };
    }
    /**
     * default config for an ordered list button
     *
     * @readonly
     */
    get orderedListButton() {
      return {
        command: "insertOrderedList",
        icon: "editor:format-list-numbered",
        label: "Ordered List",
        toggles: true,
        type: "rich-text-editor-button",
      };
    }
    /**
     * default config for an unordered list button
     *
     * @readonly
     */
    get unorderedListButton() {
      return {
        command: "insertUnorderedList",
        icon: "editor:format-list-bulleted",
        label: "Unordered List",
        toggles: true,
        type: "rich-text-editor-button",
      };
    }
    /**
     * default config for a blockquote button
     *
     * @readonly
     */
    get blockquoteButton() {
      return {
        command: "formatBlock",
        commandVal: "blockquote",
        label: "Blockquote",
        icon: "editor:format-quote",
        shortcutKeys: "ctrl+'",
        type: "rich-text-editor-button",
      };
    }
    /**
     * default config for an indent button
     *
     * @readonly
     */
    get indentButton() {
      return {
        command: "indent",
        icon: "editor:format-indent-increase",
        label: "Increase Indent",
        shortcutKeys: "ctrl+]",
        type: "rich-text-editor-button",
      };
    }
    /**
     * default config for an outdent button
     *
     * @readonly
     */
    get outdentButton() {
      return {
        command: "outdent",
        icon: "editor:format-indent-decrease",
        label: "Decrease Indent",
        shortcutKeys: "ctrl+[",
        type: "rich-text-editor-button",
      };
    }
    /**
     * default config for a list and indent button group:
     * ordered, unordered, blockquote, indent, outdent
     *
     * @readonly
     */
    get listIndentButtonGroup() {
      return {
        type: "button-group",
        buttons: [
          this.orderedListButton,
          this.unorderedListButton,
          this.blockquoteButton,
          this.indentButton,
          this.outdentButton,
        ],
      };
    }
    /**
     * default config for an save button
     *
     * @readonly
     */
    get saveButton() {
      return {
        command: "save",
        icon: "save",
        label: "Save",
        type: "rich-text-editor-button",
      };
    }
    /**
     * default config for a close button
     *
     * @readonly
     */
    get closeButton() {
      return {
        command: "cancel",
        icon: "close",
        label: "Cancel",
        type: "rich-text-editor-button",
      };
    }
    /**
     * default config for a save and close button group: save and close
     *
     * @readonly
     */
    get saveCloseButtonGroup() {
      return {
        type: "button-group",
        buttons: [this.saveButton],
      };
    }
    /**
     * default config for a view source button
     *
     * @readonly
     */
    get sourceButton() {
      return { type: "rich-text-editor-source-code" };
    }
    /**
     * default config for a source button group: view source
     *
     * @readonly
     */
    get sourceButtonGroup() {
      return {
        type: "button-group",
        buttons: [this.sourceButton],
      };
    }
    /**
     * default config for toolbar with
     * default history, style, link, clipboard, script, insert, and list button groups
     *
     * @readonly
     */
    get defaultConfig() {
      return [
        this.historyButtonGroup,
        this.basicInlineButtonGroup,
        this.linkButtonGroup,
        this.clipboardButtonGroup,
        this.scriptButtonGroup,
        this.insertButtonGroup,
        this.listIndentButtonGroup,
      ];
    }

    /**
     * default config for toolbar with
     * default a custom group of style buttons,
     * default link button group,
     * default script button group,
     * and a custom list button groups
     *
     * @readonly
     */
    get miniConfig() {
      return [
        {
          type: "button-group",
          buttons: [
            this.boldButton,
            this.italicButton,
            this.removeFormatButton,
          ],
        },
        this.linkButtonGroup,
        this.scriptButtonGroup,
        {
          type: "button-group",
          buttons: [this.orderedListButton, this.unorderedListButton],
        },
      ];
    }
    /**
     * a template that places toolbar in a container
     * so that it can be positioned absolutely
     *
     * @readonly
     */
    get miniTemplate() {
      return html` <div id="container">${super.toolbarTemplate}</div> `;
    }

    /**
     * default toolbar template uses simple-toolbar
     *
     * @readonly
     */
    get toolbarTemplate() {
      return super.toolbarTemplate;
    }

    // render function for template
    render() {
      return this.toolbarTemplate;
    }

    // properties available to custom element for data binding
    static get properties() {
      return {
        ...super.properties,
        /**
         * The label for the breadcrums area.
         */
        breadcrumbsLabel: {
          name: "breadcrumbsLabel",
          type: String,
          attribute: "breadcrumbs-label",
        },
        /**
         * The label for the breadcrums area.
         */
        breadcrumbsSelectAllLabel: {
          name: "breadcrumbsSelectAllLabel",
          type: String,
          attribute: "breadcrumbs-select-all-label",
        },
        /**
         * `rich-text-editor` element that is currently in `editing` mode
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
         * when to make toolbar visible:
         * "always" to keep it visible,
         * "selection" when there is an active selection,
         * or defaults to only when connected to a toolbar
         */
        show: {
          type: String,
          attribute: "show",
          reflect: true,
        },
        /**
         * Tracks inline widgets that require selection data
         */
        clickableElements: {
          name: "clickableElements",
          type: Object,
        },
        /**
         * hides paste button in Firefox
         */
        __pasteDisabled: {
          name: "__pasteDisabled",
          type: Boolean,
          attribute: "paste-disabled",
          reflect: true,
        },
        /**
         * whether prompt is open
         */
        __promptOpen: {
          name: "__promptOpen",
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
      import("../buttons/rich-text-editor-source-code.js");
      import("../buttons/rich-text-editor-heading-picker.js");
      import("../buttons/rich-text-editor-symbol-picker.js");
      import("../buttons/rich-text-editor-underline.js");
      import("../buttons/rich-text-editor-image.js");
      import("../buttons/rich-text-editor-link.js");
      this.config = this.defaultConfig;
      this.clickableElements = {};
      this.breadcrumbsLabel = "Select";
      this.breadcrumbsSelectAllLabel = "All";
    }
    firstUpdated(changedProperties) {
      super.firstUpdated(changedProperties);
      this.__selection = window.RichTextEditorSelection.requestAvailability();
      this.register();
      if (this.hasBreadcrumbs) this._addBreadcrumbs();
    }
    updated(changedProperties) {
      super.updated(changedProperties);
      changedProperties.forEach((oldValue, propName) => {
        if (propName === "range") this._rangeChange();
        if (propName === "editor") this._editorChange();
        if (["editor", "show", "range"].includes(propName))
          this.hidden = this.disconnected;
        if (["breadcrumbs", "sticky"].includes(propName) && !!this.breadcrumbs)
          this.breadcrumbs.sticky = this.sticky;
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
     * @returns {string}
     */
    get controls() {
      return !this.editor ? undefined : this.editor.getAttribute("id");
    }
    /**
     * determines if the toolbar is hidden
     *
     * @readonly
     * @returns {boolean}
     */
    get disconnected() {
      return this.show == "always"
        ? false
        : this.show != "selection"
        ? !this.editor
        : this.noSelection;
    }
    /**
     * determines if the toolbar has an extive selection
     *
     * @readonly
     * @returns {boolean}
     */
    get noSelection() {
      return !this.range || this.range.collapsed;
    }

    /**
     * cancels edits to active editor
     * @returns {void}
     * @event cancel
     */
    cancel() {
      this.dispatchEvent(
        new CustomEvent("cancel", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: this,
        })
      );
    }
    /**
     * closes toolbar
     * @returns {void}
     * @event disableediting
     *
     */
    close() {
      this.dispatchEvent(
        new CustomEvent("disableediting", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: this,
        })
      ); //if (editor) this.disableEditing(editor);
      this.editor = undefined;
      document.body.append(this);
    }
    /**
     * uses selection to create a range placeholder that keeps range highlighted
     *
     * @param {boolean} [add=true] add highlight?
     * @returns {void}
     * @event highlight
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
     * @returns {void}
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
     * @param {range} range
     * @returns {void}
     * @event setrange
     */
    setRange(range) {
      this.dispatchEvent(
        new CustomEvent("setrange", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: {
            editor: this.editor,
            range: range,
          },
        })
      );
    }
    /**
     * selects a given node inside connected editor
     *
     * @param {object} node
     * @returns {void}
     * @event selectnode
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
     * @event selectnodecontents
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
    }
    /**
     * selects a given node inside connected editor
     *
     * @param {range} range
     * @returns {void}
     * @event selectrange
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
     * clears toolbar and resets shortcuts
     *
     * @returns
     * @memberof SimpleToolbar
     */
    clearToolbar() {
      if (super.clearToolbar) super.clearToolbar();
      this.clickableElements = {};
    }

    /**
     * registers button when appended to toolbar
     *
     * @param {object} button button node
     * @memberof SimpleToolbar
     */
    deregisterButton(button) {
      if (super.deregisterButton) super.deregisterButton(button);
      (button.tagsArray || []).forEach(
        (tag) => delete this.clickableElements[tag]
      );
    }
    /**
     * registers button when appended to toolbar
     *
     * @param {object} button button node
     * @memberof SimpleToolbar
     */
    registerButton(button) {
      if (super.registerButton) super.registerButton(button);
      //firefox doesn't allow for clipboard button
      if (button.command === "paste" && !navigator.clipboard) {
        button.remove();
        return;
      }
      button.disabled = !this.editor;
      (button.tagsArray || []).forEach(
        (tag) =>
          (this.clickableElements[tag] = (e) => button.tagClickCallback(e))
      );
    }
    /**
     * adds breadcrumbfeature
     *
     */
    _addBreadcrumbs() {
      if (!this.breadcrumbs) {
        this.breadcrumbs = document.createElement(
          "rich-text-editor-breadcrumbs"
        );
        this.breadcrumbs.onselectnode = (e) => this._selectNode(e.detail);
        document.body.appendChild(this.breadcrumbs);
        this.breadcrumbs.addEventListener(
          "breadcrumb-click",
          this._handleBreadcrumb.bind(this)
        );
      }
      this.breadcrumbs.label = this.breadcrumbsLabel;
    }
    /**
     * click handle for breadcrumb buttons
     *
     * @param {*} e
     */
    _handleBreadcrumb(e) {
      if (!this.editor || !this.range) {
        this._rangeChange();
      } else if (e.detail.selectAll) {
        this.selectNodeContents(this.editor);
      } else {
        this.selectNode(e.detail);
      }
    }
    /**
     * handles updated button
     *
     * @param {event} e
     */
    _handleButtonUpdate(e) {
      if (super._handleButtonUpdate) super._handleButtonUpdate(e);
    }
    /**
     * sets up breadcrumbs when editor changes
     * @returns {void}
     */
    _editorChange() {
      if (this.breadcrumbs) {
        this.breadcrumbs.controls = this.controls;
        if (!!this.editor)
          this.editor.parentNode.insertBefore(
            this.breadcrumbs,
            this.editor.nextSibling
          );
      }
      this.buttons.forEach((button) => {
        if (button.command !== "close") button.disabled = !this.editor;
      });
      this.range = undefined;
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
        let ancestor = this.range.commonAncestorContainer,
          ancestorNode =
            ancestor.nodeType == 1 ? ancestor : ancestor.parentNode,
          nodes = [],
          getParentNode = (node) => {
            nodes.push(node);
            if (node.parentNode && node.parentNode !== this.editor)
              getParentNode(node.parentNode);
          };
        if (ancestorNode !== this.editor) getParentNode(ancestorNode);
        nodes.push({
          nodeName: this.breadcrumbsSelectAllLabel,
          selectAll: true,
        });
        this.selectedNode = nodes[0];
        this.selectionAncestors = nodes.reverse();
        (this.buttons || []).forEach((button) => {
          button.range = undefined;
          button.range = this.range;
          button.selectedNode = this.selectedNode;
          button.selectionAncestors = this.selectionAncestors;
        });
        if (this.breadcrumbs) {
          this.breadcrumbs.selectionAncestors = this.selectionAncestors;
          this.breadcrumbs.hidden = this.disconnected;
        }
      }
    }
  };
};
/**
 * `rich-text-editor-toolbar`
 * is a default toolbar for rich text editor 
 * (can customize by extending RichTextEditorToolbarBehaviors)
 *
 * ### Styling
`<rich-text-editor-toolbar>` uses RichTextToolbarStyles constant to set 
SimpleToolbarBehaviors's simple-toolbar/simple-toolbar-button variables.

To further customize a toolbar and its buttons:

Custom property | Description | Default
----------------|-------------|----------
--rich-text-editor-border-color | default border color | #ddd
--rich-text-editor-border-width | default border width | 1px
--rich-text-editor-bg | default toolbar background | #ffffff
--rich-text-editor-button-opacity | default button opacity | 1
--rich-text-editor-button-color | default button color | #444
--rich-text-editor-button-bg | default button background | #ffffff
--rich-text-editor-button-border-color | overrides default border-color for buttons | transparent
--rich-text-editor-button-toggled-opacity | overrides default opacity when button is toggled | 1
--rich-text-editor-button-toggled-color | overrides default text color when button is toggled | #222
--rich-text-editor-button-toggled-bg | overrides default background when button is toggled | #ddd
--rich-text-editor-button-toggled-border-color | overrides default border-color when button is toggled | transparent
--rich-text-editor-button-hover-opacity | overrides default opacity when button is hovered or focused | 1
--rich-text-editor-button-hover-color | overrides default text color when button is hovered or focused  | #000
--rich-text-editor-button-hover-bg | overrides default background when button is hovered or focused | #f0f0f0
--rich-text-editor-button-hover-border-color | overrides default border-color when button is hovered or focused | unset
--rich-text-editor-button-disabled-opacity | overrides default opacity when button is disabled | 1
--rich-text-editor-button-disabled-color | overrides default text color when button is disabled | #666
--rich-text-editor-button-disabled-bg | overrides default background when button is disabled | transparent
--rich-text-editor-button-disabled-border-color | overrides default border-color when button is toggled | transparent
 *
 * @extends RichTextEditorToolbarBehaviors
 * @extends LitElement
 * @customElement
 * @lit-html
 * @lit-element
 * @element rich-text-editor-toolbar
 * @demo ./demo/toolbar.html
 */
class RichTextEditorToolbar extends RichTextEditorToolbarBehaviors(
  LitElement
) {}
window.customElements.define(RichTextEditorToolbar.tag, RichTextEditorToolbar);
export { RichTextEditorToolbar, RichTextEditorToolbarBehaviors };
