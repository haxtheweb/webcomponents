import { ResponsiveUtility } from "./responsive-utility.js";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

window.StorybookUtilities.requestAvailability();

/**
 * add the live demo
 */
const ResponsiveUtilityStory = {
  "of": "Web Components",
  "name": "responsive-utility",
  "props": ResponsiveUtility.properties,
  "slots": {}, 
  "attr": ``,
  "slotted": ``
}
window.StorybookUtilities.instance.addLiveDemo(ResponsiveUtilityStory);