import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import "@polymer/paper-toggle-button/paper-toggle-button.js";
import "@polymer/paper-card/paper-card.js";
import "@polymer/paper-tabs/paper-tabs.js";
import "@polymer/paper-tabs/paper-tab.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/paper-input/paper-textarea.js";
import "@polymer/iron-icons/iron-icons.js";
import "@vaadin/vaadin-split-layout/vaadin-split-layout.js";
import "@lrnwebcomponents/eco-json-schema-form/eco-json-schema-form.js";
import "@lrnwebcomponents/eco-json-schema-form/lib/eco-json-schema-object.js";
import "@lrnwebcomponents/code-editor/code-editor.js";
import "@lrnwebcomponents/app-datepicker/app-datepicker.js";
import "@lrnwebcomponents/paper-icon-picker/paper-icon-picker.js";
import "@lrnwebcomponents/paper-input-flagged/paper-input-flagged.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";
/**
`hax-preview`
An element that can generate a form

@demo demo/index.html

@microcopy - the mental model for this element
 - element - the element to work against. an object that expresses enough information to create an element in the DOM. This is useful for remixing a tag via the json-form
 - source - a json object from some place loaded in remotely which will then be in json-schema format. This will then be parsed into a form which can be used to manipulate the element.

*/
Polymer({
  _template: html`
  <custom-style>
    <style is="custom-style" include="simple-colors">
      :host {
        display: block;
        background-color: rgba(0, 0, 0, .6);
      }
      paper-card.form-wrapper {
        margin: 0;
        padding: 8px;
        width: 100%;
        min-height: 160px;
        background-color: transparent;
      }

      vaadin-split-layout {
        display: flex;
        justify-content: space-around;
        height: 100%;
        --vaadin-split-layout-splitter: {
          background-color: #FFFFFF;
        };
      }
      eco-json-schema-object {
        width: 50%;
      }

      .vaadin-split-layout-panel {
        flex: 1 1 auto;
        width: 100%;
        flex-wrap: nowrap;
        margin: 0;
        height: 100%;
      }
      #form {
        --eco-json-schema-object-form: {
          display: block !important;
        }
      }
      #preview {
        padding: 16px;
        color: #000000;
        background-color: #FFFFFF;
      }
      #preview ::slotted(*) {
        float: unset !important;
        float: unset !important;
        margin: unset !important;
        width: unset !important;
      }
      .preview-text {
        font-size: 14px;
        font-family: sans-serif;
        color: #FFFFFF;
        font-style: italic;
        width: 100%;
        height: 24px;
        border-bottom: 1px solid #FFFFFF;
        text-align: center;
        padding: 8px 0;
        box-sizing: content-box;
      }
      .preview-text iron-icon {
        margin: 0 8px;
        display: inline-block;
      }
      .preview-text-bottom {
        border-bottom: unset;
        border-top: 1px solid #FFFFFF;
      }
      @media screen and (max-width: 550px) {
        .hide-on-mobile {
          opacity: 0;
          visibility: hidden;
          position: absolute;
          left: -9999px;
        }
      }

      #modetabs {
        height: 80px;
        border-bottom: 1px #e5e5e5 solid;
        display: block;
        justify-content: space-evenly;
        --paper-tabs-selection-bar-color: var(--simple-colors-light-green-background1);
        --paper-tabs: {
          background: transparent;
        }
      }

      #modetabs paper-tab {
        display: inline-flex;
        height:100%;
        --paper-tab-ink: var(--simple-colors-light-green-background1);
        --paper-tab: {
          font-size: 16px;
        }
      }
      #modetabs paper-tab paper-button {
        min-width: unset;
        width: 100%;
        height:100%;
      }
      .human-name {
        width: 100%;
        text-align: center;
        font-size: 16px;
      }
      .preview-buttons {
        height: 64px;
        padding: 0px;
        color: #222222;
        border-bottom: 1px var(--hax-manager-steps-color) solid;
        background-color: transparent;
        margin: 16px 0 0 0;
        text-align: center;
        box-sizing: content-box;
      }
      eco-json-schema-object {
        color: white;
        --eco-json-schema-object-form : {
          -ms-flex: unset;
          -webkit-flex: unset;
          flex: unset;
          -webkit-flex-basis: unset;
          flex-basis: unset;
        };
        --paper-icon-button: {
          background-color: rgba(0,0,0,.9) !important;
          border-radius: 50%;
        }
        --code-pen-title-color: #FFFFFF;
        --paper-checkbox-size: 22px;
        --paper-checkbox-unchecked-color: var(--simple-colors-blue-grey-background1);
        --paper-checkbox-checked-color: var(--simple-colors-light-green-foreground3);
        --paper-checkbox-checked-ink-color: #FFFFFF;
        --paper-checkbox-unchecked-ink-color: #FFFFFF;
        --paper-checkbox-label-color: var(--simple-colors-blue-grey-background1);
        --paper-checkbox-label-checked-color: var(--simple-colors-accent-background1);
        --paper-checkbox-label: {
          font-size: 22px;
          line-height: 32px;
        };
        --paper-input-container-invalid-color: var(--simple-colors-red-foreground3);
        --secondary-text-color: #FFFFFF;
        --primary-text-color: #FFFFFF;
        --primary-color: #FFFFFF;
        --paper-input-container-input-color: #FFFFFF;
        --paper-input-container-color: #FFFFFF !important;
        --paper-input-container-focus-color: var(--simple-colors-light-green-background1) !important;
        --paper-listbox-color: #000000;
      }
      .preview-buttons paper-button {
        min-width: unset;
        width: 40%;
        color: #000000;
        display: inline-block;
        background-color: var(--simple-colors-light-green-background1);
      }
    </style>
  </custom-style>
    <vaadin-split-layout class="panel-wrapper">
      <!-- critique panel -->
      <div class="vaadin-split-layout-panel">
        <div class="preview-buttons">
          <paper-button id="insert" raised on-click="insert">[[editTitle]]</paper-button>
          <paper-button id="cancel" raised on-click="cancel">Cancel</paper-button>
        </div>
        <div class="preview-text"><iron-icon icon="icons:arrow-drop-down"></iron-icon><iron-icon icon="icons:arrow-drop-down"></iron-icon><iron-icon icon="icons:arrow-drop-down"></iron-icon>[[humanName]] preview<iron-icon icon="icons:arrow-drop-down"></iron-icon><iron-icon icon="icons:arrow-drop-down"></iron-icon><iron-icon icon="icons:arrow-drop-down"></iron-icon></div>
        <div id="preview"></div>
        <div class="preview-text preview-text-bottom"><iron-icon icon="icons:arrow-drop-up"></iron-icon><iron-icon icon="icons:arrow-drop-up"></iron-icon><iron-icon icon="icons:arrow-drop-up"></iron-icon>end preview<iron-icon icon="icons:arrow-drop-up"></iron-icon><iron-icon icon="icons:arrow-drop-up"></iron-icon><iron-icon icon="icons:arrow-drop-up"></iron-icon></div>
      </div>
      <div class="vaadin-split-layout-panel">
        <paper-tabs hidden\$="[[!haspreviewNode]]" id="modetabs" selected="{{modeTab}}" attr-for-selected="data-mode">
          <paper-tab id="configurebutton" data-mode="configure"><paper-button raised="" noink="">Configure</paper-button></paper-tab>
          <paper-tab id="advancedbutton" data-mode="advanced"><paper-button raised="" noink="">Advanced</paper-button></paper-tab>
        </paper-tabs>
        <paper-card class="form-wrapper">
          <eco-json-schema-object id="form" schema="[[schema]]" value="{{value}}"></eco-json-schema-object>
        </paper-card>
      </div>
    </vaadin-split-layout>
`,

  is: "hax-preview",

  behaviors: [simpleColorsBehaviors],

  observers: ["_valueChanged(value.*, formKey)"],

  properties: {
    /**
     * A reference to the previewNode so we can do data binding correctly.
     */
    previewNode: {
      type: Object,
      value: {},
      observer: "_previewNodeChanged"
    },
    /**
     * Returned value from the form input.
     */
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
      value: "configure",
      observer: "_editorModeChanged"
    },
    /**
     * Edit title since it can change based on the operation
     */
    editTitle: {
      type: String,
      value: "Update"
    },
    /**
     * The element to work against expressing the structure of the DOM element
     * to create in the preview area.
     */
    element: {
      type: Object,
      observer: "_elementChanged"
    },
    /**
     * Boolean association for a preview node existing.
     */
    haspreviewNode: {
      type: Boolean,
      computed: "_computedHasPreviewNode(previewNode)"
    },
    /**
     * JSON Schema.
     */
    schema: {
      type: Object,
      value: {
        schema: {}
      }
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
      type: Boolean,
      computed: "_computedEditSource(formKey)"
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
     * Active Name from the properties
     */
    humanName: {
      type: String
    }
  },

  /**
   * Trigger cancel on manager as it is the parent here.
   */
  cancel: function(e) {
    window.HaxStore.instance.haxManager.cancel(e);
  },

  /**
   * Trigger insert on manager as it is the parent here.
   */
  insert: function(e) {
    window.HaxStore.instance.haxManager.insertHaxElement(e);
  },

  /**
   * Make a boolean to match the preview node's existance.
   */
  _computedHasPreviewNode: function(previewNode) {
    if (typeof previewNode.tagName === typeof undefined) {
      return false;
    } else {
      return true;
    }
  },

  /**
   * Edit source.
   */
  _computedEditSource: function(newValue, oldValue) {
    if (typeof newValue !== typeof undefined) {
      if (
        typeof this.previewNode.tagName !== typeof undefined &&
        window.HaxStore.instance.elementList[
          this.previewNode.tagName.toLowerCase()
        ]
      ) {
        return window.HaxStore.instance.elementList[
          this.previewNode.tagName.toLowerCase()
        ].canEditSource;
      }
    }
    return true;
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
   * Form key changed, rebuild schema for the form
   * but don't update the element. Critical difference.
   */
  _formKeyChanged: function(newValue, oldValue) {
    // ensure this doesn't run the 1st pass
    if (typeof oldValue !== typeof undefined) {
      var schema = {};
      // see if we can get schema off of this.
      if (
        typeof this.previewNode !== typeof undefined &&
        typeof this.previewNode.tagName !== typeof undefined &&
        typeof window.HaxStore.instance.elementList[
          this.previewNode.tagName.toLowerCase()
        ] !== typeof undefined
      ) {
        let element = this.element;
        let props =
          window.HaxStore.instance.elementList[
            this.previewNode.tagName.toLowerCase()
          ];
        if (typeof this.previewNode.getHaxJSONSchemaType === "function") {
          schema = window.HaxStore.instance.getHaxJSONSchema(
            newValue,
            props,
            this.previewNode
          );
        } else {
          schema = window.HaxStore.instance.getHaxJSONSchema(newValue, props);
        }
        for (var property in element.properties) {
          if (element.properties.hasOwnProperty(property)) {
            if (typeof schema.properties[property] !== typeof undefined) {
              schema.properties[property].value = element.properties[property];
              // support custom element input
              if (
                typeof schema.properties[property].component !==
                typeof undefined
              ) {
                schema.properties[property].component.properties.value =
                  element.properties[property];
              }
              // attempt to set the property in the preview node
              if (
                element.properties[property] != null &&
                !element.properties[property].readOnly
              ) {
                // attempt to set it, should be no problem but never know
                try {
                  this.previewNode.set(property, element.properties[property]);
                } catch (e) {
                  console.log(e);
                }
              }
            }
            this.set("value." + property, element.properties[property]);
          }
        }
        for (var prop in props.settings[newValue]) {
          let previewNode = this.previewNode;
          if (
            typeof props.settings[this.formKey][prop].slot !== typeof undefined
          ) {
            // walk through the slots looking for the value of it
            for (var i in dom(previewNode).getEffectiveChildNodes()) {
              // test for element nodes to be safe
              if (
                typeof dom(previewNode).getEffectiveChildNodes()[i] !==
                  typeof undefined &&
                dom(previewNode).getEffectiveChildNodes()[i].nodeType === 1 &&
                dom(previewNode).getEffectiveChildNodes()[i].slot ===
                  props.settings[this.formKey][prop].slot
              ) {
                if (
                  typeof dom(previewNode).getEffectiveChildNodes()[i]
                    .innerHTML !== typeof undefined
                ) {
                  schema.properties[
                    props.settings[this.formKey][prop].slot
                  ].value = dom(previewNode).getEffectiveChildNodes()[
                    i
                  ].innerHTML;
                  this.set(
                    "value." + props.settings[this.formKey][prop].slot,
                    dom(previewNode).getEffectiveChildNodes()[i].innerHTML
                  );
                }
              }
            }
          }
        }
      }
      this.set("schema", {});
      this.set("schema", schema);
    }
  },

  /**
   * When the preview node is updated, pull schema associated with it
   */
  _previewNodeChanged: function(newValue, oldValue) {
    // ensure this doesn't run the 1st pass
    if (typeof oldValue !== typeof undefined && newValue != oldValue) {
      // see if we can get schema off of this.
      if (
        typeof newValue.tagName !== typeof undefined &&
        typeof window.HaxStore.instance.elementList[
          newValue.tagName.toLowerCase()
        ] !== typeof undefined
      ) {
        let element = this.element;
        let props =
          window.HaxStore.instance.elementList[newValue.tagName.toLowerCase()];
        let schema = {};
        if (typeof newValue.getHaxJSONSchemaType === "function") {
          schema = window.HaxStore.instance.getHaxJSONSchema(
            this.formKey,
            props,
            newValue
          );
        } else {
          schema = window.HaxStore.instance.getHaxJSONSchema(
            this.formKey,
            props
          );
        }
        // generate a human name for this
        if (typeof props.gizmo.title === typeof undefined) {
          this.humanName = newValue.tagName.replace("-", " ").toLowerCase();
        } else {
          this.humanName = props.gizmo.title;
        }
        // first, allow element properties to dictate defaults
        for (var property in element.properties) {
          if (element.properties.hasOwnProperty(property)) {
            if (typeof schema.properties[property] !== typeof undefined) {
              schema.properties[property].value = element.properties[property];
              // support custom element input
              if (
                typeof schema.properties[property].component !==
                typeof undefined
              ) {
                schema.properties[property].component.properties.value =
                  element.properties[property];
              }
            }
            // ensure this isn't read only
            if (
              element.properties[property] != null &&
              !element.properties[property].readOnly
            ) {
              // attempt to set it, should be no problem but never know
              try {
                newValue.set(property, element.properties[property]);
              } catch (e) {}
            }
            this.set("value." + property, element.properties[property]);
          }
        }
        // then, let the node itself dictate defaults if things are not set
        for (var property in newValue) {
          if (
            newValue.hasOwnProperty(property) &&
            typeof schema.properties[property] !== typeof undefined &&
            typeof newValue[property].value !== typeof undefined &&
            newValue[property].value !== null
          ) {
            schema.properties[property].value =
              newValue.properties[property].value;
            // support custom element input
            if (
              typeof schema.properties[property].component !== typeof undefined
            ) {
              schema.properties[property].component.properties.value =
                newValue.properties[property].value;
            }
            this.set("value." + property, newValue.properties[property].value);
          }
        }
        // need to specifically walk through slots if there is anything
        // that says it has to come from a slot
        for (var prop in props.settings[this.formKey]) {
          if (
            typeof props.settings[this.formKey][prop].slot !== typeof undefined
          ) {
            // walk through the slots looking for the value of it
            for (var i in dom(newValue).getEffectiveChildNodes()) {
              // test for element nodes to be safe
              if (
                typeof dom(newValue).getEffectiveChildNodes()[i] !==
                  typeof undefined &&
                dom(newValue).getEffectiveChildNodes()[i].nodeType === 1 &&
                dom(newValue).getEffectiveChildNodes()[i].slot ===
                  props.settings[this.formKey][prop].slot
              ) {
                if (
                  typeof dom(newValue).getEffectiveChildNodes()[i].innerHTML !==
                  typeof undefined
                ) {
                  schema.properties[
                    props.settings[this.formKey][prop].slot
                  ].value = dom(newValue).getEffectiveChildNodes()[i].innerHTML;
                  this.set(
                    "value." + props.settings[this.formKey][prop].slot,
                    dom(newValue).getEffectiveChildNodes()[i].innerHTML
                  );
                }
              }
            }
          }
        }
        this.set("schema", {});
        this.set("schema", schema);
      }
    }
  },

  /**
   * Element changed, update the preview area.
   */
  _elementChanged: function(newValue, oldValue) {
    if (
      typeof newValue !== typeof undefined &&
      Object.keys(newValue).length > 0
    ) {
      // wipe the preview area and assocaited node
      let preview = this.$.preview;
      window.HaxStore.wipeSlot(preview, "*");
      this.set("previewNode", {});
      this.modeTab = "configure";
      // if we have something, generate the new element inside it
      if (newValue != null && newValue.length != 0) {
        var frag = document.createElement(newValue.tag);
        frag.innerHTML = newValue.content;
        // clone the fragment which will force an escalation to full node
        var newNode = frag.cloneNode(true);
        // send this into the root, which should filter it back down into the slot
        preview.appendChild(newNode);
        // need to let append propagate, it probably takes like no time
        setTimeout(() => {
          this.set("previewNode", newNode);
        }, 100);
      }
    } else {
      this.modeTab = "advanced";
      this.set("previewNode", {});
    }
  },

  /**
   * Value in the form has changed, reflect to the preview.
   */
  _valueChanged: function() {
    let node = this.previewNode;
    // sanity check and then get props and mesh with form value response
    if (
      typeof node.tagName !== typeof undefined &&
      typeof window.HaxStore.instance.elementList[
        node.tagName.toLowerCase()
      ] !== typeof undefined
    ) {
      let props =
        window.HaxStore.instance.elementList[node.tagName.toLowerCase()];
      // loop through the properties for the form
      for (var value in props.settings[this.formKey]) {
        // support property binding
        if (
          props.settings[this.formKey].hasOwnProperty(value) &&
          typeof props.settings[this.formKey][value].property !==
            typeof undefined &&
          typeof this.value[props.settings[this.formKey][value].property] !==
            typeof undefined
        ) {
          // special supporting for boolean because html is weird :p
          if (
            this.value[props.settings[this.formKey][value].property] === true
          ) {
            node[props.settings[this.formKey][value].property] = true;
          } else if (
            this.value[props.settings[this.formKey][value].property] === false
          ) {
            node[props.settings[this.formKey][value].property] = false;
          } else {
            // account for Array based values
            if (
              this.value[props.settings[this.formKey][value].property] !=
                null &&
              this.value[props.settings[this.formKey][value].property]
                .constructor === Array
            ) {
              node.set(
                props.settings[this.formKey][value].property,
                window.HaxStore.toArray(
                  this.value[props.settings[this.formKey][value].property]
                )
              );
            } else if (
              this.value[props.settings[this.formKey][value].property] !=
                null &&
              this.value[props.settings[this.formKey][value].property]
                .constructor === Object
            ) {
              node.set(
                props.settings[this.formKey][value].property,
                this.value[props.settings[this.formKey][value].property]
              );
            } else {
              // string most likely
              node.set(
                props.settings[this.formKey][value].property,
                this.value[props.settings[this.formKey][value].property]
              );
            }
          }
          this.set(
            "element.properties." +
              props.settings[this.formKey][value].property,
            this.value[props.settings[this.formKey][value].property]
          );
        } else if (
          props.settings[this.formKey].hasOwnProperty(value) &&
          typeof props.settings[this.formKey][value].attribute !==
            typeof undefined &&
          typeof this.value[props.settings[this.formKey][value].attribute] !==
            typeof undefined
        ) {
          let attributeName = window.HaxStore.camelToDash(
            props.settings[this.formKey][value].attribute
          );
          // special supporting for boolean because html is weird :p
          if (
            this.value[props.settings[this.formKey][value].attribute] === true
          ) {
            node.setAttribute(attributeName, attributeName);
          } else if (
            this.value[props.settings[this.formKey][value].attribute] === false
          ) {
            node.removeAttribute(attributeName);
          } else {
            // special support for innerText which is an html attribute...sorta
            if (attributeName === "inner-text") {
              node.innerText = this.value[
                props.settings[this.formKey][value].attribute
              ];
              node.removeAttribute("innertext");
            } else if (
              this.value[props.settings[this.formKey][value].attribute] !==
                null &&
              this.value[props.settings[this.formKey][value].attribute] !==
                "null"
            ) {
              node.setAttribute(
                attributeName,
                this.value[props.settings[this.formKey][value].attribute]
              );
            }
          }
          // have to specially ignore this since it's not really an
          // attribute that we want to keep but HTML4 that brought us
          // this was never meant to be used how developers now do it...
          if (
            attributeName !== "inner-text" &&
            this.value[props.settings[this.formKey][value].attribute] !==
              null &&
            this.value[props.settings[this.formKey][value].attribute] !== "null"
          ) {
            this.set(
              "element.properties." +
                props.settings[this.formKey][value].attribute,
              this.value[props.settings[this.formKey][value].attribute]
            );
          }
        } else if (
          typeof props.settings[this.formKey][value].slot !==
            typeof undefined &&
          typeof this.value[props.settings[this.formKey][value].slot] !==
            typeof undefined
        ) {
          let slotTag = "span";
          // slot binding, special support for code editor which needs a template tag
          // @todo need a tag that implies slot wrapper if it should at all.
          if (node.tagName.toLowerCase() === "code-editor") {
            slotTag = "template";
          }
          var tmpel = document.createElement(slotTag);
          // support unnamed slots
          if (props.settings[this.formKey][value].slot !== "") {
            tmpel.slot = props.settings[this.formKey][value].slot;
          }
          tmpel.innerHTML = this.value[
            props.settings[this.formKey][value].slot
          ];
          // wipe just the slot in question
          window.HaxStore.wipeSlot(
            node,
            props.settings[this.formKey][value].slot
          );
          // inject the slotted content
          dom(node).appendChild(tmpel);
          this.set(
            "element.content",
            "<template>" + tmpel.innerHTML + "</template>"
          );
        } else {
          // @todo add support for disabling based on not having advanced
        }
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
