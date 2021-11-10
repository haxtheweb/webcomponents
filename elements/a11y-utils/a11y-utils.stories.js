import { html } from "lit-element/lit-element.js";
import {
  withKnobs,
  withWebComponentsKnobs,
  text,
  boolean,
} from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";
import { A11yUtils } from "./a11y-utils.js";
// need to account for polymer goofiness when webpack rolls this up

export default {
  title: "11|A11yUtils",
  component: "a11y-utils",
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const A11yUtilsStory = () => {
  return utils.makeElementFromClass(A11yUtils);
};
