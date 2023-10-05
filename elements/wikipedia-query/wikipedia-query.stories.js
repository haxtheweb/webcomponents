import { html } from "lit-html";
import { withKnobs, text, boolean } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";
import { WikipediaQuery as sbClass } from "./wikipedia-query.js";
// need to account for polymer goofiness when webpack rolls this up

export default {
  title: `Education|Wikipedia`,
  component: sbClass.tag,
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const WikipediaQueryStory = () => {
  return utils.makeUsageDocs(
    sbClass,
    import.meta.url,
    utils.makeElementFromHaxDemo(sbClass)
  );
};
