import { IconsetDemo } from "./iconset-demo.js";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

window.StorybookUtilities.requestAvailability();

/**
 * add to the pattern library
 */
const DemoPattern = {
  of: "Pattern Library/Atoms",
  name: "Icons",
  file: require("raw-loader!./demo/index.html"),
  replacements: [],
};
window.StorybookUtilities.instance.addPattern(DemoPattern);

/**
 * add the live demo
 */
const Story = {
  of: "Web Components",
  name: "iconset-demo",
  props: IconsetDemo.properties,
  slots: {},
  attr: ``,
  slotted: ``,
};
window.StorybookUtilities.instance.addLiveDemo(Story);
