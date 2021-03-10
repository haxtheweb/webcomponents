import { html } from "lit-element/lit-element.js";
import {
  withKnobs,
  withWebComponentsKnobs,
  text,
  boolean,
} from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";
import { GradeBook } from "./grade-book.js";
// need to account for polymer goofiness when webpack rolls this up

export default {
  title: "Book|GradeBook",
  component: "grade-book",
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const GradeBookStory = () => {
  return utils.makeElementFromClass(GradeBook);
};
