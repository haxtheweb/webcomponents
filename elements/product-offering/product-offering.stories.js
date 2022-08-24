import { withKnobs } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";
import { ProductOffering } from "./product-offering.js";

export default {
  title: "Extra|Product",
  component: "product-offering",
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const ProductOfferingStory = () => {
  return utils.makeUsageDocs(ProductOffering, import.meta.url, utils.makeElementFromClass(ProductOffering, {
    icon: "maps:place",
    dark: false,
    'accent-color': "orange",
    source: "https://pbs.twimg.com/profile_images/1556675960635891713/ONMPLfPT_400x400.jpg",
    description: "The place to be is this guy's classroom. He's great at web components and dressing oddly.",
    title: "Cool Professor"
  }));
};
