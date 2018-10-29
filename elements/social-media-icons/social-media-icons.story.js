import { storiesOf } from "@storybook/polymer";
import * as storybookBridge from "@storybook/addon-knobs/polymer";
import { SocialMediaIcons } from "./social-media-icons.js";

// need to account for polymer goofiness when webpack rolls this up
var template = require("raw-loader!./demo/index.html");
let pattern = /<body[^>]*>((.|[\n\r])*)<\/body>/im;
var array_matches = pattern.exec(template);
// now template is just the body contents
template = array_matches[1];
const stories = storiesOf("Media", module);
stories.addDecorator(storybookBridge.withKnobs);
stories.add("social-media-icons", () => {
  var binding = {};
  // start of tag for demo
  let elementDemo = `<social-media-icons`;
  // mix in properties defined on the class
  for (var key in SocialMediaIcons.properties) {
    // skip prototype
    if (!SocialMediaIcons.properties.hasOwnProperty(key)) continue;
    // convert typed props
    if (SocialMediaIcons.properties[key].type.name) {
      let method = "text";
      switch (SocialMediaIcons.properties[key].type.name) {
        case "Boolean":
        case "Number":
        case "Object":
        case "Array":
        case "Date":
          method = SocialMediaIcons.properties[key].type.name.toLowerCase();
          break;
        default:
          method = "text";
          break;
      }
      binding[key] = storybookBridge[method](
        key,
        SocialMediaIcons.properties[key].value
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
  const innerText = storybookBridge.text("Inner contents", "Media");
  elementDemo += `> ${innerText}</social-media-icons>`;
  return `
  <h1>Live demo</h1>
  ${elementDemo}
  <h1>Additional examples</h1>
  ${template}
  `;
});
