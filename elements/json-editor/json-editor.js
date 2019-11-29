/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/paper-input/paper-textarea.js";

/**
 * `json-editor`
 * @customElement json-editor
 * `simple JSON blob data binding to a text area`
 *
 * @microcopy - language worth noting:
 *  -
 *

 * @polymer
 * @demo demo/index.html
 */
class JsonEditor extends PolymerElement {
  // render function
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }

        :host([hidden]) {
          display: none;
        }
        :host([error]) paper-textarea {
          --iron-autogrow-textarea: {
            background-color: #ffeeee;
          }
        }
        paper-textarea {
          --iron-autogrow-textarea: {
            font-family: "Lucida Console", Monaco, monospace;
            font-weight: 600;
            white-space: pre;
            line-height: 20px;
            padding: 9.5px;
            margin: 0 0 10px;
            font-size: 13px;
            color: #000000;
            word-break: break-all;
            word-wrap: break-word;
            background-color: #f5f5f5;
            border: 1px solid #ccc;
            border-radius: 4px;
            transition: 0.3s linear all;
            -webkit-transition: 0.3s linear all;
            -moz-transition: 0.3s linear all;
            -ms-transition: 0.3s linear all;
            -o-transition: 0.3s linear all;
          }
        }
      </style>
      <paper-textarea
        label="[[label]]"
        value="{{value}}"
        error-message="Invalid JSON!"
        readonly="[[disabled]]"
        invalid="[[error]]"
        max-rows="[[maxRows]]"
      ></paper-textarea>
    `;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,

      /**
       * label for the text area
       */
      label: {
        name: "label",
        type: String,
        value: "JSON data"
      },
      /**
       * State of being valid JSON object
       */
      error: {
        name: "error",
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      /**
       * toggling disabled state of the editor
       */
      disabled: {
        name: "disabled",
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      /**
       * max rows in the textarea
       */
      maxRows: {
        name: "maxRows",
        type: Number,
        value: 0,
        reflectToAttribute: true
      },
      /**
       * String based value of the editor, use this to set initial value
       */
      value: {
        name: "value",
        type: String,
        value: "",
        notify: true,
        reflectToAttribute: false,
        observer: "_valueChanged"
      },
      /**
       * format test to update value so it's pretty printed
       */
      formatTest: {
        name: "value",
        type: String,
        computed: "_computeFormattedValue(value)"
      },
      /**
       * The current data object
       */
      currentData: {
        name: "currentData",
        type: Object,
        notify: true,
        computed: "_computeCurrentData(value)"
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "json-editor";
  }
  // Observer value for changes
  _valueChanged(newValue, oldValue) {
    // try to evaluate this as json, otherwise return an error
    try {
      let v = JSON.parse(newValue);
      if (v) {
        this.error = false;
      }
    } catch (e) {
      this.error = true;
    }
  }
  _computeFormattedValue(value) {
    try {
      let formatted = JSON.stringify(JSON.parse(formatted), null, 2);
      if (formatted !== value) {
        this.value = formatted;
      }
    } catch (e) {}
  }
  /**
   * Computed value based on parsing the value in question
   */
  _computeCurrentData(value) {
    try {
      return JSON.parse(value);
    } catch (e) {}
  }
}
window.customElements.define(JsonEditor.tag, JsonEditor);
export { JsonEditor };
