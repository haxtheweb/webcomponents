/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { SimpleToolbarButtonBehaviors } from "@lrnwebcomponents/simple-toolbar/lib/simple-toolbar-button.js";
import "@lrnwebcomponents/rich-text-editor/lib/singletons/rich-text-editor-selection.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-button-lite.js";
import "@lrnwebcomponents/hax-iconset/lib/simple-hax-iconset.js";

const RichTextStyles = [
  css`
    :host {
      --simple-toolbar-border-color: #ddd;
      --simple-toolbar-border-width: 1px;
      --simple-toolbar-button-opacity: 1;
      --simple-toolbar-button-color: #444;
      --simple-toolbar-button-bg: #ffffff;
      --simple-toolbar-button-border-color: transparent;
      --simple-toolbar-button-toggled-opacity: 1;
      --simple-toolbar-button-toggled-color: #222;
      --simple-toolbar-button-toggled-bg: #ddd;
      --simple-toolbar-button-toggled-border-color: transparent;
      --simple-toolbar-button-hover-opacity: 1;
      --simple-toolbar-button-hover-color: #000;
      --simple-toolbar-button-hover-bg: #f0f0f0;
      --simple-toolbar-button-hover-border-color: unset;
      --simple-toolbar-button-disabled-opacity: 1;
      --simple-toolbar-button-disabled-color: #666;
      --simple-toolbar-button-disabled-bg: transparent;
      --simple-toolbar-button-disabled-border-color: transparent;
    }
  `,
];
const RichTextEditorButtonBehaviors = function (SuperClass) {
  return class extends SimpleToolbarButtonBehaviors(SuperClass) {
    /**
     * Store the tag name to make it easier to obtain directly.
     */
    static get tag() {
      return "rich-text-editor-button";
    }

    static get styles() {
      return [...super.styles, ...RichTextStyles];
    }
    render() {
      return super.render();
    }

    static get properties() {
      return {
        ...super.properties,

        /**
         * The command used for document.execCommand.
         */
        command: {
          type: String,
          reflect: true,
          attribute: "command",
        },

        /**
         * Optional parameter for the command.
         */
        commandVal: {
          attribute: "command-val",
          type: Object,
        },

        /**
         * The active selected range, inherited from the toolbar
         */
        range: {
          type: Object,
        },
        /**
         * tags edited by this button
         */
        tagsList: {
          type: String,
        },

        /**
         * The active selected range, inherited from the toolbar
         */
        target: {
          type: Object,
        },

        /**
         * The command used for document.execCommand when toggled.
         */
        toggledCommand: {
          attribute: "toggled-command",
          type: String,
          reflect: true,
        },
        /**
         * Optional parameter for the command when toggled.
         */
        toggledCommandVal: {
          attribute: "toggled-command-val",
          type: Object,
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
         * highlight surrounding selected range
         */
        __selection: {
          type: Object,
        },
      };
    }

    constructor() {
      super();
      this.__selection = window.RichTextEditorSelection.requestAvailability();
      this.tagsList = "";
    }

    /**
     * whether button is toggled
     *
     * @readonly
     * @memberof RichTextEditorButton
     */
    get isToggled() {
      let command =
          !!this.range && !!this.command
            ? document.queryCommandState(this.command)
            : false,
        /* workaround because queryCommandState("underline") returns true on links */
        block = this.command === "underline" ? !!this.rangeQuery("u") : command;
      return this.toggles && !!block ? true : false;
    }

    /**
     * gets command param for document.execCommand
     * @readonly
     */
    get operationCommand() {
      return this.isToggled && !!this.toggledCommand
        ? this.toggledCommand
        : this.command;
    }
    /**
     * gets value param for document.execCommand
     * @readonly
     */
    get operationCommandVal() {
      return this.isToggled && !!this.toggledCommand
        ? this.toggledCommandVal || ""
        : this.commandVal;
    }

    get tagsArray() {
      return (this.tagsList || "").replace(/\s*/g, "").toLowerCase().split(",");
    }

    /**
     * gets valid commands list
     *
     * @readonly
     * @memberof RichTextEditorButton
     */
    get validCommands() {
      return [
        "backColor",
        "bold",
        "createLink",
        "copy",
        "cut",
        "defaultParagraphSeparator",
        "delete",
        "fontName",
        "fontSize",
        "foreColor",
        "formatBlock",
        "forwardDelete",
        "insertHorizontalRule",
        "insertHTML",
        "insertImage",
        "insertLineBreak",
        "insertOrderedList",
        "insertParagraph",
        "insertText",
        "insertUnorderedList",
        "justifyCenter",
        "justifyFull",
        "justifyLeft",
        "justifyRight",
        "outdent",
        "paste",
        "redo",
        "selectAll",
        "strikethrough",
        "styleWithCss",
        "superscript",
        "undo",
        "unlink",
        "useCSS",
      ];
    }
    firstUpdated(changedProperties) {
      if (super.firstUpdated) {
        super.firstUpdated(changedProperties);
      }
      /*this.__a11y = this.shadowRoot.querySelector("#button");
      this.__a11y.addEventListener("keypress", (e) => {
        switch (e.key) {
          case "Enter":
            this._handleClick(e);
            break;
        }
      });*/
    }

    updated(changedProperties) {
      super.updated(changedProperties);
      changedProperties.forEach((oldValue, propName) => {
        if (propName === "controls")
          this._editorChanged(this.controls, oldValue);
        if (propName === "range") this._rangeChanged(this.range, oldValue);
      });
    }
    /**
     * life cycle, element is detatched
     */
    disconnectedCallback() {
      super.disconnectedCallback();
    }
    /**
     * indicates how highlight should be toggled
     * @event highlight
     * @param {boolean} [on=true] whether to turn highlight on
     */
    highlight(on = true) {
      this.dispatchEvent(
        new CustomEvent("highlight", {
          bubbles: true,
          composed: true,
          cancelable: true,
          detail: on,
        })
      );
    }
    /**
     * indicates node that should be highlighted
     * @event highlightnode
     * @param {object} node
     */
    highlightNode(node) {
      this.dispatchEvent(
        new CustomEvent("highlightnode", {
          bubbles: true,
          composed: true,
          cancelable: true,
          detail: node,
        })
      );
    }

    /**
     * indicates range to be set
     * @event selectrange
     * @param {object} range
     */
    selectRange(range) {
      this.dispatchEvent(
        new CustomEvent("selectrange", {
          bubbles: true,
          composed: true,
          cancelable: true,
          detail: range,
        })
      );
    }

    /**
     * indicates range should be a given node
     * @event selectnode
     * @param {object} node
     */
    selectNode(node) {
      this.dispatchEvent(
        new CustomEvent("selectnode", {
          bubbles: true,
          composed: true,
          cancelable: true,
          detail: node,
        })
      );
    }

    /**
     * indicates range should be the contents of a given node
     * @event selectnodeccontents
     * @param {object} node
     */
    selectNodeContents(node) {
      this.dispatchEvent(
        new CustomEvent("selectnodeccontents", {
          bubbles: true,
          composed: true,
          cancelable: true,
          detail: node,
        })
      );
    }
    /**
     * indicates range should be wrapped in given element
     * @event wrapselection
     * @param {object} element html element
     */
    wrapSelection(element) {
      this.dispatchEvent(
        new CustomEvent("wrapselection", {
          bubbles: true,
          composed: true,
          cancelable: true,
          detail: element,
        })
      );
    }
    /**
     * gets node where range starts
     *
     * @returns node
     */
    startNode() {
      let startContainer = !this.range ? undefined : this.range.startContainer,
        startOffset = !this.range ? undefined : this.range.startOffset;
      return !startContainer
        ? undefined
        : startContainer.children
        ? startContainer.children[startOffset - 1]
        : startContainer.childNodes
        ? startContainer.childNodes[startOffset - 1]
        : undefined;
    }
    /**
     * gets closest element to range
     *
     * @returns node
     */
    rangeElement() {
      return this.rangeIsElement() ? this.startNode() : this.rangeParent();
    }
    /**
     * determines if selection is a element node
     *
     * @returns node
     */
    rangeIsElement() {
      let startContainer = !this.range ? undefined : this.range.startContainer,
        startOffset = !this.range ? undefined : this.range.startOffset,
        endContainer = !this.range ? undefined : this.range.endContainer,
        endOffset = !this.range ? undefined : this.range.endOffset;
      return startContainer === endContainer && endOffset - startOffset === 1;
    }
    /**
     * gets parent element of range
     *
     * @returns node
     */
    rangeParent() {
      let common = !this.range ? undefined : this.range.commonAncestorContainer;
      return !common
        ? undefined
        : common.nodeType == 1
        ? common
        : common.parentElement;
    }
    /**
     * gets closest node to range that matches selectors
     *
     * @param {string} [selectors=this.tagsList || this.tag]
     * @returns node
     */
    rangeQuery(selectors = this.tagsList) {
      selectors = selectors.toLowerCase().replace(/\s*/g, "");
      let start = this.rangeElement(),
        startTag =
          !start || !start.tagName ? undefined : start.tagName.toLowerCase(),
        tags = selectors.split(",");
      return !start
        ? undefined
        : startTag && tags.includes(startTag)
        ? start
        : start.closest(selectors);
    }
    /**
     * sends a command to the selection manager
     *
     * @param {string} [command=this.operationCommand]
     * @param {string} [commandVal=this.operationCommandVal]
     * @param {object} [range=this.range]
     */
    sendCommand(
      command = this.operationCommand,
      commandVal = this.operationCommandVal,
      range = this.range
    ) {
      this.dispatchEvent(
        new CustomEvent("command", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: {
            command: command,
            commandVal: commandVal,
            range: range,
          },
        })
      );
    }
    /**
     * expands range to selection's parent block
     */
    setRange() {
      /* if command is formatBlock expand selection to entire block */
      let block = this.rangeQuery();
      if (block) this.selectNode(block);
    }

    /**
     * Handles button tap
     */
    _handleClick(e) {
      e.preventDefault();
      this.sendCommand();
    }

    /**
     * handles range change
     *
     * @param {string} newVal new editor id
     * @param {string} oldVal old editor id
     */
    _editorChanged(newValue, oldValue) {}
    /**
     * gets appplicable selection
     * @returns {object}
     */
    _getSelection() {
      return this.command === "formatBlock"
        ? this.rangeQuery()
        : this._getSelectedHtml();
    }
    /**
     * gets selected html
     * @returns {string}
     */
    _getSelectedHtml() {
      if (this.range) {
        let div = document.createElement("div"),
          contents = this.range.cloneContents(),
          val;
        div.appendChild(contents);
        val = div.innerHTML;
        div.remove();
        return val ? val.trim() : undefined;
      }
      return undefined;
    }
    /**
     * get selection's parent block
     *
     * @returns
     */
    _getSelectedTag() {
      let block = this.rangeQuery(),
        tag = !!block && !!block.tagName ? block.tagName.toLowerCase() : false;
      return tag;
    }
    /**
     * gets appplicable selection
     * @returns {object}
     */
    _getSelectionType() {
      return this.command === "formatBlock"
        ? this._getSelectedTag()
        : this._getSelectedHtml();
    }

    /**
     * Handles keys the same way a button is handled
     * @param {event} e the  event
     * /
    _handleKeys(e) {
      e.preventDefault();
      this._handleClick(e);
    }

    /**
     * handles range change
     *
     * @param {object} newVal new range
     * @param {object} oldVal old range
     */
    _rangeChanged(newVal, oldVal) {}
  };
};
/**
 * `rich-text-editor-button`
 * a button for rich text editor (custom buttons can extend this)
 *
 * @element rich-text-editor-button
 * @demo ./demo/buttons.html
 */
class RichTextEditorButton extends RichTextEditorButtonBehaviors(LitElement) {}
window.customElements.define(RichTextEditorButton.tag, RichTextEditorButton);
export { RichTextEditorButton, RichTextEditorButtonBehaviors, RichTextStyles };
