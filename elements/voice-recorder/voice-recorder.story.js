import { VoiceRecorder } from "./voice-recorder.js";
import * as record from "./lib/vmsg-fork.js";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

window.StorybookUtilities.requestAvailability();
/**
 * add to the pattern library
 */
const Pattern = {
  of: "Pattern Library/Molecules/Forms",
  name: "VoiceRecorder",
  file: require("raw-loader!./demo/index.html"),
};
window.StorybookUtilities.instance.addPattern(Pattern);

/**
 * add the live demo
 * /
const props = VoiceRecorder.properties;
props.src.value = image;

const Story = {
  of: "Web Components",
  name: "voice-recorder",
  props: props,
  slots: {},
  attr: ``,
  slotted: ``
};
window.StorybookUtilities.instance.addLiveDemo(Story);*/
