import { storiesOf } from "@storybook/polymer";
import * as storybookBridge from "@storybook/addon-knobs/polymer";
import { A11yGifPlayer } from "./a11y-gif-player.js";


/**
 * Creates a knob and adds an attribute for each property in the given element
 * @param {object} el 
 * @returns {string} attributes
 */
let setKnobsAndReturnAttributes = function(el){
  let binding = {}, attr = '';
  for (var key in el.properties) {
    // skip prototype
    if (!el.properties.hasOwnProperty(key)) continue;
    // convert typed props
    if (el.properties[key].type.name) {
      let method = "text", val = el.properties[key].value;
      switch (el.properties[key].type.name) {
        case "Boolean":
        case "Number":
        case "Object":
        case "Array":
        case "Date":
          method = el.properties[key].type.name.toLowerCase();
          break;
        default:
          method = "text";
          val = val !== null && val !== undefined ? val : '';
          break;
      }
      //don't include private properties
      if(key.startsWith('__') === false) {
        binding[key] = storybookBridge[method](key,val);

        // ensure ke-bab case
        let kebab = key.replace(/[A-Z\u00C0-\u00D6\u00D8-\u00DE]/g, function(
          match
        ) {
          return "-" + match.toLowerCase();
        });
        //don't include false booleans
        if(binding[key]!==false) attr += ` ${kebab}="${binding[key]}"`;
      }
    }
  }
  return attr;
}

/**
 * Creates a pattern library version based on demos
 * @param {string} the label for the element
 * @param {string} the html from a demo page
 */
let getStyleGuideStory = (path,label,template) => {
  // need to account for polymer goofiness when webpack rolls this up
  let pattern = /<body[^>]*>((.|[\n\r])*)<\/body>/im;
  let demo = storiesOf(path, module);
  var array_matches = pattern.exec(template);
  var makeRegex = filename => {
    return new RegExp("\.\/images\/"+filename,'g');
  };
  // now template is just the body contents
  template = array_matches[1];
  template = template.replace(/=\\"\\"/g, '').replace(/\\"/g, '"');
  demo.add(label, () => { return `${template}`; });
}
/**
 * Pattern Library Static Versions
 */
getStyleGuideStory('Pattern Library/Molecules/Media','GIF',require("raw-loader!./demo/index.html"));

/**
 * Live Demo Versions with Knobs
 */
const stories = storiesOf("a11y-gif-player", module);
stories.addDecorator(storybookBridge.withKnobs);
stories.add("a11y-gif-player", () => {
  // start of tag for demo
  return `<h1>a11y-gif-player</h1> <a11y-gif-player 
    style="width: 300px;"
    alt="${storybookBridge["text"]('alt','IT Crowd: Moss eating popcorn.')}"
    src="${storybookBridge["text"]('src','https://media.giphy.com/media/TrDxCdtmdluP6/giphy.gif')}"
    src-without-animation="${storybookBridge["text"]('srcWithoutAnimation','https://media.giphy.com/media/TrDxCdtmdluP6/480w_s.jpg')}">
  </a11y-collapse>`;
});