import { A11yGifPlayer } from "./a11y-gif-player.js";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

window.StorybookUtilities.requestAvailability();

/**
 * add to the pattern library
 */
const A11yGifPlayerPattern = {
  "of": "Pattern Library/Molecules/Media", 
  "name": 'GIF',
  "file": require("raw-loader!./demo/index.html"),
  "replacements": []
}
window.StorybookUtilities.instance.addPattern(A11yGifPlayerPattern);

/**
 * add the live demo
 */
const A11yGifPlayerStory = {
  "of": "a11y-gif-player",
  "name": "a11y-gif-player",
  "props": {
    "alt": {"name": "alt", "type": "String", "value": "IT Crowd: Moss eating popcorn." },
    "src": {"name": "src", "type": "File", "value": "https://media.giphy.com/media/TrDxCdtmdluP6/giphy.gif" },
    "srcWithoutAnimation": {"name": "srcWithoutAnimation", "type": "File", "value": "https://media.giphy.com/media/TrDxCdtmdluP6/480w_s.jpg" }
  }, 
  "slots": {}, 
  "attr": ` style="width: 300px"`,
  "slotted": ``
};
window.StorybookUtilities.instance.addLiveDemo(A11yGifPlayerStory);