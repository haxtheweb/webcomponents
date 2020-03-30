import { storiesOf } from "@storybook/polymer";
import * as storybookBridge from "@storybook/addon-knobs/polymer";
//import "@lrnwebcomponents/simple-colors/lib/simple-colors-polymer.js";
import "@lrnwebcomponents/es-global-bridge/es-global-bridge.js";

/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */

/**
 * Object to help load things in globally scoped and fire events when ready
 */
export class StorybookUtilities {
  /**
   * Cleans the template html
   * @param {string} the demo html for the story
   * @param {array} array of regular expressions and replacements
   * @returns {string} the cleaned demo html for the story
   */
  cleanHTML(template, replacements = []) {
    // need to account for polymer goofiness when webpack rolls this up
    let pattern = /<body[^>]*>((.|[\n\r])*)<\/body>/im;
    //let demo = storiesOf("Pattern Library/Molecules/Media", module);
    var array_matches = pattern.exec(template);
    // now template is just the body contents
    template = array_matches[1];
    replacements.forEach(replacement => {
      template = template.replace(
        new RegExp(replacement.find, "g"),
        replacement.replace
      );
    });

    template = template.replace(/=\\"\\"/g, "").replace(/\\"/g, '"');
    return template;
  }
  /**
   * Creates a pattern library version based on demos
   * @param {object} story object with the following: ```
   {
    "of": "Pattern Library/Molecules/Media",          //the path in the pattern library
    "name": 'Video',                                  //the UI pattern name
    "file": require("raw-loader!./demo/index.html")   //the file to use as a template
    "replacements": [                                 //a series of replacment patterns
      {
        "find": "\.\/samples\/sintel-en.vtt",         //the regex pattern to find
        "replace": enVtt                              //the replacement string
      }
    ]
  }
   ```
   * @returns {object} the pattern library version
   */
  addPattern(story) {
    let template = this.cleanHTML(story.file, story.replacements);
    story.before = story.before || ``;
    story.after = story.after || ``;
    story.demo = storiesOf(story.of, module);
    story.demo.add(story.name, () => {
      return `${story.before}${template}${story.after}`;
    });
    return [story.before, template, story.after];
  }
  /**
   * Creates a knob and adds an attribute for each property in the given element
   * @param {object} the element
   * @param {array} an array of properties to exclude
   * @returns {string} attributes
   */
  getBindings(props) {
    let binding = {},
      keys = Object.keys(props).sort();
    keys.forEach(key => {
      // skip prototype, private properties, objects, anything in the exclusions array, or any computed property
      //if (!props.hasOwnProperty(key)) continue;
      let editable =
        key.startsWith("__") === false &&
        (props[key].computed === undefined ||
          props[key].computed === "undefined") &&
        props[key].readOnly !== true;
      if (editable) {
        let keyType = props[key].type.name || props[key].type;
        // convert typed props
        if (keyType) {
          let method = keyType.toLowerCase(),
            stringifiedVal = JSON.stringify(props[key].value || "");
          // ensure ke-bab case
          let kebab = key.replace(/[A-Z\u00C0-\u00D6\u00D8-\u00DE]/g, function(
            match
          ) {
            return "-" + match.toLowerCase();
          });
          //See https://github.com/storybooks/storybook/tree/master/addons/knobs for knob types
          binding[key] = {
            id: kebab,
            value:
              method === "select"
                ? storybookBridge.select(
                    key,
                    props[key].options || [],
                    props[key].value
                  )
                : method === "number"
                ? storybookBridge.number(
                    key,
                    props[key].value !== undefined && props[key].value !== null
                      ? parseFloat(props[key].value)
                      : ""
                  )
                : method === "boolean"
                ? storybookBridge.boolean(key, props[key].value)
                : method === "date"
                ? storybookBridge.date(key, new Date(props[key].value))
                : method === "files"
                ? storybookBridge.files(
                    key,
                    props[key].options || {},
                    props[key].value || ""
                  )
                : method === "radios"
                ? storybookBridge.radios(
                    key,
                    props[key].options || {},
                    props[key].value || ``
                  )
                : method === "object"
                ? storybookBridge.text(key, stringifiedVal || "{}")
                : //storybookBridge.object(key, props[key].value || {}) :
                method === "array"
                ? storybookBridge.text(key, stringifiedVal || "[]")
                : //storybookBridge.array(key, props[key].value || [], ',') :
                method === "options"
                ? storybookBridge.radios(
                    key,
                    props[key].valuesObj || {},
                    props[key].value || ``,
                    props[key].options || {}
                  )
                : //method === "text"
                  storybookBridge.text(key, props[key].value || ``)
          };
        }
      }
    });
    return binding;
  }
  /**
   * gets properties from simple-colors and sets up accent color as a select
   *
   * @param {color} optional color as the default value
   * @returns {object} the simple colors properties
   * /
  getSimpleColorsPolymer(color = "blue") {
    return {
      accentColor: {
        name: "accentColor",
        type: "Select",
        value: color,
        options: Object.keys(window.SimpleColorsStyles.colors)
      },
      dark: {
        name: "dark",
        type: "Boolean",
        value: false
      }
    };
  }
  /**
   * Creates slotted HTML bound to knobs for each property or slot
   * @param {object} story object with the following: ```
  {
    "of": "a11y-collapse",                                          //the catergory this story will be under
    "name": "a11y-collapse-group",                                   //the name of the element
    "alias": "accordion",                                           //optional alias for storybook menu item
    "props": A11yCollapseGroup.properties,                          //an object with properties to bind
    "slots": {
      "title": { "name": "title", "type": "String", "value": ``},   //an named slot slot to bind
      "slot": { "name": "slot", "type": "String", "value": ``}      //an unnamed slot to bind
    }, 
    "attr": ``,                                                     //unbound attributes
    "slotted": ``                                                   //unbound slotted content
  }
  ```
   * @returns {object} the slot content to wire to slots
   */
  addLiveDemo(story, escape = false) {
    story.alias = story.alias !== undefined ? story.alias : story.name;
    story.before = story.before !== undefined ? story.before : ``;
    story.after = story.after !== undefined ? story.after : ``;
    story.attr = story.attr !== undefined ? story.attr : ``;
    story.slotted = story.slotted !== undefined ? story.slotted : ``;
    story.slots = story.slots !== undefined ? story.slots : {};
    story.props = story.props !== undefined ? story.props : {};
    story.demo = storiesOf(story.of, module);
    story.demo.addDecorator(storybookBridge.withKnobs);
    story.demo.add(
      story.alias,
      () => {
        story.attrBindings = ``;
        Object.values(this.getBindings(story.props)).forEach(prop => {
          if (prop.value !== false && prop.value !== "") {
            story.attrBindings +=
              typeof prop.value !== "string"
                ? ` ${prop.id}="${prop.value}"`
                : ` ${prop.id}="${prop.value
                    .replace(/'/g, "&apos;")
                    .replace(/"/g, "&quot;")}"`;
          }
        });
        story.slotBindings = ``;
        Object.values(this.getBindings(story.slots)).forEach(slot => {
          story.slotBindings +=
            slot.id !== "slot"
              ? `<div slot="${slot.id}">${slot.value}</div>`
              : `${slot.value}`;
        });
        return `
        <h1>${story.alias}</h1>
        ${story.before}
        <${story.name}${story.attrBindings}${story.attr}>
          ${story.slotBindings}
          ${story.slotted}
        </${story.name}>
        ${story.after}
      `;
      },
      { knobs: { escapeHTML: escape } }
    );
  }
  /**
   * prevents the element's load of an unpacked location from failing
   * and loads a packed path specificed by thye story.js file
   * @param {*} name of the resource (should match the name the element is using to load)
   * @param {*} location of the resource, eg., require("file-loader!./path/to/file.js")
   */
  addGlobalScript(name, location) {
    window.ESGlobalBridge.requestAvailability();
    if (!window.ESGlobalBridge.webpack) window.ESGlobalBridge.webpack = {};
    window.ESGlobalBridge.webpack[name] = true;
    window.ESGlobalBridge.instance.load(name, location, true);
  }
}

// register global bridge on window if needed
window.StorybookUtilities = window.StorybookUtilities || {};

window.StorybookUtilities.requestAvailability = () => {
  if (!window.StorybookUtilities.instance) {
    window.StorybookUtilities.instance = new StorybookUtilities();
  }
};
