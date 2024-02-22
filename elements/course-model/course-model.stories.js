import { html } from "lit-html";
import { withKnobs, text, boolean } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";
import { CourseModel } from "./course-model.js";
// need to account for polymer goofiness when webpack rolls this up

export default {
  title: "Education|CourseModel",
  component: "course-model",
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const CourseModelStory = () => {
  return utils.makeUsageDocs(
    CourseModel,
    import.meta.url,
    utils.makeElementFromHaxDemo(CourseModel),
  );
};
