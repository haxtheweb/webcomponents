/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { RichTextEditorButtonStyles } from "./rich-text-editor-button-styles.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/iron-a11y-keys/iron-a11y-keys.js";

const RichTextEditorButtonBehaviors = function(SuperClass) {
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
        `
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
          type: String
        },

        /**
         * The command used for document.execCommand.
         */
        command: {
          type: String
        },

        /**
         * Optional parameter for the command.
         */
        commandVal: {
          attribute: "command-val",
          type: Object
        },

        /**
         * Is the button disabled? Default is false.
         */
        disabled: {
          type: Boolean
        },

        /**
         * Optional iron icon name for the button.
         */
        icon: {
          type: String
        },

        /**
         * Label for the icon.
         */
        label: {
          type: String
        },

        /**
         * The active selected range, inherited from the toolbar
         */
        range: {
          type: Object
        },

        /**
         * Optional space-sperated list of keyboard shortcuts for the editor
         * to fire this button, see iron-a11y-keys for more info.
         */
        shortcutKeys: {
          attribute: "shortcut-keys",
          type: String
        },

        /**
         * Show text label even if an icon is named?
         */
        showTextLabel: {
          attribute: "show-text-label",
          type: Boolean
        },

        /**
         * The active selected range, inherited from the toolbar
         */
        target: {
          type: Object
        },

        /**
         * The command used for document.execCommand when toggled.
         */
        toggledCommand: {
          attribute: "toggled-command",
          type: String
        },
        /**
         * Optional parameter for the command when toggled.
         */
        toggledCommandVal: {
          attribute: "toggled-command-val",
          type: Object
        },

        /**
         * Optional iron icon name for the button if it is toggled.
         */
        toggledIcon: {
          attribute: "toggled-icon",
          type: String
        },

        /**
         * Label for the icon, if button is toggled.
         */
        toggledLabel: {
          attribute: "toggled-label",
          type: String
        },

        /**
         * Can this button toggle?
         */
        toggles: {
          type: Boolean
        }
      };
    }

    constructor() {
      super();
      this.disabled = false;
      this.showTextLabel = false;
      this.toggles = false;
      import("@polymer/iron-icons/iron-icons.js");
      import("@polymer/iron-icons/editor-icons.js");
      import("@polymer/iron-icons/image-icons.js");
      import("@lrnwebcomponents/md-extra-icons/md-extra-icons.js");
      import("@lrnwebcomponents/simple-tooltip/simple-tooltip.js");
      /*this.addEventListener("mousedown", function(e) {
        console.log("mousedown", e);
      });
      this.addEventListener("keypress", function(e) {
        e.preventDefault();
      });*/
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
      return (this.range || !this.range) &&
        this.command !== null &&
        this.toggles
        ? document.queryCommandState(this.command)
        : false;
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
        "useCSS"
      ];
    }

    updated(changedProperties) {
      super.updated(changedProperties);
      changedProperties.forEach((oldValue, propName) => {
        if (propName === "controls") this._editorChanged();
        if (propName === "range") this._rangeChanged();
        if (propName === "commandVal") this._commandValChanged();
        if (propName === "toggledCommandVal") this._toggledCommandValChanged();
      });
    }

    _rangeChanged() {
      this.dispatchEvent(
        new CustomEvent("range-changed", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: this
        })
      );
    }

    _commandValChanged() {
      this.dispatchEvent(
        new CustomEvent("command-val-changed", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: this
        })
      );
    }

    _toggledCommandValChanged() {
      this.dispatchEvent(
        new CustomEvent("toggled-command-val-changed", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: this
        })
      );
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
     * excutes the button's command
     */
    doTextOperation(toggle = !this.isToggled) {
      let range = this.range;
      if (!toggle && !!this.toggledCommand) {
        document.execCommand(
          this.toggledCommand,
          false,
          this.toggledCommand || ""
        );
      } else if (!!this.command) {
        this.dispatchEvent(
          new CustomEvent(this.command + "-button", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: this
          })
        );
        console.log(
          "doTextOperation",
          range,
          this.command,
          false,
          this.commandVal || ""
        );
        document.execCommand(this.command, false, this.commandVal || "");
        this.range = range;
      }
    }

    /**
     * Handles button tap
     */
    _buttonTap(e) {
      e.preventDefault();
      console.log("_buttonTap", e);
      this.doTextOperation();
    }

    /**
     * Handles editor change
     * @param {string} newVal the new editor's id
     * @param {string} oldVal the old editor's id
     * @returns {void}
     */
    _editorChanged(newVal, oldVal) {
      this.dispatchEvent(
        new CustomEvent(this.command + "-button-editor-change", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: this
        })
      );
    }

    /**
     * Handles keys the same way a button is handled
     * @param {event} e the  event
     */
    _keysPressed(e) {
      console.log("_keysPressed", e);
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
