import { html } from "lit-html";
import { withKnobs, text, boolean } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";
import { SakaiButton } from "./sakai-button.js";
// need to account for polymer goofiness when webpack rolls this up

export default {
  title: "Button|SakaiButton",
  component: "sakai-button",
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const SakaiButtonStory = () => {
  return utils.makeElementFromClass(SakaiButton);
};
