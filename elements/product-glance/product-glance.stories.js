import { withKnobs } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";
import { ProductGlance } from "./product-glance.js";

export default {
  title: "Extra|Product",
  component: "product-glance",
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const ProductGlanceStory = () => {
  return utils.makeUsageDocs(ProductGlance, import.meta.url, utils.makeElementFromClass(ProductGlance,
    {
      title: "The upside-down",
      dark: true,
      'accent-color': 'red',
      subtitle: "A great netflix show about a board game gone wrong.",
      icon: "save"
    }));
};
