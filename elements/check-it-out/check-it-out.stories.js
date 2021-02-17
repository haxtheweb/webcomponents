import { html } from "lit-element/lit-element.js";
import {
  withKnobs,
  withWebComponentsKnobs,
  text,
  boolean,
} from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";
import { CheckItOut } from "./check-it-out.js";
import { CheckItOutModal } from "./lib/check-it-out-modal.js";
// need to account for polymer goofiness when webpack rolls this up

export default {
  title: "It|CheckItOut",
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

export const CheckItOutModalStory = () => {
  return utils.makeElementFromClass(CheckItOutModal);
};
