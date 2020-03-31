import { LrndesignTimeline } from "./lrndesign-timeline.js";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

window.StorybookUtilities.requestAvailability();
/**
 * add to the pattern library
 */
const LrndesignTimelinePattern = {
  of: "Pattern Library/Molecules/Media",
  name: "Timeline",
  file: require("raw-loader!./demo/index.html")
};
window.StorybookUtilities.instance.addPattern(LrndesignTimelinePattern);
/*
const LrndesignTimelineStory = {
  of: "Web Components",
  name: "lrndesign-timeline",
  props: LrndesignTimeline.properties,
  slots: {},
  attr: ``,
  slotted: ``
};
window.StorybookUtilities.instance.addLiveDemo(LrndesignTimelineStory);*/
