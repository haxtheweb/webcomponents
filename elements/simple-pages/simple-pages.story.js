import { SimplePages } from "./simple-pages.js";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

window.StorybookUtilities.requestAvailability();
/**
 * add to the pattern library
 */
const SimplePagesPattern = {
  of: "Pages",
  name: "Simple Pages",
  file: require("raw-loader!./demo/index.html"),
};
window.StorybookUtilities.instance.addPattern(SimplePagesPattern);

/**
 * add the live demo
 * /
const props = SimplePages.properties;
props.src.value = image;

const SimplePagesStory = {
  of: "Web Components",
  name: "simple-pages",
  props: props,
  slots: {},
  attr: ``,
  slotted: ``
};
window.StorybookUtilities.instance.addLiveDemo(SimplePagesStory);*/
