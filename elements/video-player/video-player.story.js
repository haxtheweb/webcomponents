import { VideoPlayer } from "./video-player.js";
import { A11yMediaPlayer } from "@lrnwebcomponents/a11y-media-player/a11y-media-player.js";
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
let getVideoKnobs = () => {
    let allKnobs = Object.assign(
      window.StorybookUtilities.instance.getSimpleColorsPolymer(),
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
      "youtubeId",
      "youTube"
    ].forEach(prop => {
      delete allKnobs[prop];
    });
    return allKnobs;
  },
  audioKnobs = getVideoKnobs(),
  videoKnobs = getVideoKnobs(),
  ytKnobs = getVideoKnobs();
videoKnobs.sources.value = [
  {
    src:
      "https://iandevlin.github.io/mdn/video-player-with-captions/video/sintel-short.mp4",
    type: "video/mp4"
  }
];
videoKnobs.tracks.value = [
  { src: enVtt, srclang: "en", label: "English" },
  { src: esVtt, srclang: "es", label: "Español" },
  { src: deVtt, srclang: "de", label: "Deutsch" }
];
videoKnobs.source = { name: "source", value: null, type: "String" };
audioKnobs.sources.value = [
  {
    src: buellerMp3,
    type: "audio/mp3"
  }
];
audioKnobs.tracks.value = [
  { src: buellerVtt, srclang: "en", label: "English" }
];
ytKnobs.tracks.value = [{ src: buellerVtt, srclang: "en", label: "English" }];
ytKnobs.source = {
  name: "source",
  value: "https://www.youtube.com/watch?v=NP0mQeLWCCo",
  type: "String"
};

const VideoPlayerStory = {
  of: "Web Components/video-player",
  name: "Video",
  props: videoKnobs,
  slots: {},
  attr: ``,
  slotted: ``
};
const VideoPlayerAudioStory = {
  of: "Web Components/video-player",
  name: "Audio",
  props: audioKnobs,
  slots: {},
  attr: ` audio-only="audio-only"`,
  slotted: ``
};
const VideoPlayerYTStory = {
  of: "Web Components/video-player",
  name: "YouTube",
  props: ytKnobs,
  slots: {},
  attr: ``,
  slotted: ``
};
window.StorybookUtilities.instance.addLiveDemo(VideoPlayerStory);
window.StorybookUtilities.instance.addLiveDemo(VideoPlayerAudioStory);
window.StorybookUtilities.instance.addLiveDemo(VideoPlayerYTStory);
