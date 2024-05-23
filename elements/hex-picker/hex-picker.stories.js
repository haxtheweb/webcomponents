import { html } from "lit-html";
import { withKnobs, text, boolean } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@haxtheweb/storybook-utilities/storybook-utilities.js";
import { HexPicker } from "./hex-picker.js";
// need to account for polymer goofiness when webpack rolls this up

export default {
  title: "Forms|HexPicker",
  component: "hex-picker",
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const HexPickerStory = () => {
  return utils.makeElementFromClass(HexPicker);
};
