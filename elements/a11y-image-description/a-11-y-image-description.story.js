import { storiesOf } from "@storybook/polymer";
import * as storybookBridge from "@storybook/addon-knobs/polymer";
import { A11YImageDescription } from "./a11y-image-description.js";
import "@polymer/iron-demo-helpers/demo-snippet.js";
// need to account for polymer goofiness when webpack rolls this up
var template = require("raw-loader!./demo/index.html");
let pattern = /<body[^>]*>((.|[\n\r])*)<\/body>/im;
var array_matches = pattern.exec(template);
// now template is just the body contents
template = array_matches[1];
const stories = storiesOf("11", module);
stories.addDecorator(storybookBridge.withKnobs);
stories.add("a11y-image-description", () => {
  var binding = {};
  // start of tag for demo
  let elementDemo = `<a11y-image-description`;
  // mix in properties defined on the class
  for (var key in A11YImageDescription.properties) {
    // skip prototype
    if (!A11YImageDescription.properties.hasOwnProperty(key)) continue;
    // convert typed props
    if (A11YImageDescription.properties[key].type.name) {
      let method = 'text';
      switch (A11YImageDescription.properties[key].type.name) {
        case 'Boolean':
        case 'Number':
        case 'Object':
        case 'Array':
        case 'Date':
          method = A11YImageDescription.properties[key].type.name.toLowerCase();
          break;
        default:
          method = 'text';
          break;
      }
      binding[key] = storybookBridge[method](key, A11YImageDescription.properties[key].value);
      // ensure ke-bab case
      let kebab = key.replace(/[A-Z\u00C0-\u00D6\u00D8-\u00DE]/g, function (match) {
        return '-' + match.toLowerCase();
      });
      elementDemo += ` ${kebab}="${binding[key]}"`;
    }
  }
  const innerText = storybookBridge.text("Inner contents", "11");
  elementDemo += `> ${ innerText }</a11y-image-description>`
  return `
  <h1>Live demo</h1>
  ${elementDemo}
  <h1>Additional examples</h1>
  ${template}
  `;
});
