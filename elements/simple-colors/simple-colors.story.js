import { SimpleColors } from "./simple-colors.js";
import { SimpleColorsPicker } from "./lib/simple-colors-picker.js";
import { SimpleColorsSwatches } from "./lib/demo/simple-colors-swatches.js";
import { StorybookUtilities } from "@haxtheweb/storybook-utilities/storybook-utilities.js";

window.StorybookUtilities.requestAvailability();

/**
 * add to the pattern library
 */
const SimpleColorsPattern = {
  of: "Pattern Library/Atoms",
  name: "Color",
  file: require("raw-loader!./demo/colors.html"),
  replacements: [],
};
/**
 * add to the pattern library
 */
const SimpleColorsPatternPicker = {
  of: "Pattern Library/Atoms/Forms",
  name: "Color Picker",
  file: require("raw-loader!./demo/picker.html"),
  replacements: [],
};
window.StorybookUtilities.instance.addPattern(SimpleColorsPattern);
window.StorybookUtilities.instance.addPattern(SimpleColorsPatternPicker);

/**
 * add the live demo
 */
const colors = window.StorybookUtilities.instance.getSimpleColors();
colors.accentColor.value = "grey";
const SimpleColorsStory = {
  of: "Web Components/simple-colors",
  name: "simple-colors",
  props: colors,
  slots: {},
  attr: ``,
  slotted: `
    <style>
      div {
        padding: 20px;
        margin: 0 0 15px;
      }
      button {
        color: var(--simple-colors-default-theme-grey-1);
        border-radius: 3px;
        padding: 3px 5px;
        font-size: 110%;
        cursor: pointer;
      }
      #box {
        display: block;
        margin: 0 15px;
        padding: 20px;
        color: var(--simple-colors-default-theme-grey-12);
        background-color: var(--simple-colors-default-theme-accent-1);
        border: 4px solid var(--simple-colors-default-theme-accent-3);
      }
      simple-colors-picker-demo[dark] #box {
        background-color: var(--simple-colors-default-theme-grey-1);
        border: 4px solid var(--simple-colors-default-theme-accent-6);
      }
      .button {
        background-color: var(--simple-colors-default-theme-accent-7);
        border: 2px solid var(--simple-colors-default-theme-accent-8);
      }
      .button:hover {
        background-color: var(--simple-colors-default-theme-accent-8);
      }
      .confirm {
        background-color: var(--simple-colors-default-theme-blue-7);
        border: 2px solid var(--simple-colors-default-theme-blue-8);
      }
      .confirm:hover {
        background-color: var(--simple-colors-default-theme-blue-8);
      }
      .delete {
        background-color: var(--simple-colors-default-theme-red-7);
        border: 2px solid var(--simple-colors-default-theme-red-8);
      }
      .delete:hover {
        background-color: var(--simple-colors-default-theme-red-8);
      }
    </style>
    <div id="box">
    <p class="simple-colors-default-theme-accent-7-text">This is an accent-color box.</p>
    <button class="button">
      Button
    </button>
    <button class="confirm">Save</button>
    <button class="delete">Delete</button>
  </div>`,
};
const picker = SimpleColorsPicker.properties;
picker.label.value = "Pick a Color";
const SimpleColorsPickerStory = {
  of: "Web Components/simple-colors",
  name: "simple-colors-picker",
  props: picker,
  slots: {},
  attr: ``,
  slotted: ``,
};
window.StorybookUtilities.instance.addLiveDemo(SimpleColorsStory);
window.StorybookUtilities.instance.addLiveDemo(SimpleColorsPickerStory);
