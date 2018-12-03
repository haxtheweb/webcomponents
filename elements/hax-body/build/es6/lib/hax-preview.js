import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import { dom } from "../node_modules/@polymer/polymer/lib/legacy/polymer.dom.js";
import "../node_modules/@polymer/paper-toggle-button/paper-toggle-button.js";
import "../node_modules/@polymer/paper-card/paper-card.js";
import "../node_modules/@polymer/paper-tabs/paper-tabs.js";
import "../node_modules/@polymer/paper-tabs/paper-tab.js";
import "../node_modules/@polymer/paper-button/paper-button.js";
import "../node_modules/@polymer/paper-input/paper-textarea.js";
import "../node_modules/@polymer/iron-icons/iron-icons.js";
import "../node_modules/@vaadin/vaadin-split-layout/vaadin-split-layout.js";
import "../node_modules/@lrnwebcomponents/eco-json-schema-form/eco-json-schema-form.js";
import "../node_modules/@lrnwebcomponents/eco-json-schema-form/lib/eco-json-schema-object.js";
import "../node_modules/@lrnwebcomponents/code-editor/code-editor.js";
import "../node_modules/@lrnwebcomponents/app-datepicker/app-datepicker.js";
import "../node_modules/@lrnwebcomponents/paper-icon-picker/paper-icon-picker.js";
import "../node_modules/@lrnwebcomponents/paper-input-flagged/paper-input-flagged.js";
import "../node_modules/@lrnwebcomponents/simple-colors/simple-colors.js";
Polymer({
  _template: html`
    <custom-style>
      <style is="custom-style" include="simple-colors">
        :host {
          display: block;
          background-color: rgba(0, 0, 0, 0.6);
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
            background-color: #ffffff;
          }
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
          background-color: #ffffff;
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
          color: #ffffff;
          font-style: italic;
          width: 100%;
          height: 24px;
          border-bottom: 1px solid #ffffff;
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
          border-top: 1px solid #ffffff;
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
          --paper-tabs-selection-bar-color: var(
            --simple-colors-default-theme-light-green-1
          );
          --paper-tabs: {
            background: transparent;
          }
        }

        #modetabs paper-tab {
          display: inline-flex;
          height: 100%;
          --paper-tab-ink: var(--simple-colors-default-theme-light-green-1);
          --paper-tab: {
            font-size: 16px;
          }
        }
        #modetabs paper-tab paper-button {
          min-width: unset;
          width: 100%;
          height: 100%;
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
          }
          --paper-icon-button: {
            background-color: rgba(0, 0, 0, 0.9) !important;
            border-radius: 50%;
          }
          --code-pen-title-color: #ffffff;
          --paper-checkbox-size: 22px;
          --paper-checkbox-unchecked-color: var(
            --simple-colors-blue-grey-background1
          );
          --paper-checkbox-checked-color: var(
            --simple-colors-light-green-foreground3
          );
          --paper-checkbox-checked-ink-color: #ffffff;
          --paper-checkbox-unchecked-ink-color: #ffffff;
          --paper-checkbox-label-color: var(
            --simple-colors-blue-grey-background1
          );
          --paper-checkbox-label-checked-color: var(
            --simple-colors-accent-background1
          );
          --paper-checkbox-label: {
            font-size: 22px;
            line-height: 32px;
          }
          --paper-input-container-invalid-color: var(
            --simple-colors-red-foreground3
          );
          --secondary-text-color: #ffffff;
          --primary-text-color: #ffffff;
          --primary-color: #ffffff;
          --paper-input-container-input-color: #ffffff;
          --paper-input-container-color: #ffffff !important;
          --paper-input-container-focus-color: var(
            --simple-colors-default-theme-light-green-1
          ) !important;
          --paper-listbox-color: #000000;
        }
        .preview-buttons paper-button {
          min-width: unset;
          width: 40%;
          color: #000000;
          display: inline-block;
          background-color: var(--simple-colors-default-theme-light-green-1);
        }
      </style>
    </custom-style>
    <vaadin-split-layout class="panel-wrapper">
      <!-- critique panel -->
      <div class="vaadin-split-layout-panel">
        <div class="preview-buttons">
          <paper-button id="insert" raised on-click="insert"
            >[[editTitle]]</paper-button
          >
          <paper-button id="cancel" raised on-click="cancel"
            >Cancel</paper-button
          >
        </div>
        <div class="preview-text">
          <iron-icon icon="icons:arrow-drop-down"></iron-icon
          ><iron-icon icon="icons:arrow-drop-down"></iron-icon
          ><iron-icon icon="icons:arrow-drop-down"></iron-icon>[[humanName]]
          preview<iron-icon icon="icons:arrow-drop-down"></iron-icon
          ><iron-icon icon="icons:arrow-drop-down"></iron-icon
          ><iron-icon icon="icons:arrow-drop-down"></iron-icon>
        </div>
        <div id="preview"></div>
        <div class="preview-text preview-text-bottom">
          <iron-icon icon="icons:arrow-drop-up"></iron-icon
          ><iron-icon icon="icons:arrow-drop-up"></iron-icon
          ><iron-icon icon="icons:arrow-drop-up"></iron-icon>end
          preview<iron-icon icon="icons:arrow-drop-up"></iron-icon
          ><iron-icon icon="icons:arrow-drop-up"></iron-icon
          ><iron-icon icon="icons:arrow-drop-up"></iron-icon>
        </div>
      </div>
      <div class="vaadin-split-layout-panel">
        <paper-tabs
          hidden\$="[[!haspreviewNode]]"
          id="modetabs"
          selected="{{modeTab}}"
          attr-for-selected="data-mode"
        >
          <paper-tab id="configurebutton" data-mode="configure"
            ><paper-button raised="" noink=""
              >Configure</paper-button
            ></paper-tab
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
      </div>
    </vaadin-split-layout>
  `,
  is: "hax-preview",
  observers: ["_valueChanged(value.*, formKey)"],
  properties: {
    previewNode: { type: Object, value: {}, observer: "_previewNodeChanged" },
    value: { type: Object, notify: !0, value: {} },
    modeTab: {
      type: String,
      value: "configure",
      observer: "_editorModeChanged"
    },
    editTitle: { type: String, value: "Update" },
    element: { type: Object, observer: "_elementChanged" },
    haspreviewNode: {
      type: Boolean,
      computed: "_computedHasPreviewNode(previewNode)"
    },
    schema: { type: Object, value: { schema: {} } },
    advancedForm: { type: Boolean, value: !1 },
    canEditSource: { type: Boolean, computed: "_computedEditSource(formKey)" },
    formKey: {
      type: String,
      computed: "_computedFormKey(advancedForm)",
      observer: "_formKeyChanged"
    },
    humanName: { type: String }
  },
  cancel: function(e) {
    window.HaxStore.instance.haxManager.cancel(e);
  },
  insert: function(e) {
    window.HaxStore.instance.haxManager.insertHaxElement(e);
  },
  _computedHasPreviewNode: function(previewNode) {
    if (typeof previewNode.tagName === typeof void 0) {
      return !1;
    } else {
      return !0;
    }
  },
  _computedEditSource: function(newValue, oldValue) {
    if (typeof newValue !== typeof void 0) {
      if (
        typeof this.previewNode.tagName !== typeof void 0 &&
        window.HaxStore.instance.elementList[
          this.previewNode.tagName.toLowerCase()
        ]
      ) {
        return window.HaxStore.instance.elementList[
          this.previewNode.tagName.toLowerCase()
        ].canEditSource;
      }
    }
    return !0;
  },
  _computedFormKey: function(advanced) {
    if (advanced) {
      return "advanced";
    } else {
      return "configure";
    }
  },
  _formKeyChanged: function(newValue, oldValue) {
    if (typeof oldValue !== typeof void 0) {
      var schema = {};
      if (
        typeof this.previewNode !== typeof void 0 &&
        typeof this.previewNode.tagName !== typeof void 0 &&
        typeof window.HaxStore.instance.elementList[
          this.previewNode.tagName.toLowerCase()
        ] !== typeof void 0
      ) {
        let element = this.element,
          props =
            window.HaxStore.instance.elementList[
              this.previewNode.tagName.toLowerCase()
            ];
        if ("function" === typeof this.previewNode.getHaxJSONSchemaType) {
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
            if (typeof schema.properties[property] !== typeof void 0) {
              schema.properties[property].value = element.properties[property];
              if (
                typeof schema.properties[property].component !== typeof void 0
              ) {
                schema.properties[property].component.properties.value =
                  element.properties[property];
              }
              if (
                null != element.properties[property] &&
                !element.properties[property].readOnly
              ) {
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
            typeof props.settings[this.formKey][prop].slot !== typeof void 0
          ) {
            for (var i in dom(previewNode).getEffectiveChildNodes()) {
              if (
                typeof dom(previewNode).getEffectiveChildNodes()[i] !==
                  typeof void 0 &&
                1 === dom(previewNode).getEffectiveChildNodes()[i].nodeType &&
                dom(previewNode).getEffectiveChildNodes()[i].slot ===
                  props.settings[this.formKey][prop].slot
              ) {
                if (
                  typeof dom(previewNode).getEffectiveChildNodes()[i]
                    .innerHTML !== typeof void 0
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
  _previewNodeChanged: function(newValue, oldValue) {
    if (typeof oldValue !== typeof void 0 && newValue != oldValue) {
      if (
        typeof newValue.tagName !== typeof void 0 &&
        typeof window.HaxStore.instance.elementList[
          newValue.tagName.toLowerCase()
        ] !== typeof void 0
      ) {
        let element = this.element,
          props =
            window.HaxStore.instance.elementList[
              newValue.tagName.toLowerCase()
            ],
          schema = {};
        if ("function" === typeof newValue.getHaxJSONSchemaType) {
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
        if (typeof props.gizmo.title === typeof void 0) {
          this.humanName = newValue.tagName.replace("-", " ").toLowerCase();
        } else {
          this.humanName = props.gizmo.title;
        }
        for (var property in element.properties) {
          if (element.properties.hasOwnProperty(property)) {
            if (typeof schema.properties[property] !== typeof void 0) {
              schema.properties[property].value = element.properties[property];
              if (
                typeof schema.properties[property].component !== typeof void 0
              ) {
                schema.properties[property].component.properties.value =
                  element.properties[property];
              }
            }
            if (
              null != element.properties[property] &&
              !element.properties[property].readOnly
            ) {
              try {
                newValue.set(property, element.properties[property]);
              } catch (e) {}
            }
            this.set("value." + property, element.properties[property]);
          }
        }
        for (var property in newValue) {
          if (
            newValue.hasOwnProperty(property) &&
            typeof schema.properties[property] !== typeof void 0 &&
            typeof newValue[property].value !== typeof void 0 &&
            null !== newValue[property].value
          ) {
            schema.properties[property].value =
              newValue.properties[property].value;
            if (
              typeof schema.properties[property].component !== typeof void 0
            ) {
              schema.properties[property].component.properties.value =
                newValue.properties[property].value;
            }
            this.set("value." + property, newValue.properties[property].value);
          }
        }
        for (var prop in props.settings[this.formKey]) {
          if (
            typeof props.settings[this.formKey][prop].slot !== typeof void 0
          ) {
            for (var i in dom(newValue).getEffectiveChildNodes()) {
              if (
                typeof dom(newValue).getEffectiveChildNodes()[i] !==
                  typeof void 0 &&
                1 === dom(newValue).getEffectiveChildNodes()[i].nodeType &&
                dom(newValue).getEffectiveChildNodes()[i].slot ===
                  props.settings[this.formKey][prop].slot
              ) {
                if (
                  typeof dom(newValue).getEffectiveChildNodes()[i].innerHTML !==
                  typeof void 0
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
  _elementChanged: function(newValue, oldValue) {
    if (typeof newValue !== typeof void 0 && 0 < Object.keys(newValue).length) {
      let preview = this.$.preview;
      window.HaxStore.wipeSlot(preview, "*");
      this.set("previewNode", {});
      this.modeTab = "configure";
      if (null != newValue && 0 != newValue.length) {
        var frag = document.createElement(newValue.tag);
        frag.innerHTML = newValue.content;
        var newNode = frag.cloneNode(!0);
        preview.appendChild(newNode);
        setTimeout(() => {
          this.set("previewNode", newNode);
        }, 100);
      }
    } else {
      this.modeTab = "advanced";
      this.set("previewNode", {});
    }
  },
  _valueChanged: function() {
    let node = this.previewNode;
    if (
      typeof node.tagName !== typeof void 0 &&
      typeof window.HaxStore.instance.elementList[
        node.tagName.toLowerCase()
      ] !== typeof void 0
    ) {
      let props =
        window.HaxStore.instance.elementList[node.tagName.toLowerCase()];
      for (var value in props.settings[this.formKey]) {
        if (
          props.settings[this.formKey].hasOwnProperty(value) &&
          typeof props.settings[this.formKey][value].property !==
            typeof void 0 &&
          typeof this.value[props.settings[this.formKey][value].property] !==
            typeof void 0
        ) {
          if (!0 === this.value[props.settings[this.formKey][value].property]) {
            node[props.settings[this.formKey][value].property] = !0;
          } else if (
            !1 === this.value[props.settings[this.formKey][value].property]
          ) {
            node[props.settings[this.formKey][value].property] = !1;
          } else {
            if (
              null !=
                this.value[props.settings[this.formKey][value].property] &&
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
              null !=
                this.value[props.settings[this.formKey][value].property] &&
              this.value[props.settings[this.formKey][value].property]
                .constructor === Object
            ) {
              node.set(
                props.settings[this.formKey][value].property,
                this.value[props.settings[this.formKey][value].property]
              );
            } else {
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
            typeof void 0 &&
          typeof this.value[props.settings[this.formKey][value].attribute] !==
            typeof void 0
        ) {
          let attributeName = window.HaxStore.camelToDash(
            props.settings[this.formKey][value].attribute
          );
          if (
            !0 === this.value[props.settings[this.formKey][value].attribute]
          ) {
            node.setAttribute(attributeName, attributeName);
          } else if (
            !1 === this.value[props.settings[this.formKey][value].attribute]
          ) {
            node.removeAttribute(attributeName);
          } else {
            if ("inner-text" === attributeName) {
              node.innerText = this.value[
                props.settings[this.formKey][value].attribute
              ];
              node.removeAttribute("innertext");
            } else if (
              null !==
                this.value[props.settings[this.formKey][value].attribute] &&
              "null" !==
                this.value[props.settings[this.formKey][value].attribute]
            ) {
              node.setAttribute(
                attributeName,
                this.value[props.settings[this.formKey][value].attribute]
              );
            }
          }
          if (
            "inner-text" !== attributeName &&
            null !==
              this.value[props.settings[this.formKey][value].attribute] &&
            "null" !== this.value[props.settings[this.formKey][value].attribute]
          ) {
            this.set(
              "element.properties." +
                props.settings[this.formKey][value].attribute,
              this.value[props.settings[this.formKey][value].attribute]
            );
          }
        } else if (
          typeof props.settings[this.formKey][value].slot !== typeof void 0 &&
          typeof this.value[props.settings[this.formKey][value].slot] !==
            typeof void 0
        ) {
          let slotTag = "span";
          if ("code-editor" === node.tagName.toLowerCase()) {
            slotTag = "template";
          }
          var tmpel = document.createElement(slotTag);
          if ("" !== props.settings[this.formKey][value].slot) {
            tmpel.slot = props.settings[this.formKey][value].slot;
          }
          tmpel.innerHTML = this.value[
            props.settings[this.formKey][value].slot
          ];
          window.HaxStore.wipeSlot(
            node,
            props.settings[this.formKey][value].slot
          );
          dom(node).appendChild(tmpel);
          this.set(
            "element.content",
            "<template>" + tmpel.innerHTML + "</template>"
          );
        } else {
        }
      }
    }
  },
  _editorModeChanged: function(mode) {
    if (mode) {
      if ("advanced" === mode) {
        this.advancedForm = !0;
      } else {
        this.advancedForm = !1;
      }
    }
  }
});
