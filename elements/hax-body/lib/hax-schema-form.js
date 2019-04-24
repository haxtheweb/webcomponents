import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/paper-toggle-button/paper-toggle-button.js";
import "@polymer/paper-card/paper-card.js";
import "@polymer/paper-tabs/paper-tabs.js";
import "@polymer/paper-tabs/paper-tab.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/iron-icons/iron-icons.js";
import "@lrnwebcomponents/eco-json-schema-form/eco-json-schema-form.js";
import "@lrnwebcomponents/eco-json-schema-form/lib/eco-json-schema-object.js";
import "@lrnwebcomponents/code-editor/code-editor.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";
import "./hax-shared-styles.js";
/**
 * `hax-schema-form`
 * `An element that can generate a form from HAXschema`
 * @demo demo/index.html
 * @microcopy - the mental model for this element
 *  - source - a json object from some place loaded in remotely which will then be in json-schema format. This will then be parsed into a form which can be used to manipulate the element.
 */
Polymer({
  _template: html`
    <style include="simple-colors hax-shared-styles">
      :host {
        display: block;
        background-color: #ffffff;
        overflow: hidden;
      }
      paper-card.form-wrapper {
        margin: 0;
        padding: 0 16px 80px 16px;
        width: 100%;
        min-height: 160px;
        background-color: transparent;
        overflow: auto;
        height: 100%;
      }

      eco-json-schema-object {
        width: 50%;
      }
      #form {
        --eco-json-schema-object-form: {
          display: block !important;
        }
      }

      #modetabs {
        height: 64px;
        padding: 0px;
        margin: 16px 0 0 0;
        box-sizing: content-box;
        color: var(--hax-color-text);
        text-align: center;
        background-color: transparent;
        border-bottom: 1px solid var(--hax-color-border-outline);
        display: block;
        justify-content: space-evenly;
        --paper-tabs-selection-bar-color: var(--hax-color-accent1);
        --paper-tabs: {
          background: transparent;
        }
      }

      #modetabs paper-tab {
        display: inline-flex;
        height: 100%;
        --paper-tab-ink: var(--hax-color-accent1);
        --paper-tab: {
          font-size: 16px;
        }
      }
      #modetabs paper-tab paper-button {
        min-width: unset;
        width: 100%;
        background-color: var(--hax-color-accent1);
        color: var(--hax-color-accent1-text);
      }
      eco-json-schema-object {
        color: var(--hax-text-color);
        --eco-json-schema-object-form : {
          -ms-flex: unset;
          -webkit-flex: unset;
          flex: unset;
          -webkit-flex-basis: unset;
          flex-basis: unset;
        }
      }
    </style>
    <paper-tabs
      id="modetabs"
      selected="{{modeTab}}"
      attr-for-selected="data-mode"
    >
      <paper-tab id="configurebutton" data-mode="configure"
        ><paper-button raised="" noink="">Configure</paper-button></paper-tab
      >
      <paper-tab id="advancedbutton" data-mode="advanced"
        ><paper-button raised="" noink="">Advanced</paper-button></paper-tab
      >
    </paper-tabs>
    <paper-card class="form-wrapper">
      <eco-json-schema-object
        id="form"
        schema="[[schema]]"
        value="{{value}}"
      ></eco-json-schema-object>
    </paper-card>
  `,

  is: "hax-schema-form",
  properties: {
    /**
     * Returned value from the form input.
     */
    initialValue: {
      type: Object,
      notify: true,
      value: {},
      observer: "_valueChanged"
    },
    value: {
      type: Object,
      notify: true,
      value: {}
    },
    /**
     * State of mode tabs.
     */
    modeTab: {
      type: String,
      observer: "_editorModeChanged"
    },
    /**
     * If this is the advancedForm or not. Default to not but slider allows
     * switching mode for the form to be presented.
     */
    advancedForm: {
      type: Boolean,
      value: false
    },
    /**
     * If we should show source view or not.
     */
    canEditSource: {
      type: Boolean
    },
    /**
     * Form key from hax to target.
     */
    formKey: {
      type: String,
      computed: "_computedFormKey(advancedForm)",
      observer: "_formKeyChanged"
    },
    /**
     * JSON Schema.
     */
    schema: {
      type: Object
    },
    /**
     * JSON Schema.
     */
    configureSchema: {
      type: Object,
      value: {
        schema: {}
      }
    },
    /**
     * JSON Schema.
     */
    advancedSchema: {
      type: Object,
      value: {
        schema: {}
      }
    }
  },
  attached: function() {
    afterNextRender(this, function() {
      import("@polymer/paper-input/paper-textarea.js");
      import("app-datepicker/app-datepicker.js");
      import("@lrnwebcomponents/simple-picker/simple-picker.js");
      import("@lrnwebcomponents/simple-icon-picker/simple-icon-picker.js");
      import("@lrnwebcomponents/simple-colors/lib/simple-colors-picker.js");
      import("@lrnwebcomponents/paper-input-flagged/paper-input-flagged.js");
    });
  },
  /**
   * Compute form key to use.
   */
  _computedFormKey: function(advanced) {
    if (advanced) {
      return "advanced";
    } else {
      return "configure";
    }
  },
  /**
   * Form key changed, rebuild schema for the form.
   */
  _formKeyChanged: function(newValue, oldValue) {
    if (newValue) {
      if (newValue === "advanced") {
        this.set("schema", this.advancedSchema);
      } else {
        this.set("schema", this.configureSchema);
      }
      this.notifyPath("schema.*");
    }
  },
  /**
   * Value in the form has changed, reflect to the preview.
   */
  _valueChanged: function(newValue) {
    if (newValue && this.schema) {
      for (var i in newValue) {
        console.log(this.schema);
        console.log(i);
        this.schema[i].value = newValue[i];
      }
    }
  },
  /**
   * Editor mode changed handler
   */
  _editorModeChanged: function(mode) {
    if (mode) {
      // if it's the advanced setting then toggle the advancedForm setting
      if (mode === "advanced") {
        this.advancedForm = true;
      } else {
        this.advancedForm = false;
      }
    }
  }
});
