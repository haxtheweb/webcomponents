import { storiesOf } from "@storybook/polymer";
import * as storybookBridge from "@storybook/addon-knobs/polymer";
import { A11yMediaPlayer } from "./a11y-media-player.js";
import { A11yMediaBehaviors } from "./lib/a11y-media-behaviors.js";
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
    if (!el.properties.hasOwnProperty(key)) continue;    
    let editable = key.startsWith('__') === false 
      && exclusions.includes(key) === false 
      && (el.properties[key].computed === undefined || el.properties[key].computed === 'undefined') 
      && el.properties[key].readOnly !== true;
    if (editable) {
      let val = el.properties[key].value,
        keyType = el.properties[key].type.name || el.properties[key].type;
      // convert typed props
      if (keyType) {
        let method = keyType.toLowerCase();
        switch (method) {
          case "boolean":
            method = "boolean";
            val = val === true;
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
            val = val || '';
            break;
        } 
        //storybook can't assign null or undefined to a text field
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
  }
  return attr;
}

/**
 * Creates a pattern library version based on demos
 * @param {string} the label for the element
 * @param {string} the html from a demo page
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
/**
 * Pattern Library Version
 */
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
    allKnobs = {"properties": Object.assign(
    { 
      "accentColor": {"name": "accentColor", "type":"String", "value": "blue"}, 
      "dark": {"name": "dark", "type":"Boolean", "value": false}
    },
    A11yMediaPlayer.properties, A11yMediaBehaviors.properties,
    A11yMediaPlayerBehaviors.properties
  )};
  allKnobs.properties.sources.value = [{"src": "https://iandevlin.github.io/mdn/video-player-with-captions/video/sintel-short.mp4"}];
  allKnobs.properties.tracks.value = [
    {"src": enVtt, "srclang": "en", "label": "English"},
    {"src": esVtt, "srclang": "es", "label": "Español"},
    {"src": deVtt, "srclang": "de", "label": "Deutsch"}
  ];
  allKnobs.properties.crossorigin.value = "anonymous";
  elementDemo += setKnobsAndReturnAttributes(allKnobs,['playing','target','search','media','selectedTrack','manifest']);
  elementDemo += `></a11y-media-player>`;
  return `<h1>Live demo</h1>${elementDemo}`;
});
