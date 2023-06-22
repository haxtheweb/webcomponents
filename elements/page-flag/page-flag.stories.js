import { html } from "lit-html";
import { withKnobs, text, boolean } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";
import { PageFlag } from "./page-flag.js";
// need to account for polymer goofiness when webpack rolls this up

export default {
  title: "Flag|PageFlag",
  component: "page-flag",
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const PageFlagStory = () => {
  return utils.makeUsageDocs(
    PageFlag,
    import.meta.url,
    utils.makeElementFromClass(PageFlag)
  );
};
