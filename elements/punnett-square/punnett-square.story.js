import { PunnettSquare } from "./punnett-square.js";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

window.StorybookUtilities.requestAvailability();
/**
 * add to the pattern library
 */
const PunnettSquarePattern = {
  of: "Molecules",
  name: "PunnettSquare",
  file: require("raw-loader!./demo/index.html"),
};
window.StorybookUtilities.instance.addPattern(SimplePagesPattern);

/**
 * add the live demo
 * /
const props = PunnettSquare.properties;

const PunnettSquareStory = {
  of: "Web Components",
  name: "punnett-square",
  props: props,
  slots: {},
  attr: ``,
  slotted: ``
};
window.StorybookUtilities.instance.addLiveDemo(PunnettSquareStory);*/
