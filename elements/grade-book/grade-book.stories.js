import { html } from "lit-html";
import { withKnobs, text, boolean } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";
import { GradeBookLite } from "./lib/grade-book-lite.js";
// need to account for polymer goofiness when webpack rolls this up

export default {
  title: "Education|Tag Grader",
  component: "grade-book-lite",
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const GradeBookLiteStory = () => {
  return utils.makeUsageDocs(
    GradeBookLite,
    import.meta.url,
    utils.makeElementFromClass(GradeBookLite, {
      "accent-color": "blue",
      "source-data":
        "2PACX-1vQWAKQNyYk6TmE6AaArXZNJY6BZxfbzVb3a1zRVYZzPO0HG-Jcjm4yVHWICVgX9jM8Ef_sKYAv3WnRq",
      source: "googledocs",
    }),
  );
};
