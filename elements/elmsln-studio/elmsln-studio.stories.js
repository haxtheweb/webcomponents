import { html } from "lit-element/lit-element.js";
import { ElmslnStudio } from "@lrnwebcomponents/elmsln-studio/elmsln-studio.js";
import { withKnobs, withWebComponentsKnobs } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

export default {
  title: "Apps|ELMS:LN Studio",
  component: "elmsln-studio",
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel", escapeHTML: false },
  },
};
const utils = new StorybookUtilities();

export const Studio = () => {
  let images = [
    [1, 2, 3, 4, 5, 6, 7, 8].map((i) => `./demo/images/image${i}.jpg`),
    [
      "ai",
      "css",
      "csv",
      "doc",
      "eps",
      "file",
      "html",
      "js",
      "pdf",
      "ppt",
      "rtf",
      "url",
      "xls",
    ].map((i) => `./lib/svg/${i}.svg`),
  ].map((f) => new URL(f, import.meta.url));
  return utils.makeElementFromClass(
    ElmslnStudio,
    {
      assignmentsSource: new URL(
        `./demo/data/webcomponentspsu/assignments.json`,
        import.meta.url
      ),
      usersSource: new URL(
        `./demo/data/webcomponentspsu/users.json`,
        import.meta.url
      ),
      projectsSource: new URL(
        `./demo/data/webcomponentspsu/projects.json`,
        import.meta.url
      ),
      lessonsSource: new URL(
        `./demo/data/webcomponentspsu/lessons.json`,
        import.meta.url
      ),
      activitySource: new URL(
        `./demo/data/webcomponentspsu/activity.json`,
        import.meta.url
      ),
      discussionSource: new URL(
        `./demo/data/webcomponentspsu/discussion.json`,
        import.meta.url
      ),
      portfoliosSource: new URL(
        `./demo/data/webcomponentspsu/portfolios.json`,
        import.meta.url
      ),
      profileSource: new URL(
        `./demo/data/webcomponentspsu/profile.json`,
        import.meta.url
      ),
      submissionsSource: new URL(
        `./demo/data/webcomponentspsu/submissions.json`,
        import.meta.url
      ),
    },
    [],
    [
      "discussion",
      "submissions",
      "portfolios",
      "lessons",
      "projects",
      "assignments",
      "profile",
      "activity",
      "users",
      "sourcePath",
      "route",
      "params",
      "query",
      "data",
    ]
  );
};
