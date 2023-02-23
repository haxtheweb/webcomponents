import { html } from "lit-html";
import { withKnobs, text, boolean } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";
import { GradeBook } from "./grade-book.js";
// need to account for polymer goofiness when webpack rolls this up

export default {
  title: "Education|Grade Book",
  component: "grade-book",
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const GradeBookStory = () => {
  return utils.makeUsageDocs(
    GradeBook,
    import.meta.url,
    utils.makeElementFromClass(GradeBook, {
      "accent-color": "blue",
      "source-data": "2PACX-1vQWAKQNyYk6TmE6AaArXZNJY6BZxfbzVb3a1zRVYZzPO0HG-Jcjm4yVHWICVgX9jM8Ef_sKYAv3WnRq",
      source: "googledocs",
    })
  );
};
