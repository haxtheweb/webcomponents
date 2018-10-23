/**
 * In order to use this, the user must supply a haxProperties object
 * which returns what settings are allowed as well as their format.
 * For example, the default of:
 *
 *  {
 *    'api': '1',
 *    'canScale': true,
 *    'canPosition': true,
 *    'canEditSource': true,
 *    'gizmo': {},
 *    'settings': {
 *      'quick': [],
 *      'configure': [],
 *      'advanced': [],
 *    },
 *    'saveOptions': {}
 *  }
 *
 * This tells hax-body's context menu for custom-elements that this element
 * can use the scaling widget and the positioning widget as well as have a traditional source editor view when in an advanced form.
 *
 * So now you're probably saying 'What's a gizmo???'. Well, gizmo is what we call widgets or custom-elements when an end user of HAX places them in the page. It's our playful way of explaining what's happening to an end user as well as ensuring when developers talk to each other then don't use words that have duplicate meanings. It's also just a fun word.
 * A gizmo helps describe the element to the HAX Gizmo manager so that a user can select the element they want to place in the page. Think of your custom-element as an app in an app store. Well, how would you describe your 'app' or Gizmo to a store of apps (in our case the Gizmo manager).
 *
 * This is an example of th gizmo object that is expressed in the lrn-table tag:
 * 'gizmo': {
 *    'title': 'CSV Table',
 *    'descrption': 'This can generate a table from a CSV file no matter where it is located.',
 *     'icon': 'editor:border-all',
 *     'color': 'green',
 *     'groups': ['Presentation', 'Table', 'Data'],
 *     'handles': [
 *       {
 *         'type': 'data',
 *         'url': 'csvFile'
 *       }
 *     ],
 *     'meta': {
 *       'author': 'LRNWebComponents'
 *     }
 *   },
 *
 * Groups is like a filter that someone could search amongst dozens of gizmos for the type of one they are looking for. So if you said your gizmo is for presenting video then you could tag it as Video and people looking for ways to present videos could filter by just Video gizmos.
 * handles has to do with hax-sources of gizmos (think remote app stores you are searching to bring in an app if that was even possible in cell phones);. This says that if a gizmo source claims to be able to supply 'data', that lrn-table is able to handle data and that the property to map to when producing a haxElement is called csvFile. If only 1 handler exists for a response type from a source then it'll auto select it, otherwise the user will have the option of which custom element / gizmo they want to use to render that source material.
 * meta is typical meta data, these things will be printed in a table in the event anyone wants to see them. Author is a logical one so people know who an element came from; like if you wanted to have a core gizmo's vs 3rd party gizmo's concept.
 *
 * Other settings can be expressed through beyond these simple layout modifiers.
 * This example illustrates how you can show forms in three different areas of HAX.
 * Items in the 'quick' key group means that it would show up in hax's in-place editor
 * on the context menu. Things keyed with 'configure' show up in a
 * form / preview display mode in a modal above the interface. Things in 'advanced' will
 * show up on a sub-set of the configure form for more advanced operations.
 * 'settings': {
 *   'quick': [
 *     {
 *       'property': 'responsive',
 *       'title': 'Responsive',
 *       'description': 'The video automatically fills the available area.',
 *       'inputMethod': 'boolean',
 *       'icon': 'video'
 *     }
 *   ],
 *   'configure': [
 *     {
 *       'property': 'citation',
 *       'title': 'Citation',
 *       'description': 'Proper MLA or other standard citation format for the image.',
 *       'inputMethod': 'textfield',
 *       'icon': 'text-format',
 *       'required': true
 *     },
 *     {
 *       'property': 'responsive',
 *       'title': 'Responsive',
 *       'description': 'The video automatically fills the available area.',
 *       'inputMethod': 'boolean',
 *       'icon': 'video'
 *     }
 *   ],
 *   'advanced': [
 *     {
 *       'slot': 'area1',
 *       'title': 'Section 1',
 *       'description': 'Content that goes in the fist area in the layout.',
 *       'inputMethod': 'textarea',
 *       'icon': 'layout'
 *     }
 *   ]
 * }
 * `saveOptions` is a more open ended object which can be used to help
 * support future flexibility / needs. The first major thing this supports
 * is the wipeSlot flag (default false). wipeSlot is used to inform HAX
 * that when it's going to save the current item to a backend (convert to html / text)
 * that it needs to first wipe out the contents of the element. This is not a common
 * operation but useful for things like tokens and other tags that leverage slot
 * in order to present information but should not be saving that information
 * to a backend. Elements that dynamically pull content from an end point are
 * the perfect example of when you'd want to wipe the slot. A content element
 * like a block-quote tag which uses slot to allow users to write whatever
 * they want inside the tag would NOT want to use this, otherwise the contents
 * would be lost.
 * Another used saveOption is `unsetAttributes`. `unsetAttributes` is an Array
 * which can be used to tell a hax-body save operation to NOT save certain
 * attributes. The form of these is in the html style, NOT the javascript
 * style of attribute definition. In this way, you can define non property
 * based values that you require not saving. For example, the following
 * would be a valid use of `unsetAttributes`:
 * 'saveOptions': {
 *   'unsetAttributes': [
 *     'displayed-answers',
 *     'data-some-value',
 *     'id',
 *     'colors'
 *   ]
 * },
 *
 * Specialized functions
 * `preProcessHaxNodeToContent` - If you define this function on your element
 * then it will run BEFORE the conversion to text. This can be used to do
 * specialized processing that may not be standard prior to conversion to content.
 *
 * `postProcesshaxNodeToContent` - If you define this function on your element
 * then it will run AFTER the node has been converted to Content and allows you
 * to act upon the content even further. This could be to clean up / regex against
 * the text certain patterns or to look for certain elements at the end of
 * the conversion routine.
 *
 */
