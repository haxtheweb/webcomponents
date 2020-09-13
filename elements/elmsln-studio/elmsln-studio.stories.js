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
    new URL("./demo/images/image1.jpg", import.meta.url),
    new URL("./demo/images/image2.jpg", import.meta.url),
    new URL("./demo/images/image3.jpg", import.meta.url),
    new URL("./demo/images/image4.jpg", import.meta.url),
    new URL("./demo/images/image5.jpg", import.meta.url),
    new URL("./demo/images/image6.jpg", import.meta.url),
    new URL("./demo/images/image7.jpg", import.meta.url),
    new URL("./demo/images/image8.jpg", import.meta.url),
  ];

  console.log(
    images,
    new URL(
      `//fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;1,100;1,300;1,400;1,500;1,700&display=swap`,
      import.meta.url
    )
  );
  return utils.makeElementFromClass(
    ElmslnStudio,
    {
      sourcePath:
        "https://webcomponents.psu.edu/styleguide/iframe.html?id=apps-elms-ln-studio--studio",
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
