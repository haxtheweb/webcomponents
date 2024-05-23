/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */

/**
 * In order to use this, the user must supply a haxProperties object
 * which returns what settings are allowed as well as their format.
 * For example, the default of:
 *
 *  {
 *    // API version for future use
 *    "api": "1"
 *    // how HAX handles the element. values are element or grid; influences some capabilities
 *    "type": "element",
 *    // how is this modified; core is default UI experience of typical HAX elements
 *    // which is simplistic operations / text based
 *    "editingElement": "core",
 *    // ADVANCED IMPLEMENTATION
 *    // @see @haxtheweb/editable-table/lib/editable-table-display.js
 *    "editingElement": {
 *      "tag": "editable-table",
 *      "import" : "@haxtheweb/editable-table/editable-table.js"
 *    },
 *    // can this be scaled in its width
 *    "canScale": true,
 *    // can this be rough positioned left/right/center
 *
 *    // can you edit the source of this element directly? (allows code editor option)
 *    "canEditSource": true,
 *    // should the entire element be contenteditable? (allows editing slot via contenteditable operations)
 *    "contentEditable": false,
 *    // how to visualize / if this is visualized for the user when adding to the page
 *    "gizmo": {},
 *    // how HAX presents configuration options in it's side tray
 *    "settings": {
 *      "inline": [], // only used if it's an inline only element and presents itself on the bar
 *      "configure": [],
 *      "advanced": [],
 *      "developer": [], // setting intended only for HTML experts
 *    },
 *    "documentation": {
 *      "howTo": "https://oer.hax.psu.edu/bto108/sites/haxcellence/capabilities/inline-audio/howToUse",
 *      "purpose": "https://oer.hax.psu.edu/bto108/sites/haxcellence/capabilities/inline-audio/purpose"
 *    },
 *    // additional clean up options for specific pieces of saving / shortcut options
 *    "saveOptions": {},
 *    // support for multiple demos of the element; used for drag and drop place holder and in visuals of the elements
 *    "demoSchema": []
 *  }
 *
 * This tells hax-body's context menu for custom-elements that this element
 * can use the scaling widget and the positioning widget as well as have a traditional source editor view when in an advanced form.
 *
 * So now you're probably saying 'What's a gizmo???'. Well, gizmo is what we call widgets or custom-elements when an end user of HAX places them in the page. It's our playful way of explaining what's happening to an end user as well as ensuring when developers talk to each other then don't use words that have duplicate meanings. It's also just a fun word.
 * A gizmo helps describe the element to the HAX Gizmo manager so that a user can select the element they want to place in the page. Think of your custom-element as an app in an app store. Well, how would you describe your 'app' or Gizmo to a store of apps (in our case the Gizmo manager).
 *
 * type_exclusive is a flag that can be used to force selections to default to this
 * when there are multiple options. This isn't always desired but HAX will determine
 * if it makes more sense to just use the default (for example when pulling in from a remote address).
 *
 * This is an example of th gizmo object that is expressed in the lrn-table tag:
 * 'gizmo': {
 *    'title': 'CSV Table',
 *    'descrption': 'This can generate a table from a CSV file no matter where it is located.',
 *     'icon': 'editor:border-all',
 *     'iconLib': '@haxtheweb/hax-iconset/lib/simple-hax-iconset.js', // optional ability to import custom icon libraries
 *     'color': 'green',
 *     'groups': ['Presentation', 'Table', 'Data'],
 *     'handles': [
 *       {
 *         'type': 'data',
 *         'type_exclusive': false,
 *         'url': 'csvFile'
 *       }
 *     ],
 *    'tags': ['Content', 'csv'],
 *     'meta': {
 *       'author': 'HAXTheWeb'
 *     }
 *   },
 *
 * Groups is like a filter that someone could search amongst dozens of gizmos for the type of one they are looking for. So if you said your gizmo is for presenting video then you could tag it as Video and people looking for ways to present videos could filter by just Video gizmos.
 * handles has to do with hax-sources of gizmos (think remote app stores you are searching to bring in an app if that was even possible in cell phones);. This says that if a gizmo source claims to be able to supply 'data', that lrn-table is able to handle data and that the property to map to when producing a haxElement is called csvFile. If only 1 handler exists for a response type from a source then it'll auto select it, otherwise the user will have the option of which custom element / gizmo they want to use to render that source material.
 * meta is typical meta data, these things will be printed in a table in the event anyone wants to see them. Author is a logical one so people know who an element came from; like if you wanted to have a core gizmo's vs 3rd party gizmo's concept.
 *
 * Other settings can be expressed through beyond these simple layout modifiers.
 * This example illustrates how you can show forms in three different areas of HAX.
 * Things keyed with 'configure' show up in a
 * form / preview display mode in a modal above the interface. Things in 'advanced' will
 * show up on a sub-set of the configure form for more advanced operations.
 * 'settings': {
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
 * `saveOptions`
 * @element saveOptions is a more open ended object which can be used to help
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
 *  * `demoSchema`
 * @element demoSchema is used to present this element in demonstrations and
 * interfaces that want to provide a sample of what the element is. This is
 * an easy way to ship a demo of this element and is used in HAX settings.
 * [{
 *   tag: "my-tag",
 *   content: "<p>inner html</p>",
 *   properties: {
 *     endPoint: "https://cdn2.thecatapi.com/images/9j5.jpg",
 *     primaryColor: "yellow",
 *     title: "A cat"
 *   }
 * }],
 *
 * Specialized functions / life-cycle via haxHooks
 * You can add deeper support into your elements without including HAX
 * in your assets by implementing haxHooks. While haxProperties allows
 * for interfacing w/ the hax-body area / being inserted and having
 * an editing UI, haxHooks allows for tying those elements into the
 * state management of HAX without requiring to pull HAX in.
 *
 * These are the events you can "listen" for. The callback is a function name
 * and can be whatever you want though for consistency we have named ours
 * hax + the name of the hook
 * {
 *   // @see @haxtheweb/editable-table/editable-table.js (example of a haxUIElement implementing these hooks)
 *   // @see @haxtheweb/retro-card/retro-card.js
 *   activeElementChanged : "haxactiveElementChanged", // input (activeElement, value) where value is if the element is active
 *   // @see @haxtheweb/retro-card/retro-card.js
 *   editModeChanged : "haxeditModeChanged", // input (value) where value is state of body being in editMode
 *   // @see @haxtheweb/multiple-choice/multiple-choice.js
 *   inlineContextMenu: "haxinlineContextMenu", // this allows for adding buttons dynamically to the editor in context
 *   // @see @haxtheweb/multiple-choice/multiple-choice.js
 *   gizmoRegistration: "haxgizmoRegistration", // this lets you rewrite the store when the element is exposed to HAX
 *   // @see @haxtheweb/code-editor/code-editor.js
 *   // @see @haxtheweb/multiple-choice/multiple-choice.js
 *   preProcessNodeToContent : "haxpreProcessNodeToContent", // input (node) where node is the item about to be converted to content for export
 *   // @see @haxtheweb/meme-maker/meme-maker.js
 *   progressiveEnhancement : "haxprogressiveEnhancement", // works on the element ONLY in the slotted / innerHTML area. Must return content but can work against the node to generate that text
 *   // @see @haxtheweb/video-player/video-player.js
 *   postProcessNodeToContent : "haxpostProcessNodeToContent", // input (content) where content is an HTML blob about to be returned for export
 *   // @see @haxtheweb/multiple-choice/multiple-choice.js
 *   preProcessInsertContent : "haxpreProcessInsertContent", // input (node) where node is item about to be inserted into the content
 * }
 *
 * The callback if defined is handed the element / item to act against
 * // Support being an editing interface element for HAX
 * haxHooks() {
 *   return {
 *     activeElementChanged: "haxactiveElementChanged",
 *   };
 * }
 * // allow HAX to toggle edit state when activated
 * haxactiveElementChanged(el, val) {
 *   // overwrite the HAX dom w/ what our editor is supplying
 *   if (!val) {
 *     let replacement = this.getTableHTMLNode();
 *     if (el) {
 *       el.replaceWith(replacement);
 *     }
 *     el = replacement;
 *   }
 *   // aligns the state of the element w/ HAX if its available
 *   this.toggleEditMode(val);
 *   return el;
 * }
 */
