import { html } from "lit-html";
import { withKnobs, text, boolean } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";
import { TerribleThemes } from "./terrible-themes.js";
// need to account for polymer goofiness when webpack rolls this up

export default {
  title: "Themes|TerribleThemes",
  component: "terrible-themes",
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const TerribleThemesStory = () => {
  return utils.makeUsageDocs(
    TerribleThemes,
    import.meta.url,
    utils.makeElementFromClass(TerribleThemes)
  );
};
