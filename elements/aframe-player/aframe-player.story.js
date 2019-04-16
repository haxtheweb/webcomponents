import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";
import { AframePlayer } from "./aframe-player.js";
import * as gtlf from "./demo/animatedbox.gtlf";

window.StorybookUtilities.requestAvailability();
window.StorybookUtilities.instance.addGlobalScript(
  'aframePlayer',
  require("file-loader!./lib/aframe/dist/aframe-master.js")
);

/**
 * add to the pattern library 
 */
const AframePattern = {
  "of": "Pattern Library/Molecules/Media",
  "name": "3D",
  "file": require("raw-loader!./demo/index.html"),
  "replacements": [
    "find": "./animatedbox.gtlf",
    "replace": gtlf
  ]
};
window.StorybookUtilities.instance.addPattern(AframePattern);

/**
 * add the live demo
 */
const props = AframePlayer.properties;
props.source.value = gtlf;
const AframeStory = {
  "of": "Web Components",
  "name": "aframe-player",
  "props": props,
  "slots": {}, 
  "attr": ``,
  "slotted": ``
}
window.StorybookUtilities.instance.addLiveDemo(AframeStory);