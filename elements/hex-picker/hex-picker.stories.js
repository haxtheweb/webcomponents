import { html } from "lit-element/lit-element.js";
import {
  withKnobs,
  withWebComponentsKnobs,
  text,
  boolean,
} from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";
import { HexPicker } from "./hex-picker.js";
// need to account for polymer goofiness when webpack rolls this up

export default {
  title: "Picker|HexPicker",
  component: "hex-picker",
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const HexPickerStory = () => {
  return utils.makeElementFromClass(HexPicker);
};
