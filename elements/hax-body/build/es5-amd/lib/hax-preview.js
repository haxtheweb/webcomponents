define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/polymer/lib/legacy/polymer.dom.js",
  "../node_modules/@polymer/paper-toggle-button/paper-toggle-button.js",
  "../node_modules/@polymer/paper-card/paper-card.js",
  "../node_modules/@polymer/paper-tabs/paper-tabs.js",
  "../node_modules/@polymer/paper-tabs/paper-tab.js",
  "../node_modules/@polymer/paper-button/paper-button.js",
  "../node_modules/@polymer/paper-input/paper-textarea.js",
  "../node_modules/@polymer/iron-icons/iron-icons.js",
  "../node_modules/@vaadin/vaadin-split-layout/vaadin-split-layout.js",
  "../node_modules/@lrnwebcomponents/eco-json-schema-form/eco-json-schema-form.js",
  "../node_modules/@lrnwebcomponents/eco-json-schema-form/lib/eco-json-schema-object.js",
  "../node_modules/@lrnwebcomponents/code-editor/code-editor.js",
  "../node_modules/@lrnwebcomponents/app-datepicker/app-datepicker.js",
  "../node_modules/@lrnwebcomponents/paper-icon-picker/paper-icon-picker.js",
  "../node_modules/@lrnwebcomponents/paper-input-flagged/paper-input-flagged.js",
  "../node_modules/@lrnwebcomponents/simple-colors/simple-colors.js"
], function(_polymerLegacy, _polymerDom) {
  "use strict";
  function _templateObject_9c9eb1b0edcb11e88aa8b5030f652492() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n  <custom-style>\n    <style is="custom-style" include="simple-colors">\n      :host {\n        display: block;\n        background-color: rgba(0, 0, 0, .6);\n      }\n      paper-card.form-wrapper {\n        margin: 0;\n        padding: 8px;\n        width: 100%;\n        min-height: 160px;\n        background-color: transparent;\n      }\n\n      vaadin-split-layout {\n        display: flex;\n        justify-content: space-around;\n        height: 100%;\n        --vaadin-split-layout-splitter: {\n          background-color: #FFFFFF;\n        };\n      }\n      eco-json-schema-object {\n        width: 50%;\n      }\n\n      .vaadin-split-layout-panel {\n        flex: 1 1 auto;\n        width: 100%;\n        flex-wrap: nowrap;\n        margin: 0;\n        height: 100%;\n      }\n      #form {\n        --eco-json-schema-object-form: {\n          display: block !important;\n        }\n      }\n      #preview {\n        padding: 16px;\n        color: #000000;\n        background-color: #FFFFFF;\n      }\n      #preview ::slotted(*) {\n        float: unset !important;\n        float: unset !important;\n        margin: unset !important;\n        width: unset !important;\n      }\n      .preview-text {\n        font-size: 14px;\n        font-family: sans-serif;\n        color: #FFFFFF;\n        font-style: italic;\n        width: 100%;\n        height: 24px;\n        border-bottom: 1px solid #FFFFFF;\n        text-align: center;\n        padding: 8px 0;\n        box-sizing: content-box;\n      }\n      .preview-text iron-icon {\n        margin: 0 8px;\n        display: inline-block;\n      }\n      .preview-text-bottom {\n        border-bottom: unset;\n        border-top: 1px solid #FFFFFF;\n      }\n      @media screen and (max-width: 550px) {\n        .hide-on-mobile {\n          opacity: 0;\n          visibility: hidden;\n          position: absolute;\n          left: -9999px;\n        }\n      }\n\n      #modetabs {\n        height: 80px;\n        border-bottom: 1px #e5e5e5 solid;\n        display: block;\n        justify-content: space-evenly;\n        --paper-tabs-selection-bar-color: var(--simple-colors-light-green-background1);\n        --paper-tabs: {\n          background: transparent;\n        }\n      }\n\n      #modetabs paper-tab {\n        display: inline-flex;\n        height:100%;\n        --paper-tab-ink: var(--simple-colors-light-green-background1);\n        --paper-tab: {\n          font-size: 16px;\n        }\n      }\n      #modetabs paper-tab paper-button {\n        min-width: unset;\n        width: 100%;\n        height:100%;\n      }\n      .human-name {\n        width: 100%;\n        text-align: center;\n        font-size: 16px;\n      }\n      .preview-buttons {\n        height: 64px;\n        padding: 0px;\n        color: #222222;\n        border-bottom: 1px var(--hax-manager-steps-color) solid;\n        background-color: transparent;\n        margin: 16px 0 0 0;\n        text-align: center;\n        box-sizing: content-box;\n      }\n      eco-json-schema-object {\n        color: white;\n        --eco-json-schema-object-form : {\n          -ms-flex: unset;\n          -webkit-flex: unset;\n          flex: unset;\n          -webkit-flex-basis: unset;\n          flex-basis: unset;\n        };\n        --paper-icon-button: {\n          background-color: rgba(0,0,0,.9) !important;\n          border-radius: 50%;\n        }\n        --code-pen-title-color: #FFFFFF;\n        --paper-checkbox-size: 22px;\n        --paper-checkbox-unchecked-color: var(--simple-colors-blue-grey-background1);\n        --paper-checkbox-checked-color: var(--simple-colors-light-green-foreground3);\n        --paper-checkbox-checked-ink-color: #FFFFFF;\n        --paper-checkbox-unchecked-ink-color: #FFFFFF;\n        --paper-checkbox-label-color: var(--simple-colors-blue-grey-background1);\n        --paper-checkbox-label-checked-color: var(--simple-colors-accent-background1);\n        --paper-checkbox-label: {\n          font-size: 22px;\n          line-height: 32px;\n        };\n        --paper-input-container-invalid-color: var(--simple-colors-red-foreground3);\n        --secondary-text-color: #FFFFFF;\n        --primary-text-color: #FFFFFF;\n        --primary-color: #FFFFFF;\n        --paper-input-container-input-color: #FFFFFF;\n        --paper-input-container-color: #FFFFFF !important;\n        --paper-input-container-focus-color: var(--simple-colors-light-green-background1) !important;\n        --paper-listbox-color: #000000;\n      }\n      .preview-buttons paper-button {\n        min-width: unset;\n        width: 40%;\n        color: #000000;\n        display: inline-block;\n        background-color: var(--simple-colors-light-green-background1);\n      }\n    </style>\n  </custom-style>\n    <vaadin-split-layout class="panel-wrapper">\n      <!-- critique panel -->\n      <div class="vaadin-split-layout-panel">\n        <div class="preview-buttons">\n          <paper-button id="insert" raised on-click="insert">[[editTitle]]</paper-button>\n          <paper-button id="cancel" raised on-click="cancel">Cancel</paper-button>\n        </div>\n        <div class="preview-text"><iron-icon icon="icons:arrow-drop-down"></iron-icon><iron-icon icon="icons:arrow-drop-down"></iron-icon><iron-icon icon="icons:arrow-drop-down"></iron-icon>[[humanName]] preview<iron-icon icon="icons:arrow-drop-down"></iron-icon><iron-icon icon="icons:arrow-drop-down"></iron-icon><iron-icon icon="icons:arrow-drop-down"></iron-icon></div>\n        <div id="preview"></div>\n        <div class="preview-text preview-text-bottom"><iron-icon icon="icons:arrow-drop-up"></iron-icon><iron-icon icon="icons:arrow-drop-up"></iron-icon><iron-icon icon="icons:arrow-drop-up"></iron-icon>end preview<iron-icon icon="icons:arrow-drop-up"></iron-icon><iron-icon icon="icons:arrow-drop-up"></iron-icon><iron-icon icon="icons:arrow-drop-up"></iron-icon></div>\n      </div>\n      <div class="vaadin-split-layout-panel">\n        <paper-tabs hidden$="[[!haspreviewNode]]" id="modetabs" selected="{{modeTab}}" attr-for-selected="data-mode">\n          <paper-tab id="configurebutton" data-mode="configure"><paper-button raised="" noink="">Configure</paper-button></paper-tab>\n          <paper-tab id="advancedbutton" data-mode="advanced"><paper-button raised="" noink="">Advanced</paper-button></paper-tab>\n        </paper-tabs>\n        <paper-card class="form-wrapper">\n          <eco-json-schema-object id="form" schema="[[schema]]" value="{{value}}"></eco-json-schema-object>\n        </paper-card>\n      </div>\n    </vaadin-split-layout>\n'
      ],
      [
        '\n  <custom-style>\n    <style is="custom-style" include="simple-colors">\n      :host {\n        display: block;\n        background-color: rgba(0, 0, 0, .6);\n      }\n      paper-card.form-wrapper {\n        margin: 0;\n        padding: 8px;\n        width: 100%;\n        min-height: 160px;\n        background-color: transparent;\n      }\n\n      vaadin-split-layout {\n        display: flex;\n        justify-content: space-around;\n        height: 100%;\n        --vaadin-split-layout-splitter: {\n          background-color: #FFFFFF;\n        };\n      }\n      eco-json-schema-object {\n        width: 50%;\n      }\n\n      .vaadin-split-layout-panel {\n        flex: 1 1 auto;\n        width: 100%;\n        flex-wrap: nowrap;\n        margin: 0;\n        height: 100%;\n      }\n      #form {\n        --eco-json-schema-object-form: {\n          display: block !important;\n        }\n      }\n      #preview {\n        padding: 16px;\n        color: #000000;\n        background-color: #FFFFFF;\n      }\n      #preview ::slotted(*) {\n        float: unset !important;\n        float: unset !important;\n        margin: unset !important;\n        width: unset !important;\n      }\n      .preview-text {\n        font-size: 14px;\n        font-family: sans-serif;\n        color: #FFFFFF;\n        font-style: italic;\n        width: 100%;\n        height: 24px;\n        border-bottom: 1px solid #FFFFFF;\n        text-align: center;\n        padding: 8px 0;\n        box-sizing: content-box;\n      }\n      .preview-text iron-icon {\n        margin: 0 8px;\n        display: inline-block;\n      }\n      .preview-text-bottom {\n        border-bottom: unset;\n        border-top: 1px solid #FFFFFF;\n      }\n      @media screen and (max-width: 550px) {\n        .hide-on-mobile {\n          opacity: 0;\n          visibility: hidden;\n          position: absolute;\n          left: -9999px;\n        }\n      }\n\n      #modetabs {\n        height: 80px;\n        border-bottom: 1px #e5e5e5 solid;\n        display: block;\n        justify-content: space-evenly;\n        --paper-tabs-selection-bar-color: var(--simple-colors-light-green-background1);\n        --paper-tabs: {\n          background: transparent;\n        }\n      }\n\n      #modetabs paper-tab {\n        display: inline-flex;\n        height:100%;\n        --paper-tab-ink: var(--simple-colors-light-green-background1);\n        --paper-tab: {\n          font-size: 16px;\n        }\n      }\n      #modetabs paper-tab paper-button {\n        min-width: unset;\n        width: 100%;\n        height:100%;\n      }\n      .human-name {\n        width: 100%;\n        text-align: center;\n        font-size: 16px;\n      }\n      .preview-buttons {\n        height: 64px;\n        padding: 0px;\n        color: #222222;\n        border-bottom: 1px var(--hax-manager-steps-color) solid;\n        background-color: transparent;\n        margin: 16px 0 0 0;\n        text-align: center;\n        box-sizing: content-box;\n      }\n      eco-json-schema-object {\n        color: white;\n        --eco-json-schema-object-form : {\n          -ms-flex: unset;\n          -webkit-flex: unset;\n          flex: unset;\n          -webkit-flex-basis: unset;\n          flex-basis: unset;\n        };\n        --paper-icon-button: {\n          background-color: rgba(0,0,0,.9) !important;\n          border-radius: 50%;\n        }\n        --code-pen-title-color: #FFFFFF;\n        --paper-checkbox-size: 22px;\n        --paper-checkbox-unchecked-color: var(--simple-colors-blue-grey-background1);\n        --paper-checkbox-checked-color: var(--simple-colors-light-green-foreground3);\n        --paper-checkbox-checked-ink-color: #FFFFFF;\n        --paper-checkbox-unchecked-ink-color: #FFFFFF;\n        --paper-checkbox-label-color: var(--simple-colors-blue-grey-background1);\n        --paper-checkbox-label-checked-color: var(--simple-colors-accent-background1);\n        --paper-checkbox-label: {\n          font-size: 22px;\n          line-height: 32px;\n        };\n        --paper-input-container-invalid-color: var(--simple-colors-red-foreground3);\n        --secondary-text-color: #FFFFFF;\n        --primary-text-color: #FFFFFF;\n        --primary-color: #FFFFFF;\n        --paper-input-container-input-color: #FFFFFF;\n        --paper-input-container-color: #FFFFFF !important;\n        --paper-input-container-focus-color: var(--simple-colors-light-green-background1) !important;\n        --paper-listbox-color: #000000;\n      }\n      .preview-buttons paper-button {\n        min-width: unset;\n        width: 40%;\n        color: #000000;\n        display: inline-block;\n        background-color: var(--simple-colors-light-green-background1);\n      }\n    </style>\n  </custom-style>\n    <vaadin-split-layout class="panel-wrapper">\n      <!-- critique panel -->\n      <div class="vaadin-split-layout-panel">\n        <div class="preview-buttons">\n          <paper-button id="insert" raised on-click="insert">[[editTitle]]</paper-button>\n          <paper-button id="cancel" raised on-click="cancel">Cancel</paper-button>\n        </div>\n        <div class="preview-text"><iron-icon icon="icons:arrow-drop-down"></iron-icon><iron-icon icon="icons:arrow-drop-down"></iron-icon><iron-icon icon="icons:arrow-drop-down"></iron-icon>[[humanName]] preview<iron-icon icon="icons:arrow-drop-down"></iron-icon><iron-icon icon="icons:arrow-drop-down"></iron-icon><iron-icon icon="icons:arrow-drop-down"></iron-icon></div>\n        <div id="preview"></div>\n        <div class="preview-text preview-text-bottom"><iron-icon icon="icons:arrow-drop-up"></iron-icon><iron-icon icon="icons:arrow-drop-up"></iron-icon><iron-icon icon="icons:arrow-drop-up"></iron-icon>end preview<iron-icon icon="icons:arrow-drop-up"></iron-icon><iron-icon icon="icons:arrow-drop-up"></iron-icon><iron-icon icon="icons:arrow-drop-up"></iron-icon></div>\n      </div>\n      <div class="vaadin-split-layout-panel">\n        <paper-tabs hidden\\$="[[!haspreviewNode]]" id="modetabs" selected="{{modeTab}}" attr-for-selected="data-mode">\n          <paper-tab id="configurebutton" data-mode="configure"><paper-button raised="" noink="">Configure</paper-button></paper-tab>\n          <paper-tab id="advancedbutton" data-mode="advanced"><paper-button raised="" noink="">Advanced</paper-button></paper-tab>\n        </paper-tabs>\n        <paper-card class="form-wrapper">\n          <eco-json-schema-object id="form" schema="[[schema]]" value="{{value}}"></eco-json-schema-object>\n        </paper-card>\n      </div>\n    </vaadin-split-layout>\n'
      ]
    );
    _templateObject_9c9eb1b0edcb11e88aa8b5030f652492 = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_9c9eb1b0edcb11e88aa8b5030f652492()
    ),
    is: "hax-preview",
    behaviors: [simpleColorsBehaviors],
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
      canEditSource: {
        type: Boolean,
        computed: "_computedEditSource(formKey)"
      },
      formKey: {
        type: String,
        computed: "_computedFormKey(advancedForm)",
        observer: "_formKeyChanged"
      },
      humanName: { type: String }
    },
    cancel: function cancel(e) {
      window.HaxStore.instance.haxManager.cancel(e);
    },
    insert: function insert(e) {
      window.HaxStore.instance.haxManager.insertHaxElement(e);
    },
    _computedHasPreviewNode: function _computedHasPreviewNode(previewNode) {
      if (babelHelpers.typeof(previewNode.tagName) === "undefined") {
        return !1;
      } else {
        return !0;
      }
    },
    _computedEditSource: function _computedEditSource(newValue) {
      if (babelHelpers.typeof(newValue) !== "undefined") {
        if (
          babelHelpers.typeof(this.previewNode.tagName) !== "undefined" &&
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
    _computedFormKey: function _computedFormKey(advanced) {
      if (advanced) {
        return "advanced";
      } else {
        return "configure";
      }
    },
    _formKeyChanged: function _formKeyChanged(newValue, oldValue) {
      if (babelHelpers.typeof(oldValue) !== "undefined") {
        var schema = {};
        if (
          babelHelpers.typeof(this.previewNode) !== "undefined" &&
          babelHelpers.typeof(this.previewNode.tagName) !== "undefined" &&
          babelHelpers.typeof(
            window.HaxStore.instance.elementList[
              this.previewNode.tagName.toLowerCase()
            ]
          ) !== "undefined"
        ) {
          var element = this.element,
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
              if (
                babelHelpers.typeof(schema.properties[property]) !== "undefined"
              ) {
                schema.properties[property].value =
                  element.properties[property];
                if (
                  babelHelpers.typeof(schema.properties[property].component) !==
                  "undefined"
                ) {
                  schema.properties[property].component.properties.value =
                    element.properties[property];
                }
                if (
                  null != element.properties[property] &&
                  !element.properties[property].readOnly
                ) {
                  try {
                    this.previewNode.set(
                      property,
                      element.properties[property]
                    );
                  } catch (e) {
                    console.log(e);
                  }
                }
              }
              this.set("value." + property, element.properties[property]);
            }
          }
          for (var prop in props.settings[newValue]) {
            var previewNode = this.previewNode;
            if (
              babelHelpers.typeof(props.settings[this.formKey][prop].slot) !==
              "undefined"
            ) {
              for (var i in (0, _polymerDom.dom)(
                previewNode
              ).getEffectiveChildNodes()) {
                if (
                  babelHelpers.typeof(
                    (0, _polymerDom.dom)(previewNode).getEffectiveChildNodes()[
                      i
                    ]
                  ) !== "undefined" &&
                  1 ===
                    (0, _polymerDom.dom)(previewNode).getEffectiveChildNodes()[
                      i
                    ].nodeType &&
                  (0, _polymerDom.dom)(previewNode).getEffectiveChildNodes()[i]
                    .slot === props.settings[this.formKey][prop].slot
                ) {
                  if (
                    babelHelpers.typeof(
                      (0, _polymerDom.dom)(
                        previewNode
                      ).getEffectiveChildNodes()[i].innerHTML
                    ) !== "undefined"
                  ) {
                    schema.properties[
                      props.settings[this.formKey][prop].slot
                    ].value = (0, _polymerDom.dom)(
                      previewNode
                    ).getEffectiveChildNodes()[i].innerHTML;
                    this.set(
                      "value." + props.settings[this.formKey][prop].slot,
                      (0, _polymerDom.dom)(
                        previewNode
                      ).getEffectiveChildNodes()[i].innerHTML
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
    _previewNodeChanged: function _previewNodeChanged(newValue, oldValue) {
      if (
        babelHelpers.typeof(oldValue) !== "undefined" &&
        newValue != oldValue
      ) {
        if (
          babelHelpers.typeof(newValue.tagName) !== "undefined" &&
          babelHelpers.typeof(
            window.HaxStore.instance.elementList[newValue.tagName.toLowerCase()]
          ) !== "undefined"
        ) {
          var element = this.element,
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
          if (babelHelpers.typeof(props.gizmo.title) === "undefined") {
            this.humanName = newValue.tagName.replace("-", " ").toLowerCase();
          } else {
            this.humanName = props.gizmo.title;
          }
          for (var property in element.properties) {
            if (element.properties.hasOwnProperty(property)) {
              if (
                babelHelpers.typeof(schema.properties[property]) !== "undefined"
              ) {
                schema.properties[property].value =
                  element.properties[property];
                if (
                  babelHelpers.typeof(schema.properties[property].component) !==
                  "undefined"
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
              babelHelpers.typeof(schema.properties[property]) !==
                "undefined" &&
              babelHelpers.typeof(newValue[property].value) !== "undefined" &&
              null !== newValue[property].value
            ) {
              schema.properties[property].value =
                newValue.properties[property].value;
              if (
                babelHelpers.typeof(schema.properties[property].component) !==
                "undefined"
              ) {
                schema.properties[property].component.properties.value =
                  newValue.properties[property].value;
              }
              this.set(
                "value." + property,
                newValue.properties[property].value
              );
            }
          }
          for (var prop in props.settings[this.formKey]) {
            if (
              babelHelpers.typeof(props.settings[this.formKey][prop].slot) !==
              "undefined"
            ) {
              for (var i in (0, _polymerDom.dom)(
                newValue
              ).getEffectiveChildNodes()) {
                if (
                  babelHelpers.typeof(
                    (0, _polymerDom.dom)(newValue).getEffectiveChildNodes()[i]
                  ) !== "undefined" &&
                  1 ===
                    (0, _polymerDom.dom)(newValue).getEffectiveChildNodes()[i]
                      .nodeType &&
                  (0, _polymerDom.dom)(newValue).getEffectiveChildNodes()[i]
                    .slot === props.settings[this.formKey][prop].slot
                ) {
                  if (
                    babelHelpers.typeof(
                      (0, _polymerDom.dom)(newValue).getEffectiveChildNodes()[i]
                        .innerHTML
                    ) !== "undefined"
                  ) {
                    schema.properties[
                      props.settings[this.formKey][prop].slot
                    ].value = (0, _polymerDom.dom)(
                      newValue
                    ).getEffectiveChildNodes()[i].innerHTML;
                    this.set(
                      "value." + props.settings[this.formKey][prop].slot,
                      (0, _polymerDom.dom)(newValue).getEffectiveChildNodes()[i]
                        .innerHTML
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
    _elementChanged: function _elementChanged(newValue) {
      var _this = this;
      if (
        babelHelpers.typeof(newValue) !== "undefined" &&
        0 < Object.keys(newValue).length
      ) {
        var preview = this.$.preview;
        window.HaxStore.wipeSlot(preview, "*");
        this.set("previewNode", {});
        this.modeTab = "configure";
        if (null != newValue && 0 != newValue.length) {
          var frag = document.createElement(newValue.tag);
          frag.innerHTML = newValue.content;
          var newNode = frag.cloneNode(!0);
          preview.appendChild(newNode);
          setTimeout(function() {
            _this.set("previewNode", newNode);
          }, 100);
        }
      } else {
        this.modeTab = "advanced";
        this.set("previewNode", {});
      }
    },
    _valueChanged: function _valueChanged() {
      var node = this.previewNode;
      if (
        babelHelpers.typeof(node.tagName) !== "undefined" &&
        babelHelpers.typeof(
          window.HaxStore.instance.elementList[node.tagName.toLowerCase()]
        ) !== "undefined"
      ) {
        var props =
          window.HaxStore.instance.elementList[node.tagName.toLowerCase()];
        for (var value in props.settings[this.formKey]) {
          if (
            props.settings[this.formKey].hasOwnProperty(value) &&
            babelHelpers.typeof(
              props.settings[this.formKey][value].property
            ) !== "undefined" &&
            babelHelpers.typeof(
              this.value[props.settings[this.formKey][value].property]
            ) !== "undefined"
          ) {
            if (
              !0 === this.value[props.settings[this.formKey][value].property]
            ) {
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
            babelHelpers.typeof(
              props.settings[this.formKey][value].attribute
            ) !== "undefined" &&
            babelHelpers.typeof(
              this.value[props.settings[this.formKey][value].attribute]
            ) !== "undefined"
          ) {
            var attributeName = window.HaxStore.camelToDash(
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
              "null" !==
                this.value[props.settings[this.formKey][value].attribute]
            ) {
              this.set(
                "element.properties." +
                  props.settings[this.formKey][value].attribute,
                this.value[props.settings[this.formKey][value].attribute]
              );
            }
          } else if (
            babelHelpers.typeof(props.settings[this.formKey][value].slot) !==
              "undefined" &&
            babelHelpers.typeof(
              this.value[props.settings[this.formKey][value].slot]
            ) !== "undefined"
          ) {
            var slotTag = "span";
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
            (0, _polymerDom.dom)(node).appendChild(tmpel);
            this.set(
              "element.content",
              "<template>" + tmpel.innerHTML + "</template>"
            );
          }
        }
      }
    },
    _editorModeChanged: function _editorModeChanged(mode) {
      if (mode) {
        if ("advanced" === mode) {
          this.advancedForm = !0;
        } else {
          this.advancedForm = !1;
        }
      }
    }
  });
});
