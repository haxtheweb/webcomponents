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
  title: "Apps|GradeBook",
  component: "grade-book",
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const GradeBookStory = () => {
  return utils.makeElementFromClass(
    GradeBook,
    {
      accentColor: "blue",
      sheet:
        "2PACX-1vQWAKQNyYk6TmE6AaArXZNJY6BZxfbzVb3a1zRVYZzPO0HG-Jcjm4yVHWICVgX9jM8Ef_sKYAv3WnRq",
      "app-name": `
        <img style="height:32px;" src="https://standard.psu.edu/images/uploads/psu-mark.svg" alt="Penn State University">
        <div style="margin: -20px 0 0 35px;font-weight:bold;">Gradebook</div>
        `,
    },
    [
      { property: "accentColor", title: "Accent color" },
      { property: "sheet", title: "Google Sheet ID from publishing" },
      { slot: "app-name", title: "Load your own logo / app name" },
    ],
    // exclude these
    [
      "t",
      "hideActiveStudentOverview",
      "hideGradeScale",
      "settings",
      "loading",
      "hideActiveAssignment",
      "activeAssignment",
      "activeStudent",
      "totalScore",
      "scoreLock",
      "activeRubric",
      "activeGrading",
      "database",
      "activeSubmission",
      "activeStudentSubmissions",
      "assessmentView",
    ]
  );
};
