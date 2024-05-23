import { LunrSearch } from "./lunr-search.js";
import { withKnobs } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@haxtheweb/storybook-utilities/storybook-utilities.js";

export default {
  title: "Other|Lunr Search",
  component: LunrSearch.tag,
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const SimpleSearch = () => {
  return utils.makeUsageDocs(
    LunrSearch,
    import.meta.url,
    utils.makeElementFromClass(LunrSearch, {
      demo: true,
      search: "Drupal",
      "data-source": `${import.meta.url.replace(
        "lunr-search.stories.js?storybook-story",
        "",
      )}demo/lunrSearchIndex.json`,
    }),
  );
};
