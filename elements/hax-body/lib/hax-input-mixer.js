import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import "@polymer/app-layout/app-toolbar/app-toolbar.js";
import "@polymer/paper-input/paper-textarea.js";
import "@polymer/paper-input/paper-input.js";
import "@polymer/paper-checkbox/paper-checkbox.js";
import "@lrnwebcomponents/simple-colors/lib/simple-colors-picker.js";
import "@polymer/paper-slider/paper-slider.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "./hax-context-item-menu.js";
import "./hax-context-item.js";
/**
`hax-input-mixer`
A context menu that provides common custom-element based authoring options. While
trying to call for haxProperties which can automatically generate the buttons
required for populating input.

@demo demo/index.html

@microcopy - the mental model for this element
 - context menu - this is a menu of custom-element based buttons and events for use in a larger solution.
*/
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
        color: #FFFFFF;
      }
      app-toolbar {
        background-color: #3e3e3e;
        color: white;
        padding: 0 0 0 16px;
      }
      hax-context-item {
        margin: 0;
        width: 40px;
        height: 40px;
      }
      #elementoptions {
        height: inherit;
      }
      #input {
        color: #FFFFFF;
      }
      paper-checkbox {
        --paper-checkbox-label-color: #FFFFFF;
      }
      .input-mixer-label {
        padding-left: 4px;
      }
      paper-textarea,
      paper-input {
        --paper-input-container-color: #BBBBFF;
        --paper-input-container-focus-color: #FFFFFF;
        --paper-input-container-invalid-color: #FFAAAA;
        --paper-input-container-input-color: #FFFFFF;
        --paper-input-container-shared-input-style: {
          color: #FFFFFF;
          background: transparent;
          margin: 0;
          padding: 0;
          min-width: 20em;
          line-height: 1em;
          font-size: 1em;
          margin-top: -8px;
          margin-bottom: 8px;
          outline: none;
          border: none;
        }
      }
      .input-method {
        color: #FFFFFF;
      }
    </style>
    <app-toolbar>
      <template is="dom-if" if="[[__inputselect]]">
        <span class="input-mixer-label">[[label]]</span>
        <hax-context-item-menu selected="{{value}}" icon="[[icon]]" id="input">
          <slot></slot>
        </hax-context-item-menu>
      </template>
      <span class="input-method">
      <template is="dom-if" if="[[__inputtextarea]]">
        <paper-textarea id="input" label="[[label]]" value="{{value}}" auto-validate="" pattern="[[validation]]" required="[[required]]"></paper-textarea>
      </template>
      <template is="dom-if" if="[[__inputtextfield]]">
        <paper-input id="input" type="[[validationType]]" label="[[label]]" value="{{value}}" auto-validate="" pattern="[[validation]]" required="[[required]]"></paper-input>
      </template>
      <template is="dom-if" if="[[__inputboolean]]">
        <paper-checkbox id="input" checked="{{value}}">[[label]]</paper-checkbox>
      </template>
      <template is="dom-if" if="[[__inputflipboolean]]">
        <paper-checkbox id="input" checked="{{value}}">[[label]]</paper-checkbox>
      </template>
      <template is="dom-if" if="[[__inputcolorpicker]]">
        <span>[[label]]</span>
        <simple-colors-picker id="input" value="{{value}}"></simple-colors-picker>
      </template>
      </span>
      <paper-tooltip for="input" position="top" offset="14">
        [[description]]
      </paper-tooltip>
      <hax-context-item id="updatebutton" icon="subdirectory-arrow-right" label\$="Update [[label]]" event-name="hax-update-tap"></hax-context-item>
    </app-toolbar>
