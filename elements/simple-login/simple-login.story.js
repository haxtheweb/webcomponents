import { storiesOf } from "@storybook/polymer";
import * as storybookBridge from "@storybook/addon-knobs/polymer";
import { SimpleLogin } from "./simple-login.js";
import "@polymer/iron-demo-helpers/demo-snippet.js";
// need to account for polymer goofiness when webpack rolls this up
var template = require("raw-loader!./demo/index.html");
let pattern = /<body[^>]*>((.|[\n\r])*)<\/body>/im;
var array_matches = pattern.exec(template);
// now template is just the body contents
template = array_matches[1];
const stories = storiesOf("Login", module);
stories.addDecorator(storybookBridge.withKnobs);
stories.add("simple-login", () => {
  var binding = {};
  // start of tag for demo
  let elementDemo = `<simple-login`;
  // mix in properties defined on the class
  for (var key in SimpleLogin.properties) {
    // skip prototype
    if (!SimpleLogin.properties.hasOwnProperty(key)) continue;
    // convert typed props
    if (SimpleLogin.properties[key].type.name) {
      let method = "text";
      switch (SimpleLogin.properties[key].type.name) {
        case "Boolean":
        case "Number":
        case "Object":
        case "Array":
        case "Date":
          method = SimpleLogin.properties[key].type.name.toLowerCase();
          break;
        default:
          method = "text";
          break;
      }
      binding[key] = storybookBridge[method](
        key,
        SimpleLogin.properties[key].value
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
  const innerText = storybookBridge.text("Inner contents", "Login");
  elementDemo += `> ${innerText}</simple-login>`;
  return `
  <h1>Live demo</h1>
  ${elementDemo}
  <h1>Additional examples</h1>
  ${template}
  `;
});
