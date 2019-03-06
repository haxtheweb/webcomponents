import { storiesOf } from "@storybook/polymer";
import * as storybookBridge from "@storybook/addon-knobs/polymer";
import { A11yMediaPlayer } from "./a11y-media-player.js";
import { A11yMediaPlayerBehaviors } from "./lib/a11y-media-player-behaviors.js";
import * as enVtt from "./demo/samples/sintel-en.vtt";
import * as deVtt from "./demo/samples/sintel-de.vtt";
import * as esVtt from "./demo/samples/sintel-es.vtt";
import * as buellerVtt from "./demo/samples/bueller.vtt";
import * as buellerMp3 from "./demo/samples/bueller.mp3";
import * as stclairVtt from "./demo/samples/stclair.vtt";
import stclairJpg from "./demo/samples/stclair.jpg";
/**
 * Creates a knob and adds an attribute for each property in the given element
 * @param {object} the element 
 * @param {array} properties to exclude
 * @returns {string} attributes
 */
let setKnobsAndReturnAttributes = function(el,exclusions = []){
  let binding = {}, attr = '';
  for (var key in el.properties) {
    // skip prototype, private properties, objects, anything in the exclusions array, or any computed property
    if (!el.properties.hasOwnProperty(key) && key.startsWith('__') === false && el.properties[key].type.name !== "Object" && exclusions.includes(key) === false && el.properties[key].computed === undefined) continue;
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
          break;
      }
      //storybook can't assign null or undefined to a text field
      if (method === 'text') val = val !== null && val !== undefined ? val : ''; 
      binding[key] = storybookBridge[method](key,val);

      // ensure ke-bab case
      let kebab = key.replace(/[A-Z\u00C0-\u00D6\u00D8-\u00DE]/g, function(
        match
      ) {
        return "-" + match.toLowerCase();
      });
      //don't include false booleans
      if(binding[key]!==false && val !== '') attr += ` ${kebab}="${binding[key]}"`;
    }
  }
  return attr;
}

/**
 * Pattern Library Version
 */
let getStyleGuideStory = (label,template) => {
  // need to account for polymer goofiness when webpack rolls this up
  let pattern = /<body[^>]*>((.|[\n\r])*)<\/body>/im;
  let demo = storiesOf("Pattern Library/Molecules/Media", module);
  var array_matches = pattern.exec(template);
  var makeRegex = filename => {
    return new RegExp("\.\/samples\/"+filename,'g');
  };
  // now template is just the body contents
  template = array_matches[1];
  template = template.replace(makeRegex('sintel-en.vtt'),enVtt);
  template = template.replace(makeRegex('sintel-de.vtt'),deVtt);
  template = template.replace(makeRegex('sintel-es.vtt'),esVtt);
  template = template.replace(makeRegex('stclair.vtt'),stclairVtt);
  template = template.replace(makeRegex('bueller.vtt'),buellerVtt);
  template = template.replace(makeRegex('bueller.mp3'),buellerMp3);
  template = template.replace(makeRegex('stclair.jpg'),stclairJpg);

  template = template.replace(/=\\"\\"/g, '').replace(/\\"/g, '"');
  //template = template.replace(/<\/?template>/g, '').replace(/<\/?demo-snippet>/g, '');
  demo.add(label, () => { return `${template}`; });
}
getStyleGuideStory('Audio',require("raw-loader!./demo/audio.html"));
getStyleGuideStory('Video',require("raw-loader!./demo/index.html"));
getStyleGuideStory('YouTube',require("raw-loader!./demo/youtube.html"));
/**
 * Live Demo
 */
const stories = storiesOf("a11y-media-player", module);
stories.addDecorator(storybookBridge.withKnobs);
stories.add("a11y-media-player", () => {
  var binding = {};
  // start of tag for demo
  let elementDemo = `<a11y-media-player`, 
  color = storybookBridge.text('accentColor', 'blue'), 
  dark = storybookBridge.boolean('dark', false), 
  sources = JSON.stringify([{"src": "https://iandevlin.github.io/mdn/video-player-with-captions/video/sintel-short.mp4"}]),
  tracks = JSON.stringify([
    {"src": enVtt, "srclang": "en", "label": "English"},
    {"src": esVtt, "srclang": "es", "label": "Español"},
    {"src": deVtt, "srclang": "de", "label": "Deutsch"}
  ]);
  elementDemo += setKnobsAndReturnAttributes(A11yMediaPlayer,['sources','tracks']);
  elementDemo += setKnobsAndReturnAttributes(A11yMediaPlayerBehaviors,['crossorigin']);
  elementDemo += ` accent-color="${color}" crossorigin="anonymous"
    sources=${sources} tracks=${tracks}>
  </a11y-media-player>`;
  return `<h1>Live demo</h1>${elementDemo}`;
});
