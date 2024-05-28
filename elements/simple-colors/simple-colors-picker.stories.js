import { html } from "lit-html";
import { withKnobs } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@haxtheweb/storybook-utilities/storybook-utilities.js";
import { SimpleColorsPicker } from "@haxtheweb/simple-colors/lib/simple-colors-picker.js";

export default {
  title: "Forms|Picker",
  component: "simple-colors-picker",
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};

const utils = new StorybookUtilities();
export const SimpleColorsPickerStory = () => {
  let rawProps = SimpleColorsPicker.properties;
  delete rawProps.accentColor;
  delete rawProps.dark;
  let knobs = utils.getKnobs(utils.getElementProperties(rawProps), {
    label: 'Select a color from "simple-colors"',
  });
  return utils.makeElement(SimpleColorsPicker, knobs);
};
