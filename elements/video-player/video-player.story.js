
import { VideoPlayer } from "./video-player.js";
import { A11yMediaPlayer } from "@lrnwebcomponents/a11y-media-player/a11y-media-player.js";
import { A11yMediaBehaviors } from "@lrnwebcomponents/a11y-media-player/lib/a11y-media-behaviors.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
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
 * add the live demo, only since the pattern itself is in a11y-media-player
 */
//combine all of the inherited properties into one object
let allKnobs = Object.assign(
  { 
    "accentColor": {"name": "accentColor", "type":"Select", "value": "blue", "options": Object.keys(SimpleColors.colors)}, 
    "dark": {"name": "dark", "type":"Boolean", "value": false}
  },
  A11yMediaPlayer.properties, A11yMediaBehaviors.properties
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
allKnobs.sources.value = [{
  "src": "https://iandevlin.github.io/mdn/video-player-with-captions/video/sintel-short.mp4", 
  "type": "video/mp4"
}];
allKnobs.tracks.value = [
  {"src": enVtt,  "srclang": "en", "label": "English"},
  {"src": esVtt,  "srclang": "es", "label": "Español"},
  {"src": deVtt,  "srclang": "de", "label": "Deutsch"}
];
allKnobs.source = {"name": "source","value": null, "type": "String" } ;
//create the story data
const VideoPlayerStory = {
  "of": "video-player",
  "name": "video-player",
  "props": allKnobs, 
  "slots": {}, 
  "attr": ``,
  "slotted": ``
};
let ytKnobs = Object.assign(allKnobs);
ytKnobs.sources.value = [];
ytKnobs.tracks.value = [
  {"src": buellerVtt,  "srclang": "en", "label": "English"}
] ;
ytKnobs.source.value = "https://www.youtube.com/watch?v=NP0mQeLWCCo";
//create the story data
const VideoPlayerYTStory = {
  "of": "video-player",
  "name": "video-player (YouTube)",
  "props": allKnobs, 
  "slots": {}, 
  "attr": ``,
  "slotted": ``
};
window.StorybookUtilities.instance.addLiveDemo(VideoPlayerStory);
window.StorybookUtilities.instance.addLiveDemo(VideoPlayerYTStory);