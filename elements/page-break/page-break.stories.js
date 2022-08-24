import { withKnobs } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";
import { PageBreak } from "./page-break.js";
// need to account for polymer goofiness when webpack rolls this up

export default {
  title: "HAX|PageBreak",
  component: "page-break",
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const PageBreakStory = () => {
  return utils.makeUsageDocs(
    PageBreak,
    import.meta.url,
    utils.makeElementFromHaxDemo(PageBreak)
  );
};
