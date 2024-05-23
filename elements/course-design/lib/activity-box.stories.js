import { html } from "lit-html";
import { withKnobs, text, boolean } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@haxtheweb/storybook-utilities/storybook-utilities.js";
import { ActivityBox } from "./activity-box.js";
// need to account for polymer goofiness when webpack rolls this up

export default {
  title: "Education|Course Design",
  component: "activity-box",
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const ActivityBoxStory = () =>
  utils.makeUsageDocs(
    ActivityBox,
    import.meta.url,
    utils.makeElementFromHaxDemo(ActivityBox),
  );
