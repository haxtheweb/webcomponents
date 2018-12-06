import { storiesOf } from "@storybook/polymer";
import * as storybookBridge from "@storybook/addon-knobs/polymer";
import { OutlineDesigner } from "./outline-designer.js";

// need to account for polymer goofiness when webpack rolls this up
var template = require("raw-loader!./demo/index.html");
let pattern = /<body[^>]*>((.|[\n\r])*)<\/body>/im;
var array_matches = pattern.exec(template);
// now template is just the body contents
template = array_matches[1];
const stories = storiesOf("Designer", module);
stories.addDecorator(storybookBridge.withKnobs);
stories.add("outline-designer", () => {
  var binding = {};
  // start of tag for demo
  let elementDemo = `<outline-designer`;
  // mix in properties defined on the class
  for (var key in OutlineDesigner.properties) {
    // skip prototype
    if (!OutlineDesigner.properties.hasOwnProperty(key)) continue;
    // convert typed props
    if (OutlineDesigner.properties[key].type.name) {
      let method = "text";
      switch (OutlineDesigner.properties[key].type.name) {
        case "Boolean":
        case "Number":
        case "Object":
        case "Array":
        case "Date":
          method = OutlineDesigner.properties[key].type.name.toLowerCase();
          break;
        default:
          method = "text";
          break;
      }
      binding[key] = storybookBridge[method](
        key,
        OutlineDesigner.properties[key].value
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
  const innerText = storybookBridge.text("Inner contents", "Designer");
  elementDemo += `> ${innerText}</outline-designer>`;
  return `
  <h1>Live demo</h1>
  ${elementDemo}
  <h1>Additional examples</h1>
  ${template}
  `;
});
