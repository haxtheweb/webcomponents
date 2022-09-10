import { html } from "lit-html";
import { withKnobs, text, boolean } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";
import { LessonOverview } from "./lesson-overview.js";
// need to account for polymer goofiness when webpack rolls this up

export default {
  title: "Overview|LessonOverview",
  component: "lesson-overview",
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const LessonOverviewStory = () => {
  return utils.makeUsageDocs(
    LessonOverview,
    import.meta.url,
    utils.makeElementFromClass(LessonOverview)
  );
};