// ensure HAXPropertiesBehaviors exists
/**
`hax-body-behaviors`
A behavior for mixing-in structure for elements to communicate effectively
with the hax-body element which manages elements.

@microcopy - the mental model for this element
 - context - hax-body has context menus to provide options related to the active element
 - haxProperties - a mapping of properties to what inputMethod types to place on the menu

*/
window.HAXBehaviors = window.HAXBehaviors || {};
/**
 * `HAXBehaviors.PropertiesBehaviors` helps ensure that there is a consistent
 * function name and binding structure for notifying HAX that this element
 * is capable of working with it. This behavior provides validation helpers
 * to ensure that the HAX schema conforms to the API and fills in the gaps
 * when people are missing critical properties in order for the API to work.
 *
 * It also provides some basic protections for the haxProperties object
 * by making it read only and using private functions to get and set it.
 *
 * The helper function to convert the haxProperties schema into JSON Schema
 * is also incredibly powerful and provides much of what makes HAX able to
 * generate headless forms. The hax-store also utilizes this behavior which
 * may seem odd but allows for centralization of operations and consistency
 * no matter if an element or the store is in scope of wanting to interogate
 * the possible targets for a URL (like who can support image media).
 *
 * @polymerBehavior HAXBehaviors.PropertiesBehaviors
 **/
window.HAXBehaviors.PropertiesBehaviors = {
  properties: {
    /**
     * haxProperties
     */
    haxProperties: {
      type: Object,
      value: {
        canScale: false,
        canPosition: false,
        canEditSource: false,
        settings: {
          quick: [],
          configure: [],
          advanced: []
        },
        wipeSlot: {}
      },
      readOnly: true
    }
  },
  /**
   * Setter to bridge private haxProperties setter.
   * This is to then be implemented by the ready state of whatever is supplying the
   * properties in order to be able to bubble up the properties for a tag.
   */
  setHaxProperties: function(props, tag = "") {
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
        for (i = 0; i < props.settings.quick.length; i++) {
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
        for (i = 0; i < props.settings.configure.length; i++) {
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
        for (i = 0; i < props.settings.advanced.length; i++) {
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
      if (
        tag !== "" &&
        typeof Polymer.HaxStore !== typeof undefined &&
        typeof Polymer.HaxStore.instance !== typeof undefined &&
        Polymer.HaxStore.instance != null &&
        typeof Polymer.HaxStore.instance.elementList !== typeof undefined &&
        typeof Polymer.HaxStore.instance.elementList[tag.toLowerCase()] ===
          typeof undefined
      ) {
        this.fire("hax-register-properties", {
          tag: tag.toLowerCase(),
          properties: props
        });
      } else if (
        typeof Polymer.HaxStore !== typeof undefined &&
        typeof Polymer.HaxStore.instance !== typeof undefined &&
        Polymer.HaxStore.instance != null &&
        typeof Polymer.HaxStore.instance.elementList !== typeof undefined &&
        typeof Polymer.HaxStore.instance.elementList[
          this.tagName.toLowerCase()
        ] === typeof undefined
      ) {
        this.fire("hax-register-properties", {
          tag: this.tagName.toLowerCase(),
          properties: props
        });
      }
      // only set these when tag hasn't been force fed
      if (tag === "") {
        this._setHaxProperties(props);
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
  },
  /**
   * Validate settings object.
   */
  validateSetting: function(setting) {
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
  },
  /**
   * Match convention for set.
   */
  getHaxProperties: function() {
    return this.haxProperties;
  },
  /**
   * Convert haxProperties structure to a simple json-schema.
   * This allows for complex form building systems based on this data.
   * type is configure or advanced
   */
  getHaxJSONSchema: function(type, haxProperties, target = this) {
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
  },
  /**
   * Default postProcessgetHaxJSONSchema to be overridden.
   */
  postProcessgetHaxJSONSchema: function(schema) {
    return schema;
  },
  /**
   * Internal helper for getHaxJSONSchema to buiild the properties object
   * correctly with support for recursive nesting thx to objects / arrays.
   */
  _getHaxJSONSchemaProperty: function(settings, target) {
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
                name: "simple-colors-picker",
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
                props[settings[value].property].component.properties.iconList =
                  settings[value].options;
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
                name: "simple-colors-picker",
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
          for (var i in Polymer.dom(target).childNodes) {
            // this is crazy... you know that right
            if (typeof Polymer.dom(target).childNodes[i] !== typeof undefined) {
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
          props[settings[value].slot].component.slot =
            "<template>" + slot + "</template>";
        }
      }
    }
    return props;
  },
  /**
   * Convert input method to schedma type
   */
  getHaxJSONSchemaType: function(inputMethod) {
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
  },
  /**
   * List valid input methods.
   */
  validHAXPropertyInputMethod: function() {
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
  },
  /**
   * Return a haxProperties prototype / example structure
   */
  prototypeHaxProperties: function() {
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
  }
};
