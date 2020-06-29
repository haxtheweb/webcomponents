import { html } from "lit-element/lit-element.js";
import { ElmslnStudio } from "@lrnwebcomponents/elmsln-studio/elmsln-studio.js";
import { ElmslnStudioDashboard } from "@lrnwebcomponents/elmsln-studio/lib/elmsln-studio-dashboard.js";
import { ElmslnStudioSubmissions } from "@lrnwebcomponents/elmsln-studio/lib/elmsln-studio-submissions.js";
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

export const ElmslnStudioDashboardStory = () => {
  return utils.makeElementFromClass(ElmslnStudioDashboard, {
    activitySrc: new URL(`./demo/data/recent-activity.json`, import.meta.url),
    assignmentsSrc: new URL(`./demo/data/assignments.json`, import.meta.url),
    commentsSrc: new URL(`./demo/data/my-comments.json`, import.meta.url),
    profileSrc: new URL(`./demo/data/profile.json`, import.meta.url),
    submissionsSrc: new URL(`./demo/data/my-submissions.json`, import.meta.url)
  });
};
export const ElmslnStudioSubmissionsStory = () => {
  let sub = new ElmslnStudioSubmissions();
  sub.getFakeData();
  return utils.makeElementFromClass(ElmslnStudioSubmissions, {
    comments: sub.comments,
    assignments: sub.assignments,
    students: sub.students,
    submissions: sub.submissions,
    activites: sub.activites,
    activty: sub.activty,
  });
};
