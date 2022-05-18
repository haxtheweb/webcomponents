import { html } from "lit";
import {
  withKnobs,
  withWebComponentsKnobs,
  text,
  boolean,
} from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";
import { UnityWebgl } from "./unity-webgl.js";
// need to account for polymer goofiness when webpack rolls this up

export default {
  title: "Widgets|UnityWebgl",
  component: "unity-webgl",
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const UnityWebglStory = () => {
  console.log(utils.makeElementFromClass(UnityWebgl));
  return utils.makeElementFromClass(UnityWebgl);
};
