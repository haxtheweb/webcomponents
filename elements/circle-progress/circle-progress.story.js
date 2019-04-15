import { CircleProgress } from "./circle-progress.js";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

window.StorybookUtilities.requestAvailability();
/**
 * add to the pattern library
 */
const CircleProgressPattern = {
  "of": "Pattern Library/Atoms/Media", 
  "name": 'Progress Circle',
  "file": require("raw-loader!./demo/index.html"),
  "replacements": []
}
window.StorybookUtilities.instance.addPattern(CircleProgressPattern);

/**
 * add the live demo
 */
const CircleProgressProps = CircleProgress.properties;
CircleProgressProps.value.value = 30;
const CircleProgressStory = {
  "of": "Web Components",
  "name": "circle-progress",
  "props": CircleProgressProps,
  "slots": {
    "slot": { 
      "name": "slot", 
      "type": "String", 
      "value": ``
    }
  }, 
  "attr": ``,
  "slotted": ``
};
window.StorybookUtilities.instance.addLiveDemo(CircleProgressStory);