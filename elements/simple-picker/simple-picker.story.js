import { SimplePicker } from "./simple-picker.js";
import { StorybookUtilities } from "@haxtheweb/storybook-utilities/storybook-utilities.js";

window.StorybookUtilities.requestAvailability();

/**
 * add to the pattern library
 */
const SimplePickerPattern = {
  of: "Pattern Library/Atoms/Forms",
  name: "Picker",
  file: require("raw-loader!./demo/index.html"),
  replacements: [],
};
window.StorybookUtilities.instance.addPattern(SimplePickerPattern);

/**
 * add the live demo
 */
const props = SimplePicker.properties;
props.label.value = "Pick a Font-Family";
props.options.type = "Object";
props.options.value = [
  [
    {
      alt: "sans-serif",
      style: "font-family: sans-serif",
      value: "sans-serif",
    },
  ],
  [
    {
      alt: "serif",
      style: "font-family: serif",
      value: "serif",
    },
  ],
  [
    {
      alt: "monospace",
      selected: true,
      style: "font-family: monospace",
      value: "monospace",
    },
  ],
  [
    {
      alt: "cursive",
      style: "font-family: cursive",
      value: "cursive",
    },
  ],
];
const SimplePickerStory = {
  of: "Web Components",
  name: "simple-picker",
  props: props,
  slots: {},
  attr: ``,
  slotted: ``,
};
window.StorybookUtilities.instance.addLiveDemo(SimplePickerStory);
