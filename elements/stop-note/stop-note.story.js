import { StopNote } from "./stop-note.js";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

window.StorybookUtilities.requestAvailability();

/**
 * add to the pattern library
 */
const Pattern = {
  of: "Pattern Library/Molecules/Layout", //Pattern library path
  name: "Card", //Pattern name
  file: require("raw-loader!./demo/index.html"),
  replacements: [],
};
window.StorybookUtilities.instance.addPattern(Pattern);

/**
 * add the live demo
 */
const Story = {
  of: "Card", //component folder
  name: "stop-note", //component tag
  props: StopNote.properties, //component properties that will become knobs
  slots: {
    //slots that will become knobs
    message: {
      name: "message", //slot name
      type: "String", //slot type
      value: `Pay attention to what is coming up!`, //slot content
    },
  },
  attr: ``, //attributes that won't become knobs
  slotted: ``, //slots that won't become knobs
};
window.StorybookUtilities.instance.addLiveDemo(Story);
