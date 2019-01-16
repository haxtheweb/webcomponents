import { storiesOf } from "@storybook/polymer";
import * as storybookBridge from "@storybook/addon-knobs/polymer";
import { Hal9000 } from "./hal-9000.js";

// need to account for polymer goofiness when webpack rolls this up
var template = require("raw-loader!./demo/index.html");
let pattern = /<body[^>]*>((.|[\n\r])*)<\/body>/im;
var array_matches = pattern.exec(template);
// now template is just the body contents
template = array_matches[1];
const stories = storiesOf("9000", module);
stories.addDecorator(storybookBridge.withKnobs);
stories.add("hal-9000", () => {
  var binding = {};
  // start of tag for demo
  let elementDemo = `<hal-9000`;
  // mix in properties defined on the class
  for (var key in Hal9000.properties) {
    // skip prototype
    if (!Hal9000.properties.hasOwnProperty(key)) continue;
    // convert typed props
    if (Hal9000.properties[key].type.name) {
      let method = "text";
      switch (Hal9000.properties[key].type.name) {
        case "Boolean":
        case "Number":
        case "Object":
        case "Array":
        case "Date":
          method = Hal9000.properties[key].type.name.toLowerCase();
          break;
        default:
          method = "text";
          break;
      }
      binding[key] = storybookBridge[method](
        key,
        Hal9000.properties[key].value
      );
      // ensure ke-bab case
      let kebab = key.replace(/[A-Z\u00C0-\u00D6\u00D8-\u00DE]/g, function(
        match
      ) {
        return "-" + match.toLowerCase();
      });
      elementDemo += ` ${kebab}="${binding[key]}"`;
    }
  }
  const innerText = storybookBridge.text("Inner contents", "9000");
  elementDemo += `> ${innerText}</hal-9000>`;
  return `
  <h1>Live demo</h1>
  ${elementDemo}
  <h1>Additional examples</h1>
  ${template}
  `;
});
