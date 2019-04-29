import { SimpleIconPicker } from "./simple-icon-picker.js";
import { SimplePicker } from "@lrnwebcomponents/simple-picker/simple-picker.js";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

window.StorybookUtilities.requestAvailability();

/**
 * add to the pattern library
 */
const SimpleIconPickerPattern = {
  of: "Pattern Library/Atoms/Forms",
  name: "Icon Picker",
  file: require("raw-loader!./demo/index.html"),
  replacements: []
};
window.StorybookUtilities.instance.addPattern(SimpleIconPickerPattern);

/**
 * add the live demo
 */
const props = Object.assign(
  SimpleIconPicker.properties,
  SimplePicker.properties
);
delete props.hideOptionLabels;
delete props.options;
delete props.titleAsHtml;
props.label.value = "Pick an Icon";
props.icons.value = [
  "check",
  "clear",
  "search",
  "arrow-back",
  "arrow-downward",
  "arrow-forward",
  "arrow-upward"
];
const SimpleIconPickerStory = {
  of: "Web Components",
  name: "simple-icon-picker",
  props: props,
  slots: {},
  attr: ``,
  slotted: ``
};
window.StorybookUtilities.instance.addLiveDemo(SimpleIconPickerStory);
