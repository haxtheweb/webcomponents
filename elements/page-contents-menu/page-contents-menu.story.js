import { storiesOf } from "@storybook/polymer";
import * as storybookBridge from "@storybook/addon-knobs/polymer";
import { PageContentsMenu } from "./page-contents-menu.js";
import "@polymer/iron-demo-helpers/demo-snippet.js";
// need to account for polymer goofiness when webpack rolls this up
var template = require("raw-loader!./demo/index.html");
let pattern = /<body[^>]*>((.|[\n\r])*)<\/body>/im;
var array_matches = pattern.exec(template);
// now template is just the body contents
template = array_matches[1];
const stories = storiesOf("Contents", module);
stories.addDecorator(storybookBridge.withKnobs);
stories.add("page-contents-menu", () => {
  var binding = {};
  // start of tag for demo
  let elementDemo = `<page-contents-menu`;
  // mix in properties defined on the class
  for (var key in PageContentsMenu.properties) {
    // skip prototype
    if (!PageContentsMenu.properties.hasOwnProperty(key)) continue;
    // convert typed props
    if (PageContentsMenu.properties[key].type.name) {
      let method = "text";
      switch (PageContentsMenu.properties[key].type.name) {
        case "Boolean":
        case "Number":
        case "Object":
        case "Array":
        case "Date":
          method = PageContentsMenu.properties[key].type.name.toLowerCase();
          break;
        default:
          method = "text";
          break;
      }
      binding[key] = storybookBridge[method](
        key,
        PageContentsMenu.properties[key].value
      );
      // ensure ke-bab case
      let kebab = key.replace(
        /[A-Z\u00C0-\u00D6\u00D8-\u00DE]/g,
        function (match) {
          return "-" + match.toLowerCase();
        }
      );
      elementDemo += ` ${kebab}="${binding[key]}"`;
    }
  }
  const innerText = storybookBridge.text("Inner contents", "Contents");
  elementDemo += `> ${innerText}</page-contents-menu>`;
  return `
  <h1>Live demo</h1>
  ${elementDemo}
  <h1>Additional examples</h1>
  ${template}
  `;
});
