import { html } from "lit-html";
import { withKnobs, text, boolean } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";
import { SimpleImg } from "./simple-img.js";
// need to account for polymer goofiness when webpack rolls this up

export default {
  title: "Img|SimpleImg",
  component: "simple-img",
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const SimpleImgStory = () => {
  return utils.makeElementFromClass(SimpleImg);
};
