/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { RichTextEditorButtonBehaviors } from "./rich-text-editor-button.js";
import "@haxtheweb/rich-text-editor/lib/singletons/rich-text-editor-prompt.js";

/**
 * RichTextEditorPromptButtonBehaviors
 *
 * @customElement
 * @class
 * @lit-html
 * @lit-element
 * @extends RichTextEditorButtonBehaviors
 */
const RichTextEditorPromptButtonBehaviors = function (SuperClass) {
  return class extends RichTextEditorButtonBehaviors(SuperClass) {
    /**
     * Store tag name to make it easier to obtain directly.
     */
    static get tag() {
      return "rich-text-editor-prompt-button";
    }

    // render function for template
    render() {
      return super.render();
    }

    // properties available to custom element for data binding
    static get properties() {
      return {
        ...super.properties,
        /**
         * fields for prompt popover.
         */
        fields: {
          type: Array,
        },
        /**
         * is element a custom inline widget element?
         */
        id: {
          name: "id",
          type: String,
          reflect: true,
          attribute: "id",
        },
        /**
         * prefilled value of prompt
         */
        value: {
          type: Object,
        },
        /**
         * contents node inside selected range
         */
        __wrap: {
          name: "__wrap",
          type: Object,
        },
        /**
         * contents node inside selected range
         */
        __oldValue: {
          name: "__oldValue",
          type: Object,
        },
      };
    }
    constructor() {
      super();
      this.editableSelection = false;
      this.fields = [
        {
          property: "innerHTML",
          title: "Text",
          inputMethod: "textfield",
          description: "Text currently selected",
          disabled: true,
          required: true,
        },
      ];
      this.tagsList = "span";
      this.value = { innerHTML: undefined };
    }

    firstUpdated(changedProperties) {
      super.firstUpdated(changedProperties);
    }

    /**
     * determines which command based on values passed from prompt
     * (can be overriden for custom prompt  commands)
     *
     * @readonly
     */
    get promptCommand() {
      return this.toggledCommand && !this.toggled
        ? this.toggledCommand
        : this.command;
    }

    /**
     * determines commandVal based on values passed from prompt
     * (can be overriden for custom prompt command values)
     */
    get promptCommandVal() {
      return this.commandVal;
    }
    /**
     * determines if prompt also sets innerHTML of range
     * (can be overriden for custom prompts)
     */
    get setsInnerHTML() {
      let innerHTML = (this.fields || []).filter(
        (field) => field.property === "innerHTML",
      );
      return innerHTML && innerHTML.length > 0;
    }

    get targetedNode() {
      let firstMatch = this.__highlight.querySelectorAll(this.tagsList);
      return firstMatch.length === 1 ? firstMatch[0] : this.__highlight;
    }
    /**
     * override this custom function to perform a
     * custom operation when an element that matches the tags list is clicked
     *
     * @param {event} e click event
     */
    tagClickCallback(e = {}) {
      if (e.detail) this.open(e.detail);
    }

    /**
     * closes without updates
     */
    cancel() {
      this.close();
    }
    /**
     * closes prompt
     * @event rich-text-editor-prompt-close
     *
     */
    close() {
      this.__highlight.unwrap(this.range);
      if (this.range) this.range.collapse();
      this.dispatchEvent(
        new CustomEvent("rich-text-editor-prompt-close", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: this,
        }),
      );
    }

    /**
     * updates insertion based on fields
     * @event rich-text-editor-prompt-confirm
     */
    confirm(val) {
      this.value = val;
      this.dispatchEvent(
        new CustomEvent("rich-text-editor-prompt-confirm", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: this,
        }),
      );
      //this.update();
      this.setToggled();
      this.updateSelection();
      this.close();
    }

    /**
     * gets a field value (and trims it if it's a string)
     *
     * @param {string} prop field name
     * @returns {*}
     * @memberof RichTextEditorPrompt
     */
    getPropValue(prop) {
      let val = !!this.value ? { ...this.value } : false,
        rawVal =
          !val || !val[prop]
            ? false
            : val[prop].trim
              ? val[prop].trim()
              : val[prop];

      return rawVal && rawVal !== "" ? rawVal : false;
    }

    /**
     * gets value for prompt based on current selection
     * (can be overriden for custom prompt field values)
     */
    getValue() {
      return { innerHTML: this.targetedNode.innerHTML || "" };
    }

    /**
     * Handles selecting text and opening prompt
     * @param {object} node optional node to select instead of range
     * @event rich-text-editor-prompt-open
     */
    open(node) {
      this.highlightNode(node);
      this.value = this.getValue();
      this.dispatchEvent(
        new CustomEvent("rich-text-editor-prompt-open", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: this,
        }),
      );
    }
    /**
     * sets inner HTML of selection
     *
     * @param {string} html
     */
    setInnerHTML(html) {
      if (this.setsInnerHTML) this.targetedNode.innerHTML = html;
    }
    /**
     * updates toggled based on values passed from prompt
     * (can be overriden for custom toggled state)
     */
    setToggled() {
      this.toggled = !this.value;
    }
    /**
     * updates selection based on values passed from prompt
     */
    updateSelection() {
      let command = this.promptCommand,
        commandVal = this.promptCommandVal;
      this.setInnerHTML(this.getPropValue("innerHTML"));
      if (this.targetedNode === this.__highlight) {
        this.selectNodeContents(this.targetedNode);
      } else {
        this.selectNode(this.targetedNode);
      }
      this._handleCommand(command, commandVal, this.range, this.value);
    }

    /**
     * Handles button tap
     * @param {event} e button tap event
     */
    _handleClick(e) {
      e.preventDefault();
      this.open();
    }

    /**
     * Handles range change
     * @param {event} e button tap event
     */
    _rangeChanged(newVal, oldVal) {
      this.value = this.getValue();
      this.setToggled();
    }
  };
};
/**
 * `rich-text-editor-prompt-button`
 * prompts for more information for rich text editor
 * (custom buttons can extend RichTextEditorPromptButtonBehaviors)
 *
 * @extends RichTextEditorPromptButtonBehaviors
 * @extends LitElement
 * @customElement
 * @lit-html
 * @lit-element
 * @element rich-text-editor-prompt-button
 * @demo ./demo/buttons.html
 */
class RichTextEditorPromptButton extends RichTextEditorPromptButtonBehaviors(
  LitElement,
) {}
customElements.define(
  RichTextEditorPromptButton.tag,
  RichTextEditorPromptButton,
);
export { RichTextEditorPromptButton, RichTextEditorPromptButtonBehaviors };
