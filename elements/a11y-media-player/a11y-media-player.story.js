import { A11yMediaPlayer } from "./a11y-media-player.js";
import * as enVtt from "./demo/samples/sintel-en.vtt";
import * as deVtt from "./demo/samples/sintel-de.vtt";
import * as esVtt from "./demo/samples/sintel-es.vtt";
import * as buellerVtt from "./demo/samples/bueller.vtt";
import * as buellerMp3 from "./demo/samples/bueller.mp3";
import * as stclairVtt from "./demo/samples/stclair.vtt";
import stclairJpg from "./demo/samples/stclair.jpg";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

window.StorybookUtilities.requestAvailability();
import * as screenfullLib from "./lib/screenfull/dist/screenfull.js";
/**
 * add to the pattern library
 */
const A11yMediaPlayerVideoPattern = {
  of: "Pattern Library/Molecules/Media",
  name: "Video",
  file: require("raw-loader!./demo/index.html"),
  replacements: [
    { find: "./samples/sintel-en.vtt", replace: enVtt },
    { find: "./samples/sintel-es.vtt", replace: esVtt },
    { find: "./samples/sintel-de.vtt", replace: deVtt },
    { find: "./samples/stclair.vtt", replace: stclairVtt },
    { find: "./samples/stclair.jpg", replace: stclairJpg }
  ]
};

const A11yMediaPlayerAudioPattern = {
  of: "Pattern Library/Molecules/Media",
  name: "Audio",
  file: require("raw-loader!./demo/audio.html"),
  replacements: [{ find: "bueller.vtt", replace: buellerMp3 }]
};

const A11yMediaPlayerYouTubePattern = {
  of: "Pattern Library/Molecules/Media",
  name: "YouTube",
  file: require("raw-loader!./demo/youtube.html"),
  replacements: [{ find: "bueller.vtt", replace: buellerVtt }]
};
window.StorybookUtilities.instance.addPattern(A11yMediaPlayerAudioPattern);
window.StorybookUtilities.instance.addPattern(A11yMediaPlayerVideoPattern);
window.StorybookUtilities.instance.addPattern(A11yMediaPlayerYouTubePattern);

/**
 * add the live demo
 */
//combine all of the inherited properties into one object
let getVideoKnobs = () => {
    let allKnobs = Object.assign(
      window.StorybookUtilities.instance.getSimpleColors(),
      A11yMediaPlayer.properties,
      A11yMediaBehaviors.properties
    );
    allKnobs.crossorigin = {
      value: "anonymous",
      type: "Select",
      options: ["anonymous", "use-credentials", ""]
    };
    //remove properties we don't want to expose
    [
      "audioOnly",
      "flexLayout",
      "manifest",
      "media",
      "muteUnmute",
      "playing",
      "playPause",
      "responsiveSize",
      "seekDisabled",
      "selectedTrack",
      "selectedTrackID",
      "status",
      "target",
      "search",
      "youTube"
    ].forEach(prop => {
      delete allKnobs[prop];
    });
    return allKnobs;
  },
  audioKnobs = getVideoKnobs(),
  videoKnobs = getVideoKnobs(),
  ytKnobs = getVideoKnobs();
ytKnobs.tracks.value = [{ src: buellerVtt, srclang: "en", label: "English" }];
delete ytKnobs.source;
delete ytKnobs.sources;
ytKnobs.youtubeId.value = "NP0mQeLWCCo";

const A11yMediaPlayerStory = {
  of: "Web Components/a11y-media-player",
  name: "Video",
  props: videoKnobs,
  slots: {
    slot: {
      name: "slot",
      type: "String",
      value: `
        <source src="https://iandevlin.github.io/mdn/video-player-with-captions/video/sintel-short.mp4" type="video/mp4">
        <track src="${enVtt}" srclang="en" label="English">
        <track src="${esVtt}" srclang="es" label="Español">
        <track src="${deVtt}" srclang="de" label="Deutsch">
      `
    }
  },
  attr: ``,
  slotted: ``
};
const A11yMediaPlayerAudioStory = {
  of: "Web Components/a11y-media-player",
  name: "Audio",
  props: audioKnobs,
  slots: {
    slot: {
      name: "slot",
      type: "String",
      value: `
        <source src="${buellerMp3}" type="audio/mp3">
        <track src="${stclairVtt}" srclang="en" label="English">
      `
    }
  },
  attr: ` audio-only`,
  slotted: ``
};
const A11yMediaPlayerYTStory = {
  of: "Web Components/a11y-media-player",
  name: "YouTube",
  props: ytKnobs,
  slots: {},
  attr: ``,
  slotted: ``
};
window.StorybookUtilities.instance.addLiveDemo(A11yMediaPlayerStory);
window.StorybookUtilities.instance.addLiveDemo(A11yMediaPlayerAudioStory);
window.StorybookUtilities.instance.addLiveDemo(A11yMediaPlayerYTStory);
