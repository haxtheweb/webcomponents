define([
  "exports",
  "../node_modules/@polymer/polymer/lib/legacy/polymer.dom.js"
], function(_exports, _polymerDom) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.HAXWiring = void 0;
  var HAXWiring = function HAXWiring() {
    var _this = this;
    babelHelpers.classCallCheck(this, HAXWiring);
    this.haxProperties = {
      canScale: !1,
      canPosition: !1,
      canEditSource: !1,
      settings: { quick: [], configure: [], advanced: [] },
      wipeSlot: {}
    };
    this.setHaxProperties = function(props) {
      var tag =
          1 < arguments.length && arguments[1] !== void 0 ? arguments[1] : "",
        context =
          2 < arguments.length && arguments[2] !== void 0
            ? arguments[2]
            : document,
        isReady =
          3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : !1;
      if (
        babelHelpers.typeof(props.api) ===
        ("undefined" === typeof void 0
          ? "undefined"
          : babelHelpers.typeof(void 0))
      ) {
        props.api = "1";
      }
      if ("1" == props.api) {
        if (
          babelHelpers.typeof(props.canPosition) ===
          ("undefined" === typeof void 0
            ? "undefined"
            : babelHelpers.typeof(void 0))
        ) {
          props.canPosition = !0;
        }
        if (
          babelHelpers.typeof(props.canScale) ===
          ("undefined" === typeof void 0
            ? "undefined"
            : babelHelpers.typeof(void 0))
        ) {
          props.canScale = !0;
        }
        if (
          babelHelpers.typeof(props.canEditSource) ===
          ("undefined" === typeof void 0
            ? "undefined"
            : babelHelpers.typeof(void 0))
        ) {
          props.canEditSource = !1;
        }
        if (
          babelHelpers.typeof(props.gizmo) ===
          ("undefined" === typeof void 0
            ? "undefined"
            : babelHelpers.typeof(void 0))
        ) {
          props.gizmo = !1;
        }
        if (
          babelHelpers.typeof(props.settings) !==
          ("undefined" === typeof void 0
            ? "undefined"
            : babelHelpers.typeof(void 0))
        ) {
          if (
            babelHelpers.typeof(props.settings.quick) ===
            ("undefined" === typeof void 0
              ? "undefined"
              : babelHelpers.typeof(void 0))
          ) {
            props.settings.quick = [];
          }
          for (var i = 0; i < props.settings.quick.length; i++) {
            props.settings.quick[i] = _this.validateSetting(
              props.settings.quick[i]
            );
            if (!props.settings.quick[i]) {
              props.settings.quick.splice(i, 1);
            }
          }
          if (
            babelHelpers.typeof(props.settings.configure) ===
            ("undefined" === typeof void 0
              ? "undefined"
              : babelHelpers.typeof(void 0))
          ) {
            props.settings.configure = [];
          }
          for (var _i = 0; _i < props.settings.configure.length; _i++) {
            props.settings.configure[_i] = _this.validateSetting(
              props.settings.configure[_i]
            );
            if (!props.settings.configure[_i]) {
              props.settings.configure.splice(_i, 1);
            }
          }
          if (
            babelHelpers.typeof(props.settings.advanced) ===
            ("undefined" === typeof void 0
              ? "undefined"
              : babelHelpers.typeof(void 0))
          ) {
            props.settings.advanced = [];
          }
          for (var _i2 = 0; _i2 < props.settings.advanced.length; _i2++) {
            props.settings.advanced[_i2] = _this.validateSetting(
              props.settings.advanced[_i2]
            );
            if (!props.settings.advanced[_i2]) {
              props.settings.advanced.splice(_i2, 1);
            }
          }
          props.settings.advanced.push({
            attribute: "class",
            title: "Classes",
            description: "CSS classes applied manually to the element",
            inputMethod: "textfield"
          });
          props.settings.advanced.push({
            attribute: "style",
            title: "Styles",
            description: "Custom CSS styles as applied to the element",
            inputMethod: "textfield"
          });
          props.settings.advanced.push({
            attribute: "prefix",
            title: "Schema: prefix",
            description: "Schema prefixes",
            inputMethod: "textfield"
          });
          props.settings.advanced.push({
            attribute: "typeof",
            title: "Schema: TypeOf",
            description: "typeof definition for Schema usage",
            inputMethod: "textfield"
          });
          props.settings.advanced.push({
            attribute: "property",
            title: "Schema: Property",
            description: "typeof definition for Schema usage",
            inputMethod: "textfield"
          });
          props.settings.advanced.push({
            attribute: "resource",
            title: "Schema: Resource ID",
            description: "Schema resource identifier",
            inputMethod: "textfield"
          });
          props.settings.advanced.push({
            attribute: "id",
            title: "ID",
            description: "element ID, only set this if you know why",
            inputMethod: "textfield"
          });
          props.settings.advanced.push({
            attribute: "slot",
            title: "slot",
            description: "DOM slot area",
            inputMethod: "textfield"
          });
        }
        if (
          babelHelpers.typeof(props.saveOptions) ===
          ("undefined" === typeof void 0
            ? "undefined"
            : babelHelpers.typeof(void 0))
        ) {
          props.saveOptions = { wipeSlot: !1 };
        }
        if (isReady) {
          if (
            "" !== tag &&
            babelHelpers.typeof(window.HaxStore) ===
              ("undefined" === typeof void 0
                ? "undefined"
                : babelHelpers.typeof(void 0))
          ) {
            var evt = new CustomEvent("hax-register-properties", {
              bubbles: !0,
              cancelable: !0,
              detail: { tag: tag.toLowerCase(), properties: props, polymer: !1 }
            });
            context.dispatchEvent(evt);
          } else if (
            "" !== tag &&
            babelHelpers.typeof(window.HaxStore) !==
              ("undefined" === typeof void 0
                ? "undefined"
                : babelHelpers.typeof(void 0)) &&
            babelHelpers.typeof(window.HaxStore.instance) !==
              ("undefined" === typeof void 0
                ? "undefined"
                : babelHelpers.typeof(void 0)) &&
            null != window.HaxStore.instance &&
            babelHelpers.typeof(window.HaxStore.instance.elementList) !==
              ("undefined" === typeof void 0
                ? "undefined"
                : babelHelpers.typeof(void 0)) &&
            babelHelpers.typeof(
              window.HaxStore.instance.elementList[tag.toLowerCase()]
            ) ===
              ("undefined" === typeof void 0
                ? "undefined"
                : babelHelpers.typeof(void 0))
          ) {
            var _evt = new CustomEvent("hax-register-properties", {
              bubbles: !0,
              cancelable: !0,
              detail: { tag: tag.toLowerCase(), properties: props }
            });
            context.dispatchEvent(_evt);
          } else if (
            babelHelpers.typeof(_this.tagName) !==
              ("undefined" === typeof void 0
                ? "undefined"
                : babelHelpers.typeof(void 0)) &&
            babelHelpers.typeof(window.HaxStore) !==
              ("undefined" === typeof void 0
                ? "undefined"
                : babelHelpers.typeof(void 0)) &&
            babelHelpers.typeof(window.HaxStore.instance) !==
              ("undefined" === typeof void 0
                ? "undefined"
                : babelHelpers.typeof(void 0)) &&
            null != window.HaxStore.instance &&
            babelHelpers.typeof(window.HaxStore.instance.elementList) !==
              ("undefined" === typeof void 0
                ? "undefined"
                : babelHelpers.typeof(void 0)) &&
            babelHelpers.typeof(
              window.HaxStore.instance.elementList[_this.tagName.toLowerCase()]
            ) ===
              ("undefined" === typeof void 0
                ? "undefined"
                : babelHelpers.typeof(void 0))
          ) {
            var _evt2 = new CustomEvent("hax-register-properties", {
              bubbles: !0,
              cancelable: !0,
              detail: { tag: _this.tagName.toLowerCase(), properties: props }
            });
            context.dispatchEvent(_evt2);
          }
        }
        if ("" === tag) {
          if ("function" === typeof _this._setHaxProperties) {
            _this._setHaxProperties(props);
          } else {
            _this.haxProperties = props;
          }
        }
      } else {
        console.warn(
          "This is't a valid usage of hax API. See hax-body-behaviors/lib/HAXWiring.js for more details on how to implement the API. Most likely your hax item just was placed in an iframe as a fallback as opposed to a custom element."
        );
      }
    };
    this.validateSetting = function(setting) {
      if (
        babelHelpers.typeof(setting.property) ===
          ("undefined" === typeof void 0
            ? "undefined"
            : babelHelpers.typeof(void 0)) &&
        babelHelpers.typeof(setting.slot) ===
          ("undefined" === typeof void 0
            ? "undefined"
            : babelHelpers.typeof(void 0)) &&
        babelHelpers.typeof(setting.attribute) ===
          ("undefined" === typeof void 0
            ? "undefined"
            : babelHelpers.typeof(void 0))
      ) {
        return !1;
      }
      if (
        babelHelpers.typeof(setting.title) ===
        ("undefined" === typeof void 0
          ? "undefined"
          : babelHelpers.typeof(void 0))
      ) {
        if (
          babelHelpers.typeof(setting.attribute) ===
          ("undefined" === typeof void 0
            ? "undefined"
            : babelHelpers.typeof(void 0))
        ) {
          setting.title = setting.property;
        } else {
          setting.title = setting.attribute;
        }
      }
      if (
        babelHelpers.typeof(setting.description) ===
        ("undefined" === typeof void 0
          ? "undefined"
          : babelHelpers.typeof(void 0))
      ) {
        setting.description = "";
      }
      if (
        babelHelpers.typeof(setting.inputMethod) ===
        ("undefined" === typeof void 0
          ? "undefined"
          : babelHelpers.typeof(void 0))
      ) {
        setting.inputMethod = "textfield";
      }
      if (
        babelHelpers.typeof(setting.type) ===
        ("undefined" === typeof void 0
          ? "undefined"
          : babelHelpers.typeof(void 0))
      ) {
        setting.type = "settings";
      }
      if (
        babelHelpers.typeof(setting.icon) ===
        ("undefined" === typeof void 0
          ? "undefined"
          : babelHelpers.typeof(void 0))
      ) {
        setting.icon = "android";
      }
      if (
        babelHelpers.typeof(setting.options) ===
        ("undefined" === typeof void 0
          ? "undefined"
          : babelHelpers.typeof(void 0))
      ) {
        setting.options = {};
      }
      if (
        babelHelpers.typeof(setting.required) ===
        ("undefined" === typeof void 0
          ? "undefined"
          : babelHelpers.typeof(void 0))
      ) {
        setting.required = !1;
      }
      if (
        babelHelpers.typeof(setting.validation) ===
        ("undefined" === typeof void 0
          ? "undefined"
          : babelHelpers.typeof(void 0))
      ) {
        setting.validation = ".*";
      }
      if (
        babelHelpers.typeof(setting.validationType) ===
        ("undefined" === typeof void 0
          ? "undefined"
          : babelHelpers.typeof(void 0))
      ) {
        setting.validationType = "";
      }
      return setting;
    };
    this.getHaxProperties = function() {
      return _this.haxProperties;
    };
    this.getHaxJSONSchema = function(type, haxProperties) {
      var target =
        2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : _this;
      if (
        babelHelpers.typeof(type) ===
        ("undefined" === typeof void 0
          ? "undefined"
          : babelHelpers.typeof(void 0))
      ) {
        type = "configure";
      }
      if (
        babelHelpers.typeof(haxProperties) ===
        ("undefined" === typeof void 0
          ? "undefined"
          : babelHelpers.typeof(void 0))
      ) {
        haxProperties = target.haxProperties;
      }
      var settings = haxProperties.settings[type],
        schema = {
          $schema: "http://json-schema.org/schema#",
          title: "HAX " + type + " form schema",
          type: "object",
          properties: {}
        };
      schema.properties = target._getHaxJSONSchemaProperty(settings, target);
      schema = target.postProcessgetHaxJSONSchema(schema);
      return schema;
    };
    this.postProcessgetHaxJSONSchema = function(schema) {
      return schema;
    };
    this._getHaxJSONSchemaProperty = function(settings, target) {
      var props = {};
      for (var value in settings) {
        if (settings.hasOwnProperty(value)) {
          if (
            babelHelpers.typeof(settings[value].property) !==
            ("undefined" === typeof void 0
              ? "undefined"
              : babelHelpers.typeof(void 0))
          ) {
            props[settings[value].property] = {
              title: settings[value].title,
              type: target.getHaxJSONSchemaType(settings[value].inputMethod)
            };
            if (
              babelHelpers.typeof(target[settings[value].property]) !==
              ("undefined" === typeof void 0
                ? "undefined"
                : babelHelpers.typeof(void 0))
            ) {
              props[settings[value].property].value =
                target[settings[value].property];
            }
            if ("url" == settings[value].validationType) {
              props[settings[value].property].format = "uri";
            }
            if ("datepicker" == settings[value].inputMethod) {
              props[settings[value].property].format = "date-time";
            }
            if (".*" != settings[value].validation) {
              props[settings[value].property].pattern =
                settings[value].validation;
            }
            switch (settings[value].inputMethod) {
              case "number":
                props[settings[value].property].component = {
                  name: "paper-input",
                  valueProperty: "value",
                  properties: { required: settings[value].required },
                  attributes: { type: "number" }
                };
                break;
              case "select":
                var slot = "";
                if (
                  babelHelpers.typeof(settings[value].options) !==
                  ("undefined" === typeof void 0
                    ? "undefined"
                    : babelHelpers.typeof(void 0))
                ) {
                  for (var val in settings[value].options) {
                    slot +=
                      '<paper-item value="' +
                      val +
                      '">' +
                      settings[value].options[val] +
                      "</paper-item>" +
                      "\n";
                  }
                }
                props[settings[value].property].component = {
                  name: "dropdown-select",
                  valueProperty: "value",
                  slot: slot,
                  properties: { required: settings[value].required }
                };
                break;
              case "textarea":
                props[settings[value].property].component = {
                  name: "paper-textarea",
                  valueProperty: "value",
                  properties: { required: settings[value].required },
                  attributes: {
                    "auto-validate": "auto-validate",
                    "char-counter": "char-counter"
                  }
                };
                break;
              case "code-editor":
                props[settings[value].property].component = {
                  name: "code-editor",
                  valueProperty: "editorValue",
                  attributes: { id: "haxcodeeditor" },
                  properties: {
                    title: settings[value].title,
                    readOnly: !1,
                    theme: "ace/theme/monokai",
                    mode: "ace/mode/html",
                    fontsize: "16px",
                    className: "hax-code-editor"
                  }
                };
                break;
              case "array":
                props[settings[value].property].items = {
                  type: "object",
                  properties: target._getHaxJSONSchemaProperty(
                    settings[value].properties,
                    target
                  )
                };
                break;
              case "textfield":
                props[settings[value].property].component = {
                  name: "paper-input",
                  valueProperty: "value",
                  properties: { required: settings[value].required },
                  attributes: { "auto-validate": "auto-validate" }
                };
                break;
              case "alt":
                props[settings[value].property].component = {
                  name: "paper-input-flagged",
                  valueProperty: "value",
                  properties: { required: settings[value].required },
                  attributes: { "auto-validate": "auto-validate" }
                };
                break;
              case "colorpicker":
                props[settings[value].property].component = {
                  name: "paper-swatch-picker",
                  valueProperty: "color",
                  properties: { required: settings[value].required }
                };
                break;
              case "iconpicker":
                props[settings[value].property].component = {
                  name: "paper-icon-picker",
                  valueProperty: "icon",
                  properties: { required: settings[value].required }
                };
                if (settings[value].options.constructor === Array) {
                  props[
                    settings[value].property
                  ].component.properties.iconList = settings[value].options;
                }
                break;
              case "datepicker":
                props[settings[value].property].component = {
                  name: "app-datepicker",
                  valueProperty: "date",
                  properties: {
                    required: settings[value].required,
                    autoUpdateDate: !0
                  }
                };
                break;
            }
          } else if (
            babelHelpers.typeof(settings[value].attribute) !==
            ("undefined" === typeof void 0
              ? "undefined"
              : babelHelpers.typeof(void 0))
          ) {
            props[settings[value].attribute] = {
              title: settings[value].title,
              type: target.getHaxJSONSchemaType(settings[value].inputMethod)
            };
            if ("class" === settings[value].attribute) {
              props[settings[value].attribute].value = target.className;
            } else if ("style" === settings[value].attribute) {
              props[settings[value].attribute].value = target.style.cssText;
            } else if (
              babelHelpers.typeof(
                target.attributes[settings[value].attribute]
              ) !==
              ("undefined" === typeof void 0
                ? "undefined"
                : babelHelpers.typeof(void 0))
            ) {
              props[settings[value].attribute].value = target.getAttribute(
                settings[value].attribute
              );
            }
            if ("href" == value || "src" == value) {
              props[settings[value].attribute].format = "uri";
            }
            if ("url" == settings[value].validationType) {
              props[settings[value].attribute].format = "uri";
            }
            if ("datepicker" == settings[value].inputMethod) {
              props[settings[value].attribute].format = "date-time";
            }
            if (".*" != settings[value].validation) {
              props[settings[value].attribute].pattern =
                settings[value].validation;
            }
            switch (settings[value].inputMethod) {
              case "number":
                props[settings[value].attribute].component = {
                  name: "paper-input",
                  valueProperty: "value",
                  properties: { required: settings[value].required },
                  attributes: { type: "number" }
                };
                break;
              case "select":
                var slot = "";
                if (
                  babelHelpers.typeof(settings[value].options) !==
                  ("undefined" === typeof void 0
                    ? "undefined"
                    : babelHelpers.typeof(void 0))
                ) {
                  for (var val in settings[value].options) {
                    slot +=
                      '<paper-item value="' +
                      val +
                      '">' +
                      settings[value].options[val] +
                      "</paper-item>" +
                      "\n";
                  }
                }
                props[settings[value].attribute].component = {
                  name: "dropdown-select",
                  valueProperty: "value",
                  slot: slot,
                  properties: { required: settings[value].required }
                };
                break;
              case "textarea":
                props[settings[value].attribute].component = {
                  name: "paper-textarea",
                  valueProperty: "value",
                  properties: { required: settings[value].required },
                  attributes: {
                    "auto-validate": "auto-validate",
                    "char-counter": "char-counter"
                  }
                };
                break;
              case "code-editor":
                props[settings[value].attribute].component = {
                  name: "code-editor",
                  valueProperty: "editorValue",
                  attributes: { id: "haxcodeeditor" },
                  properties: {
                    title: settings[value].title,
                    readOnly: !1,
                    theme: "ace/theme/monokai",
                    mode: "ace/mode/html",
                    fontsize: "16px",
                    className: "hax-code-editor"
                  }
                };
                break;
              case "textfield":
                props[settings[value].attribute].component = {
                  name: "paper-input",
                  valueProperty: "value",
                  properties: { required: settings[value].required },
                  attributes: { "auto-validate": "auto-validate" }
                };
                break;
              case "alt":
                props[settings[value].attribute].component = {
                  name: "paper-input-flagged",
                  valueProperty: "value",
                  properties: { required: settings[value].required },
                  attributes: { "auto-validate": "auto-validate" }
                };
                break;
              case "colorpicker":
                props[settings[value].attribute].component = {
                  name: "paper-swatch-picker",
                  valueProperty: "color",
                  properties: { required: settings[value].required }
                };
                break;
            }
          } else {
            props[settings[value].slot] = {
              title: settings[value].title,
              type: target.getHaxJSONSchemaType(settings[value].inputMethod),
              value: "",
              component: {
                name: "code-editor",
                valueProperty: "editorValue",
                attributes: { id: "haxcodeeditor" },
                properties: {
                  title: settings[value].title,
                  readOnly: !1,
                  theme: "ace/theme/monokai",
                  mode: "ace/mode/html",
                  fontsize: "16px",
                  className: "hax-code-editor"
                }
              }
            };
            var slot = "";
            for (var i in (0, _polymerDom.dom)(target).childNodes) {
              if (
                babelHelpers.typeof(
                  (0, _polymerDom.dom)(target).childNodes[i]
                ) !==
                ("undefined" === typeof void 0
                  ? "undefined"
                  : babelHelpers.typeof(void 0))
              ) {
                if (1 === (0, _polymerDom.dom)(target).childNodes[i].nodeType) {
                  slot += (0, _polymerDom.dom)(target).childNodes[i].innerHTML;
                } else if (
                  1 !== (0, _polymerDom.dom)(target).childNodes[i].nodeType &&
                  babelHelpers.typeof(
                    (0, _polymerDom.dom)(target).childNodes[i].textContent
                  ) !==
                    ("undefined" === typeof void 0
                      ? "undefined"
                      : babelHelpers.typeof(void 0)) &&
                  "" !== (0, _polymerDom.dom)(target).childNodes[i].textContent
                ) {
                  slot += (0, _polymerDom.dom)(target).childNodes[i]
                    .textContent;
                }
              }
            }
            props[settings[value].slot].component.slot =
              "<template>" + slot + "</template>";
          }
        }
      }
      return props;
    };
    this.getHaxJSONSchemaType = function(inputMethod) {
      var methods = _this.validHAXPropertyInputMethod();
      if (methods.includes(inputMethod)) {
        switch (inputMethod) {
          case "flipboolean":
          case "boolean":
            return "boolean";
            break;
          case "number":
            return "number";
            break;
          case "select":
          case "textarea":
          case "colorpicker":
          case "iconpicker":
          case "datepicker":
          case "textfield":
          case "alt":
            return "string";
            break;
          case "array":
            return "array";
            break;
          default:
            return "string";
            break;
        }
      }
    };
    this.validHAXPropertyInputMethod = function() {
      var methods = [
        "flipboolean",
        "boolean",
        "select",
        "textfield",
        "textarea",
        "datepicker",
        "colorpicker",
        "iconpicker",
        "alt",
        "number",
        "code-editor",
        "array"
      ];
      return methods;
    };
    this.prototypeHaxProperties = function() {
      var props = {
        api: "1",
        canScale: !0,
        canPosition: !0,
        canEditSource: !1,
        gizmo: {
          title: "Tag name",
          description: "A description",
          icon: "av:play-circle-filled",
          color: "blue",
          groups: ["Content"],
          handles: [{ type: "data", url: "src" }],
          meta: { author: "" }
        },
        settings: {
          quick: [
            {
              property: "title",
              title: "Title",
              inputMethod: "textfield",
              icon: "android"
            },
            {
              property: "primaryColor",
              title: "Primary color",
              inputMethod: "colorpicker",
              icon: "color"
            }
          ],
          configure: [
            {
              slot: "",
              title: "Inner content",
              description: "The slotted content that lives inside the tag",
              inputMethod: "textfield",
              icon: "android",
              required: !0,
              validationType: "text"
            },
            {
              slot: "button",
              title: "Button content",
              description: "The content that can override the button",
              inputMethod: "textfield",
              icon: "android",
              required: !0,
              validationType: "text"
            },
            {
              property: "title",
              title: "Title",
              description: "",
              inputMethod: "textfield",
              icon: "android",
              required: !0,
              validationType: "text"
            },
            {
              property: "primaryColor",
              title: "Title",
              description: "",
              inputMethod: "textfield",
              icon: "android",
              required: !1,
              validation: ".*",
              validationType: "text"
            }
          ],
          advanced: [
            {
              property: "secondaryColor",
              title: "Secondary color",
              description:
                "An optional secondary color used in certain edge cases.",
              inputMethod: "colorpicker",
              icon: "color"
            },
            {
              property: "endPoint",
              title: "API endpoint",
              description:
                "An optional endpoint to hit and load in more data dymaically.",
              inputMethod: "textfield",
              icon: "android",
              validation: "[a-z0-9]",
              validationType: "url"
            }
          ]
        },
        saveOptions: {
          wipeSlot: !1,
          unsetAttributes: ["end-point", "secondary-color"]
        }
      };
      return props;
    };
  };
  _exports.HAXWiring = HAXWiring;
  window.HAXWiring = new HAXWiring();
  window.HAXBehaviors = window.HAXBehaviors || {};
  window.HAXBehaviors.PropertiesBehaviors = {
    properties: { haxProperties: window.HAXWiring.haxProperties },
    setHaxProperties: function setHaxProperties(props) {
      var tag =
          1 < arguments.length && arguments[1] !== void 0 ? arguments[1] : "",
        context =
          2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : this;
      if (
        babelHelpers.typeof(this.tagName) !==
        ("undefined" === typeof void 0
          ? "undefined"
          : babelHelpers.typeof(void 0))
      ) {
        tag = this.tagName.toLowerCase();
      }
      window.addEventListener(
        "hax-store-ready",
        this._haxStoreReady.bind(this)
      );
      if (
        babelHelpers.typeof(window.HaxStore) !==
          ("undefined" === typeof void 0
            ? "undefined"
            : babelHelpers.typeof(void 0)) &&
        null != window.HaxStore.instance &&
        window.HaxStore.ready
      ) {
        return window.HAXWiring.setHaxProperties(props, tag, context, !0);
      } else {
        return window.HAXWiring.setHaxProperties(props, tag, context, !1);
      }
    },
    _haxStoreReady: function _haxStoreReady(e) {
      if (
        e.detail &&
        babelHelpers.typeof(this.tagName) !==
          ("undefined" === typeof void 0
            ? "undefined"
            : babelHelpers.typeof(void 0)) &&
        babelHelpers.typeof(this.haxProperties) !==
          ("undefined" === typeof void 0
            ? "undefined"
            : babelHelpers.typeof(void 0))
      ) {
        var tag = this.tagName,
          props = this.haxProperties,
          context = this;
        if (
          "" !== tag &&
          babelHelpers.typeof(window.HaxStore) ===
            ("undefined" === typeof void 0
              ? "undefined"
              : babelHelpers.typeof(void 0))
        ) {
          var evt = new CustomEvent("hax-register-properties", {
            bubbles: !0,
            cancelable: !0,
            detail: { tag: tag.toLowerCase(), properties: props, polymer: !1 }
          });
          context.dispatchEvent(evt);
        } else if (
          "" !== tag &&
          babelHelpers.typeof(window.HaxStore) !==
            ("undefined" === typeof void 0
              ? "undefined"
              : babelHelpers.typeof(void 0)) &&
          babelHelpers.typeof(window.HaxStore.instance) !==
            ("undefined" === typeof void 0
              ? "undefined"
              : babelHelpers.typeof(void 0)) &&
          null != window.HaxStore.instance &&
          babelHelpers.typeof(window.HaxStore.instance.elementList) !==
            ("undefined" === typeof void 0
              ? "undefined"
              : babelHelpers.typeof(void 0)) &&
          babelHelpers.typeof(
            window.HaxStore.instance.elementList[tag.toLowerCase()]
          ) ===
            ("undefined" === typeof void 0
              ? "undefined"
              : babelHelpers.typeof(void 0))
        ) {
          var _evt3 = new CustomEvent("hax-register-properties", {
            bubbles: !0,
            cancelable: !0,
            detail: { tag: tag.toLowerCase(), properties: props }
          });
          context.dispatchEvent(_evt3);
        } else if (
          babelHelpers.typeof(this.tagName) !==
            ("undefined" === typeof void 0
              ? "undefined"
              : babelHelpers.typeof(void 0)) &&
          babelHelpers.typeof(window.HaxStore) !==
            ("undefined" === typeof void 0
              ? "undefined"
              : babelHelpers.typeof(void 0)) &&
          babelHelpers.typeof(window.HaxStore.instance) !==
            ("undefined" === typeof void 0
              ? "undefined"
              : babelHelpers.typeof(void 0)) &&
          null != window.HaxStore.instance &&
          babelHelpers.typeof(window.HaxStore.instance.elementList) !==
            ("undefined" === typeof void 0
              ? "undefined"
              : babelHelpers.typeof(void 0)) &&
          babelHelpers.typeof(
            window.HaxStore.instance.elementList[this.tagName.toLowerCase()]
          ) ===
            ("undefined" === typeof void 0
              ? "undefined"
              : babelHelpers.typeof(void 0))
        ) {
          var _evt4 = new CustomEvent("hax-register-properties", {
            bubbles: !0,
            cancelable: !0,
            detail: { tag: this.tagName.toLowerCase(), properties: props }
          });
          context.dispatchEvent(_evt4);
        }
      }
    },
    validateSetting: function validateSetting(setting) {
      return window.HAXWiring.validateSetting(setting);
    },
    getHaxProperties: function getHaxProperties() {
      return this.haxProperties;
    },
    getHaxJSONSchema: function getHaxJSONSchema(type, haxProperties) {
      var target =
        2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : this;
      return window.HAXWiring.getHaxJSONSchema(type, haxProperties, target);
    },
    postProcessgetHaxJSONSchema: function postProcessgetHaxJSONSchema(schema) {
      return window.HAXWiring.postProcessgetHaxJSONSchema(schema);
    },
    _getHaxJSONSchemaProperty: function _getHaxJSONSchemaProperty(
      settings,
      target
    ) {
      return window.HAXWiring._getHaxJSONSchemaProperty(settings, target);
    },
    getHaxJSONSchemaType: function getHaxJSONSchemaType(inputMethod) {
      return window.HAXWiring.getHaxJSONSchemaType(inputMethod);
    },
    validHAXPropertyInputMethod: function validHAXPropertyInputMethod() {
      return window.HAXWiring.validHAXPropertyInputMethod();
    },
    prototypeHaxProperties: function prototypeHaxProperties() {
      return window.HAXWiring.prototypeHaxProperties();
    }
  };
});
