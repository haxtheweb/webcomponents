import { A11yGifPlayer } from "./a11y-gif-player.js";
import { storiesOf } from "@storybook/polymer";
import * as storybookBridge from "@storybook/addon-knobs/polymer";

/**
 * Creates a knob and adds an attribute for each property in the given element
 * @param {object} the element
 * @param {array} an array of properties to exclude
 * @returns {string} attributes
 */
let getBindings = props => {
  let bindings = [];
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
        bindings.push({
          "id": kebab,
          "value": storybookBridge[method](key, val),
        })
      }
    }
  }
  return bindings;
},
/**
 * Creates a string of attributes wired to knobs for each property
 * @param {array} an array of properties
 * @returns {object} the attributes to wire to properties
 */
getAttributes = (data) => {
  let result = ``, props = getBindings(data);
  props.forEach(prop => {
    if(prop.value !== false) result += ` ${prop.id}="${prop.value}"`;
  });
  return result;
},
/**
 * Creates slotted HTML wired to knobs for each property
 * @param {array} an array of slots
 * @returns {object} the slot content to wire to slots
 */
getSlotted = (data) => {
  let result = ``, slots = getBindings(data);
  slots.forEach(slot => {
    result += slot.id !== "slot" ? `<div slot="${slot.id}">${slot.value}</div>` : `${slot.value}`;
  });
  return result;
},
/**
 * Creates slotted HTML wired to knobs for each property
 * @param {array} an array of slots
 * @returns {object} the slot content to wire to slots
 */
addLiveDemo = (story) => {
  console.log('addLiveDemo',story);
  let demo = storiesOf(story.of, module), 
    storySlots = getSlotted(story.slots), 
    storyProps = getAttributes(story.props);
  demo.addDecorator(storybookBridge.withKnobs);
  demo.add(story.tag, () => {
    return `
      <h1>${story.tag}</h1>
      <${story.tag}${storyProps}${story.attr}>
        ${storySlots}
        ${story.slotted}
      </${story.tag}>
    `;
  });
};

let story = {
  "of": "a11y-gif-player",
  "tag": "a11y-gif-player",
  "props": {
    "alt": {"name": "alt", "type": "String", "value": "IT Crowd: Moss eating popcorn." },
    "src": {"name": "src", "type": "String", "value": "https://media.giphy.com/media/TrDxCdtmdluP6/giphy.gif" },
    "srcWithoutAnimation": {"name": "srcWithoutAnimation", "type": "String", "value": "https://media.giphy.com/media/TrDxCdtmdluP6/480w_s.jpg" }
  }, 
  "slots": {}, 
  "attr": ` style="width: 300px"`,
  "slotted": ``
};
addLiveDemo(story);

let utils = window.LrnStorybookUtilities;

/**
 * Pattern Library Static Versions
 * /
let pattern = utils.addPattern(
  'Pattern Library/Molecules/Media',
  'GIF',
  require("raw-loader!./demo/index.html")
);*/