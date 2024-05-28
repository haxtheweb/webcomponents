/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { SimpleToolbarButtonBehaviors } from "@haxtheweb/simple-toolbar/lib/simple-toolbar-button.js";
import { RichTextEditorRangeBehaviors } from "@haxtheweb/rich-text-editor/lib/singletons/rich-text-editor-range-behaviors.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";
import "@haxtheweb/hax-iconset/lib/simple-hax-iconset.js";

/**
 * RichTextStyles
 *
 * @lit-html
 * @lit-element
 * @const
 * @default
 * @type {array}
 */
const RichTextStyles = [
  css`
    :host {
      height: var(--rich-text-editor-button-height, 32px);
      --simple-toolbar-border-color: var(--rich-text-editor-border-color, #ddd);
      --simple-toolbar-border-width: var(--rich-text-editor-border-width, 1px);
      --simple-toolbar-button-bg: var(--rich-text-editor-bg, #ffffff);
      --simple-fields-focus-color: var(--rich-text-editor-focus-color, blue);
      --simple-fields-invalid-color: var(--rich-text-editor-error-color, #800);
    }
  `,
];
/**
 * RichTextStyles
 *
 * @lit-html
 * @lit-element
 * @const
 * @default
 * @type {array}
 * @extends RichTextStyles
 */
const RichTextToolbarStyles = [
  ...RichTextStyles,
  css`
    :host {
      --simple-toolbar-border-color: var(--rich-text-editor-border-color, #ddd);
      --simple-toolbar-border-width: var(--rich-text-editor-border-width, 1px);
      --simple-toolbar-button-opacity: var(
        --rich-text-editor-button-opacity,
        1
      );
      --simple-toolbar-button-color: var(--rich-text-editor-button-color, #444);
      --simple-toolbar-button-bg: var(--rich-text-editor-button-bg, #ffffff);
      --simple-toolbar-button-border-color: var(
        --rich-text-editor-button-border-color,
        transparent
      );
      --simple-toolbar-button-toggled-opacity: var(
        --rich-text-editor-button-toggled-opacity,
        1
      );
      --simple-toolbar-button-toggled-color: var(
        --rich-text-editor-button-toggled-color,
        #222
      );
      --simple-toolbar-button-toggled-bg: var(
        --rich-text-editor-button-toggled-bg,
        #ddd
      );
      --simple-toolbar-button-toggled-border-color: var(
        --rich-text-editor-button-toggled-border-color,
        transparent
      );
      --simple-toolbar-button-hover-opacity: var(
        --rich-text-editor-button-hover-opacity,
        1
      );
      --simple-toolbar-button-hover-color: var(
        --rich-text-editor-button-hover-color,
        #000
      );
      --simple-toolbar-button-hover-bg: var(
        --rich-text-editor-button-hover-bg,
        #f0f0f0
      );
      --simple-toolbar-button-hover-border-color: var(
        --rich-text-editor-button-hover-border-color,
        unset
      );
      --simple-toolbar-button-disabled-opacity: var(
        --rich-text-editor-button-disabled-opacity,
        1
      );
      --simple-toolbar-button-disabled-color: var(
        --rich-text-editor-button-disabled-color,
        #666
      );
      --simple-toolbar-button-disabled-bg: var(
        --rich-text-editor-button-disabled-bg,
        transparent
      );
      --simple-toolbar-button-disabled-border-color: var(
        --rich-text-editor-button-disabled-border-color,
        transparent
      );
    }
    button[part="button"] {
      border-radius: var(--rich-text-editor-button-disabled-border-radius, 0px);
    }
  `,
];
/**
 * RichTextEditorButtonBehaviors
 *
 * @extends SimpleToolbarButtonBehaviors
 * @customElement
 * @class
 * @lit-html
 * @lit-element
 */
