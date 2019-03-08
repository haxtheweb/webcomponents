import { storiesOf } from "@storybook/polymer";
import * as storybookBridge from "@storybook/addon-knobs/polymer";

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
    story.demo = storiesOf(story.of, module);
    story.demo.add(story.name, () => {
      return `${template}`;
    });
  }
  /**
   * Creates a knob and adds an attribute for each property in the given element
   * @param {object} the element
   * @param {array} an array of properties to exclude
   * @returns {string} attributes
   */
  getBindings(props) {
    let binding = {};
    for (var key in props) {
      // skip prototype, private properties, objects, anything in the exclusions array, or any computed property
      if (!props.hasOwnProperty(key)) continue;
      let editable =
        key.startsWith("__") === false &&
        (props[key].computed === undefined ||
          props[key].computed === "undefined") &&
        props[key].readOnly !== true;
      if (editable) {
        console.log(key, props[key]);
        let val = props[key].value,
          keyType = props[key].type.name || props[key].type;
        // convert typed props
        if (keyType) {
          let method = keyType.toLowerCase();
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
                ? storybookBridge.select(key, props[key].options || [], val)
                : method === "number"
                ? storybookBridge.number(key, parseFloat(val))
                : method === "boolean"
                ? storybookBridge.boolean(key, false)
                : method === "date"
                ? storybookBridge.date(key, new Date(val))
                : method === "files"
                ? storybookBridge.files(
                    key,
                    props[key].options || {},
                    val || ""
                  )
                : method === "radios"
                ? storybookBridge.radios(key, props[key].options || {}, val)
                : method === "object"
                ? storybookBridge.text(key, JSON.stringify(val || {}))
                : //storybookBridge.object(key, val || {}) :
                method === "array"
                ? storybookBridge.text(key, JSON.stringify(val || {}))
                : //storybookBridge.array(key, val || [], ',') :
                method === "options"
                ? storybookBridge.radios(
                    key,
                    props[key].valuesObj || {},
                    val,
                    props[key].options || {}
                  )
                : //method === "text"
                  storybookBridge.text(key, val || "")
          };
        }
      }
    }
    return binding;
  }
  /**
   * Creates slotted HTML bound to knobs for each property or slot
   * @param {object} story object with the following: ```
  {
    "of": "a11y-collapse",                                          //the catergory this story will be under
    "name": "a11y-collapse-group",                                   //the name of the element
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
  addLiveDemo(story) {
    story.demo = storiesOf(story.of, module);
    story.demo.addDecorator(storybookBridge.withKnobs);
    story.demo.add(story.name, () => {
      story.slotted2 = ``;
      Object.values(this.getBindings(story.slots)).forEach(slot => {
        story.slotted2 +=
          slot.id !== "slot"
            ? `<div slot="${slot.id}">${slot.value}</div>`
            : `${slot.value}`;
      });
      story.attr2 = ``;
      Object.values(this.getBindings(story.props)).forEach(prop => {
        if (prop.value !== false) story.attr2 += ` ${prop.id}="${prop.value}"`;
      });
      return `
        <h1>${story.name}</h1>
        <${story.name}${story.attr2}${story.attr}>
          ${story.slotted2}
          ${story.slotted}
        </${story.name}>
      `;
    });
  }
}
// register global bridge on window if needed
window.StorybookUtilities = window.StorybookUtilities || {};

window.StorybookUtilities.requestAvailability = () => {
  if (!window.StorybookUtilities.instance) {
    window.StorybookUtilities.instance = new StorybookUtilities();
  }
};
