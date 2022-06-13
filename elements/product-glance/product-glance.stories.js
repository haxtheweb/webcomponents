import { html } from "lit-html";
import { withKnobs, text, boolean } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";
import { ProductGlance } from "./product-glance.js";
// need to account for polymer goofiness when webpack rolls this up

export default {
  title: "Widgets|ProductGlance",
  component: "product-glance",
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const ProductGlanceStory = () => {
  return utils.makeElementFromClass(ProductGlance);
};
