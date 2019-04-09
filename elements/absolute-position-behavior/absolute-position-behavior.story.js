import { AbsolutePositionBehavior } from "./absolute-position-behavior.js";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

window.StorybookUtilities.requestAvailability();

/**
 * add the live demo
 */
let props = AbsolutePositionBehavior.properties;
const AbsolutePositionBehaviorStory = {
  "of": "Web Components",
  "name": "absolute-position-behavior",
  "props":  props,
  "slots": {
    "slot": { 
      "name": "slot", 
      "type": "String", 
      "value": `I'm absolutely positioned!`
    }
  }, 
  "attr": ``,
  "slotted": ``
};
window.StorybookUtilities.instance.addLiveDemo(AbsolutePositionBehaviorStory);