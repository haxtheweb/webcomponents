/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
/**
 * `json-editor`
 * `simple JSON blob data binding to a text area`
 * @demo demo/index.html
 * @element json-editor
 */
class JsonEditor extends LitElement {
  
  //styles function
  static get styles() {
    return  [
      
      css`
:host {
  display: block;
}
:host([hidden]) {
  display: none;
}
      `
    ];
  }
  // render function
  render() {
    return html`

<custom-style>
  <style>
  :host([error]) paper-textarea {
    --iron-autogrow-textarea: {
      background-color: #ffeeee;
    };
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
    };
  }
  </style>
</custom-style>
<paper-textarea 
  label="${this.label}"
  value="${this.value}"
  @value-changed="${this.valueEvent}"
  error-message="Invalid JSON!"
  ?readonly="${this.disabled}"
  ?invalid="${this.error}"
  max-rows="${this.maxRows}"></paper-textarea>`;
  }

  // properties available to the custom element for data binding
    static get properties() {
    return {
  
  ...super.properties,
  
  /**
   * label for the text area
   */
  "label": {
    "type": String
  },
  /**
   * State of being valid JSON object
   */
  "error": {
    "type": Boolean,
    "reflect": true
  },
  /**
   * toggling disabled state of the editor
   */
  "disabled": {
    "type": Boolean,
    "reflect": true
  },
  /**
   * max rows in the textarea
   */
  "maxRows": {
    "type": Number,
    "reflect": true,
    "attribute": "max-rows"
  },
  /**
   * String based value of the editor, use this to set initial value
   */
  "value": {
    "type": String,
    "reflect": false
  },
  /**
   * format test to update value so it's pretty printed
   */
  "formatTest": {
    "type": String,
    "attribute": "format-test"
  },
  /**
   * The current data object
   */
  "currentData": {
    "type": Object,
    "attribute": "current-data"
  }
}
;
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "json-editor";
  }
  constructor() {
    super();
    this.label = "JSON data";
    this.error = false;
    this.disabled = false;
    this.maxRows = 0;
    this.value = "";
    import("@polymer/paper-input/paper-textarea.js");
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      let notifiedProps = ["currentData", "value"];
      if (notifiedProps.includes(propName)) {
        // notify
        let eventName = `${propName
          .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2")
          .toLowerCase()}-changed`;
        this.dispatchEvent(
          new CustomEvent(eventName, {
            detail: {
              value: this[propName]
            }
          })
        );
      }
      if (propName == "value") {
        this.formatTest = this._computeFormattedValue(this[propName]);
        this.currentData = this._computeCurrentData(this[propName]);
        this._valueChanged(this[propName]);
      }
    });
  }
  valueEvent(e) {
    this.value = e.detail.value;
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
