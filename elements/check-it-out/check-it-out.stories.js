import { html } from "lit";
import {
  withKnobs,
  withWebComponentsKnobs,
  text,
  boolean,
} from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";
import { CheckItOut } from "./check-it-out.js";
// need to account for polymer goofiness when webpack rolls this up

export default {
  title: "Widgets|CheckItOut",
  component: "check-it-out",
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const CheckItOutStory = () => {
  return utils.makeElementFromClass(CheckItOut);
};
