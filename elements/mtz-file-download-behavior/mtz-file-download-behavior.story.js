import { storiesOf } from "@storybook/polymer";
import * as storybookBridge from "@storybook/addon-knobs/polymer";
import { MtzFileDownloadBehavior } from "./mtz-file-download-behavior.js";

// need to account for polymer goofiness when webpack rolls this up
var template = require("raw-loader!./demo/index.html");
let pattern = /<body[^>]*>((.|[\n\r])*)<\/body>/im;
var array_matches = pattern.exec(template);
// now template is just the body contents
template = array_matches[1];
const stories = storiesOf("File", module);
stories.addDecorator(storybookBridge.withKnobs);
stories.add("mtz-file-download-behavior", () => {
  var binding = {};
  // start of tag for demo
  let elementDemo = `<mtz-file-download-behavior`;
  // mix in properties defined on the class
  for (var key in MtzFileDownloadBehavior.properties) {
    // skip prototype
    if (!MtzFileDownloadBehavior.properties.hasOwnProperty(key)) continue;
    // convert typed props
    if (MtzFileDownloadBehavior.properties[key].type.name) {
      let method = "text";
      switch (MtzFileDownloadBehavior.properties[key].type.name) {
        case "Boolean":
        case "Number":
        case "Object":
        case "Array":
        case "Date":
          method = MtzFileDownloadBehavior.properties[
            key
          ].type.name.toLowerCase();
          break;
        default:
          method = "text";
          break;
      }
      binding[key] = storybookBridge[method](
        key,
        MtzFileDownloadBehavior.properties[key].value
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
  const innerText = storybookBridge.text("Inner contents", "File");
  elementDemo += `> ${innerText}</mtz-file-download-behavior>`;
  return `
  <h1>Live demo</h1>
  ${elementDemo}
  <h1>Additional examples</h1>
  ${template}
  `;
});
