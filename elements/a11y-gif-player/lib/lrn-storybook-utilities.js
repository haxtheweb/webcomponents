import { storiesOf } from "@storybook/polymer";
import * as storybookBridge from "@storybook/addon-knobs/polymer";

window.LrnStorybookUtilities = window.LrnStorybookUtilities || {};

/**
 * Creates a knob and adds an attribute for each property in the given element
 * @param {object} the element
 * @param {array} an array of properties to exclude
 * @returns {string} attributes
 */
window.LrnStorybookUtilities.getKnobsFromProps = el => {
  let binding = {},
    attr = "";
  for (var key in el.properties) {
    // skip prototype, private properties, objects, anything in the exclusions array, or any computed property
    if (!el.properties.hasOwnProperty(key)) continue;
    let editable =
      key.startsWith("__") === false &&
      (el.properties[key].computed === undefined ||
        el.properties[key].computed === "undefined") &&
      el.properties[key].readOnly !== true;
    if (editable) {
      let val = el.properties[key].value,
        keyType = el.properties[key].type.name || el.properties[key].type;
      // convert typed props
      if (keyType) {
        let method = keyType.toLowerCase();
        switch (method) {
          case "boolean":
            method = "boolean";
            val = val === true;
            break;
          case "number":
            val = parseFloat(val);
            break;
          case "date":
            break;
          case "object":
            method = "text";
            val = JSON.stringify(val);
            break;
          case "array":
            method = "text";
            val = JSON.stringify(val);
            break;
          default:
            method = "text";
            val = val || "";
            break;
        }
        console.log(method, key, val);
        //storybook can't assign null or undefined to a text field
        binding[key] = storybookBridge[method](key, val);

        // ensure ke-bab case
        let kebab = key.replace(/[A-Z\u00C0-\u00D6\u00D8-\u00DE]/g, function(
          match
        ) {
          return "-" + match.toLowerCase();
        });
        //don't include false booleans
        if (binding[key] !== false && val !== "")
          attr += ` ${kebab}="${binding[key]}"`;
      }
    }
  }
  return attr;
};

/**
 * Adds pattern to pattern library
 * @param {string} the label for the element
 * @param {string} the html from a demo page
 * @returns {object} the demo object
 */
window.LrnStorybookUtilities.addPattern = (
  storypath,
  label,
  filepath,
  replacements = []
) => {
  // need to account for polymer goofiness when webpack rolls this up
  let template = window.LrnStorybookUtilities.cleanHTML(
      filepath,
      (replacements = [])
    ),
    demo = window.LrnStorybookUtilities.addStory(
      storypath,
      label,
      template,
      false
    );
};

/**
 * Adds pattern to pattern library
 * @param {string} the label for the element
 * @param {string} the html from a demo page
 * @returns {object} the demo object
 */
window.LrnStorybookUtilities.addStory = (
  storypath,
  label,
  template,
  knobs = true
) => {
  // need to account for polymer goofiness when webpack rolls this up
  let demo = storiesOf(storypath, module);
  if (knobs) demo.addDecorator(storybookBridge.withKnobs);
  demo.add(label, () => {
    return `${template}`;
  });
  console.log("addStory", storypath, label, template, demo);
  return demo;
};

/**
 * Adds pattern to pattern library
 * @param {string} the label for the element
 * @param {string} the html from a demo page
 * @returns {object} the demo object
 */
window.LrnStorybookUtilities.addLivedemo = (
  storypath,
  label,
  el,
  extraProps = ""
) => {
  console.log("addLivedemo", storypath, label, el);
  // need to account for polymer goofiness when webpack rolls this up
  let props = window.LrnStorybookUtilities.getKnobsFromProps(el),
    template = `<h1>${label}</h1><${label}${props}${extraProps}></${label}>`,
    demo = window.LrnStorybookUtilities.addStory(storypath, label, template);
  return demo;
};

/**
 * Creates a pattern library version based on demos
 * @param {string} the demo html for the story
 * @param {array} array of regular expressions and replacements
 * @returns {string} the cleaned demo html for the story
 */
window.LrnStorybookUtilities.cleanHTML = (template, replacements = []) => {
  // need to account for polymer goofiness when webpack rolls this up
  let pattern = /<body[^>]*>((.|[\n\r])*)<\/body>/im;
  //let demo = storiesOf("Pattern Library/Molecules/Media", module);
  var array_matches = pattern.exec(template);
  // now template is just the body contents
  template = array_matches[1];
  replacements.forEach((find, replace) => {
    template = template.replace(new RegExp(find, "g"), replace);
  });

  template = template.replace(/=\\"\\"/g, "").replace(/\\"/g, '"');
  return template;
};
