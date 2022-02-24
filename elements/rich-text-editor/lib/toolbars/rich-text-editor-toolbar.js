/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { SimpleToolbarBehaviors } from "@lrnwebcomponents/simple-toolbar/simple-toolbar.js";
import { SimpleToolbarButtonBehaviors } from "@lrnwebcomponents/simple-toolbar/lib/simple-toolbar-button.js";
import {
  RichTextStyles,
  RichTextToolbarStyles,
} from "@lrnwebcomponents/rich-text-editor/lib/buttons/rich-text-editor-button.js";
import { RichTextEditorRangeBehaviors } from "@lrnwebcomponents/rich-text-editor/lib/singletons/rich-text-editor-range-behaviors.js";
import "@lrnwebcomponents/rich-text-editor/lib/singletons/rich-text-editor-prompt.js";
import "@lrnwebcomponents/absolute-position-behavior/absolute-position-behavior.js";
import * as shadow from "shadow-selection-polyfill/shadow.js";
import { normalizeEventPath } from "@lrnwebcomponents/utils/utils.js";

window.RichTextEditorToolbars = window.RichTextEditorToolbars || [];
/**
 * RichTextEditorToolbarBehaviors
 *
 * @extends SimpleToolbarBehaviors
 * @extends RichTextToolbarStyles
 * @customElement
 * @class
 * @lit-html
 * @lit-element
 *
 *
 */
