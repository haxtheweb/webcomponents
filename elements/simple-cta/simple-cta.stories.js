import { SimpleCta } from "./simple-cta.js";
import { withKnobs } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@haxtheweb/storybook-utilities/storybook-utilities.js";

export default {
  title: "Navigation|CTA",
  component: SimpleCta.tag,
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const Button = () => {
  return utils.makeUsageDocs(
    SimpleCta,
    import.meta.url,
    utils.makeElementFromHaxDemo(SimpleCta),
  );
};
