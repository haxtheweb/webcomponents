/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */

/**
 * Object to validate HAX
 */
export class HAXWiring {
  constructor() {
    /**
     * haxProperties
     */
    this.haxProperties = {
      canScale: false,
      canPosition: false,
      canEditSource: false,
      settings: {
        quick: [],
        configure: [],
        advanced: []
      },
      wipeSlot: {}
    };
    /**
     * Setter to bridge private haxProperties setter.
     * This is to then be implemented by the ready state of whatever is supplying the
     * properties in order to be able to bubble up the properties for a tag.
     */
    this.setHaxProperties = (props, tag = "", context = document) => {
      // these are a core piece of hax capabilities
      // set them in the event this got called without anything
      // so we at least won't bomb
      if (typeof props.api === typeof undefined) {
        props.api = "1";
      }
      // sets us up for future API versioning of property validation
      // and clean up.
      if (props.api == "1") {
        if (typeof props.canPosition === typeof undefined) {
          props.canPosition = true;
        }
        if (typeof props.canScale === typeof undefined) {
          props.canScale = true;
        }
        if (typeof props.canEditSource === typeof undefined) {
          props.canEditSource = false;
        }
        if (typeof props.gizmo === typeof undefined) {
          props.gizmo = false;
        }
        // while not required, this is where all the raw power of this
        // approach really lies since this wires properties/slots to HAX's
        // ability to manipulate things via contextual menus
        if (typeof props.settings !== typeof undefined) {
          // loop through any potential settings in each of the three
          // groupings of possible settings and validate that each setting is accurate
          if (typeof props.settings.quick === typeof undefined) {
            props.settings.quick = [];
          }
          for (let i = 0; i < props.settings.quick.length; i++) {
            props.settings.quick[i] = this.validateSetting(
              props.settings.quick[i]
            );
            // account for a bad property and remove it
            if (!props.settings.quick[i]) {
              props.settings.quick.splice(i, 1);
            }
          }
          if (typeof props.settings.configure === typeof undefined) {
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
          if (typeof props.settings.advanced === typeof undefined) {
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
          // allow classes to be modified this way
          props.settings.advanced.push({
            attribute: "class",
            title: "Classes",
            description: "CSS classes applied manually to the element",
            inputMethod: "textfield"
          });
          // allow styles to be modified this way
          props.settings.advanced.push({
            attribute: "style",
            title: "Styles",
            description: "Custom CSS styles as applied to the element",
            inputMethod: "textfield"
          });
          // allow schema definitions
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
          // allow the id to be modified
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
        // support for advanced save options
        if (typeof props.saveOptions === typeof undefined) {
          props.saveOptions = {
            wipeSlot: false
          };
        }
        // fire event so we know they have been set for the store to collect
        // only fire if we haven't already so multiple elements don't keep bubbling

        // @todo need the correct way of detecting this without global scope
        // if polymer doesn't exist, then just fire anyway with a flag
        // this would be if others are implementing hax and want to use
        // all it's schema wired objects but not the platform as we
        // had envisioned it
        if (typeof Polymer === typeof undefined) {
          let evt = new CustomEvent("hax-register-properties", {
            bubbles: true,
            cancelable: true,
            detail: {
              tag: tag.toLowerCase(),
              properties: props,
              polymer: false
            }
          });
          context.dispatchEvent(evt);
        } else if (
          tag !== "" &&
          typeof Polymer !== typeof undefined &&
          typeof Polymer.HaxStore !== typeof undefined &&
          typeof Polymer.HaxStore.instance !== typeof undefined &&
          Polymer.HaxStore.instance != null &&
          typeof Polymer.HaxStore.instance.elementList !== typeof undefined &&
          typeof Polymer.HaxStore.instance.elementList[tag.toLowerCase()] ===
            typeof undefined
        ) {
          let evt = new CustomEvent("hax-register-properties", {
            bubbles: true,
            cancelable: true,
            detail: {
              tag: tag.toLowerCase(),
              properties: props
            }
          });
          context.dispatchEvent(evt);
        } else if (
          typeof Polymer !== typeof undefined &&
          typeof Polymer.HaxStore !== typeof undefined &&
          typeof Polymer.HaxStore.instance !== typeof undefined &&
          Polymer.HaxStore.instance != null &&
          typeof Polymer.HaxStore.instance.elementList !== typeof undefined &&
          typeof Polymer.HaxStore.instance.elementList[
            this.tagName.toLowerCase()
          ] === typeof undefined
        ) {
          let evt = new CustomEvent("hax-register-properties", {
            bubbles: true,
            cancelable: true,
            detail: {
              tag: this.tagName.toLowerCase(),
              properties: props
            }
          });
          context.dispatchEvent(evt);
        }
        // only set these when tag hasn't been force fed
        if (tag === "") {
          this.setHaxProperties(props);
        }
      } else {
        // especially useful during development if we implement our own API
        // incorrectly. Don't hard brick cause it'll still more or less work
        // but would probably default to an iframe which is less then ideal
        // but at least wouldn't brick the AX.
        console.log(
          "This is't a valid usage of hax-body-behaviors API. See hax-body-behaviors for more details on how to implement the API. Most likely your hax item just was placed in an iframe as a fallback as opposed to a custom element."
        );
      }
    };
    /**
     * Validate settings object.
     */
    this.validateSetting = setting => {
      // we don't have a property or slot so it's not valid.
      if (
        typeof setting.property === typeof undefined &&
        typeof setting.slot === typeof undefined &&
        typeof setting.attribute === typeof undefined
      ) {
        return false;
      }
      // ensure there's a title
      if (typeof setting.title === typeof undefined) {
        if (typeof setting.attribute === typeof undefined) {
          setting.title = setting.property;
        } else {
          setting.title = setting.attribute;
        }
      }
      // ensure there's at least an empty description
      if (typeof setting.description === typeof undefined) {
        setting.description = "";
      }
      // ensure there's at least an input method
      if (typeof setting.inputMethod === typeof undefined) {
        setting.inputMethod = "textfield";
      }
      // ensure there's at least a type
      if (typeof setting.type === typeof undefined) {
        setting.type = "settings";
      }
      // ensure there's at least an icon
      if (typeof setting.icon === typeof undefined) {
        setting.icon = "android";
      }
      // ensure there's at least an empty options area
      if (typeof setting.options === typeof undefined) {
        setting.options = {};
      }
      // ensure there's required set
      if (typeof setting.required === typeof undefined) {
        setting.required = false;
      }
      // ensure there's validation or make it anything if none set
      if (typeof setting.validation === typeof undefined) {
        setting.validation = ".*";
      }
      // ensure there's validation or make it anything if none set
      if (typeof setting.validationType === typeof undefined) {
        setting.validationType = "";
      }
      return setting;
    };
    /**
     * Match convention for set.
     */
    this.getHaxProperties = () => {
      return this.haxProperties;
    };
    /**
     * Convert haxProperties structure to a simple json-schema.
     * This allows for complex form building systems based on this data.
     * type is configure or advanced
     */
    this.getHaxJSONSchema = (type, haxProperties, target = this) => {
      if (typeof type === typeof undefined) {
        type = "configure";
      }
      if (typeof haxProperties === typeof undefined) {
        haxProperties = target.haxProperties;
      }
      var slot = "";
      let settings = haxProperties.settings[type];
      var schema = {
        $schema: "http://json-schema.org/schema#",
        title: "HAX " + type + " form schema",
        type: "object",
        properties: {}
      };
      schema.properties = target._getHaxJSONSchemaProperty(settings, target);
      // support post processing of schema in order to allow for really
      // custom implementations that are highly dynamic in nature
      schema = target.postProcessgetHaxJSONSchema(schema);
      return schema;
    };
    /**
     * Default postProcessgetHaxJSONSchema to be overridden.
     */
    this.postProcessgetHaxJSONSchema = schema => {
      return schema;
    };
    /**
     * Internal helper for getHaxJSONSchema to buiild the properties object
     * correctly with support for recursive nesting thx to objects / arrays.
     */
    this._getHaxJSONSchemaProperty = (settings, target) => {
      var props = {};
      for (var value in settings) {
        if (settings.hasOwnProperty(value)) {
          if (typeof settings[value].property !== typeof undefined) {
            props[settings[value].property] = {
              title: settings[value].title,
              type: target.getHaxJSONSchemaType(settings[value].inputMethod)
            };
            if (typeof target[settings[value].property] !== typeof undefined) {
              props[settings[value].property].value =
                target[settings[value].property];
            }
            if (settings[value].validationType == "url") {
              props[settings[value].property].format = "uri";
            }
            if (settings[value].inputMethod == "datepicker") {
              props[settings[value].property].format = "date-time";
            }
            if (settings[value].validation != ".*") {
              props[settings[value].property].pattern =
                settings[value].validation;
            }
            switch (settings[value].inputMethod) {
              case "number":
                props[settings[value].property].component = {
                  name: "paper-input",
                  valueProperty: "value",
                  properties: {
                    required: settings[value].required
                  },
                  attributes: {
                    type: "number"
                  }
                };
                break;
              case "select":
                slot = "";
                if (typeof settings[value].options !== typeof undefined) {
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
                  properties: {
                    required: settings[value].required
                  }
                };
                break;
              case "textarea":
                props[settings[value].property].component = {
                  name: "paper-textarea",
                  valueProperty: "value",
                  properties: {
                    required: settings[value].required
                  },
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
                  attributes: {
                    id: "haxcodeeditor"
                  },
                  properties: {
                    title: settings[value].title,
                    readOnly: false,
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
                  properties: {
                    required: settings[value].required
                  },
                  attributes: {
                    "auto-validate": "auto-validate"
                  }
                };
                break;
              case "alt":
                props[settings[value].property].component = {
                  name: "paper-input-flagged",
                  valueProperty: "value",
                  properties: {
                    required: settings[value].required
                  },
                  attributes: {
                    "auto-validate": "auto-validate"
                  }
                };
                break;
              case "colorpicker":
                props[settings[value].property].component = {
                  name: "paper-swatch-picker",
                  valueProperty: "color",
                  properties: {
                    required: settings[value].required
                  }
                };
                break;
              case "iconpicker":
                props[settings[value].property].component = {
                  name: "paper-icon-picker",
                  valueProperty: "icon",
                  properties: {
                    required: settings[value].required
                  }
                };
                // support options array of icons to pick from
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
                    autoUpdateDate: true
                  }
                };
                break;
            }
          } else if (typeof settings[value].attribute !== typeof undefined) {
            props[settings[value].attribute] = {
              title: settings[value].title,
              type: target.getHaxJSONSchemaType(settings[value].inputMethod)
            };
            // special support for className
            if (settings[value].attribute === "class") {
              props[settings[value].attribute].value = target.className;
            } else if (settings[value].attribute === "style") {
              props[settings[value].attribute].value = target.style.cssText;
            } else if (
              typeof target.attributes[settings[value].attribute] !==
              typeof undefined
            ) {
              props[settings[value].attribute].value = target.getAttribute(
                settings[value].attribute
              );
            }
            // special validation on uri based attributes
            if (value == "href" || value == "src") {
              props[settings[value].attribute].format = "uri";
            }
            if (settings[value].validationType == "url") {
              props[settings[value].attribute].format = "uri";
            }
            if (settings[value].inputMethod == "datepicker") {
              props[settings[value].attribute].format = "date-time";
            }
            if (settings[value].validation != ".*") {
              props[settings[value].attribute].pattern =
                settings[value].validation;
            }
            switch (settings[value].inputMethod) {
              case "number":
                props[settings[value].attribute].component = {
                  name: "paper-input",
                  valueProperty: "value",
                  properties: {
                    required: settings[value].required
                  },
                  attributes: {
                    type: "number"
                  }
                };
                break;
              case "select":
                slot = "";
                if (typeof settings[value].options !== typeof undefined) {
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
                  properties: {
                    required: settings[value].required
                  }
                };
                break;
              case "textarea":
                props[settings[value].attribute].component = {
                  name: "paper-textarea",
                  valueProperty: "value",
                  properties: {
                    required: settings[value].required
                  },
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
                  attributes: {
                    id: "haxcodeeditor"
                  },
                  properties: {
                    title: settings[value].title,
                    readOnly: false,
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
                  properties: {
                    required: settings[value].required
                  },
                  attributes: {
                    "auto-validate": "auto-validate"
                  }
                };
                break;
              case "alt":
                props[settings[value].attribute].component = {
                  name: "paper-input-flagged",
                  valueProperty: "value",
                  properties: {
                    required: settings[value].required
                  },
                  attributes: {
                    "auto-validate": "auto-validate"
                  }
                };
                break;
              case "colorpicker":
                props[settings[value].attribute].component = {
                  name: "paper-swatch-picker",
                  valueProperty: "color",
                  properties: {
                    required: settings[value].required
                  }
                };
                break;
            }
          } else {
            // @todo slot should support other editor types... maybe
            props[settings[value].slot] = {
              title: settings[value].title,
              type: target.getHaxJSONSchemaType(settings[value].inputMethod),
              value: "",
              component: {
                name: "code-editor",
                valueProperty: "editorValue",
                attributes: {
                  id: "haxcodeeditor"
                },
                properties: {
                  title: settings[value].title,
                  readOnly: false,
                  theme: "ace/theme/monokai",
                  mode: "ace/mode/html",
                  fontsize: "16px",
                  className: "hax-code-editor"
                }
              }
            };
            let slot = "";
            // test for slotted content values names is tricky
            if (typeof Polymer !== typeof undefined) {
              for (var i in Polymer.dom(target).childNodes) {
                // this is crazy... you know that right
                if (
                  typeof Polymer.dom(target).childNodes[i] !== typeof undefined
                ) {
                  if (Polymer.dom(target).childNodes[i].nodeType === 1) {
                    slot += Polymer.dom(target).childNodes[i].innerHTML;
                  } else if (
                    Polymer.dom(target).childNodes[i].nodeType !== 1 &&
                    typeof Polymer.dom(target).childNodes[i].textContent !==
                      typeof undefined &&
                    Polymer.dom(target).childNodes[i].textContent !== ""
                  ) {
                    slot += Polymer.dom(target).childNodes[i].textContent;
                  }
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
    /**
     * Convert input method to schedma type
     */
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
    /**
     * List valid input methods.
     */
    this.validHAXPropertyInputMethod = () => {
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
    /**
     * Return a haxProperties prototype / example structure
     */
    this.prototypeHaxProperties = () => {
      // example properties valid for HAX context menu.
      let props = {
        api: "1",
        canScale: true,
        canPosition: true,
        canEditSource: false,
        gizmo: {
          title: "Tag name",
          description: "A description",
          icon: "av:play-circle-filled",
          color: "blue",
          groups: ["Content"],
          handles: [
            {
              type: "data",
              url: "src"
            }
          ],
          meta: {
            author: ""
          }
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
              required: true,
              validationType: "text"
            },
            {
              slot: "button",
              title: "Button content",
              description: "The content that can override the button",
              inputMethod: "textfield",
              icon: "android",
              required: true,
              validationType: "text"
            },
            {
              property: "title",
              title: "Title",
              description: "",
              inputMethod: "textfield",
              icon: "android",
              required: true,
              validationType: "text"
            },
            {
              property: "primaryColor",
              title: "Title",
              description: "",
              inputMethod: "textfield",
              icon: "android",
              required: false,
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
          wipeSlot: false,
          unsetAttributes: ["end-point", "secondary-color"]
        }
      };
      return props;
    };
  }
}

// ensure HAXPropertiesBehaviors exists
window.HAXBehaviors = window.HAXBehaviors || {};
window.HAXBehaviors.PropertiesBehaviors = new HAXWiring();
