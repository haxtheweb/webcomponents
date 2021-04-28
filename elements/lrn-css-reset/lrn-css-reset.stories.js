import { html } from "lit-element/lit-element.js";
import {
  withKnobs,
  withWebComponentsKnobs,
  text,
  boolean,
} from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";
import { LrnCssReset } from "./lrn-css-reset.js";
// need to account for polymer goofiness when webpack rolls this up

export default {
  title: "Css|LrnCssReset",
  component: "lrn-css-reset",
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const LrnCssResetStory = () => {
  return utils.makeElementFromClass(LrnCssReset);
};
