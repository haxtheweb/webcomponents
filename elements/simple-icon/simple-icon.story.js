import { storiesOf } from "@storybook/polymer";
import * as storybookBridge from "@storybook/addon-knobs/polymer";
import { SimpleIcon } from "./simple-icon.js";
import "@polymer/iron-demo-helpers/demo-snippet.js";
// need to account for polymer goofiness when webpack rolls this up
var template = require("raw-loader!./demo/index.html");
let pattern = /<body[^>]*>((.|[\n\r])*)<\/body>/im;
var array_matches = pattern.exec(template);
// now template is just the body contents
template = array_matches[1];
const stories = storiesOf("Icon", module);
stories.addDecorator(storybookBridge.withKnobs);
stories.add("simple-icon", () => {
  var binding = {};
  // start of tag for demo
  let elementDemo = `<simple-icon`;
  // mix in properties defined on the class
  for (var key in SimpleIcon.properties) {
    // skip prototype
    if (!SimpleIcon.properties.hasOwnProperty(key)) continue;
    // convert typed props
    if (SimpleIcon.properties[key].type.name) {
      let method = "text";
      switch (SimpleIcon.properties[key].type.name) {
        case "Boolean":
        case "Number":
        case "Object":
        case "Array":
        case "Date":
          method = SimpleIcon.properties[key].type.name.toLowerCase();
          break;
        default:
          method = "text";
          break;
      }
      binding[key] = storybookBridge[method](
        key,
        SimpleIcon.properties[key].value
      );
      // ensure ke-bab case
      let kebab = key.replace(/[A-Z\u00C0-\u00D6\u00D8-\u00DE]/g, function (
        match
      ) {
        return "-" + match.toLowerCase();
      });
      elementDemo += ` ${kebab}="${binding[key]}"`;
    }
  }
  const innerText = storybookBridge.text("Inner contents", "Icon");
  elementDemo += `> ${innerText}</simple-icon>`;
  return `
  <h1>Live demo</h1>
  ${elementDemo}
  <h1>Additional examples</h1>
  ${template}
  `;
});