const RichTextEditorToolbarBehaviors = function (SuperClass) {
  return class extends RichTextEditorRangeBehaviors(
    SimpleToolbarBehaviors(SuperClass)
  ) {
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
          :host(:focus-within) {
            border-width: var(--rich-text-editor-border-width, 1px);
          }
          #morebutton::part(button) {
            border-radius: var(
              --rich-text-editor-button-disabled-border-radius,
              0px
            );
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
        target: {
          name: "target",
          type: Object,
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
         * pauses history when multiple mutations must count as one change
         */
        enableMarkdown: {
          name: "enableMarkdown",
          attribute: "enable-markdown",
          type: Boolean,
        },

        /**
         * sets a maximum amount of undo/redo steps in history
         */
        historyMax: {
          name: "historyMax",
          attribute: "history-max",
          type: Number,
        },

        /**
         * Tracks history for undo/redo
         */
        history: {
          name: "history",
          type: Array,
        },

        /**
         * pauses history when multiple mutations must count as one change
         */
        historyPaused: {
          name: "historyPaused",
          type: Boolean,
        },

        /**
         * location of undo in history
         */
        historyLocation: {
          name: "historyLocation",
          type: Number,
        },

        /**
         * contains cancelled edits
         */
        __canceledEdits: {
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
        __prompt: {
          type: Object,
        },
        /**
         * whether prompt is open
         */
        __promptOpen: {
          name: "__promptOpen",
          type: Boolean,
        },
      };
    }
    constructor() {
      super();
      // prettier-ignore
      import("@lrnwebcomponents/rich-text-editor/lib/buttons/rich-text-editor-source-code.js");
      // prettier-ignore
      import("@lrnwebcomponents/rich-text-editor/lib/buttons/rich-text-editor-heading-picker.js");
      // prettier-ignore
      import("@lrnwebcomponents/rich-text-editor/lib/buttons/rich-text-editor-underline.js");
      // prettier-ignore
      import("@lrnwebcomponents/rich-text-editor/lib/buttons/rich-text-editor-image.js");
      // prettier-ignore
      import("@lrnwebcomponents/rich-text-editor/lib/buttons/rich-text-editor-link.js");
      // prettier-ignore
      import("@lrnwebcomponents/rich-text-editor/lib/buttons/rich-text-editor-unlink.js");
      this.resetHistory();
      this.config = this.defaultConfig;
      this.clickableElements = {};
      this.breadcrumbsLabel = "Select";
      this.breadcrumbsSelectAllLabel = "All";
      this.__toolbar = this;
      this.historyMax = 10;
      document.addEventListener(
        shadow.eventName,
        this._handleTargetSelection.bind(this.__toolbar)
      );
      this.addEventListener("mousedown", this._handleToolbarMousedown);
    }

    connectedCallback() {
      super.connectedCallback();
      window.RichTextEditorToolbars.push(this);
    }

    /**
     * life cycle, element is disconnected
     * @returns {void}
     */
    disconnectedCallback() {
      super.disconnectedCallback();
      window.RichTextEditorToolbars = window.RichTextEditorToolbars.filter(
        (toolbar) => toolbar !== this
      );
    }

    firstUpdated(changedProperties) {
      if (!this.id) this.id = this._generateUUID();
      super.firstUpdated(changedProperties);
      if (this.hasBreadcrumbs && this.editor)
        this.positionByTarget(this.editor);
      this.__prompt = window.RichTextEditorPrompt.requestAvailability();
      this.__prompt.addEventListener("open", (e) => {
        this.__promptOpen = true;
      });
      this.__prompt.addEventListener("close", (e) => {
        this.__promptOpen = false;
      });
    }

    updated(changedProperties) {
      super.updated(changedProperties);
      changedProperties.forEach((oldValue, propName) => {
        if (propName === "historyMax") {
          let offset = this.history.length - this.historyLocation;
          this.history = this.history.slice(0 - this.historyMax);
          this.historyLocation = Math.min(0, this.history.length - offset);
        }
        if (propName === "range" || propName == "historyPaused")
          this._rangeChanged(this.range, oldValue);
        if (propName === "config") this.updateToolbar();
        if (propName === "editor") this._editorChange();
        if (["editor", "show", "range"].includes(propName))
          this.hidden = this.disconnected;
        if (["breadcrumbs", "sticky"].includes(propName) && !!this.breadcrumbs)
          this.breadcrumbs.sticky = this.sticky;
        if (["history", "historyLocation"].includes(propName))
          this._updateUndoRedoButtons();
      });
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
        subtype: "history-button-group",
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
    get strikethroughButton() {
      return {
        command: "strikeThrough",
        icon: "editor:format-strikethrough",
        label: "Strike Through",
        type: "rich-text-editor-button",
      };
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
     * default config for a remove format button
     *
     * @readonly
     */
    get codeButton() {
      return {
        command: "wrapRange",
        commandVal: "CODE",
        toggles: true,
        label: "Code",
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
        subtype: "basic-inline-button-group",
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
     * default config for a unlink button
     *
     * @readonly
     */
    get unlinkButton() {
      return {
        icon: "mdextra:unlink",
        label: "Remove Link",
        type: "rich-text-editor-unlink",
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
        subtype: "link-button-group",
        buttons: [this.linkButton, this.unlinkButton],
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
        subtype: "clipboard-button-group",
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
        radio: true,
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
        radio: true,
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
        type: "simple-toolbar-button-group",
        subtype: "script-button-group",
        "aria-label": "Subscript and Superscript",
        buttons: [this.subscriptButton, this.superscriptButton],
      };
    }
    /**
     * default config for a symbol button
     *
     * @readonly
     */
    get symbolButton() {
      // prettier-ignore
      import("@lrnwebcomponents/rich-text-editor/lib/buttons/rich-text-editor-symbol-picker.js");
      return {
        symbolTypes: ["symbols"],
        type: "rich-text-editor-symbol-picker",
      };
    }
    /**
     * default config for a symbol button
     *
     * @readonly
     */
    get iconButton() {
      return {
        type: "rich-text-editor-icon-picker",
      };
    }
    /**
     * default config for an emoji button
     *
     * @readonly
     */
    get emojiButton() {
      // prettier-ignore
      import("@lrnwebcomponents/rich-text-editor/lib/buttons/rich-text-editor-emoji-picker.js");
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
        subtype: "insert-button-group",
        buttons: [this.imageButton, this.symbolButton],
      };
    }
    /**
     * default config for an insert button group: image
     *
     * @readonly
     */
    get advancedInsertButtonGroup() {
      return {
        type: "button-group",
        subtype: "advanced-insert-button-group",
        buttons: [this.emojiButton],
      };
    }
    /**
     * default config for a justify left button
     *
     * @readonly
     */
    get justifyLeftButton() {
      return {
        command: "justifyLeft",
        icon: "editor:format-align-left",
        label: "Align Left",
        radio: true,
        type: "rich-text-editor-button",
      };
    }
    /**
     * default config for a justify center button
     *
     * @readonly
     */
    get justifyCenterButton() {
      return {
        command: "justifyCenter",
        icon: "editor:format-align-center",
        label: "Align Center",
        radio: true,
        type: "rich-text-editor-button",
      };
    }
    /**
     * default config for a justify left button
     *
     * @readonly
     */
    get justifyRightButton() {
      return {
        command: "justifyRight",
        icon: "editor:format-align-right",
        label: "Align Right",
        radio: true,
        type: "rich-text-editor-button",
      };
    }
    /**
     * default config for a justify center button
     *
     * @readonly
     */
    get justifyFullButton() {
      return {
        command: "justifyFull",
        icon: "editor:format-align-justify",
        label: "Justify",
        radio: true,
        type: "rich-text-editor-button",
      };
    }
    /**
     * default config for an insert button group: image
     *
     * @readonly
     */
    get justifyButtonGroup() {
      return {
        type: "simple-toolbar-button-group",
        subtype: "advanced-insert-button-group",
        "aria-label": "Text Alignment",
        required: true,
        buttons: [
          this.justifyLeftButton,
          this.justifyCenterButton,
          this.justifyRightButton,
          this.justifyFullButton,
        ],
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
        radio: true,
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
        radio: true,
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
        toggles: true,
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
    get listButtonGroup() {
      return {
        type: "simple-toolbar-button-group",
        subtype: "list-button-group",
        "aria-label": "List Type",
        buttons: [this.orderedListButton, this.unorderedListButton],
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
        subtype: "list-indent-button-group",
        buttons: [
          this.listButtonGroup,
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
        subtype: "save-close-button-group",
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
        subtype: "source-button-group",
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

    /**
     * id of editor currently being controlled
     * @readonly
     * @returns {string}
     */
    get controls() {
      let controls = !this.target ? undefined : this.target.getAttribute("id");
      if (!!this.target) this.setAttribute("controls", controls);
      return controls;
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
        ? !this.target
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
     * mutation observer
     *
     * @readonly
     * @memberof RichTextEditor
     */
    get observer() {
      return new MutationObserver(this._handleTargetMutation.bind(this));
    }

    /**
     * determines if current range is in scope of the target
     *
     * @readonly
     */
    get isRangeInScope() {
      return this._isRangeInScope();
    }
    /**
     * markdown patterns for heading markdown
     *
     * @readonly
     */
    get headingMarkdown() {
      return [1,2,3,4,5,6].map(num=>{
        let pound = () => {
          let str = '';
          for(let i=0;i<num;i++){
            str+='#';
          }
          return str;
        }
        return {
          match: new RegExp(`(\n|^)${pound()} (.+)(\n|$)`,''),
          replace: `<h${num}>$2</h${num}>`,
          excludeAncestors: ["pre", "code"],
          lastChars: ["enter"],
          examples: [`${pound()} Heading Level ${num}`]
        };
      });
    }
    /**
     * markdown patterns for italics markdown
     *
     * @readonly
     */
    get italicsMarkdown() {
      return [
        {
          match: /([^\*]|^)\*(([^\*]*\*{2}[^\*]+\*{2}[^\*]*)+|[^\*]+)\*(?!\*)/,
          replace: "$1<i>$2</i>",
          excludeAncestors: ["em", "i", "pre", "code"],
          lastChars: ["*"],
          examples: ["*italics*"]
        },
        {
          match: /([^_]|^)_(([^_]*_{2}[^_]+_{2}[^_]*)+|[^_]+)_(?!_)/,
          replace: "$1<i>$2</i>",
          excludeAncestors: ["em", "i", "pre", "code"],
          lastChars: ["_"],
          examples: ["_italics_"],
        },
        {
          match: /([^\*]|^|\*{2})\*([^\*]+)\*(?=[^\*])/,
          replace: "$1<i>$2</i>",
          excludeAncestors: ["em", "i", "pre", "code"],
          lastChars: ["*"],
        },
        {
          match: /([^_]|^|_{2})_([^_]+)_(?=[^_])/,
          replace: "$1<i>$2</i>",
          excludeAncestors: ["em", "i", "pre", "code"],
          lastChars: ["_"],
        },
        {
          match: /(\*{2}[^\*]+)\*([^\*]+)\*(?=\*)/,
          replace: "$1<i>$2</i>",
          excludeAncestors: ["em", "i", "pre", "code"],
          lastChars: ["*"],
        },
        {
          match: /(_{2}[^_]+)_([^_]+)_(?=_)/,
          replace: "$1<i>$2</i>",
          excludeAncestors: ["em", "i", "pre", "code"],
          lastChars: ["_"],
        },
      ];
    }
    /**
     * markdown patterns for bold markdown
     *
     * @readonly
     */
    get boldMarkdown() {
      return [
        {
          match: /(_{2}|\*{2})(([^_\*]*(([_\*])([^_\*]+)\5)*[^_\*]?)*)(\1)/,
          replace: "<b>$2</b>",
          excludeAncestors: ["b", "strong", "pre", "code"],
          lastChars: ["*", "_"],
          examples: ['**bold**','__bold__']
        },
      ];
    }
    /**
     * markdown patterns for strikethrough markdown
     *
     * @readonly
     */
    get strikeMarkdown() {
      return [
        {
          match: /~{2}(([^~]|(~[^~]+~))+)~{2}/,
          replace: "<strike>$1</strike>",
          excludeAncestors: ["strike", "pre", "code"],
          lastChars: ["~"],
          examples: ["~~strikethrough~~"]
        },
      ];
    }
    /**
     * markdown patterns for subscript markdown
     *
     * @readonly
     */
    get subscriptMarkdown() {
      return [
        {
          match: /~(([^~]|(~{2}[^~]+~{2})])+)~/,
          replace: "<sub>$1</sub>",
          excludeAncestors: ["sub", "pre", "code"],
          lastChars: ["~"],
          examples: ["~subscript~"],
        },
        {
          match: /(~{2})[^~]*~([^~]+)/,
          replace: "$1<sub>$2</sub>",
          excludeAncestors: ["sub", "pre", "code"],
          lastChars: ["~"],
        },
      ];
    }
    /**
     * markdown patterns for superscript markdown
     *
     * @readonly
     */
    get superscriptMarkdown() {
      return [
        {
          match: /\^(([^\^]|(\^{2}[^\^]+\^{2})])+)\^/,
          replace: "<sup>$1</sup>",
          excludeAncestors: ["sup", "pre", "code"],
          lastChars: ["^"],
          examples: ["^superscript^"],
        },
        {
          match: /(\^{2})[^\^]*\^([^\^]+)/,
          replace: "$1<sup>$2</sup>",
          excludeAncestors: ["sup", "pre", "code"],
          lastChars: ["^"],
        },
      ];
    }
    /**
     * markdown patterns for mark markdown
     *
     * @readonly
     */
    get markMarkdown() {
      return [
        {
          match: /={2}([^=]+)={2}/,
          replace: "<mark>$1</mark>",
          excludeAncestors: ["mark", "pre", "code"],
          lastChars: ["="],
          examples: ["==mark (highlight)=="],
        },
      ];
    }

    /**
     * markdown patterns for link markdown
     *
     * @readonly
     */
    get linkMarkdown() {
      return [
        {
          match: /&lt;(#\S+|(https?:\/\/|\.{1,2}\/)+[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*))&gt;/,
          replace: '<a href="$1">$1</a>',
          excludeAncestors: ["a", "pre", "code"],
          lastChars: [">"],
          examples: ["<http://haxtheweb.org>"],
        },
        {
          match: /([^!])\[([^\]]+)\]\((#\S+|(https?:\/\/|\.{1,2}\/)+[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)(?=\)))\)/,
          replace: '$1<a href="$3">$2</a>',
          excludeAncestors: ["a", "pre", "code"],
          lastChars: [")"],
          examples: ["[HAX](http://haxtheweb.org)"],
        },
        {
          match: /\[([^\]]+)\]\((?:mailto\:)?(\w+@(\w+\.)+\w{2,4})\)/,
          replace: '<a href="mailto:$2">$1</a>',
          excludeAncestors: ["a", "pre", "code"],
          lastChars: [")"],
          examples: ["[My Email](email@domain.com)"],
        },
        {
          match: /&lt;(?:mailto\:)?(\w+@(\w+\.)+\w{2,4})\&gt;/,
          replace: '<a href="mailto:$1">$1</a>',
          excludeAncestors: ["a", "pre", "code"],
          lastChars: [">"],
          examples: ["<email@domain.com>"],
        },
      ];
    }
    /**
     * markdown patterns for image markdown
     *
     * @readonly
     */
    get imageMarkdown() {
      return [
        {
          match: /!\[([^\]]+)\]\(((https?:\/\/|\.{1,2}\/)+[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)(?=\)))\)/,
          replace: '<img alt="$1" src="$2"/>',
          excludeAncestors: ["pre", "code"],
          lastChars: [")"],
          examples: ["![Black Labrador Puppy](https://picsum.photos/id/237/200/300)"],
        },
      ];
    }
    /**
     * markdown patterns for code markdown
     *
     * @readonly
     */
    get codeMarkdown() {
      return [
        {
          match: /([^`])`([^`]+)`(?!`)/,
          replace: "$1<code>$2</code>",
          excludeAncestors: ["pre", "code"],
          lastChars: ["`"],
          examples: ["`code`"],
        },
      ];
    }
    /**
     * markdown patterns for pre markdown
     *
     * @readonly
     */
    get preformattedMarkdown() {
      return [
        {
          match: /`{3}/,
          command: "formatBlock",
          commandVal: "pre",
          excludeAncestors: ["code"],
          lastChars: ["`"],
        },
        {
          match: /`{3}([^`]+)`{3}(?!`)/,
          replace: "<pre>$1</pre>",
          excludeAncestors: ["pre", "code"],
          lastChars: ["`"],
          examples: ["```preformatted```"],
        },
      ];
    }
    /**
     * markdown patterns for blockquote markdown
     *
     * @readonly
     */
    get blockquoteMarkdown() {
      return [
        {
          match: /(\n|^)(\>|&gt;) (.+)(\n|$)/,
          replace: "<blockquote>$3</blockquote>",
          excludeAncestors: ["pre", "code"],
          lastChars: ["enter"],
          examples: ["> blockquote"],
        },
      ];
    }
    /**
     * TODO: regex for blockquote markdown
     *
     * @readonly
     */
    get listMarkdown() {
      return [
        {
          match: /(\n|^)- (.+)(\n|$)/,
          replace: "<ul><li>$2</li></ul>",
          excludeAncestors: ["pre", "code"],
          lastChars: ["enter"],
          examples: ["* bulleted list item"],
        },
        {
          match: /(\n|^)1\. (.+)(\n|$)/,
          replace: "<ol><li>$2</li></ol>",
          excludeAncestors: ["pre", "code"],
          lastChars: ["enter"],
          examples: ["1. numbered list item"],
        },
      ];
    }
    /**
     * markdown patterns for horizontal rule markdown
     *
     * @readonly
     */
    get horizontalRuleMarkdown() {
      return [
        {
          match: /(\n|^)[-\*|_]{3,}(\n|$)/,
          replace: "<hr>",
          excludeAncestors: ["pre", "code"],
          lastChars: ["enter"],
          examples: ["---"],
        },
      ];
    }
    /**
     * markdown patterns for horizontal rule markdown
     *
     * @readonly
     */
    get footnoteMarkdown() {
      return [
        {
          match: /\[([^\]]+)\]\[([^\]]+)\]/,
          replace: '$1<sup>(<a href="#$2">$2</a>)</sup>',
          excludeAncestors: ["pre", "code", "a"],
          lastChars: ["]"],
          examples: ["see footnote[^1]"],
        },
        {
          match: /(\n|^)\[([^\]]+)\]: (.+)(\n|$)/,
          replace: "$1. $2",
          excludeAncestors: ["pre", "code", "a"],
          lastChars: ["enter"],
          examples: ["[^1]: This is a footnote."],
        },
      ];
    }
    /**
     * markdown patterns for emojis
     *
     * @readonly
     */
    get mdashReplacement() {
      let wordboundaries = " ,.;:'')*!-";
      return [
        {
          match: /(\w+)--(\w+\W)/,
          replace: "$1&mdash;$2",
          excludeAncestors: ["pre", "code", "a"],
          lastChars: wordboundaries.split(""),
          examples: ["The emdash--an incredibly versatile punctuation mark that can be used instead of parentheses, commas, colons, or quotation marks in a sentence."],
        },
      ];
    }
    /**
     * markdown patterns for emojis
     *
     * @readonly
     */
    get emojiMarkdown() {
      import("@lrnwebcomponents/simple-emoji-list/simple-emoji-list.js").then(
        (module) => {
          this.SimpleEmojiList = module.SimpleEmojiList;
          let getEmojisByMarkdown = () => {
            let obj = {},
              patterns = [];
            (module.SimpleEmojiList || []).forEach((emoji) => {
              let shortcodes = emoji.shortcodes || [ emoji.description || emoji.character || "zzz"];
              shortcodes.forEach(emojidesc => {
                //converts emoji description to markdown
                let emojimd = `:${emojidesc
                  .toLowerCase()
                  .replace(/\s+/g, "_")
                  .replace(/([\+\*\?\^\$\\\.\[\]\{\}\(\)\|\/])/g,'\\$1')}:`;
                //handles emoji with identical descriptions
                if (emojimd && obj[emojimd]) {
                  let ctr = 2,
                    test = `${emojimd}-${ctr}`;
                  while (obj[test]) {
                    ctr++;
                    test = `${emojimd}-${ctr}`;
                  }
                  emojimd = test;
                }
                //adds emoji markdown data
                if (emojimd) {
                  obj[emojimd] = emoji;
                  patterns.push({
                    name: emoji.description,
                    match: new RegExp(emojimd, "g"),
                    replace: emoji.character,
                    excludeAncestors: ["pre", "code"],
                    lastChars: [":"],
                    examples: [emojimd]
                  });
                }

              })  
            });
            return patterns;
          };
          if (module.SimpleEmojiList)
            window.richTextEditorEmojiMarkdown =
              window.richTextEditorEmojiMarkdown || getEmojisByMarkdown();
        }
      );
      return window.richTextEditorEmojiMarkdown || [];
    }
    /**
     * markdown patterns for symbols
     *
     * @readonly
     */
    get symbolMarkdown() {
      import("@lrnwebcomponents/simple-symbol-list/simple-symbol-list.js").then(
        (module) => {
          let getSymbolsByMarkdown = () => {
            let obj = {},
              patterns = [];
            (module.SimpleSymbolList || []).forEach((symbol) => {
              let symboldesc = symbol.description || symbol.character || "zzz",
                //converts symbol description to markdown
                symbolmd = `;${symboldesc
                  .toLowerCase()
                  .replace(/\s+/g, "_")
                  .replace(/([\+\*\?\^\$\\\.\[\]\{\}\(\)\|\/])/g,'\\$1')};`;
              //handles symbol with identical descriptions
              if (symbolmd && obj[symbolmd]) {
                let ctr = 2,
                  test = `${symbolmd}-${ctr}`;
                while (obj[test]) {
                  ctr++;
                  test = `${symbolmd}-${ctr}`;
                }
                symbolmd = test;
              }
              //adds emoji markdown data
              if (symbolmd) {
                obj[symbolmd] = symbol;
                patterns.push({
                  match: new RegExp(symbolmd, "g"),
                  replace: symbol.character,
                  excludeAncestors: ["pre", "code"],
                  lastChars: [";"],
                  examples: [symbolmd]
                });
              }
            });
            return patterns;
          };
          if (module.SimpleSymbolList)
            window.richTextEditorSymbolMarkdown =
              window.richTextEditorSymbolMarkdown || getSymbolsByMarkdown();
        }
      );
      return window.richTextEditorSymbolMarkdown || [];
    }
    /**
     * markdown patterns for icons
     *
     * @readonly
     */
    get simpleIconMarkdown(){
      import("@lrnwebcomponents/simple-icon/lib/simple-iconset.js").then(module=>{
        
        let icons = module.SimpleIconsetStore && module.SimpleIconsetStore.iconlist ? module.SimpleIconsetStore.iconlist : [];
        if (icons) window.richTextEditorIconMarkdown = window.richTextEditorIconMarkdown 
          || icons.map(icon=>{
            let iconmd = `!(${icon})`.replace(/([\+\*\?\^\$\\\.\[\]\{\}\(\)\|\/])/g,'\\$1');
            return {
              match: new RegExp(iconmd, "g"),
              replace: `<simple-icon-lite icon="${icon}"></simple-icon-lite>`,
              excludeAncestors: ["pre", "code"],
              lastChars: [")"],
              examples: [iconmd]
            }
          });
      });
      return window.richTextEditorIconMarkdown || [];
    }
    /**
     * a series of markdown patterns
     *
     * @readonly
     */
    get markdownPatterns(){
      return [
        ...this.headingMarkdown,
        ...this.imageMarkdown,
        ...this.linkMarkdown,
        ...this.boldMarkdown,
        ...this.italicsMarkdown,
        ...this.strikeMarkdown,
        ...this.markMarkdown,
        ...this.subscriptMarkdown,
        ...this.superscriptMarkdown,
        ...this.codeMarkdown,
        ...this.preformattedMarkdown,
        ...this.blockquoteMarkdown,
        ...this.listMarkdown,
        ...this.horizontalRuleMarkdown,
        ...this.footnoteMarkdown,
      ];
    }
    /**
     * default regexes for markdown support
     *
     * @readonly
     */
    get defaultPatterns() {
      return [
        ...this.markdownPatterns,
        ...this.emojiMarkdown,
        ...this.symbolMarkdown,
        ...this.simpleIconMarkdown,
        ...this.mdashReplacement
      ];
    }
    /**
     * object with lists of regexes by last key so only applicable regexes are checked
     *
     * @readonly
     */
    get replacementsByLastKey() {
      let regexes = {};
      this.defaultPatterns.forEach((regex) => {
        let keys =
          !regex.lastChars || regex.lastChars.length == 0
            ? [""]
            : regex.lastChars;
        keys.forEach((key) => {
          if (!regex.replace || !regex.match) return;
          let char = key == "" ? "any" : key == " " ? "space" : key;
          regexes[char] = regexes[char] || [];
          regexes[char].push(regex);
        });
      });
      return regexes;
    }
    /**
     *
     * object with lists of commands by last key so only applicable commands are checked
     *
     * @readonly
     */
    get commandsByLastKey() {
      let regexes = {};
      this.defaultPatterns.forEach((regex) => {
        let keys =
          !regex.lastChars || regex.lastChars.length == 0
            ? [""]
            : regex.lastChars;
        keys.forEach((key) => {
          if (!!regex.replace || !regex.match) return;
          let char = key == "" ? "any" : key == " " ? "space" : key;
          regexes[char] = regexes[char] || [];
          regexes[char].push(regex);
        });
      });
      return regexes;
    }

    get pauseHistoryUpdates() {
      return (
        this.historyPaused ||
        !this.target ||
        !this.target.getAttribute("contenteditable") ||
        this.target.getAttribute("contenteditable") != "true" ||
        !this.__prompt.hidden ||
        !this.__highlight.hidden ||
        this.__highlight.isActiveForEditor(this.target)
      );
    }
    /**
     * determines if range is in scope of editor
     *
     * @param {object} [range=this.range] range object
     * @returns {boolean}
     */
    _isRangeInScope(range = this.range) {
      let rangeParent = range ? this.rangeNodeOrParentNode(range) : false,
        targetIsRangeParent = this.target && this.target == rangeParent,
        targetIsRangeAncestor =
          this.target && rangeParent && this.target.contains(rangeParent);
      return targetIsRangeParent || targetIsRangeAncestor;
    }

    /**
     * cancels edits to active editor
     * @returns {void}
     * @event cancel
     */
    cancel() {
      this.resetHistory();
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
      this.resetHistory();
      this.target = undefined;
      this.positionByTarget(false);
      this.dispatchEvent(
        new CustomEvent("close", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: this,
        })
      );
    }

    /**
     * fires when editor changed
     * @event editor-change
     */
    _editorChanged() {
      this.resetHistory();
      this.updateHistory();
      this.dispatchEvent(
        new CustomEvent("editor-change", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: this,
        })
      );
    }

    /* ------- RANGES -------- */

    /**
     * function for getting range;
     * can be overriden
     */
    getRange() {
      let shadowRoot = (el) => {
        let parent = el.parentNode;
        return parent ? shadowRoot(parent) : el;
      };
      try {
        this.range = shadowRoot(this.target)
          ? shadow.getRange(shadowRoot(this.target))
          : undefined;
      } catch (e) {
        this.range = undefined;
      }
      return this.range;
    }
    getSelection() {
      return window, getSelection();
    }
    /**
     * maintains consistent range info across toolbar and target
     *
     * @param {object} editor
     * @param {range} range
     * @memberof RichTextEditorManager
     */
    updateRange(target, range = this.range) {
      if (!target) return;
      if (!target.range) target.range = range;
    }
    /**
     * updates buttons and fires when rane changes
     * @event range-changed
     * @param {event} e
     */
    _rangeChanged(newValue, oldValue) {
      if (newValue !== oldValue && !this.historyPaused)
        this._updateButtonRanges(this._isRangeInScope(oldValue));
      this.dispatchEvent(
        new CustomEvent("range-changed", {
          bubbles: true,
          composed: true,
          cancelable: true,
          detail: this,
        })
      );
    }

    /* ------- BUTTONS AND BREADCRUMBS -------- */
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
      button.__toolbar = this;
      button.disabled = !this.target;
      (button.tagsArray || []).forEach((tag) => {
        if (!!tag && !!button.tagClickCallback)
          this.clickableElements[tag] = this.clickableElements[tag] || button;
      });
      this._updateUndoRedoButton(button);
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
        document.body.appendChild(this.breadcrumbs);
      }
      this.breadcrumbs.label = this.breadcrumbsLabel;
      return this.breadcrumbs;
    }

    /**
     * Generate a UUID
     * @returns {string} unique id
     */
    _generateUUID() {
      let hex = Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
      return "rte-" + "ss-s-s-s-sss".replace(/s/g, hex);
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
     * creates a div element to contain/group buttons based on config object
     *
     * @param {object} config object containing configuration for a group of buttons
     * @returns {object} div element as a button group
     * @memberof SimpleToolbar
     */
    _renderButtonGroup(config) {
      let group = super._renderButtonGroup(config);
      if (config.subtype) group.classList.add(config.subtype);
      return group;
    }

    /**
     * updates disabled property of undo and redo buttons based on history
     */
    _updateUndoRedoButtons() {
      (this.buttons || []).forEach((button) =>
        this._updateUndoRedoButton(button)
      );
    }
    /**
     *
     * updates disabled property of an undo or redo button based on history
     *
     * @param {*} button
     */
    _updateUndoRedoButton(button) {
      if (button.command == "undo") {
        button.disabled = !this.history || this.historyLocation < 1;
      } else if (button.command == "redo") {
        button.disabled =
          !this.history || this.historyLocation > this.history.length - 2;
      }
    }

    /**
     * updates buttons with selected range
     * @returns {void}
     */
    _updateButtonRanges(clearEmptyRanges) {
      if (this.isRangeInScope) {
        let nodes = [],
          getParentNode = (node) => {
            if (
              (node.tagName || "").toLowerCase() !==
              "rich-text-editor-highlight"
            )
              nodes.push(node);
            if (node.parentNode && node.parentNode !== this.target)
              getParentNode(node.parentNode);
          };
        if (this.rangeNodeOrParentNode(this.range) !== this.target)
          getParentNode(this.rangeNodeOrParentNode(this.range));
        nodes.push({
          nodeName: this.breadcrumbsSelectAllLabel,
          selectAll: this.target,
        });
        this.selectedNode = nodes[0];
        this.selectionAncestors = nodes.reverse();
        if (this.breadcrumbs) {
          this.breadcrumbs.selectionAncestors = this.selectionAncestors;
          this.breadcrumbs.hidden = this.disconnected;
          this.breadcrumbs.editor = this.editor;
        }
        (this.buttons || []).forEach((button) => {
          button.range = undefined;
          button.range = this.range;
          button.selectedNode = this.selectedNode;
          button.selectionAncestors = this.selectionAncestors;
        });
      } else if (clearEmptyRanges) {
        if (this.breadcrumbs) {
          this.breadcrumbs.selectionAncestors = undefined;
        }
        (this.buttons || []).forEach((button) => {
          button.range = undefined;
        });
      }
    }
    /* ------- TARGET -------- */
    /**
     * undo for canceled edits
     *
     * @param {object} editor
     * @memberof RichTextEditorManager
     */
    cancelEdits(target = this.target) {
      this.revertTarget(target);
      this.target(editor, false);
    }

    get enabledTargetHandlers() {
      return {
        keydown: this._handleTargetKeyDown.bind(this),
      };
    }
    /**
     * moves toolbar into position before the target
     * (can be overriden for custom positioning)
     * @param {object} target
     */
    positionByTarget(target) {
      if (!!target) {
        target.parentNode.insertBefore(this, target);
        this.slot = target.slot;
        if (this.hasBreadcrumbs) {
          this.breadcrumbs = this.breadcrumbs || this._addBreadcrumbs();
          this.target.parentNode.insertBefore(
            this.breadcrumbs,
            this.target.nextSibling
          );
          this.breadcrumbs.slot = target.slot;
        }
      } else {
        document.body.append(this);
        this.slot = undefined;
        if (this.breadcrumbs) {
          document.body.append(this.breadcrumbs);
          this.breadcrumbs.slot = undefined;
        }
      }
    }

    /**
     * disables editing
     *
     * @param {object} editor
     * @memberof RichTextEditorManager
     */
    enableEditing(target = this.editor) {
      let handlers = this.enabledTargetHandlers;
      if (!!target && !target.hidden && !target.disabled) {
        if (target.makeSticky) target.makeSticky(this.sticky);
        this.positionByTarget(target);
        if (
          !target.getAttribute("contenteditable") ||
          target.getAttribute("contenteditable") == true
        )
          target.setAttribute("contenteditable", "true");

        Object.keys(handlers).forEach((handler) =>
          target.addEventListener(handler, handlers[handler])
        );

        this.setCanceledEdits();
        this.updateRange(target);
        this.observeChanges(true);

        this.getRoot(target).onselectionchange = (e) => {
          if (!this.__promptOpen) this.updateRange(target, this.getRange());
        };

        this.dispatchEvent(
          new CustomEvent("enabled", {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: (this.target.innerHTML || "")
              .replace(/<!--[^(-->)]*-->/g, "")
              .trim(),
          })
        );
        target.tabindex = 0;
        if (this.history.length < 1) this.updateHistory();
      }
    }

    disableEditing(target = this.target) {
      let handlers = this.enabledTargetHandlers,
        range = this.getRange();
      if (!!target) {
        if (!!range) range.collapse(false);
        this.__highlight.emptyContents();
        this.getRoot(target).onselectionchange = undefined;
        this.observeChanges(false);
        if (this.__source) this.__source.toggle(false);
        if (
          !!target.getAttribute("contenteditable") ||
          target.getAttribute("contenteditable") == true
        )
          target.removeAttribute("contenteditable");

        Object.keys(handlers).forEach((handler) =>
          target.removeEventListener(handler, handlers[handler])
        );

        if (target.makeSticky) target.makeSticky(false);
        this.dispatchEvent(
          new CustomEvent("disabled", {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: (this.target.innerHTML || "")
              .replace(/<!--[^(-->)]*-->/g, "")
              .trim(),
          })
        );
        target.tabindex = -1;
      }
    }

    /**
     * make an new editable element
     *
     * @param {object} editor an HTML object that can be edited
     * @returns {void}
     */
    insertNew(target) {
      let content = document.createElement("rich-text-editor");
      target.parentNode.insertBefore(content, target);
      content.appendChild(target);
    }
    /**
     * set observer on or off
     *
     * @param {boolean} [on=true]
     * @memberof RichTextEditor
     */
    observeChanges(on = true) {
      if (on) {
        this.observer.observe(this.target, {
          attributes: true,
          childList: true,
          subtree: true,
          characterData: false,
        });
      } else {
        if (this.observer) this.observer.disconnect;
      }
    }
    /**
     * revert content to before editing=true
     *
     * @memberof RichTextEditor
     */
    revertTarget(target = this.target) {
      if (this.target) this.target.innerHTML = this.__canceledEdits;
    }

    /**
     * sanitizesHTML
     * override this function to make your own filters
     *
     * @param {string} html html to be pasted
     * @returns {string} filtered html as string
     */
    sanitizeHTML(html = "") {
      let regex = "<body(.*\n)*>(.*\n)*</body>";
      if (html.match(regex) && html.match(regex).length > 0)
        html = html.match(regex)[0].replace(/<\?body(.*\n)*\>/i);
      return html;
    }
    /**
     * holds on to edits so cancel willwork
     *
     * @param {string} [html=this.innerHTML]
     * @memberof RichTextEditor
     */
    setCanceledEdits(html) {
      this.__canceledEdits = html
        ? html
        : this.target && this.target.innerHTML
        ? this.target.innerHTML
        : "";
    }
    setTarget(target) {
      let handlers = this.targetHandlers(target),
        oldTarget = this.target;
      if (!!target) {
        let oldTarget = this.target;
        if (oldTarget && oldTarget.getAttribute("role") == "textbox")
          oldTarget.removeAttribute("role");
        target.setAttribute("role", "textbox");
        if (oldTarget !== target) {
          if (!!oldTarget) this.unsetTarget(oldTarget);
          Object.keys(handlers).forEach((handler) =>
            target.addEventListener(handler, handlers[handler])
          );
          this.getRoot(target).onselectionchange = (e) => {
            if (!this.__promptOpen) this.updateRange(target, this.getRange());
          };
          this.target = target;
          this.enableEditing(target);
        }
      }
      this.updateRange(this.target);
      if (this.breadcrumbs) this.breadcrumbs.controls = this.controls;
      this.buttons.forEach((button) => {
        if (button.command !== "close") button.disabled = !this.target;
      });
      if (target !== oldTarget) {
        this.range = undefined;
        this._rangeChanged();
      }
    }
    unsetTarget(target = this.target) {
      let handlers = this.targetHandlers(target);
      this.disableEditing(target);
      Object.keys(handlers).forEach((handler) =>
        target.removeEventListener(handler, handlers[handler])
      );
      this.target = undefined;
    }
    /**
     * determines if target is empty
     *
     * @returns {string}
     * @memberof RichTextEditor
     */
    targetEmpty() {
      return (
        !this.target ||
        !this.target.innerHTML ||
        this.trimHTML(this.target) == ""
      );
    }

    /**
     * list of event handlers for a given target
     *
     * @param {*} target
     * @returns
     */
    targetHandlers(target) {
      return {
        dblclick: (e) => this._handleTargetClick(target, e),
        focus: (e) => this._handleTargetFocus(target, e),
        blur: (e) => this._handleTargetBlur(e),
        keydown: (e) => this._handleShortcutKeys(e),
        keyup: (e) => this._handlePatterns(e),
        paste: (e) => this._handlePaste(e),
      };
    }
    /**
     * gets cleaned HTML from the target
     *
     * @returns {string}
     * @memberof RichTextEditor
     */

    get targetHTML() {
      return !!this.target
        ? this.outdentHTML(this.target.innerHTML)
        : undefined;
    }

    htmlMatchesTarget(html) {
      let outdentedHTML = !!html ? this.outdentHTML(html) : undefined,
        cleanHTML = outdentedHTML
          ? outdentedHTML.replace(/\s+/gm, "")
          : undefined,
        cleanTarget = this.targetHTML
          ? this.targetHTML.replace(/\s+/gm, "")
          : undefined;
      return cleanHTML && cleanTarget && cleanTarget.localeCompare(cleanHTML);
    }

    _handleTargetClick(target, e) {
      let eventPath = normalizeEventPath(e);
      if (!target || target.disabled) return;
      if (this.target !== target) {
        e.preventDefault();
        this.setTarget(target);
      } else {
        let els = Object.keys(this.clickableElements || {}),
          matched = false;
        eventPath.forEach((target) => {
          if (matched) return;
          let tagname = (target.tagName || "").toLowerCase();
          if (tagname && els.includes(tagname)) {
            matched = true;
            e.preventDefault();
            let ee = {
              ...e,
              detail: target,
              eventPath: eventPath,
            };
            this.clickableElements[tagname].tagClickCallback(ee);
          }
        });
      }
      this.range = this.getRange();
      this.updateRange();
    }

    _handleTargetBlur(e) {
      if (this.target && !this.__highlight.isActiveForEditor(this.target)) {
        this._addHighlight();
      }
    }
    _handleTargetFocus(target, e) {
      this._removeHighlight();
      if (!this.__promptOpen && !target.disabled) {
        this.setTarget(target);
      }
    }

    _handleToolbarMousedown(e) {
      //stops mousedown from bubbling up and triggering HAX focus logic
      e.stopImmediatePropagation();
    }
    /**
     * checks for markdown and replaces
     *
     * @param {event} e keypress event
     */
    _handlePatterns(e) {
      if (!this.enableMarkdown) return;
      let keepPaused = this.historyPaused;
      this.historyPaused = true;

      //drop a placeholder into editor so we know where range is
      let range = this.getRange(),
        node = !range
          ? false
          : e.key == "Enter"
          ? range.commonAncestorContainer.previousElementSibling
          : range.commonAncestorContainer,
        id = "range-placeholder-" + Date.now(),
        span = document.createElement("span"),
        spanHTML = `<span id="${id}"></span>`,
        placeholderSearch = new RegExp(spanHTML),
        target = node,
        found = false,
        rangeClone;
      span.id = id;
      range.insertNode(span);
      rangeClone = range.cloneRange();

      //adjust range if last key was enter key
      if (e.key == "Enter") {
        rangeClone.selectNode(node);
      } else {
        rangeClone.setStartBefore(rangeClone.startContainer);
      }
      //make a clone of the range
      let cloneContents = rangeClone.cloneContents(),
        //clean up copy of clone text
        cloneText = cloneContents.textContent
          ? cloneContents.textContent.replace(/\s*\n\s*$/, "\n")
          : "",
        //last character of pattern
        searchChar =
          e.key == "Enter"
            ? cloneText.charAt(cloneText.length - 1)
            : cloneText.charAt(cloneText.length - 2),
        //last character before end of range
        rangeChar =
          e.key == "Enter" ? "enter" : cloneText.charAt(cloneText.length - 1),
        //gets a list of regexes filtered by matching last key so we don't have to text every regex
        listByLastKey = (key, list) => {
          let char = e.key == "Enter" ? "enter" : key == " " ? "space" : key,
            //get anything that specifically ends with key
            lastChar = rangeChar !== "" && list[char] ? list[char] : [],
            //get everything that does not specify a key
            noKey = list["any"] || [],
            //if enter key, get everything that ends in search character
            enterKey =
              e.key == "Enter" && list[searchChar] ? list[searchChar] : [];
          return [...lastChar, ...enterKey, ...noKey];
        },
        //regex commands to text
        commands = listByLastKey(rangeChar, this.commandsByLastKey),
        //regex replacement patterns to test
        replacements = listByLastKey(searchChar, this.replacementsByLastKey),
        //make a clone of specficied node to search for matches
        searchNodeClone,
        cloneHTML,
        cloneSplit,
        cloneSearch,
        makeSearchClone = (searchNode) => {
          searchNodeClone = searchNode.cloneNode(true);
          let html = searchNodeClone && searchNodeClone.nodeType == 1;
          cloneHTML =
            searchNodeClone && html
              ? searchNodeClone.innerHTML
              : searchNodeClone
              ? searchNodeClone.textContent
              : false;
          //clean up extra spacing
          if (html && cloneHTML)
            cloneHTML = cloneHTML.replace(/^(&nbsp;\s?)+/, "");
          if (cloneHTML)
            cloneHTML = cloneHTML.replace(/\s+/, " ").replace(/\s*\n\s*/, "\n");

          cloneSplit = cloneHTML ? cloneHTML.split(placeholderSearch) : [];
          cloneSearch = cloneSplit[0] ? cloneSplit[0] : false;

          //convert &nbsp;
          if (html && cloneSearch)
            cloneSearch = cloneSearch.replace(/&nbsp;$/, " ");
        },
        //node any matches that are valid
        excludeAncestors,
        ignoreMatches,
        match,
        checkMatch = (regex, searchNode) => {
          excludeAncestors = (regex.excludeAncestors || []).join();
          ignoreMatches =
            searchNode && excludeAncestors.length > 0
              ? searchNode.closest && searchNode.closest(excludeAncestors)
              : false;
          match =
            !!cloneSearch &&
            cloneSearch.length > 1 &&
            regex.match &&
            !ignoreMatches
              ? cloneSearch.match(regex.match)
              : false;
        },
        //search a given node for regex replacements
        searchReplacements = (searchNode) => {
          makeSearchClone(searchNode);
          replacements.forEach((regex) => {
            if (!searchNode || !searchNode.cloneNode) return;
            let matchIndex = e.key == "Enter" ? 0 : 1;
            checkMatch(regex, searchNode);
            if (
              match &&
              match[0] &&
              cloneSearch.length -
                match[0].length -
                cloneSearch.lastIndexOf(match[0]) ==
                matchIndex
            ) {
              found = true;
              if (regex.replace)
                cloneSplit[0] = cloneSplit[0].replace(
                  regex.match,
                  regex.replace
                );
            }
          });

          //update HTML with replacement
          if (found) {
            range.selectNode(searchNode);
            range.setEndBefore(span);
            this._handleCommand("insertHTML", cloneSplit[0]);
            span.remove();
            if (searchNodeClone) searchNodeClone.remove();
          }
        };

      //only search the common ancestor node of the range for matching commans
      commands.forEach((regex) => {
        if (!node || !node.cloneNode) return;
        makeSearchClone(node);
        checkMatch(regex, node, true);

        //run the matching command
        if (match && match[0]) {
          let commandVal = regex.commandVal;
          span.remove();
          range.setStart(
            range.startContainer,
            range.startOffset - match[0].length
          );
          range.deleteContents();
          if (
            regex.command === "formatBlock" &&
            range.commonAncestorContainer.closest(commandVal)
          ) {
            commandVal = "p";
          } else if (
            regex.command === "wrapRange" &&
            range.commonAncestorContainer.closest(commandVal)
          ) {
            commandVal = "span";
          }
          this._handleCommand(regex.command, commandVal, range);
          if (searchNodeClone) searchNodeClone.remove();
          found = true;
        }
      });

      //only search replacements if we didn't alread execute a comand
      //starting with a target, check for matches
      //expand search to parent if not found
      while (
        !found &&
        !!target &&
        target !== this.target &&
        !!target.parentNode
      ) {
        searchReplacements(target);
        target = target.parentNode;
      }
      if (!found) searchReplacements(this.target);

      //if enter key, then go to next node
      if (found && e.key == "Enter") {
        let sibs =
            range && range.commonAncestorContainer
              ? [...range.commonAncestorContainer.childNodes]
              : [],
          currentNode =
            range && range.endOffset ? sibs[range.endOffset] : false,
          nextNode = currentNode.nextElementSibling;
        if (nextNode) {
          nextNode.append(span);
          this.selectNode(span, this.getRange());
        }
      }

      //remove placeholder from editor
      if (span) span.remove();
      this.historyPaused = keepPaused;
      if (found) this.updateHistory();
    }

    _handleTargetKeypress(e) {
      if (this.targetEmpty() && e.key) {
        this.innerHTML = e.key
          .replace(">", "&gt;")
          .replace("<", "&lt;")
          .replace("&", "&amp;");
        this.range = this.getRange();
        this.range.selectNodeContents(this);
        this.range.collapse();
      }
    }
    _handleTargetMutation(mutations = []) {
      this._handleTargetSelection();
      let target = this.target,
        update = false;
      (mutations || []).forEach((mutation) => {
        if (
          mutation.type == "attributes" &&
          ["disabled", "hidden", "contenteditable"].includes(
            mutation.attributeName
          )
        ) {
          if ((target.disabled || target.hidden) && target.contenteditable) {
            this.disableEditing(target);
          } else if (
            !target.disabled &&
            !target.hidden &&
            target.contenteditable
          ) {
            this.enableEditing(target);
          }
        } else if (!this.historyPaused) {
          let nodes = [
              ...(mutation.addedNodes || []),
              ...(mutation.removedNodes || []),
            ],
            filtered;
          filtered = nodes.filter(
            (node) =>
              !node.getAttribute ||
              !node.getAttribute("id") ||
              node.getAttribute("id").indexOf("range-placeholder") < 0
          );
          if (filtered.length > 0) update = true;
        }
      });
      if (update && !this.pauseHistoryUpdates) this.updateHistory();
    }
    _handleTargetSelection(e) {
      if (!this.__promptOpen) this.range = this.getRange();
    }
    _handlePaste(e) {
      e.stopImmediatePropagation();
      this.pasteFromClipboard();
    }

    /**
     * undo last action
     *
     */
    undo() {
      this._restoreFromHistory();
    }

    /**
     * redo last action
     *
     */
    redo() {
      this._restoreFromHistory(1);
    }

    /**
     * resets history, pausing, and location
     *
     */
    resetHistory() {
      this.historyLocation = -1;
      this.history = [];
      this.historyPaused = false;
    }

    /**
     * adds new changes to history as long as history is not paused for complex changes
     *
     * @param {string} [description="change"] description of the type of change (to eventually allow for multi-step undo)
     * @param {string} [changes=this.targetHTML] html to save as a change
     * @param {object} [range=this.getRange()] current range
     * @returns
     */
    updateHistory(description = "change") {
      //only update history if not paused
      if (this.pauseHistoryUpdates) return;

      //get range details
      this.getRange();
      let range = this.getRangeForCopy(this.target);

      //get start and end of history based on maximum amount saved
      let prev = this.history[this.historyLocation],
        html = this.target.innerHTML;

      if (prev && prev.html == html) return;

      //clear history after current location and add changes
      this.history = [
        ...this.history.slice(0 - (this.historyMax - 1)),
        {
          type: description,
          html: html,
          range: range,
        },
      ];

      //set location to current changes
      this.historyLocation = this.history.length - 1;
    }

    /**
     * restores target HTML from history before or after the current point
     *
     * @param {number} [direction=-1] direction relative to current location of history, eg. -1 for undo
     */
    _restoreFromHistory(direction = -1) {
      this.historyLocation = this.historyLocation + direction;
      if (-1 < this.historyLocation < this.history.length) {
        let history = this.history[this.historyLocation],
          inRange = this._isRangeInScope(this.range);

        if (!history || !history.html) return;
        this.historyPaused = true;
        this.target.innerHTML = history.html;
        let range = this.getRangeFromCopy(this.target, history.range);
        if (range && this._isRangeInScope(range)) {
          this._removeHighlight();
          this.selectRange(range);
          this.range = range;
          this._updateButtonRanges(inRange);
        }
        this.historyPaused = false;
      }
    }

    /**
     * handles keydown
     *
     * @param {event} e keydown event
     */
    _handleTargetKeyDown(e) {
      let modifier =
        window.navigator.platform === "MacIntel" ? e.metaKey : e.ctrlKey;
      if (modifier && e.key == "z") {
        e.preventDefault();
        this.undo();
        return false;
      } else if (modifier && e.key == "y") {
        e.preventDefault();
        this.redo();
        return false;
      }
      this._removeHighlight();
    }

    _addHighlight() {
      this.range = this.getRange();
      if (
        !this.target ||
        !this.target.getAttribute("contenteditable") == "true"
      )
        return;
      this.__highlight.wrap(this.range || this.getRange());
    }

    _removeHighlight() {
      this.__highlight.unwrap();
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
