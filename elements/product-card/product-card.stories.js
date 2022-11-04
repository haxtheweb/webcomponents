import { ProductCard } from "./product-card.js";
import { withKnobs } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

export default {
  title: "Cards|Product",
  component: ProductCard.tag,
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const BasicUsage = () => {
  return utils.makeUsageDocs(
    ProductCard,
    import.meta.url,
    utils.makeElementFromClass(ProductCard, {
      heading: "HAX Camp",
      icon: "save",
      "accent-color": "blue",
      subheading: "#HAXTheWeb",
      logo: "assets/images/edtechjoker.jpg",
      image: "assets/images/haxcamp.jpg",
      emptyslot: `<div slot="details-collapse-header">Details</div>
      <div slot="details-collapse-content">My details</div>
      <div slot="demo-collapse-header">Demo</div>
      <div slot="demo-collapse-content"><a href="https://haxtheweb.org/">HAX all the things</a></div>
    </product-card>`,
    })
  );
};
