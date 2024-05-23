import { html } from "lit-html";
import { withKnobs, text, boolean } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@haxtheweb/storybook-utilities/storybook-utilities.js";
import { SimpleImg } from "./simple-img.js";
// need to account for polymer goofiness when webpack rolls this up

export default {
  title: "Microservices|Images",
  component: "simple-img",
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const BasicExample = () => {
  return utils.makeElementFromHaxDemo(SimpleImg);
};