import { SimpleFields } from "@haxtheweb/simple-fields/simple-fields.js";
import "./HAXFields.js";

/**
 * Object to validate HAX schema. Can be used in and out of element contexts
 */
export class HAXWiring {
  constructor() {
    /**
     * haxProperties
     */
    this.haxProperties = {
      type: "element",
      editingElement: "core",
      hideDefaultSettings: false,
      canScale: false,

      canEditSource: true,
      settings: {
        configure: [],
        advanced: [],
        developer: [],
      },
      wipeSlot: {},
    };
    /**
     * Setter to bridge private haxProperties setter.
     * This is to then be implemented by the ready state of whatever is supplying the
     * properties in order to be able to bubble up the properties for a tag.
     */
    this.setup = (props, tag = "", context = this) => {
      if (typeof this.tagName !== typeof undefined) {
        tag = this.tagName.toLowerCase();
      }
      globalThis.addEventListener(
        "hax-store-ready",
        this._haxStoreReady.bind(this),
      );
      if (
        typeof globalThis.HaxStore !== typeof undefined &&
        globalThis.HaxStore.instance != null &&
        globalThis.HaxStore.instance.ready
      ) {
        return this.setHaxProperties(props, tag, context, true);
      } else {
        return this.setHaxProperties(props, tag, context, false);
      }
    };
    /**
     * HAX store is ready so now we can fire events
     */
    this._haxStoreReady = (e) => {
      if (
        e.detail &&
        typeof this.tagName !== typeof undefined &&
        typeof this.haxProperties !== typeof undefined
      ) {
        let tag = this.tagName;
        let props = this.haxProperties;
        let context = this;
        if (tag != "" && typeof globalThis.HaxStore === typeof undefined) {
          const evt = new CustomEvent("hax-register-properties", {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
              tag: tag.toLowerCase(),
              properties: props,
            },
          });
          context.dispatchEvent(evt);
        } else if (
          tag != "" &&
          typeof globalThis.HaxStore.instance.elementList[tag.toLowerCase()] ===
            typeof undefined
        ) {
          const evt = new CustomEvent("hax-register-properties", {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
              tag: tag.toLowerCase(),
              properties: props,
            },
          });
          context.dispatchEvent(evt);
        } else if (
          typeof this.tagName !== typeof undefined &&
          typeof globalThis.HaxStore.instance.elementList[
            this.tagName.toLowerCase()
          ] === typeof undefined
        ) {
          const evt = new CustomEvent("hax-register-properties", {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
              tag: this.tagName.toLowerCase(),
              properties: props,
            },
          });
          context.dispatchEvent(evt);
        }
      }
    };
    /**
     * Setter to bridge private haxProperties setter.
     * This is to then be implemented by the ready state of whatever is supplying the
     * properties in order to be able to bubble up the properties for a tag.
     */
    this.setHaxProperties = async (
      props = {},
      tag = "",
      context = document,
      isReady = false,
    ) => {
      // support remote loading from a string
      if (typeof props === "string") {
        props = await fetch(props).then((response) => {
          if (response && response.json) return response.json();
          return false;
        });
      }
      // these are a core piece of hax capabilities
      // set them in the event this got called without anything
      // so we at least won't bomb
      if (typeof props.api === typeof undefined) {
        props.api = "1";
      }
      // sets us up for future API versioning of property validation
      // and clean up.
      if (props.api == "1") {
        if (typeof props.type === typeof undefined) {
          props.type = "element";
        }
        if (typeof props.editingElement === typeof undefined) {
          props.editingElement = "core";
        }
        // @note really just for page-break but could see
        // elements that are to LITERALLY be what is defined
        // instead of mixing in our common settings collection-list
        // manages it's own spacing for example
        if (typeof props.hideDefaultSettings === typeof undefined) {
          props.hideDefaultSettings = false;
        }
        // can this be scaled via a simple 25/50/75/100 sizing
        if (typeof props.canScale === typeof undefined) {
          props.canScale = true;
        }
        if (typeof props.designSystem === typeof undefined) {
          props.designSystem = {
            primary: false,
            accent: false,
            text: false,
            card: false,
            designTreatment: false,
          };
        }
        if (typeof props.canEditSource === typeof undefined) {
          props.canEditSource = false;
        }
        if (typeof props.contentEditable === typeof undefined) {
          props.contentEditable = false;
        }
        if (typeof props.gizmo === typeof undefined) {
          props.gizmo = false;
        } else {
          // support possible dynamic import of iconset
          // this would be if the user defined their own icons
          if (typeof props.gizmo.iconLib !== typeof undefined) {
            var basePath;
            if (globalThis.WCGlobalBasePath) {
              basePath = globalThis.WCGlobalBasePath;
            } else {
              basePath =
                new URL("./HAXWiring.js", import.meta.url).href +
                "/../../../../";
            }
            import(`${basePath}${props.gizmo.iconLib}`);
          }
        }
        // while not required, this is where all the raw power of this
        // approach really lies since this wires properties/slots to HAX's
        // ability to manipulate things via contextual menus
        if (typeof props.settings !== typeof undefined) {
          if (typeof props.settings.configure === typeof undefined) {
            props.settings.configure = [];
          }
          for (let i = 0; i < props.settings.configure.length; i++) {
            props.settings.configure[i] = this.validateSetting(
              props.settings.configure[i],
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
              props.settings.advanced[i],
            );
            if (!props.settings.advanced[i]) {
              props.settings.advanced.splice(i, 1);
            }
          }
          if (typeof props.settings.developer === typeof undefined) {
            props.settings.developer = [];
          }
          for (let i = 0; i < props.settings.developer.length; i++) {
            props.settings.developer[i] = this.validateSetting(
              props.settings.developer[i],
            );
            if (!props.settings.developer[i]) {
              props.settings.developer.splice(i, 1);
            }
          }
          // support design systems supplying their own property definitions
          if (globalThis.HaxStore) {
            props =
              globalThis.HaxStore.requestAvailability().designSystemHAXProperties(
                props,
                tag,
              );
          }
          // apply standard set of props that the system wires in
          props = this.standardAdvancedProps(props, tag);
        }
        // support for advanced save options
        if (typeof props.saveOptions === typeof undefined) {
          props.saveOptions = {
            wipeSlot: false,
          };
        }
        // support for advanced save options
        if (typeof props.documentation === typeof undefined) {
          props.documentation = {
            howTo: null,
            purpose: null,
          };
        }
        // support for demoSchema
        if (typeof props.demoSchema === typeof undefined) {
          props.demoSchema = [];
        }
        // fire event so we know they have been set for the store to collect
        // only fire if we haven't already so multiple elements don't keep bubbling

        // if there's no global HaxStore then this means it is a custom
        // implementation of the schema
        if (isReady) {
          this.readyToFireHAXSchema(tag, props, context);
        }
        // only set these when tag hasn't been force fed
        if (tag === "") {
          if (typeof this._setHaxProperties === "function") {
            this._setHaxProperties(props);
          } else {
            this.haxProperties = props;
          }
        }
      } else {
        // especially useful during development if we implement our own API
        // incorrectly. Don't hard brick cause it'll still more or less work
        // but would probably default to an iframe which is less then ideal
        // but at least wouldn't brick the AX.
        console.warn(
          "This is't a valid usage of hax API. See hax-body-behaviors/lib/HAXWiring.js for more details on how to implement the API. https://haxtheweb.org/hax-schema for details but we will try and guess the wiring",
        );
      }
    };
    this.readyToFireHAXSchema = (tag, props, context) => {
      if (tag != "" && typeof globalThis.HaxStore === typeof undefined) {
        const evt = new CustomEvent("hax-register-properties", {
          bubbles: true,
          composed: true,
          cancelable: true,
          detail: {
            tag: tag.toLowerCase(),
            properties: props,
          },
        });
        context.dispatchEvent(evt);
      } else if (tag != "") {
        const evt = new CustomEvent("hax-register-properties", {
          bubbles: true,
          composed: true,
          cancelable: true,
          detail: {
            tag: tag.toLowerCase(),
            properties: props,
          },
        });
        context.dispatchEvent(evt);
      } else if (typeof this.tagName !== typeof undefined) {
        const evt = new CustomEvent("hax-register-properties", {
          bubbles: true,
          composed: true,
          cancelable: true,
          detail: {
            tag: this.tagName.toLowerCase(),
            properties: props,
          },
        });
        context.dispatchEvent(evt);
      } else if (typeof context.tagName !== typeof undefined) {
        const evt = new CustomEvent("hax-register-properties", {
          bubbles: true,
          composed: true,
          cancelable: true,
          detail: {
            tag: context.tagName.toLowerCase(),
            properties: props,
          },
        });
        context.dispatchEvent(evt);
      } else {
        console.warn(context);
        console.warn(
          `${tag} missed our checks and has an issue in implementation with HAX`,
        );
      }
    };
    /**
     * Standard advanced properties we support for all forms
     */
    this.standardAdvancedProps = (props, tag) => {
      if (!props.hideDefaultSettings) {
        // specialized attribute to allow locking in hax of anything
        props.settings.advanced.push({
          attribute: "data-hax-lock",
          title: "Lock editing",
          description: "Prevent changes to this element and all its content",
          inputMethod: "boolean",
        });
        // allow classes to be modified this way
        props.settings.developer.push({
          attribute: "class",
          title: "Classes",
          description: "CSS classes applied manually to the element",
          inputMethod: "textfield",
        });
        // allow styles to be modified this way
        props.settings.developer.push({
          attribute: "style",
          title: "Styles",
          description: "Custom CSS styles as applied to the element",
          inputMethod: "textfield",
        });
        // allow schema definitions
        props.settings.developer.push({
          attribute: "prefix",
          title: "Schema: prefix",
          description: "Schema prefixes",
          inputMethod: "textfield",
        });
        props.settings.developer.push({
          attribute: "typeof",
          title: "Schema: TypeOf",
          description: "typeof definition for Schema usage",
          inputMethod: "textfield",
        });
        props.settings.developer.push({
          attribute: "property",
          title: "Schema: Property",
          description: "typeof definition for Schema usage",
          inputMethod: "textfield",
        });
        props.settings.developer.push({
          attribute: "resource",
          title: "Schema: Resource ID",
          description: "Schema resource identifier",
          inputMethod: "textfield",
        });
        // allow the id to be modified
        props.settings.developer.push({
          attribute: "id",
          title: "ID",
          description: "element ID, only set this if you know why",
          inputMethod: "textfield",
        });
        // we need to support slot in the UI but actually shift it around under the hood
        // this is so that shadow roots don't get mad when previewing
        props.settings.developer.push({
          attribute: "slot",
          title: "slot",
          description: "DOM slot area",
          inputMethod: "textfield",
        });
      }
      return props;
    };
    /**
     * Validate settings object.
     */
    this.validateSetting = (setting) => {
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
      // ensure there's required set
      if (typeof setting.disabled === typeof undefined) {
        setting.disabled = false;
      }
      // ensure there's validation or make it anything if none set
      if (typeof setting.validation === typeof undefined) {
        setting.validation = ".*";
      }
      // ensure there's validation or make it anything if none set
      if (typeof setting.validationType === typeof undefined) {
        setting.validationType = "";
      }
      // slot can have a slot wrapper property
      if (typeof setting.slot !== typeof undefined) {
        if (typeof setting.slotWrapper === typeof undefined) {
          setting.slotWrapper = "span";
        }
        if (typeof setting.slotAttributes === typeof undefined) {
          setting.slotAttributes = {};
        }
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
      let settings = haxProperties.settings[type];
      var schema = {
        $schema: "http://json-schema.org/schema#",
        title: "HAX " + type + " form schema",
        type: "object",
        properties: {},
      };
      schema.properties = new SimpleFields().fieldsToSchema(settings);
      // support post processing of schema in order to allow for really
      // custom implementations that are highly dynamic in nature
      // post process hook needs to see if there's a class overriding this
      // if we have a definition for this component then we should run its postProcess
      // just to be safe
      if (
        haxProperties.gizmo &&
        haxProperties.gizmo.tag &&
        globalThis.customElements.get(haxProperties.gizmo.tag)
      ) {
        let tmp = globalThis.document.createElement(haxProperties.gizmo.tag);
        if (typeof tmp.postProcessgetHaxJSONSchema === "function") {
          schema = tmp.postProcessgetHaxJSONSchema(schema);
        } else {
          schema = target.postProcessgetHaxJSONSchema(schema);
        }
      } else {
        schema = target.postProcessgetHaxJSONSchema(schema);
      }
      return schema;
    };
    /**
     * Default postProcessgetHaxJSONSchema to be overridden.
     */
    this.postProcessgetHaxJSONSchema = (schema) => {
      return schema;
    };
    /**
     * Internal helper for getHaxJSONSchema to buiild the properties object
     * correctly with support for recursive nesting thx to objects / arrays.
     */
    this._getHaxJSONSchemaProperty = (settings) => {
      return new SimpleFields().fieldsToSchema(settings);
    };
    /**
     * Convert input method to schema type
     */
    this.getHaxJSONSchemaType = (inputMethod) => {
      var method =
        new SimpleFields().fieldsConversion.inputMethod[inputMethod] ||
        new SimpleFields().fieldsConversion;
      return method && method.defaultSettings && method.defaultSettings.type
        ? method.defaultSettings.type
        : "string";
    };
    /**
     * List valid input methods.
     */
    this.validHAXPropertyInputMethod = () => {
      var methods = Object.keys(
        new SimpleFields().fieldsConversion.inputMethod,
      );
      return methods;
    };
    /**
     * Return a haxProperties prototype / example structure
     */
    this.prototypeHaxProperties = () => {
      // example properties valid for HAX context menu.
      let props = {
        api: "1",
        type: "element",
        editingElement: "core",
        hideDefaultSettings: false,
        canScale: true,

        canEditSource: true,
        contentEditable: false,
        gizmo: {
          title: "Tag name",
          description: "",
          icon: "icons:android",
          color: "purple",
          tags: ["Other"],
          handles: [
            {
              type: "data",
              type_exclusive: false,
              url: "src",
            },
          ],
          meta: {
            author: "auto",
          },
          requiresChildren: false,
          requiresParent: false,
        },
        settings: {
          configure: [
            {
              slot: "",
              title: "Inner content",
              description: "The slotted content that lives inside the tag",
              inputMethod: "textfield",
              icon: "android",
              required: true,
              validationType: "text",
            },
            {
              slot: "button",
              title: "Button content",
              description: "The content that can override the button",
              inputMethod: "textfield",
              icon: "android",
              required: true,
              validationType: "text",
            },
            {
              property: "title",
              title: "Title",
              description: "",
              inputMethod: "textfield",
              icon: "android",
              required: true,
              validationType: "text",
            },
            {
              property: "primaryColor",
              title: "Title",
              description: "",
              inputMethod: "textfield",
              icon: "android",
              required: false,
              validation: ".*",
              validationType: "text",
            },
          ],
          advanced: [
            {
              property: "secondaryColor",
              title: "Secondary color",
              description:
                "An optional secondary color used in certain edge cases.",
              inputMethod: "colorpicker",
              icon: "color",
            },
            {
              property: "endPoint",
              title: "API endpoint",
              description:
                "An optional endpoint to hit and load in more data dymaically.",
              inputMethod: "textfield",
              icon: "android",
              validation: "[a-z0-9]",
              validationType: "url",
            },
          ],
          developer: [],
        },
        saveOptions: {
          wipeSlot: false,
          unsetAttributes: ["end-point", "secondary-color"],
        },
        documentation: {
          howTo: "https://oer.hax.psu.edu/bto108/sites/haxcellence/welcome",
          purpose: "https://oer.hax.psu.edu/bto108/sites/haxcellence/welcome",
        },
        demoSchema: [
          {
            tag: "my-tag",
            content: "<p>inner html</p>",
            properties: {
              endPoint: "https://cdn2.thecatapi.com/images/9j5.jpg",
              primaryColor: "yellow",
              title: "A cat",
            },
          },
        ],
      };
      return props;
    };
  }
}
/**
 * Super class element partial. This mixes the HAXWiring capabilities into the element itself.
 * Use this in instances where you want direct access to all the functions in the element itself
 */