`,

  is: "hax-input-mixer",

  listeners: {
    "hax-context-item-selected": "_haxContextOperation"
  },

  properties: {
    /**
     * value, where the magic happens.
     */
    value: {
      type: String,
      value: null
    },
    /**
     * Label for the input
     */
    label: {
      type: String,
      reflectToAttribute: true
    },
    /**
     * Optional regex Validation for input and textarea fields
     */
    validation: {
      type: String,
      reflectToAttribute: true
    },
    /**
     * Optional input type validation; use on input field
     */
    validationType: {
      type: String,
      reflectToAttribute: true
    },
    /**
     * Required; used on input and textarea fields
     */
    required: {
      type: Boolean,
      reflectToAttribute: true
    },
    /**
     * Options for the input if it's a select of some form
     */
    options: {
      type: Object,
      value: {},
      reflectToAttribute: true
    },
    /**
     * Optional icon that represents the item mixing.
     */
    icon: {
      type: String,
      value: "android",
      reflectToAttribute: true
    },
    /**
     * longer description for the input
     */
    description: {
      type: String,
      reflectToAttribute: true
    },
    /**
     * longer description for the input
     */
    inputMethod: {
      type: String,
      value: null,
      reflectToAttribute: true,
      observer: "_inputMethodChanged"
    },
    /**
     * longer description for the input
     */
    propertyToBind: {
      type: String,
      reflectToAttribute: true
    },
    /**
     * slot to bind input back to
     */
    slotToBind: {
      type: String,
      reflectToAttribute: true
    }
  },

  /**
   * Ensure our weird data binding for templates is set initially.
   */
  ready: function() {
    // prime methods even though invisible most likely
    this._resetInputMethods();
  },

  /**
   * Input method changes, allow our templates to rebind correctly.
   */
  _inputMethodChanged: function(newValue, oldValue) {
    if (newValue != null && typeof oldValue !== typeof undefined) {
      let method = newValue;
      let methods = this.validInputMethods();
      // ensure this is a valid method of input
      if (methods.includes(method)) {
        // set everything false to force a correct rebind of template tags
        this._resetInputMethods();
        // this is weird looking, I know...
        this["__input" + method] = true;
        // hide the menu if it was open previously
        // need to paint into the slot so clean it out and repaint
        let slot = dom(this);
        while (slot.firstChild !== null) {
          slot.removeChild(slot.firstChild);
        }
        // select needs to inject settings into the slot
        if (method === "select" && typeof this.options !== typeof undefined) {
          // this hits the key => value relationship correctly
          for (val in this.options) {
            item = document.createElement("paper-item");
            item.attributes.value = val;
            item.innerHTML = this.options[val];
            slot.appendChild(item);
          }
        }
        // try and force cursor to focus on this element
        setTimeout(() => {
          if (typeof this.$$("#input").hideMenu === "function") {
            this.$$("#input").hideMenu();
          }
          this.$$("#input").focus();
        }, 200);
      }
    }
  },

  /**
   * Validate input method.
   */
  validInputMethods: function() {
    var methods = [
      "flipboolean",
      "boolean",
      "select",
      "confirm",
      "textfield",
      "textarea",
      "datepicker",
      "colorpicker",
      "number"
    ];
    return methods;
  },

  /**
   * Reset all our meta attributes.
   */
  _resetInputMethods: function() {
    let methods = this.validInputMethods();
    for (var i = 0; i < methods.length; i++) {
      this["__input" + methods[i]] = false;
    }
  },

  /**
   * Respond to simple modifications.
   */
  _haxContextOperation: function(e) {
    let detail = e.detail;
    // support a simple insert event to bubble up or everything else
    switch (detail.eventName) {
      case "hax-update-tap":
        // minor dataType conversion for boolean
        if (this.inputMethod == "boolean") {
          this.value = this.value;
        }
        // opposite value for a flip-boolean
        else if (this.inputMethod == "flipboolean") {
          this.value = !this.value;
        } else if (this.inputMethod == "select") {
          var count = 0;
          // convert value into key value
          for (val in this.options) {
            if (count == this.value) {
              this.value = val;
              continue;
            }
            count++;
          }
        }
        let mixer = {
          value: this.value,
          propertyToBind: this.propertyToBind,
          slotToBind: this.slotToBind
        };
        // retarget event with all the guts of this item
        // this way we can do whatever we want in hax-body which is
        // basically notice that we got asked to do some data binding
        // and then actually do it and hide this item!!!!
        this.fire("hax-input-mixer-update", { inputMixer: mixer });
        break;
    }
  }
});
