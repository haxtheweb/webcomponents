import { storiesOf } from "@storybook/polymer";
import * as storybookBridge from "@storybook/addon-knobs/polymer";
import { A11yCollapse } from "./a11y-collapse.js";
import { A11yCollapseGroup } from "./lib/a11y-collapse-group.js";
/**
 * Creates a knob and adds an attribute for each property in the given element
 * @param {object} the element 
 * @param {array} properties to exclude
 * @returns {string} attributes
 */
let setKnobsAndReturnAttributes = function(el,exclusions = []){
  let binding = {}, attr = '';
  for (var key in el.properties) {
    // skip prototype, private properties, objects, anything in the exclusions array, or any computed property
    if (!el.properties.hasOwnProperty(key)) continue;    
    let editable = key.startsWith('__') === false 
      && exclusions.includes(key) === false 
      && (el.properties[key].computed === undefined || el.properties[key].computed === 'undefined') 
      && el.properties[key].readOnly !== true;
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
            val = val || '';
            break;
        } 
        //storybook can't assign null or undefined to a text field
        binding[key] = storybookBridge[method](key,val);

        // ensure ke-bab case
        let kebab = key.replace(/[A-Z\u00C0-\u00D6\u00D8-\u00DE]/g, function(
          match
        ) {
          return "-" + match.toLowerCase();
        });
        //don't include false booleans
        if(binding[key]!==false && val !== '') attr += ` ${kebab}="${binding[key]}"`;
      }
    } 
  }
  return attr;
}

/**
 * Creates a pattern library version based on demos
 * @param {string} the label for the element
 * @param {string} the html from a demo page
 */
let getStyleGuideStory = (label,template) => {
  // need to account for polymer goofiness when webpack rolls this up
  let pattern = /<body[^>]*>((.|[\n\r])*)<\/body>/im;
  let demo = storiesOf("Pattern Library/Molecules/Layout", module);
  var array_matches = pattern.exec(template);
  var makeRegex = filename => {
    return new RegExp("\.\/samples\/"+filename,'g');
  };
  // now template is just the body contents
  template = array_matches[1];
  template = template.replace(/=\\"\\"/g, '').replace(/\\"/g, '"');
  demo.add(label, () => { return `${template}`; });
}
/**
 * Pattern Library Static Versions
 */
getStyleGuideStory('Accordion',require("raw-loader!./demo/accordion.html"));
getStyleGuideStory('Collapse',require("raw-loader!./demo/index.html"));

/**
 * Live Demo Versions with Knobs
 */
const stories = storiesOf("a11y-collapse", module);
stories.addDecorator(storybookBridge.withKnobs);
stories.add("a11y-collapse", () => {
  // start of tag for demo
  let elementDemo = `<a11y-collapse`;
  const heading = storybookBridge.text("heading", "Click to expand me.");
  const content = storybookBridge.text("content", "Here are some details.");
  elementDemo += setKnobsAndReturnAttributes(A11yCollapse);
  elementDemo += `><p slot="heading">${heading}</p><div slot="content">${content}</div></a11y-collapse>`;
  return `<h1>a11y-collapse</h1> ${elementDemo}`;
});
stories.add("a11y-collapse-group", () => {
  var binding = {};
  // start of tag for demo
  let elementDemo = `<a11y-collapse-group`;
  elementDemo += setKnobsAndReturnAttributes(A11yCollapseGroup);
  elementDemo += `>
    <h2>Secondary Colors</h2>
    <a11y-collapse accordion>
      <p slot="heading">Purple</p>
      <div slot="content">Blue and red make purple.</div>
    </a11y-collapse>
    <a11y-collapse accordion>
      <p slot="heading">Green</p>
      <div slot="content">Blue and yellow make purple.</div>
    </a11y-collapse>
    <a11y-collapse accordion>
      <p slot="heading">Orange</p>
      <div slot="content">Yellow and red make purple.</div>
  </a11y-collapse-group>`;
  return `<h1>a11y-collapse-group</h1> ${elementDemo}`;
});
