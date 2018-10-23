import { storiesOf } from "@storybook/polymer";
import * as storybookBridge from "@storybook/addon-knobs/polymer";
import { EcoJsonSchemaForm } from "./eco-json-schema-form.js";

// need to account for polymer goofiness when webpack rolls this up
var template = require("raw-loader!./demo/index.html");
let pattern = /<body[^>]*>((.|[\n\r])*)<\/body>/im;
var array_matches = pattern.exec(template);
// now template is just the body contents
template = array_matches[1];
const stories = storiesOf("Json", module);
stories.addDecorator(storybookBridge.withKnobs);
stories.add("eco-json-schema-form", () => {
  var binding = {};
  // start of tag for demo
  let elementDemo = `<eco-json-schema-form`;
  // mix in properties defined on the class
  for (var key in EcoJsonSchemaForm.properties) {
    // skip prototype
    if (!EcoJsonSchemaForm.properties.hasOwnProperty(key)) continue;
    // convert typed props
    if (EcoJsonSchemaForm.properties[key].type.name) {
      let method = "text";
      switch (EcoJsonSchemaForm.properties[key].type.name) {
        case "Boolean":
        case "Number":
        case "Object":
        case "Array":
        case "Date":
          method = EcoJsonSchemaForm.properties[key].type.name.toLowerCase();
          break;
        default:
          method = "text";
          break;
      }
      binding[key] = storybookBridge[method](
        key,
        EcoJsonSchemaForm.properties[key].value
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
  const innerText = storybookBridge.text("Inner contents", "Json");
  elementDemo += `> ${innerText}</eco-json-schema-form>`;
  return `
  <h1>Live demo</h1>
  ${elementDemo}
  <h1>Additional examples</h1>
  ${template}
  `;
});
