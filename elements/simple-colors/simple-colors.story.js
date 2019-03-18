/*import { SimpleColors } from "./simple-colors.js";
import { SimpleColorsPicker } from "./lib/simple-colors-picker.js";
import { SimpleColorsDocsTable } from "./lib/demo/simple-colors-docs-table.js";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";
import { storiesOf } from "@storybook/polymer";
import * as storybookBridge from "@storybook/addon-knobs/polymer";

window.StorybookUtilities.requestAvailability();

/**
 * add to the pattern library
 * /
const SimpleColorsPattern = {
  "of": "Pattern Library/Atoms/Colors", 
  "name": 'Simple Colors',
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
*/
/**
 * add the live demo
 */

/*const colors = Object.keys(SimpleColors.colors);
const SimpleColorsStory = storiesOf('simple-colors', module);
SimpleColorsStory.addDecorator(storybookBridge.withKnobs);
SimpleColorsStory.add(
  'simple-colors', () => {
    return `
      <simple-colors-demo
      accent-color="${storybookBridge.select( 'accentColor', colors, "grey" )}" 
      dark="${storybookBridge.boolean('dark', false)}">
        <div id="box">
          <style>
            button {
              color: var(--simple-colors-default-theme-grey-1);
              border-radius: 3px;
              padding: 3px 5px;
              font-size: 110%;
              cursor: pointer;
            }
            #box {
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
              background-color: var(--simple-colors-default-theme-light-blue-7);
              border: 2px solid var(--simple-colors-default-theme-light-blue-8);
            }
            .confirm:hover {
              background-color: var(--simple-colors-default-theme-light-blue-8);
            }
            .delete {
              background-color: var(--simple-colors-default-theme-red-7);
              border: 2px solid var(--simple-colors-default-theme-red-8);
            }
            .delete:hover {
              background-color: var(--simple-colors-default-theme-red-8);
            }
          </style>
          <p>This is a box that uses the accent color CSS variables.</p>
          <p>This is a <button class="button">Accent</button> that uses the accent color CSS variables.</p>
          <p>This is a <button class="confirm">Save</button> that uses the blue CSS variables.</p>
          <p>This is a <button class="delete">Delete</button> that uses the red CSS variables.</p>
        </div>
      </simple-colors-demo>
    `;
  }, { knobs: { escapeHTML: escape } }
);
*/
/*const colors = Object.keys(SimpleColors.colors);
colors.unshift("");
const simpleProps = SimpleColors.properties;
simpleProps.accentColor.type = "Select";
simpleProps.accentColor.options = colors;
delete simpleProps.colors;
const SimpleColorsStory = {
  "of": "simple-colors",
  "name": "simple-colors",
  "props": simpleProps, 
  "slots": {
    "slot": {
      "name": "slot", 
      "type": "String", 
      "value": `
        <div id="box">
          <style>
            button {
              color: var(--simple-colors-default-theme-grey-1);
              border-radius: 3px;
              padding: 3px 5px;
              font-size: 110%;
              cursor: pointer;
            }
            #box {
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
              background-color: var(--simple-colors-default-theme-light-blue-7);
              border: 2px solid var(--simple-colors-default-theme-light-blue-8);
            }
            .confirm:hover {
              background-color: var(--simple-colors-default-theme-light-blue-8);
            }
            .delete {
              background-color: var(--simple-colors-default-theme-red-7);
              border: 2px solid var(--simple-colors-default-theme-red-8);
            }
            .delete:hover {
              background-color: var(--simple-colors-default-theme-red-8);
            }
          </style>
          <p>This is a box that uses the accent color CSS variables.</p>
          <p>This is a <button class="button">Accent</button> that uses the accent color CSS variables.</p>
          <p>This is a <button class="confirm">Save</button> that uses the blue CSS variables.</p>
          <p>This is a <button class="delete">Delete</button> that uses the red CSS variables.</p>
        </div>
      `
    }
  }, 
  "attr": ``,
  "slotted": ``
};
const PickerProps = Object.assign(simpleProps,SimpleColorsPicker.properties);
const SimpleColorsPickerStory = {
  "of": "simple-colors",
  "name": "simple-colors-picker",
  "props": PickerProps, 
  "slots": {}, 
  "attr": ``,
  "slotted": ``
};
window.StorybookUtilities.instance.addLiveDemo(SimpleColorsStory);
window.StorybookUtilities.instance.addLiveDemo(SimpleColorsPickerStory);*/