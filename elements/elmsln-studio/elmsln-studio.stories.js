import { html } from "lit-element/lit-element.js";
import { ElmslnStudio } from "@lrnwebcomponents/elmsln-studio/elmsln-studio.js";
import { withKnobs, withWebComponentsKnobs } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

export default {
  title: "Apps|ELMS:LN Studio",
  component: "elmsln-studio",
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel", escapeHTML: false }
  }
};
const utils = new StorybookUtilities();

export const Studio = () => {
  let div = document.createElement("div");

  console.log(
    new URL(
      `//fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;1,100;1,300;1,400;1,500;1,700&display=swap`,
      import.meta.url
    )
  );
  return utils.makeElementFromClass(
    ElmslnStudio,
    {
      sourcePath: window.location,
      assignmentsSource: new URL(
        `./demo/data/assignments.json`,
        import.meta.url
      ),
      usersSource: new URL(`./demo/data/users.json`, import.meta.url),
      projectsSource: new URL(`./demo/data/projects.json`, import.meta.url),
      lessonsSource: new URL(`./demo/data/lessons.json`, import.meta.url),
      activitySource: new URL(`./demo/data/activity.json`, import.meta.url),
      discussionSource: new URL(`./demo/data/discussion.json`, import.meta.url),
      portfoliosSource: new URL(`./demo/data/portfolios.json`, import.meta.url),
      profileSource: new URL(`./demo/data/profile.json`, import.meta.url),
      submissionsSource: new URL(
        `./demo/data/submissions.json`,
        import.meta.url
      )
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
      "data"
    ]
  );
};
