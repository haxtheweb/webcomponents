import { LrnStorybookUtilities } from "./lib/lrn-storybook-utilities.js";
import { A11yGifPlayer } from "./a11y-gif-player.js";

let utils = window.LrnStorybookUtilities;

/**
 * Pattern Library Static Versions
 */
let pattern = utils.addPattern(
  'Pattern Library/Molecules/Media',
  'GIF',
  require("raw-loader!./demo/index.html")
);

/**
 * Live Demo Versions with Knobs
 */
let props = {
  "properties": {
    "alt": {"name": "alt", "type": "String", "value": "IT Crowd: Moss eating popcorn." },
    "src": {"name": "src", "type": "String", "value": "https://media.giphy.com/media/TrDxCdtmdluP6/giphy.gif" },
    "srcWithoutAnimation": {"name": "srcWithoutAnimation", "type": "String", "value": "https://media.giphy.com/media/TrDxCdtmdluP6/480w_s.jpg" }
  }
}, live = utils.addLivedemo("a11y-gif-player","a11y-gif-player",props,'style="width: 300px"');
console.log(live,pattern);