export const HAXElement = function (SuperClass) {
  return class extends SuperClass {
    constructor() {
      super();
      this.windowControllers = new AbortController();
      this.HAXWiring = new HAXWiring();
    }

    /**
     *
     * @param {Object} props - HAX properties being set for the schema for an element
     * @param {String} tag - tagName of the element
     * @returns props object
     */
    designSystemHAXProperties(props, tag) {
      // design systems can implement this in order to inject options into elements in a pervasive way
      // this does nothing but ensure that HAX works without a design system
      return props;
    }
    static get properties() {
      return {
        ...super.properties,

        /**
         * haxProperties
         */
        haxProperties: globalThis.HAXWiring.haxProperties,
      };
    }
    /**
     * Setter to bridge private haxProperties setter.
     * This is to then be implemented by the ready state of whatever is supplying the
     * properties in order to be able to bubble up the properties for a tag.
     */
    setHaxProperties(props, tag = "", context = this) {
      if (tag == "" && typeof this.tagName !== typeof undefined) {
        tag = this.tagName.toLowerCase();
      }
      if (
        globalThis.HaxStore &&
        globalThis.HaxStore.instance != null &&
        globalThis.HaxStore.instance.ready
      ) {
        return this.HAXWiring.setHaxProperties(props, tag, context, true);
      } else {
        // slow load environment, set listener and hold off of processing
        globalThis.addEventListener(
          "hax-store-ready",
          this._haxStoreReady.bind(this),
          { signal: this.windowControllers.signal },
        );

        return this.HAXWiring.setHaxProperties(props, tag, context, false);
      }
    }
    /**
     * Clean up
     */
    disconnectedCallback() {
      this.windowControllers.abort();
      if (super.disconnectedCallback) {
        super.disconnectedCallback();
      }
    }
    /**
     * Setter to bridge private haxProperties setter.
     * This is to then be implemented by the ready state of whatever is supplying the
     * properties in order to be able to bubble up the properties for a tag.
     */
    setup(props, tag = "", context = this) {
      return this.HAXWiring.setup(props, (tag = ""), (context = this));
    }
    /**
     * Private function to fire off props when ready
     */
    _haxStoreReady(e) {
      return this.HAXWiring._haxStoreReady(e);
    }
    /**
     * Validate settings object.
     */
    validateSetting(setting) {
      return this.HAXWiring.validateSetting(setting);
    }
    /**
     * Match convention for set.
     */
    getHaxProperties() {
      return this.haxProperties;
    }
    /**
     * Convert haxProperties structure to a simple json-schema.
     * This allows for complex form building systems based on this data.
     * type is configure or advanced
     */
    getHaxJSONSchema(type, haxProperties, target = this) {
      return this.HAXWiring.getHaxJSONSchema(type, haxProperties, target);
    }
    /**
     * Default postProcessgetHaxJSONSchema to be overridden.
     */
    postProcessgetHaxJSONSchema(schema) {
      return this.HAXWiring.postProcessgetHaxJSONSchema(schema);
    }
    /**
     * Internal helper for getHaxJSONSchema to buiild the properties object
     * correctly with support for recursive nesting thx to objects / arrays.
     */
    _getHaxJSONSchemaProperty(settings) {
      return new SimpleFields().fieldsToSchema(settings);
    }
    /**
     * Convert input method to schedma type
     */
    getHaxJSONSchemaType(inputMethod) {
      return this.HAXWiring.getHaxJSONSchemaType(inputMethod);
    }
    /**
     * List valid input methods.
     */
    validHAXPropertyInputMethod() {
      return this.HAXWiring.validHAXPropertyInputMethod();
    }
    /**
     * Return a haxProperties prototype / example structure
     */
    prototypeHaxProperties() {
      return this.HAXWiring.prototypeHaxProperties();
    }
  };
};

