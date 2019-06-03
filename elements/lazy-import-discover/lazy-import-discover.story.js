import { storiesOf } from "@storybook/polymer";
import * as storybookBridge from "@storybook/addon-knobs/polymer";
import { LazyImportDiscover } from "./lazy-import-discover.js";
import "@polymer/iron-demo-helpers/demo-snippet.js";
// need to account for polymer goofiness when webpack rolls this up
var template = require("raw-loader!./demo/index.html");
let pattern = /<body[^>]*>((.|[\n\r])*)<\/body>/im;
var array_matches = pattern.exec(template);
// now template is just the body contents
template = array_matches[1];
const stories = storiesOf("Import", module);
stories.addDecorator(storybookBridge.withKnobs);
stories.add("lazy-import-discover", () => {
  var binding = {};
  // start of tag for demo
  let elementDemo = `<lazy-import-discover`;
  // mix in properties defined on the class
  for (var key in LazyImportDiscover.properties) {
    // skip prototype
    if (!LazyImportDiscover.properties.hasOwnProperty(key)) continue;
    // convert typed props
    if (LazyImportDiscover.properties[key].type.name) {
      let method = "text";
      switch (LazyImportDiscover.properties[key].type.name) {
        case "Boolean":
        case "Number":
        case "Object":
        case "Array":
        case "Date":
          method = LazyImportDiscover.properties[key].type.name.toLowerCase();
          break;
        default:
          method = "text";
          break;
      }
      binding[key] = storybookBridge[method](
        key,
        LazyImportDiscover.properties[key].value
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
  const innerText = storybookBridge.text("Inner contents", "Import");
  elementDemo += `> ${innerText}</lazy-import-discover>`;
  return `
  <h1>Live demo</h1>
  ${elementDemo}
  <h1>Additional examples</h1>
  ${template}
  `;
});
