import { html } from "lit-html";
import { withKnobs, text, boolean } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";
import { TrainingTheme } from "./training-theme.js";
// need to account for polymer goofiness when webpack rolls this up

export default {
  title: "Theme|TrainingTheme",
  component: "training-theme",
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const TrainingThemeStory = () => {
  return utils.makeUsageDocs(
    TrainingTheme,
    import.meta.url,
    utils.makeElementFromClass(TrainingTheme)
  );
};
