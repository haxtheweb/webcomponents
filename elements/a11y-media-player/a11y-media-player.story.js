import { A11yMediaPlayer } from "./a11y-media-player.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import { A11yMediaBehaviors } from "./lib/a11y-media-behaviors.js";
import { A11yMediaPlayerBehaviors } from "./lib/a11y-media-player-behaviors.js";
import * as enVtt from "./demo/samples/sintel-en.vtt";
import * as deVtt from "./demo/samples/sintel-de.vtt";
import * as esVtt from "./demo/samples/sintel-es.vtt";
import * as buellerVtt from "./demo/samples/bueller.vtt";
import * as buellerMp3 from "./demo/samples/bueller.mp3";
import * as stclairVtt from "./demo/samples/stclair.vtt";
import stclairJpg from "./demo/samples/stclair.jpg";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

window.StorybookUtilities.requestAvailability();

/**
 * add to the pattern library
 */
const A11yMediaPlayerVideoPattern = {
  "of": "Pattern Library/Molecules/Media", 
  "name": 'Video',
  "file": require("raw-loader!./demo/index.html"),
  "replacements": [
    {"find": "\.\/samples\/sintel-en.vtt", "replace": enVtt },
    {"find": "\.\/samples\/sintel-es.vtt", "replace": esVtt },
    {"find": "\.\/samples\/sintel-de.vtt", "replace": deVtt },
    {"find": "\.\/samples\/stclair.vtt", "replace": stclairVtt },
    {"find": "\.\/samples\/stclair.jpg", "replace": stclairJpg }
  ]
}

const A11yMediaPlayerAudioPattern = {
  "of": "Pattern Library/Molecules/Media", 
  "name": 'Audio',
  "file": require("raw-loader!./demo/audio.html"),
  "replacements": [
    {"find": "bueller.vtt", "replace": buellerMp3 }
  ]
}

const A11yMediaPlayerYouTubePattern = {
  "of": "Pattern Library/Molecules/Media", 
  "name": 'YouTube',
  "file": require("raw-loader!./demo/youtube.html"),
  "replacements": [
    {"find": "bueller.vtt", "replace": buellerVtt }
  ]
}
window.StorybookUtilities.instance.addPattern(A11yMediaPlayerAudioPattern);
window.StorybookUtilities.instance.addPattern(A11yMediaPlayerVideoPattern);
window.StorybookUtilities.instance.addPattern(A11yMediaPlayerYouTubePattern);

/**
 * add the live demo
 */
//combine all of the inherited properties into one object
let allKnobs = Object.assign(
  { 
    "accentColor": {"name": "accentColor", "type":"Select", "value": "blue", "options": Object.keys(SimpleColors.colors)}, 
    "dark": {"name": "dark", "type":"Boolean", "value": false}
  },
  A11yMediaPlayer.properties, A11yMediaBehaviors.properties,
  A11yMediaPlayerBehaviors.properties
);
allKnobs.crossorigin.value = "anonymous";
//remove properties we don't want to expose
[
  'flexLayout',
  'manifest',
  'media',
  'muteUnmute',
  'playing',
  'playPause',
  'responsiveSize',
  'seekDisabled',
  'selectedTrack',
  'selectedTrackID',
  'status',
  'target',
  'search',
  'youtubeId',
  'youTube'
].forEach(prop => {
  delete allKnobs[prop];
});

//create the story data
const A11yMediaPlayerStory = {
  "of": "a11y-media-player",
  "name": "a11y-media-player",
  "props": allKnobs, 
  "slots": {
    "slot": {
      "name": "slot",
      "type": "String",
      "value": `
        <source src="https://iandevlin.github.io/mdn/video-player-with-captions/video/sintel-short.mp4" type="video/mp4">
        <track src="${enVtt}" srclang="en" label="English">
        <track src="${esVtt}" srclang="es" label="Español">
        <track src="${deVtt}" srclang="de" label="Deutsch">
      `
    }
  }, 
  "attr": ``,
  "slotted": ``
};
window.StorybookUtilities.instance.addLiveDemo(A11yMediaPlayerStory);