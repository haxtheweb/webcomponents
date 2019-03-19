import { SimpleColors } from "./simple-colors.js";
import { SimpleColorsPicker } from "./lib/simple-colors-picker.js";
import { SimpleColorsSwatches } from "./lib/demo/simple-colors-swatches.js";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";
import { storiesOf } from "@storybook/polymer";
import * as storybookBridge from "@storybook/addon-knobs/polymer";

window.StorybookUtilities.requestAvailability();

/**
 * add to the pattern library
 */
const SimpleColorsPattern = {
  "of": "Pattern Library/Atoms", 
  "name": 'Colors',
  "file": require("raw-loader!./demo/colors.html"),
  "replacements": []
};
const SimpleColorsPickerPattern = {
  "of": "Pattern Library/Atoms/Forms", 
  "name": 'Color Picker',
  "file": require("raw-loader!./demo/picker.html"),
  "replacements": []
};
window.StorybookUtilities.instance.addPattern(SimpleColorsPickerPattern);
window.StorybookUtilities.instance.addPattern(SimpleColorsPattern);

/**
 * add the live demo
 */
const SimpleColorsStory = {
  "of": "simple-colors",
  "name": "simple-colors",
  "props": window.StorybookUtilities.instance.getSimpleColors("grey"),
  "slots": {
    "slot": { 
      "name": "slot", 
      "type": "String", 
      "value": `
        <style is="custom-style" include="simple-colors">
          #box {
            background-color: var(--simple-colors-default-theme-grey-1);
            border: 1px solid var(--simple-colors-default-theme-grey-2);
            display: block;
            margin: 0 15px;
            padding: 0 20px 20px;
            color: var(--simple-colors-default-theme-grey-12);
            background-color: var(--simple-colors-default-theme-accent-1);
            border: 4px solid var(--simple-colors-default-theme-accent-3);
          }
          simple-colors-picker-demo[dark] #box {
            background-color: var(--simple-colors-default-theme-grey-1);
            border: 4px solid var(--simple-colors-default-theme-accent-6);
          }
          button {
            color: var(--simple-colors-default-theme-grey-1);
            border-radius: 3px;
            padding: 3px 5px;
            font-size: 110%;
            cursor: pointer;
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
      </div>
      `
    }
  }, 
  "attr": ``,
  "slotted": ``
};
const pickerProps = SimpleColorsPicker.properties;
pickerProps.label.value = `Pick a color: `;
console.log(pickerProps.label);
const SimpleColorsPickerStory = {
  "of": "simple-colors",
  "name": "simple-colors-picker",
  "props": pickerProps
};
console.log(SimpleColorsPicker.properties);
window.StorybookUtilities.instance.addLiveDemo(SimpleColorsStory);
window.StorybookUtilities.instance.addLiveDemo(SimpleColorsPickerStory);