import { html } from "lit-html";
import { withKnobs, text, boolean } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@haxtheweb/storybook-utilities/storybook-utilities.js";
import { CollectionList } from "./collection-list.js";
// need to account for polymer goofiness when webpack rolls this up

export default {
  title: "List|CollectionList",
  component: "collection-list",
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const CollectionListStory = () => {
  return utils.makeUsageDocs(
    CollectionList,
    import.meta.url,
    utils.makeElementFromClass(CollectionList),
  );
};
