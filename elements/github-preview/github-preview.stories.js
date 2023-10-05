import { GithubPreview } from "./github-preview.js";
import { withKnobs } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

export default {
  title: "Other|Github Preview",
  component: GithubPreview.tag,
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const StandardUsage = () => {
  return utils.makeUsageDocs(
    GithubPreview,
    import.meta.url,
    utils.makeElementFromClass(GithubPreview, {
      repo: "lrnwebcomponents",
      org: "elmsln",
    })
  );
};
