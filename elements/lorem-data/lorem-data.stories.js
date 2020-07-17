import { html } from "lit-element/lit-element.js";
import { LoremData } from "@lrnwebcomponents/lorem-data/lorem-data.js";
import {
  withKnobs,
  withWebComponentsKnobs,
  text,
  boolean
} from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

export default {
  title: "Social|Discussion",
  component: "lorem-data",
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" }
  }
};
const utils = new StorybookUtilities();
export const LoremDataStory = () => {
  return utils.makeElementFromClass(LoremData, {
    source: new URL(`./demo/discussion.json`, import.meta.url),
    commentIcon: "send",
    demo: true
  });
};
