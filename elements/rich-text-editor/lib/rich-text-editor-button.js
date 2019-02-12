/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "@polymer/iron-icons/iron-icons.js";
import "./rich-text-editor-styles.js";
/**
 * `rich-text-editor-button`
 * `a button for rich text editor (custom buttons can extend this)`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 */
class RichTextEditorButton extends PolymerElement {
  // render function
  static get template() {
    return html`
      <style include="rich-text-editor-styles"></style>
      <iron-a11y-keys
        id="a11y"
        target="[[__a11y]]"
        keys="enter"
        on-keys-pressed="_buttonTap">
      </iron-a11y-keys>
      <paper-button id="button"
        disabled$="[[disabled]]" 
        controls="[[controls]]"
        on-tap="_buttonTap"
        on-mousedown="_addSavedSelection"
        on-keydown="_addSavedSelection"
        tabindex="0"
        toggled$="[[toggled]]">
        <iron-icon id="icon" 
          aria-hidden
          icon$="[[_regOrToggled(icon,toggledIcon,toggled)]]">
        </iron-icon>
        <span id="label" class$="[[labelStyle]]"></span>
      </paper-button>
      <paper-tooltip id="tooltip" for="button"></paper-button>
    `;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * The command used for document.execCommand.
       */
      command: {
        name: "command",
        type: "String",
        value: null
      },
      /**
       * Optional parameter for the command.
       */
      commandVal: {
        name: "commandVal",
        type: "Object",
        value: null
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
       * Is the button disabled? Default is false.
       */
      disabled: {
        name: "disabled",
        type: "Boolean",
        value: false
      },

      /**
       * Optional iron icon name for the button.
       */
      icon: {
        name: "icon",
        type: "String",
        value: null
      },

      /**
       * Label for the icon.
       */
      label: {
        name: "label",
        type: "String",
        value: null
      },

      /**
       * Hide the label offscreen?
       */
      labelStyle: {
        name: "labelStyle",
        type: "String",
        computed: "_labelStyle(icon,showTextLabel)",
        readOnly: true
      },

      /**
       * The active selection, inherited from the toolbar
       */
      selection: {
        name: "selection",
        type: "Object",
        value: null,
        notify: true,
        reflectToAttribute: true
      },

      /**
       * Show text label even if an icon is named?
       */
      showTextLabel: {
        name: "showTextLabel",
        type: "Boolean",
        value: false
      },

      /**
       * Is this button toggled?
       */
      toggled: {
        name: "toggled",
        type: "Boolean",
        computed: "_isToggled(selection)",
        notify: true,
        reflectToAttribute: true
      },

      /**
       * The command used for document.execCommand when toggled.
       */
      toggledCommand: {
        name: "toggledCommand",
        type: "String",
        value: null
      },
      /**
       * Optional parameter for the command when toggled.
       */
      toggledCommandVal: {
        name: "toggledCommandVal",
        type: "Object",
        value: null
      },

      /**
       * Optional iron icon name for the button if it is toggled.
       */
      toggledIcon: {
        name: "toggledIcon",
        type: "String",
        value: null
      },

      /**
       * Label for the icon, if button is toggled.
       */
      toggledLabel: {
        name: "toggledLabel",
        type: "String",
        value: null
      },

      /**
       * Can this button toggle?
       */
      toggles: {
        name: "toggles",
        type: "Boolean",
        value: false
      },

      /**
       * List of valid commands
       */
      validCommands: {
        name: "validCommands",
        type: "Array",
        value: [
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
        ],
        readOnly: true
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "rich-text-editor-button";
  }
  
  /**
   * life cycle, element is ready
   */
  ready() {
    super.ready();
    let root = this;
    /*root.$.button.addEventListener('mouseover',function(e){
      root._addSavedSelection(e);
    });
    root.$.button.addEventListener('focus',function(e){
      root._addSavedSelection(e);
    });*/
  }

  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    this.__a11y = this.$.button;
    this.dispatchEvent(
      new CustomEvent("activate-rich-text-button", { detail: this })
    );
  }

  /**
   * life cycle, element is detatched
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    this.dispatchEvent(
      new CustomEvent("deactivate-rich-text-button", { detail: this })
    );
  }

  /**
   * excutes the button's command
   */
  doTextOperation() {
    let root = this,
      selection = root.selection;
    if (root.toggled && root.toggledCommand !== null) {
      document.execCommand(
        root.toggledCommand,
        false,
        root.toggledCommand || ""
      );
    } else if (root.command !== null) {
      document.execCommand(root.command, false, root.commandVal || "");
    }
    root.selection = selection;
  }
  /**
   * maintains the selection for the button
   */
  _addSavedSelection(e = null) {
    console.log('_addSavedSelection',e,this.savedSelection);
    if (this.commandVal !== null) {
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(this.savedSelection);
    }
  }

  /**
   * determins if the button is toggled
   *
   * @param {object} the text selection
   * @returns {boolean} whether the button is toggled
   *
   */
  _isToggled(selection) {
    let toggled =
        this.command !== null && this.toggles
          ? document.queryCommandState(this.command)
          : false,
      label = this._regOrToggled(this.label, this.toggledLabel, toggled);
    this.$.label.innerHTML = label;
    this.$.tooltip.innerHTML = label;
    return toggled;
  }
  /**
   * Handles button tap;
   */
  _buttonTap(e) {
    e.preventDefault();
    this.doTextOperation();
    this.dispatchEvent(
      new CustomEvent("rich-text-button-tap", { detail: this })
    );
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
    return toggledOn !== null && toggled ? toggledOn : toggledOff;
  }

  /**
   * Determines if an iron icon has been named for the button.
   *
   * @param {string} the name of the icon
   * @returns {boolean} if an icon is named
   */
  _labelStyle(icon, showTextLabel) {
    return icon !== undefined &&
      icon !== null &&
      icon !== "" &&
      showTextLabel === false
      ? "offscreen"
      : null;
  }
}
window.customElements.define(RichTextEditorButton.tag, RichTextEditorButton);
export { RichTextEditorButton };
