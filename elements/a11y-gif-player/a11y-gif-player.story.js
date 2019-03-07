import { A11yGifPlayer } from "./a11y-gif-player.js";
import { storiesOf } from "@storybook/polymer";
import * as storybookBridge from "@storybook/addon-knobs/polymer";

/**
 * Cleans the template html
 * @param {string} the demo html for the story
 * @param {array} array of regular expressions and replacements
 * @returns {string} the cleaned demo html for the story
 */
let cleanHTML = (template, replacements = []) => {
  // need to account for polymer goofiness when webpack rolls this up
  let pattern = /<body[^>]*>((.|[\n\r])*)<\/body>/im;
  //let demo = storiesOf("Pattern Library/Molecules/Media", module);
  var array_matches = pattern.exec(template);
  // now template is just the body contents
  template = array_matches[1];
  replacements.forEach(replacement => {
    template = template.replace(new RegExp(replacement.find, "g"), replacement.replace);
  });

  template = template.replace(/=\\"\\"/g, "").replace(/\\"/g, '"');
  return template;
},
/**
 * Creates a pattern library version based on demos
 * @param {object} story object with the following: ```
 {
  "of": "Pattern Library/Molecules/Media",          //the path in the pattern library
  "name": 'Video',                                  //the UI pattern name
  "file": require("raw-loader!./demo/index.html")   //the file to use as a template
  "replacements": [                                 //a series of replacment patterns
    {
      "find": "\.\/samples\/sintel-en.vtt",         //the regex pattern to find
      "replace": enVtt                              //the replacement string
    }
  ]
}
 ```
 * @returns {object} the pattern library version
 */
addPattern = story => {
  let template = cleanHTML(story.file, story.replacements);
  story.demo = storiesOf(story.of, module);
  story.demo.add(story.name, () => { return `${template}`; });
},
/**
 * Creates a knob and adds an attribute for each property in the given element
 * @param {object} the element
 * @param {array} an array of properties to exclude
 * @returns {string} attributes
 */
getBindings = props => {
  let binding = {};
  for (var key in props) {
    // skip prototype, private properties, objects, anything in the exclusions array, or any computed property
    if (!props.hasOwnProperty(key)) continue;
    let editable =
      key.startsWith("__") === false &&
      (props[key].computed === undefined ||
        props[key].computed === "undefined") &&
      props[key].readOnly !== true;
    if (editable) {
      let val = props[key].value,
        keyType = props[key].type.name || props[key].type;
      // convert typed props
      if (keyType) {
        let method = keyType.toLowerCase();
        switch (method) {
          case "boolean":
            method = "boolean";
            val = false;
            break;
          case "number":
            val = parseFloat(val);
            break;
          case "date":
            break;
          case "object":
            method = "text";
            val = JSON.stringify(val);
            break;
          case "array":
            method = "text";
            val = JSON.stringify(val);
            break;
          default:
            method = "text";
            val = val || "";
            break;
        }

        // ensure ke-bab case
        let kebab = key.replace(/[A-Z\u00C0-\u00D6\u00D8-\u00DE]/g, function(
          match
        ) {
          return "-" + match.toLowerCase();
        });
        binding[key] = {
          "id": kebab,
          "value": storybookBridge[method](key, val),
        };
      }
    }
  }
  return binding;
},
/**
 * Creates slotted HTML bound to knobs for each property or slot
 * @param {object} story object with the following: ```
{
  "of": "a11y-collapse",                                          //the catergory this story will be under
  "name": "a11y-collapse-group",                                   //the name of the element
  "props": A11yCollapseGroup.properties,                          //an object with properties to bind
  "slots": {
    "title": { "name": "title", "type": "String", "value": ``},   //an named slot slot to bind
    "slot": { "name": "slot", "type": "String", "value": ``}      //an unnamed slot to bind
  }, 
  "attr": ``,                                                     //unbound attributes
  "slotted": ``                                                   //unbound slotted content
}
```
 * @returns {object} the slot content to wire to slots
 */
addLiveDemo = (story) => {
  story.demo = storiesOf(story.of, module);
  story.demo.addDecorator(storybookBridge.withKnobs);
  story.demo.add(story.name, () => {
    story.slotted2 = ``;
    Object.values(getBindings(story.slots)).forEach(slot => {
      story.slotted2 += slot.id !== "slot" ? `<div slot="${slot.id}">${slot.value}</div>` : `${slot.value}`;
    });
    story.attr2 = ``;
    Object.values(getBindings(story.props)).forEach(prop => {
      if(prop.value !== false) story.attr2 += ` ${prop.id}="${prop.value}"`;
    });
    return `
      <h1>${story.name}</h1>
      <${story.name}${story.attr2}${story.attr}>
        ${story.slotted2}
        ${story.slotted}
      </${story.name}>
    `;
  });
};

/**
 * add to the pattern library
 */
const A11yGifPlayerPattern = {
  "of": "Pattern Library/Molecules/Media", 
  "name": 'GIF',
  "file": require("raw-loader!./demo/index.html"),
  "replacements": []
}
addPattern(A11yGifPlayerPattern);

/**
 * add the live demo
 */
const A11yGifPlayerStory = {
  "of": "a11y-gif-player",
  "name": "a11y-gif-player",
  "props": {
    "alt": {"name": "alt", "type": "String", "value": "IT Crowd: Moss eating popcorn." },
    "src": {"name": "src", "type": "String", "value": "https://media.giphy.com/media/TrDxCdtmdluP6/giphy.gif" },
    "srcWithoutAnimation": {"name": "srcWithoutAnimation", "type": "String", "value": "https://media.giphy.com/media/TrDxCdtmdluP6/480w_s.jpg" }
  }, 
  "slots": {}, 
  "attr": ` style="width: 300px"`,
  "slotted": ``
};
addLiveDemo(A11yGifPlayerStory);