import { dom } from "../node_modules/@polymer/polymer/lib/legacy/polymer.dom.js";
export class HAXWiring {
  constructor() {
    this.haxProperties = {
      canScale: !1,
      canPosition: !1,
      canEditSource: !1,
      settings: { quick: [], configure: [], advanced: [] },
      wipeSlot: {}
    };
    this.setHaxProperties = (
      props,
      tag = "",
      context = document,
      isReady = !1
    ) => {
      if (typeof props.api === typeof void 0) {
        props.api = "1";
      }
      if ("1" == props.api) {
        if (typeof props.canPosition === typeof void 0) {
          props.canPosition = !0;
        }
        if (typeof props.canScale === typeof void 0) {
          props.canScale = !0;
        }
        if (typeof props.canEditSource === typeof void 0) {
          props.canEditSource = !1;
        }
        if (typeof props.gizmo === typeof void 0) {
          props.gizmo = !1;
        }
        if (typeof props.settings !== typeof void 0) {
          if (typeof props.settings.quick === typeof void 0) {
            props.settings.quick = [];
          }
          for (let i = 0; i < props.settings.quick.length; i++) {
            props.settings.quick[i] = this.validateSetting(
              props.settings.quick[i]
            );
            if (!props.settings.quick[i]) {
              props.settings.quick.splice(i, 1);
            }
          }
          if (typeof props.settings.configure === typeof void 0) {
            props.settings.configure = [];
          }
          for (let i = 0; i < props.settings.configure.length; i++) {
            props.settings.configure[i] = this.validateSetting(
              props.settings.configure[i]
            );
            if (!props.settings.configure[i]) {
              props.settings.configure.splice(i, 1);
            }
          }
          if (typeof props.settings.advanced === typeof void 0) {
            props.settings.advanced = [];
          }
          for (let i = 0; i < props.settings.advanced.length; i++) {
            props.settings.advanced[i] = this.validateSetting(
              props.settings.advanced[i]
            );
            if (!props.settings.advanced[i]) {
              props.settings.advanced.splice(i, 1);
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
        if (typeof props.saveOptions === typeof void 0) {
          props.saveOptions = { wipeSlot: !1 };
        }
        if (isReady) {
          if ("" !== tag && typeof window.HaxStore === typeof void 0) {
            const evt = new CustomEvent("hax-register-properties", {
              bubbles: !0,
              cancelable: !0,
              detail: { tag: tag.toLowerCase(), properties: props, polymer: !1 }
            });
            context.dispatchEvent(evt);
          } else if (
            "" !== tag &&
            typeof window.HaxStore !== typeof void 0 &&
            typeof window.HaxStore.instance !== typeof void 0 &&
            null != window.HaxStore.instance &&
            typeof window.HaxStore.instance.elementList !== typeof void 0 &&
            typeof window.HaxStore.instance.elementList[tag.toLowerCase()] ===
              typeof void 0
          ) {
            const evt = new CustomEvent("hax-register-properties", {
              bubbles: !0,
              cancelable: !0,
              detail: { tag: tag.toLowerCase(), properties: props }
            });
            context.dispatchEvent(evt);
          } else if (
            typeof this.tagName !== typeof void 0 &&
            typeof window.HaxStore !== typeof void 0 &&
            typeof window.HaxStore.instance !== typeof void 0 &&
            null != window.HaxStore.instance &&
            typeof window.HaxStore.instance.elementList !== typeof void 0 &&
            typeof window.HaxStore.instance.elementList[
              this.tagName.toLowerCase()
            ] === typeof void 0
          ) {
            const evt = new CustomEvent("hax-register-properties", {
              bubbles: !0,
              cancelable: !0,
              detail: { tag: this.tagName.toLowerCase(), properties: props }
            });
            context.dispatchEvent(evt);
          }
        }
        if ("" === tag) {
          if ("function" === typeof this._setHaxProperties) {
            this._setHaxProperties(props);
          } else {
            this.haxProperties = props;
          }
        }
      } else {
        console.warn(
          "This is't a valid usage of hax-body-behaviors API. See hax-body-behaviors for more details on how to implement the API. Most likely your hax item just was placed in an iframe as a fallback as opposed to a custom element."
        );
      }
    };
    this.validateSetting = setting => {
      if (
        typeof setting.property === typeof void 0 &&
        typeof setting.slot === typeof void 0 &&
        typeof setting.attribute === typeof void 0
      ) {
        return !1;
      }
      if (typeof setting.title === typeof void 0) {
        if (typeof setting.attribute === typeof void 0) {
          setting.title = setting.property;
        } else {
          setting.title = setting.attribute;
        }
      }
      if (typeof setting.description === typeof void 0) {
        setting.description = "";
      }
      if (typeof setting.inputMethod === typeof void 0) {
        setting.inputMethod = "textfield";
      }
      if (typeof setting.type === typeof void 0) {
        setting.type = "settings";
      }
      if (typeof setting.icon === typeof void 0) {
        setting.icon = "android";
      }
      if (typeof setting.options === typeof void 0) {
        setting.options = {};
      }
      if (typeof setting.required === typeof void 0) {
        setting.required = !1;
      }
      if (typeof setting.validation === typeof void 0) {
        setting.validation = ".*";
      }
      if (typeof setting.validationType === typeof void 0) {
        setting.validationType = "";
      }
      return setting;
    };
    this.getHaxProperties = () => {
      return this.haxProperties;
    };
    this.getHaxJSONSchema = (type, haxProperties, target = this) => {
      if (typeof type === typeof void 0) {
        type = "configure";
      }
      if (typeof haxProperties === typeof void 0) {
        haxProperties = target.haxProperties;
      }
      let settings = haxProperties.settings[type];
      var schema = {
        $schema: "http://json-schema.org/schema#",
        title: "HAX " + type + " form schema",
        type: "object",
        properties: {},
        properties: target._getHaxJSONSchemaProperty(settings, target)
      };
      schema = target.postProcessgetHaxJSONSchema(schema);
      return schema;
    };
    this.postProcessgetHaxJSONSchema = schema => {
      return schema;
    };
    this._getHaxJSONSchemaProperty = (settings, target) => {
      var props = {};
      for (var value in settings) {
        if (settings.hasOwnProperty(value)) {
          if (typeof settings[value].property !== typeof void 0) {
            props[settings[value].property] = {
              title: settings[value].title,
              type: target.getHaxJSONSchemaType(settings[value].inputMethod)
            };
            if (typeof target[settings[value].property] !== typeof void 0) {
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
                slot = "";
                if (typeof settings[value].options !== typeof void 0) {
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
          } else if (typeof settings[value].attribute !== typeof void 0) {
            props[settings[value].attribute] = {
              title: settings[value].title,
              type: target.getHaxJSONSchemaType(settings[value].inputMethod)
            };
            if ("class" === settings[value].attribute) {
              props[settings[value].attribute].value = target.className;
            } else if ("style" === settings[value].attribute) {
              props[settings[value].attribute].value = target.style.cssText;
            } else if (
              typeof target.attributes[settings[value].attribute] !==
              typeof void 0
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
                slot = "";
                if (typeof settings[value].options !== typeof void 0) {
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
            let slot = "";
            for (var i in dom(target).childNodes) {
              if (typeof dom(target).childNodes[i] !== typeof void 0) {
                if (1 === dom(target).childNodes[i].nodeType) {
                  slot += dom(target).childNodes[i].innerHTML;
                } else if (
                  1 !== dom(target).childNodes[i].nodeType &&
                  typeof dom(target).childNodes[i].textContent !==
                    typeof void 0 &&
                  "" !== dom(target).childNodes[i].textContent
                ) {
                  slot += dom(target).childNodes[i].textContent;
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
    this.getHaxJSONSchemaType = inputMethod => {
      var methods = this.validHAXPropertyInputMethod();
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
    this.validHAXPropertyInputMethod = () => {
      return [
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
    };
    this.prototypeHaxProperties = () => {
      return {
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
    };
  }
}
window.HAXWiring = new HAXWiring();
window.HAXBehaviors = window.HAXBehaviors || {};
window.HAXBehaviors.PropertiesBehaviors = {
  properties: { haxProperties: window.HAXWiring.haxProperties },
  setHaxProperties: function(props, tag = "", context = this) {
    if (typeof this.tagName !== typeof void 0) {
      tag = this.tagName.toLowerCase();
    }
    window.addEventListener("hax-store-ready", this._haxStoreReady.bind(this));
    if (
      typeof window.HaxStore !== typeof void 0 &&
      null != window.HaxStore.instance &&
      window.HaxStore.ready
    ) {
      return window.HAXWiring.setHaxProperties(props, tag, context, !0);
    } else {
      return window.HAXWiring.setHaxProperties(props, tag, context, !1);
    }
  },
  _haxStoreReady: function(e) {
    if (
      e.detail &&
      typeof this.tagName !== typeof void 0 &&
      typeof this.haxProperties !== typeof void 0
    ) {
      let tag = this.tagName,
        props = this.haxProperties,
        context = this;
      if ("" !== tag && typeof window.HaxStore === typeof void 0) {
        const evt = new CustomEvent("hax-register-properties", {
          bubbles: !0,
          cancelable: !0,
          detail: { tag: tag.toLowerCase(), properties: props, polymer: !1 }
        });
        context.dispatchEvent(evt);
      } else if (
        "" !== tag &&
        typeof window.HaxStore !== typeof void 0 &&
        typeof window.HaxStore.instance !== typeof void 0 &&
        null != window.HaxStore.instance &&
        typeof window.HaxStore.instance.elementList !== typeof void 0 &&
        typeof window.HaxStore.instance.elementList[tag.toLowerCase()] ===
          typeof void 0
      ) {
        const evt = new CustomEvent("hax-register-properties", {
          bubbles: !0,
          cancelable: !0,
          detail: { tag: tag.toLowerCase(), properties: props }
        });
        context.dispatchEvent(evt);
      } else if (
        typeof this.tagName !== typeof void 0 &&
        typeof window.HaxStore !== typeof void 0 &&
        typeof window.HaxStore.instance !== typeof void 0 &&
        null != window.HaxStore.instance &&
        typeof window.HaxStore.instance.elementList !== typeof void 0 &&
        typeof window.HaxStore.instance.elementList[
          this.tagName.toLowerCase()
        ] === typeof void 0
      ) {
        const evt = new CustomEvent("hax-register-properties", {
          bubbles: !0,
          cancelable: !0,
          detail: { tag: this.tagName.toLowerCase(), properties: props }
        });
        context.dispatchEvent(evt);
      }
    }
  },
  validateSetting: function(setting) {
    return window.HAXWiring.validateSetting(setting);
  },
  getHaxProperties: function() {
    return this.haxProperties;
  },
  getHaxJSONSchema: function(type, haxProperties, target = this) {
    return window.HAXWiring.getHaxJSONSchema(type, haxProperties, target);
  },
  postProcessgetHaxJSONSchema: function(schema) {
    return window.HAXWiring.postProcessgetHaxJSONSchema(schema);
  },
  _getHaxJSONSchemaProperty: function(settings, target) {
    return window.HAXWiring._getHaxJSONSchemaProperty(settings, target);
  },
  getHaxJSONSchemaType: function(inputMethod) {
    return window.HAXWiring.getHaxJSONSchemaType(inputMethod);
  },
  validHAXPropertyInputMethod: function() {
    return window.HAXWiring.validHAXPropertyInputMethod();
  },
  prototypeHaxProperties: function() {
    return window.HAXWiring.prototypeHaxProperties();
  }
};
