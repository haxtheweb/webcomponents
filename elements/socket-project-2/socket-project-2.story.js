import { storiesOf } from "@storybook/polymer";
import * as storybookBridge from "@storybook/addon-knobs/polymer";
import { SocketProject2 } from "./socket-project-2.js";

// need to account for polymer goofiness when webpack rolls this up
var template = require("raw-loader!./demo/index.html");
let pattern = /<body[^>]*>((.|[\n\r])*)<\/body>/im;
var array_matches = pattern.exec(template);
// now template is just the body contents
template = array_matches[1];
const stories = storiesOf("Project", module);
stories.addDecorator(storybookBridge.withKnobs);
stories.add("socket-project-2", () => {
  var binding = {};
  // start of tag for demo
  let elementDemo = `<socket-project-2`;
  // mix in properties defined on the class
  for (var key in SocketProject2.properties) {
    // skip prototype
    if (!SocketProject2.properties.hasOwnProperty(key)) continue;
    // convert typed props
    if (SocketProject2.properties[key].type.name) {
      let method = "text";
      switch (SocketProject2.properties[key].type.name) {
        case "Boolean":
        case "Number":
        case "Object":
        case "Array":
        case "Date":
          method = SocketProject2.properties[key].type.name.toLowerCase();
          break;
        default:
          method = "text";
          break;
      }
      binding[key] = storybookBridge[method](
        key,
        SocketProject2.properties[key].value
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
  const innerText = storybookBridge.text("Inner contents", "Project");
  elementDemo += `> ${innerText}</socket-project-2>`;
  return `
  <h1>Live demo</h1>
  ${elementDemo}
  <h1>Additional examples</h1>
  ${template}
  `;
});
