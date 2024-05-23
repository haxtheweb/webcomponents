import { withKnobs } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@haxtheweb/storybook-utilities/storybook-utilities.js";
import { SelfCheck } from "./self-check.js";

export default {
  title: "Education|Self check",
  component: "self-check",
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const BasicSelfCheck = () =>
  utils.makeUsageDocs(
    SelfCheck,
    import.meta.url,
    utils.makeElementFromHaxDemo(SelfCheck),
  );
