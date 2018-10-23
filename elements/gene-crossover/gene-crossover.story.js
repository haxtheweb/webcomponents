import { storiesOf } from "@storybook/polymer";
import * as storybookBridge from "@storybook/addon-knobs/polymer";
import { GeneCrossover } from "./gene-crossover.js";

// need to account for polymer goofiness when webpack rolls this up
var template = require("raw-loader!./demo/index.html");
let pattern = /<body[^>]*>((.|[\n\r])*)<\/body>/im;
var array_matches = pattern.exec(template);
// now template is just the body contents
template = array_matches[1];
const stories = storiesOf("Crossover", module);
stories.addDecorator(storybookBridge.withKnobs);
stories.add("gene-crossover", () => {
  var binding = {};
  // start of tag for demo
  let elementDemo = `<gene-crossover`;
  // mix in properties defined on the class
  for (var key in GeneCrossover.properties) {
    // skip prototype
    if (!GeneCrossover.properties.hasOwnProperty(key)) continue;
    // convert typed props
    if (GeneCrossover.properties[key].type.name) {
      let method = "text";
      switch (GeneCrossover.properties[key].type.name) {
        case "Boolean":
        case "Number":
        case "Object":
        case "Array":
        case "Date":
          method = GeneCrossover.properties[key].type.name.toLowerCase();
          break;
        default:
          method = "text";
          break;
      }
      binding[key] = storybookBridge[method](
        key,
        GeneCrossover.properties[key].value
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
  const innerText = storybookBridge.text("Inner contents", "Crossover");
  elementDemo += `> ${innerText}</gene-crossover>`;
  return `
  <h1>Live demo</h1>
  ${elementDemo}
  <h1>Additional examples</h1>
  ${template}
  `;
});
