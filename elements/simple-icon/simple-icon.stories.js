import { html } from "lit-element/lit-element.js";
import { SimpleIcon } from "@lrnwebcomponents/simple-icon/simple-icon.js";
import {
  withKnobs,
  withWebComponentsKnobs,
  text,
  boolean,
} from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

<simple-icon icon="device:battery-20" accent-color="pink"></simple-icon>;
export default {
  title: "Icons|Simple",
  component: "simple-icon",
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const SimpleIconStory = () => {
  return utils.makeElementFromClass(SimpleIcon, {
    demo: true,
  });
};
