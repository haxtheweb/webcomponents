import { GitCorner } from "./git-corner.js";
import { withKnobs } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@haxtheweb/storybook-utilities/storybook-utilities.js";

export default {
  title: "Other|Git",
  component: GitCorner.tag,
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const GitHubCorner = () => {
  return utils.makeUsageDocs(
    GitCorner,
    import.meta.url,
    utils.makeElementFromClass(GitCorner, {
      source: "https://github.com/haxtheweb/webcomponents",
      alt: "Our monorepo of all the things you see here",
      corner: true,
      size: "large",
    }),
  );
};
