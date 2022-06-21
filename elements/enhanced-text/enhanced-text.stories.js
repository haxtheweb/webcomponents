import { html } from "lit-html";
import { withKnobs, text, boolean } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";
import { EnhancedText } from "./enhanced-text.js";
// need to account for polymer goofiness when webpack rolls this up

export default {
  title: "Text|EnhancedText",
  component: "enhanced-text",
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const EnhancedTextStory = () => {
  return utils.makeElementFromClass(EnhancedText);
};