const RichTextEditorButtonBehaviors = function (SuperClass) {
  return class extends RichTextEditorRangeBehaviors(
    SimpleToolbarButtonBehaviors(SuperClass),
  ) {
    /**
     * Store the tag name to make it easier to obtain directly.
     */
    static get tag() {
      return "rich-text-editor-button";
    }

    static get styles() {
      return [super.styles, ...RichTextToolbarStyles];
    }
    render() {
      return super.render();
    }

    static get properties() {
      return {
        ...super.properties,

        /**
         * Hide the null option
         */
        disabled: {
          type: Boolean,
          reflect: true,
          attribute: "disabled",
        },
        /**
         * The command used for globalThis.document.execCommand.
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
         * The command used for globalThis.document.execCommand when toggled.
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
      };
    }

    constructor() {
      super();
      this.tagsList = "";
    }

    /**
     * whether button is toggled
     *
     * @readonly
     * @memberof RichTextEditorButton
     */
    get isToggled() {
      return this.commandIsToggled;
    }

    /**
     * gets command param for globalThis.document.execCommand
     * @readonly
     */
    get operationCommand() {
      return this.isToggled && !!this.toggledCommand
        ? this.toggledCommand
        : this.command;
    }
    /**
     * gets value param for globalThis.document.execCommand
     * @readonly
     */
    get operationCommandVal() {
      return this.isToggled && !!this.toggledCommand
        ? this.toggledCommandVal || ""
        : this.commandVal;
    }
    /**
     * tagslist as an array
     *
     * @readonly
     */
    get tagsArray() {
      return (this.tagsList || "").replace(/\s*/g, "").toLowerCase().split(",");
    }

    firstUpdated(changedProperties) {
      if (super.firstUpdated) {
        super.firstUpdated(changedProperties);
      }
    }

    updated(changedProperties) {
      super.updated(changedProperties);
      changedProperties.forEach((oldValue, propName) => {
        if (propName === "controls")
          this._editorChanged(this.controls, oldValue);
        if (propName === "range") this._rangeChanged(this.range, oldValue);
        if (["shortcutKeys", "tagsList", "tagClickCallback"].includes(propName))
          this.updateButtonRegistry();
      });
    }
    /**
     * Called every time the element is inserted into the DOM. Useful for
     * running setup code, such as fetching resources or rendering.
     * Generally, you should try to delay work until this time.
     */
    connectedCallback() {
      super.connectedCallback();
    }
    /**
     * Called every time the element is inserted into the DOM. Useful for
     * running setup code, such as fetching resources or rendering.
     * Generally, you should try to delay work until this time.
     */
    connectedCallback() {
      super.connectedCallback();
    }
    /**
     * life cycle, element is detatched
     */
    disconnectedCallback() {
      super.disconnectedCallback();
    }
    /**
     * override this custom function to perform a
     * custom operation after button is clicked
     *
     * @param {object} editor current editor
     * @param {object} toolbar parent toolbar
     * @param {object} selection range/selection manager
     */
    commandCallback(editor, toolbar, selection) {}
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
        }),
      );
    }
    /**
     * sends a command to the selection manager
     *
     * @param {object} event
     */
    sendCommand(event) {
      this._handleCommand(
        this.operationCommand,
        this.operationCommandVal,
        this.range,
      );
      // optional callback so that custom buttons can perform
      // custom toolbar and/or editor opperations
      if (this.commandCallback)
        this.commandCallback(this.target, this.__toolbar, this);
      this.dispatchEvent(
        new CustomEvent("command", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: {
            command: this.operationCommand,
            commandVal: this.operationCommandVal,
            range: this.range,
            button: this,
          },
        }),
      );
    }
    /**
     * expands range to selection's parent block
     */
    setRange() {
      if (!this.tagsList || this.tagsList === "") return;
      /* if command is formatBlock expand selection to entire block */
      let block = this.rangeOrMatchingAncestor();
      if (block) this.selectNode(block);
    }

    /**
     * Handles button tap
     */
    _handleClick(e) {
      e.preventDefault();
      this.sendCommand(e);
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
        ? this.rangeOrMatchingAncestor()
        : this._getSelectedHtml();
    }
    /**
     * gets selected html
     * @returns {string}
     */
    _getSelectedHtml() {
      if (this.range) {
        let div = globalThis.document.createElement("div"),
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
      let block = this.rangeOrMatchingAncestor(),
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
 * is a basic button for rich text editor (custom buttons can extend RichTextEditorButtonBehaviors)
 * 
 * ### Styling
`<rich-text-editor-button>` uses RichTextToolbarStyles constant to set 
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
 * 
 * @extends RichTextEditorButtonBehaviors
 * @customElement
 * @lit-html
 * @lit-element
 * @element rich-text-editor-button
 * @demo ./demo/buttons.html
 */
class RichTextEditorButton extends RichTextEditorButtonBehaviors(LitElement) {}
customElements.define(RichTextEditorButton.tag, RichTextEditorButton);
export {
  RichTextEditorButton,
  RichTextEditorButtonBehaviors,
  RichTextStyles,
  RichTextToolbarStyles,
};
