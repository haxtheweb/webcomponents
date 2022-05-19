import { html } from 'lit-html';
import {
  withKnobs,
  text,
  boolean,
} from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";
import { ProductOffering } from "./product-offering.js";
// need to account for polymer goofiness when webpack rolls this up

export default {
  title: "Widgets|ProductOffering",
  component: "product-offering",
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const ProductOfferingStory = () => {
  return utils.makeElementFromClass(ProductOffering);
};
