/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { RichTextEditorButtonStyles } from "./rich-text-editor-button-styles.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/iron-a11y-keys/iron-a11y-keys.js";
import "../singletons/rich-text-editor-selection.js";

const RichTextEditorButtonBehaviors = function (SuperClass) {
  return class extends RichTextEditorButtonStyles(SuperClass) {
    /**
     * Store the tag name to make it easier to obtain directly.
     */
    static get tag() {
      return "rich-text-editor-button";
    }

    static get styles() {
      return [
        ...super.styles,
        css`
          .rtebutton {
            min-width: var(--rich-text-editor-button-min-width);
            height: var(--rich-text-editor-button-height);
            margin: var(--rich-text-editor-button-margin);
            padding: var(--rich-text-editor-button-padding);
          }
        `,
      ];
    }
    render() {
      return html`
        <iron-a11y-keys
          id="a11y"
          .target="${this.__a11y}"
          keys="enter"
          @keys-pressed="${this._buttonTap}"
        >
        </iron-a11y-keys>
        <paper-button
          id="button"
          class="rtebutton"
          ?disabled="${this.disabled}"
          ?controls="${this.controls}"
          @click="${this._buttonTap}"
          tabindex="0"
          ?toggled="${this.isToggled}"
        >
          <iron-icon id="icon" aria-hidden="true" icon="${this.currentIcon}">
          </iron-icon>
          <span id="label" class="${this.labelStyle}"
            >${this.currentLabel}</span
          >
        </paper-button>
        <simple-tooltip id="tooltip" for="button"
          >${this.currentLabel}</simple-tooltip
        >
      `;
    }

    static get properties() {
      return {
        /**
         * The `id` of the `rich-text-editor` that the toolbar controls.
         */
        controls: {
          type: String,
        },

        /**
         * The command used for document.execCommand.
         */
        command: {
          type: String,
        },

        /**
         * Optional parameter for the command.
         */
        commandVal: {
          attribute: "command-val",
          type: Object,
        },

        /**
         * Is the button disabled? Default is false.
         */
        disabled: {
          type: Boolean,
        },

        /**
         * Optional iron icon name for the button.
         */
        icon: {
          type: String,
        },

        /**
         * Label for the icon.
         */
        label: {
          type: String,
        },

        /**
         * The active selected range, inherited from the toolbar
         */
        range: {
          type: Object,
        },

        /**
         * Optional space-sperated list of keyboard shortcuts for the editor
         * to fire this button, see iron-a11y-keys for more info.
         */
        shortcutKeys: {
          attribute: "shortcut-keys",
          type: String,
        },

        /**
         * Show text label even if an icon is named?
         */
        showTextLabel: {
          attribute: "show-text-label",
          type: Boolean,
        },
        /**
         * The active selected range, inherited from the toolbar
         */
        tag: {
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
        },
        /**
         * Optional parameter for the command when toggled.
         */
        toggledCommandVal: {
          attribute: "toggled-command-val",
          type: Object,
        },

        /**
         * Optional iron icon name for the button if it is toggled.
         */
        toggledIcon: {
          attribute: "toggled-icon",
          type: String,
        },

        /**
         * Label for the icon, if button is toggled.
         */
        toggledLabel: {
          attribute: "toggled-label",
          type: String,
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
         * Can this button toggle?
         */
        toggles: {
          type: Boolean,
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
      this.disabled = false;
      this.showTextLabel = false;
      this.toggles = false;
      import("@polymer/iron-icons/iron-icons.js");
      import("@polymer/iron-icons/editor-icons.js");
      import("@polymer/iron-icons/image-icons.js");
      import("@lrnwebcomponents/md-extra-icons/md-extra-icons.js");
      import("@lrnwebcomponents/simple-tooltip/simple-tooltip.js");
    }
    get blockSelectors() {
      return "p,h1,h2,h3,h4,h5,h6,div,address,blockquote,pre";
    }

    /**
     * current label based on toggled state
     *
     * @readonly
     * @memberof RichTextEditorButton
     */
    get currentLabel() {
      return this._regOrToggled(this.label, this.toggledLabel, this.isToggled);
    }

    /**
     * current icon based on toggled state
     *
     * @readonly
     * @memberof RichTextEditorButton
     */
    get currentIcon() {
      return this._regOrToggled(this.icon, this.toggledIcon, this.isToggled);
    }

    /**
     * label is offscreen (screenreader-only)
     *
     * @readonly
     * @memberof RichTextEditorButton
     */
    get labelStyle() {
      return !!this.icon && this.icon !== "" && this.showTextLabel === false
        ? "offscreen"
        : null;
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
        block =
          this.command === "underline"
            ? !!this.selectionAncestors.includes("u")
            : command;
      return !!this.selected && this.toggles && !!block ? true : false;
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

    updated(changedProperties) {
      super.updated(changedProperties);
      changedProperties.forEach((oldValue, propName) => {
        if (propName === "controls") this._editorChanged();
        if (propName === "range") this._rangeChanged();
      });
    }
    /**
     * life cycle, element is afixed to the DOM
     */
    connectedCallback() {
      super.connectedCallback();
      this.__a11y = this.shadowRoot.querySelector("#button");
    }

    /**
     * life cycle, element is detatched
     */
    disconnectedCallback() {
      super.disconnectedCallback();
    }

    /**
     * gets command param for document.execCommand
     *
     * @readonly
     */
    get operationCommand() {
      return this.isToggled && !!this.toggledCommand
        ? this.toggledCommand
        : this.command;
    }
    /**
     * gets value param for document.execCommand
     *
     * @readonly
     */
    get operationCommandVal() {
      return this.isToggled && !!this.toggledCommand
        ? this.toggledCommandVal || ""
        : this.commandVal;
    }

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

    sendCommand(
      command = this.operationCommand,
      commandVal = this.operationCommandVal
    ) {
      console.log("BUTTON sendCommand", command, commandVal);
      this.dispatchEvent(
        new CustomEvent("command", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: {
            command: command,
            commandVal: commandVal,
          },
        })
      );
    }
    /**
     * expands range to selection's parent block
     */
    setRange() {
      /* if command is formatBlock expand selection to entire block */
      let block = this._getSelectedBlock();
      if (block) this.selectNode(block);
    }
    /**
     * expands range an updates highlight
     * @param {object} nodede
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
     * Handles button tap
     */
    _buttonTap(e) {
      e.preventDefault();
      this.sendCommand();
    }
    _editorChanged() {}
    /**
     * gets appplicable selection
     * @returns {object}
     */
    _getSelection() {
      return this.command === "formatBlock"
        ? this._getSelectedBlock()
        : this._getSelectedHtml();
    }
    _getSelectedNode() {
      let common = !this.range ? undefined : this.range.commonAncestorContainer,
        startContainer = !this.range ? undefined : this.range.startContainer,
        startOffset = !this.range ? undefined : this.range.startOffset,
        endContainer = !this.range ? undefined : this.range.endContainer,
        endOffset = !this.range ? undefined : this.range.endOffset,
        startNode =
          !startContainer || !startContainer.children
            ? undefined
            : startContainer.children[startOffset - 1],
        rootNode =
          startContainer === endContainer && endOffset - startOffset === 1
            ? startNode
            : common;
      return rootNode;
    }
    /**
     * get selection's parent block
     * @returns {object}
     */
    _getSelectedBlock(selectors = this.blockSelectors) {
      let rootNode = this._getSelectedNode(),
        tagName =
          rootNode && rootNode.tagName
            ? rootNode.tagName.toLowerCase()
            : undefined,
        selectorsList = selectors.toLowerCase().replace(/\s*/g, "").split(",");
      if (selectorsList.includes(tagName)) {
        return rootNode;
      } else if (rootNode && rootNode.closest) {
        return rootNode.closest(selectors);
      } else {
        return undefined;
      }
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
      let block = this._getSelectedBlock(),
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
     */
    _keysPressed(e) {
      e.preventDefault();
      this._buttonTap(e);
    }

    /**
     * updates a button value based on whether or not button is toggled
     *
     * @param {string} the value when toggled off
     * @param {string} the value when toggled on
     * @param {boolean} whether the button is toggled
     * @returns {string} the correct value based on
     * whether or not the button is toggled
     */
    _regOrToggled(toggledOff, toggledOn, toggled) {
      return !!toggledOn && toggled ? toggledOn : toggledOff;
    }
    _rangeChanged() {}
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
export { RichTextEditorButton, RichTextEditorButtonBehaviors };
