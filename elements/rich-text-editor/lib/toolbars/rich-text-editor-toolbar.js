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
} from "@lrnwebcomponents/rich-text-editor/lib/buttons/rich-text-editor-button.js";
import { RichTextEditorRangeBehaviors } from "@lrnwebcomponents/rich-text-editor/lib/singletons/rich-text-editor-range-behaviors.js";
import "@lrnwebcomponents/rich-text-editor/lib/singletons/rich-text-editor-prompt.js";
import "@lrnwebcomponents/absolute-position-behavior/absolute-position-behavior.js";
import * as shadow from "shadow-selection-polyfill/shadow.js";

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
      import("@lrnwebcomponents/rich-text-editor/lib/buttons/rich-text-editor-symbol-picker.js");
      // prettier-ignore
      import("@lrnwebcomponents/rich-text-editor/lib/buttons/rich-text-editor-underline.js");
      // prettier-ignore
      import("@lrnwebcomponents/rich-text-editor/lib/buttons/rich-text-editor-image.js");
      // prettier-ignore
      import("@lrnwebcomponents/rich-text-editor/lib/buttons/rich-text-editor-link.js");
      this.config = this.defaultConfig;
      this.clickableElements = {};
      this.breadcrumbsLabel = "Select";
      this.breadcrumbsSelectAllLabel = "All";
      this.__toolbar = this;
      document.addEventListener(
        shadow.eventName,
        this._handleTargetSelection.bind(this.__toolbar)
      );
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
      if (this.hasBreadcrumbs) this._addBreadcrumbs();
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
        if (propName === "range") this._rangeChanged();
        if (propName === "editor") this._editorChange();
        if (["editor", "show", "range"].includes(propName))
          this.hidden = this.disconnected;
        if (["breadcrumbs", "sticky"].includes(propName) && !!this.breadcrumbs)
          this.breadcrumbs.sticky = this.sticky;
      });
    }

    /**
     * id of editor currently being controlled
     * @readonly
     * @returns {string}
     */
    get controls() {
      let controls = !this.target ? undefined : this.target.getAttribute("id");
      this.setAttribute("controls", controls);
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
      return new MutationObserver(this._handleTargetMutation);
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
      //if (editor) this.disableEditing(editor);
      this.target = undefined;
      document.body.append(this);
      this.dispatchEvent(
        new CustomEvent("close", {
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
      this.range = target.range;
    }
    /**
     * updates buttons and fires when rane changes
     * @event range-changed
     * @param {event} e
     */
    _rangeChanged(e) {
      this._updateButtonRanges();
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
      button.__toolbar = this;
      button.disabled = !this.target;
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
        document.body.appendChild(this.breadcrumbs);
      }
      this.breadcrumbs.label = this.breadcrumbsLabel;
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
     * updates buttons with selected range
     * @returns {void}
     */
    _updateButtonRanges() {
      if (
        this.range &&
        this.target &&
        this.rangeNodeOrParentNode(this.range) &&
        this.target.contains(this.rangeNodeOrParentNode(this.range))
      ) {
        let nodes = [],
          getParentNode = (node) => {
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

    /**
     * disables editing
     *
     * @param {object} editor
     * @memberof RichTextEditorManager
     */
    enableEditing(target = this.target) {
      if (!!target && !target.hidden && !target.disabled) {
        target.makeSticky(this.sticky);
        target.parentNode.insertBefore(this, target);
        target.setAttribute("contenteditable", "true");
        target.addEventListener("keypress", this._handleTargetKeypress);
        this.setCanceledEdits();
        this.updateRange(target);
        //editor.observeChanges(this.getRoot(editor));
        this.getRoot(target).onselectionchange = (e) => {
          console.log(
            "onselectionchange",
            this.debugRange(this.range),
            this.debugRange(this.getRange())
          );
          if (!this.__promptOpen) this.updateRange(target);
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
      }
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

    disableEditing(target = this.target) {
      if (!!target) {
        this.unsetHighlight();
        this.getRoot(target).onselectionchange = undefined;
        target.viewSource = false;
        target.removeAttribute("contenteditable");
        target.removeEventListener("keypress", this._handleTargetKeypress);

        target.makeSticky(false);
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
          attributes: false,
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
    sanitizeHTML(html) {
      if (!html) return;
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
      let handlers = this.targetHandlers(target);
      if (!!target) {
        let oldTarget = this.target;
        if (oldTarget !== target) {
          if (!!oldTarget) this.unsetTarget(oldTarget);
          Object.keys(handlers).forEach((handler) =>
            target.addEventListener(handler, handlers[handler])
          );
          this.getRoot(target).onselectionchange = (e) => {
            if (!this.__promptOpen) this.updateRange(target);
          };
          this.target = target;
          this.enableEditing(target);
        }
      }
      this.updateRange(this.target);
      if (this.breadcrumbs) {
        this.breadcrumbs.controls = this.controls;
        if (!!this.target)
          this.target.parentNode.insertBefore(
            this.breadcrumbs,
            this.target.nextSibling
          );
      }
      this.buttons.forEach((button) => {
        if (button.command !== "close") button.disabled = !this.target;
      });
      this.range = undefined;
      this._rangeChanged();
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
        click: (e) => this._handleTargetClick(target, e),
        focus: (e) => this._handleTargetFocus(target, e),
        keydown: (e) => this._handleShortcutKeys(e),
        paste: (e) => this._handlePaste(e),
      };
    }
    /**
     * gets cleaned HTML from the target
     *
     * @returns {string}
     * @memberof RichTextEditor
     */
    targetHTML() {
      return this.targetEmpty()
        ? ""
        : (this.target.innerHTML || "").replace(/<!--[^(-->)]*-->/g, "").trim();
    }

    _handleTargetClick(target, e) {
      console.log("_handleTargetClick", this.target, target, e);
      if (!target || target.disabled) return;
      if (this.target !== target) {
        e.preventDefault();
        this.setTarget(target);
      } else {
        let els = Object.keys(this.clickableElements || {}),
          el = e.target || e.srcElement || { tagName: "" },
          evt = { detail: el },
          tagname = (el.tagName || "").toLowerCase();
        if (tagname && els.includes(tagname)) {
          e.preventDefault();
          this.clickableElements[tagname](evt);
        }
      }
      this.updateRange();
      console.log(
        "update",
        this.debugRange(this.range),
        this.debugRange(this.getRange())
      );
    }
    _handleTargetFocus(target, e) {
      if (!this.__promptOpen && !target.disabled) this.setTarget(target);
    }
    _handleTargetMutation(mutations = []) {
      console.log("_handleTargetMutation", mutations);
      this._handleTargetSelection();
      (mutations || []).forEach((mutation) => {
        if (mutation.type == "attributes") {
          if ((target.disabled || target.hidden) && target.conteneditable) {
            this.disableEditing(target);
            target.tabindex = -1;
          } else if (
            !target.disabled &&
            !target.hidden &&
            target.conteneditable
          ) {
            this.enableEditing(target);
            target.tabindex = 0;
          }
        }
      });
    }
    _handleTargetSelection(e) {
      console.log("_handleTargetSelection", e);
      if (!this.__promptOpen) this.range = this.getRange();
    }
    _handlePaste(e) {
      e.stopImmediatePropagation();
      this.pasteFromClipboard();
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