// LEGACY. This is a Polymer 1.x syntax element "behavior"
// This has been replaced with HAXElement, a super class which can be used to wrap classes
// invoke an instance so we can support behaviors as well
globalThis.HAXWiring = new HAXWiring();
// ensure HAXPropertiesBehaviors exists
globalThis.HAXBehaviors = globalThis.HAXBehaviors || {};
globalThis.HAXBehaviors.PropertiesBehaviors = {
  properties: {
    /**
     * haxProperties
     */
    haxProperties: globalThis.HAXWiring.haxProperties,
  },
  /**
   * Setter to bridge private haxProperties setter.
   * This is to then be implemented by the ready state of whatever is supplying the
   * properties in order to be able to bubble up the properties for a tag.
   */
  setHaxProperties: function (props, tag = "", context = this) {
    if (tag == "" && typeof this.tagName !== typeof undefined) {
      tag = this.tagName.toLowerCase();
    }
    globalThis.addEventListener(
      "hax-store-ready",
      this._haxStoreReady.bind(this),
    );
    if (
      typeof globalThis.HaxStore !== typeof undefined &&
      globalThis.HaxStore.instance != null &&
      globalThis.HaxStore.instance.ready
    ) {
      return globalThis.HAXWiring.setHaxProperties(props, tag, context, true);
    } else {
      return globalThis.HAXWiring.setHaxProperties(props, tag, context, false);
    }
  },
  /**
   * Private function to fire off props when ready
   */
  _haxStoreReady: function (e) {
    return globalThis.HAXWiring._haxStoreReady(e);
  },
  /**
   * Validate settings object.
   */
  validateSetting: function (setting) {
    return globalThis.HAXWiring.validateSetting(setting);
  },
  /**
   * Match convention for set.
   */
  getHaxProperties: function () {
    return this.haxProperties;
  },
  /**
   * Convert haxProperties structure to a simple json-schema.
   * This allows for complex form building systems based on this data.
   * type is configure or advanced
   */
  getHaxJSONSchema: function (type, haxProperties, target = this) {
    return globalThis.HAXWiring.getHaxJSONSchema(type, haxProperties, target);
  },
  /**
   * Default postProcessgetHaxJSONSchema to be overridden.
   */
  postProcessgetHaxJSONSchema: function (schema) {
    return globalThis.HAXWiring.postProcessgetHaxJSONSchema(schema);
  },
  /**
   * Internal helper for getHaxJSONSchema to buiild the properties object
   * correctly with support for recursive nesting thx to objects / arrays.
   */
  _getHaxJSONSchemaProperty: function (settings) {
    return new SimpleFields().fieldsToSchema(settings);
  },
  /**
   * Convert input method to schedma type
   */
  getHaxJSONSchemaType: function (inputMethod) {
    return globalThis.HAXWiring.getHaxJSONSchemaType(inputMethod);
  },
  /**
   * List valid input methods.
   */
  validHAXPropertyInputMethod: function () {
    return globalThis.HAXWiring.validHAXPropertyInputMethod();
  },
  /**
   * Return a haxProperties prototype / example structure
   */
  prototypeHaxProperties: function () {
    return globalThis.HAXWiring.prototypeHaxProperties();
  },
};
