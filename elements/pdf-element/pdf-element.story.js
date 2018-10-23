import { storiesOf } from "@storybook/polymer";
import * as storybookBridge from "@storybook/addon-knobs/polymer";
import { PdfElement } from "./pdf-element.js";

// need to account for polymer goofiness when webpack rolls this up
var template = require("raw-loader!./demo/index.html");
let pattern = /<body[^>]*>((.|[\n\r])*)<\/body>/im;
var array_matches = pattern.exec(template);
// now template is just the body contents
template = array_matches[1];
const stories = storiesOf("Element", module);
stories.addDecorator(storybookBridge.withKnobs);
stories.add("pdf-element", () => {
  var binding = {};
  // start of tag for demo
  let elementDemo = `<pdf-element`;
  // mix in properties defined on the class
  for (var key in PdfElement.properties) {
    // skip prototype
    if (!PdfElement.properties.hasOwnProperty(key)) continue;
    // convert typed props
    if (PdfElement.properties[key].type.name) {
      let method = "text";
      switch (PdfElement.properties[key].type.name) {
        case "Boolean":
        case "Number":
        case "Object":
        case "Array":
        case "Date":
          method = PdfElement.properties[key].type.name.toLowerCase();
          break;
        default:
          method = "text";
          break;
      }
      binding[key] = storybookBridge[method](
        key,
        PdfElement.properties[key].value
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
  const innerText = storybookBridge.text("Inner contents", "Element");
  elementDemo += `> ${innerText}</pdf-element>`;
  return `
  <h1>Live demo</h1>
  ${elementDemo}
  <h1>Additional examples</h1>
  ${template}
  `;
});
