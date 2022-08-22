import { withKnobs } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";
import { SelfCheck } from "./self-check.js";
// need to account for polymer goofiness when webpack rolls this up

export default {
  title: "Education|SelfCheck",
  component: "self-check",
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const BasicSelfCheck = () => {
  return utils.makeElementFromHaxDemo(SelfCheck);
};
