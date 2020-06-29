import { html } from "lit-element/lit-element.js";
import { ElmslnStudio } from "@lrnwebcomponents/elmsln-studio/elmsln-studio.js";
import { ElmslnStudioDashboard } from "@lrnwebcomponents/elmsln-studio/lib/elmsln-studio-dashboard.js";
import { ElmslnStudioSubmissions } from "@lrnwebcomponents/elmsln-studio/lib/elmsln-studio-submissions.js";
import { ElmslnStudioSubmissionView } from "@lrnwebcomponents/elmsln-studio/lib/elmsln-studio-submission-view.js";
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

export const Dashboard = () => {
  let sub = new ElmslnStudioDashboard();
  sub.getFakeData();
  return utils.makeElementFromClass(ElmslnStudioDashboard, {
    profile: sub.profile,
    studentId: sub.studentId,
    activities: sub.activities,
    activity: sub.activity,
    contributions: sub.contributions,
    comments: sub.activities,
    assignments: sub.assignments,
    submissions: sub.submissions,
    projects: sub.projects
  });
};
export const Submissions = () => {
  let sub = new ElmslnStudioSubmissions();
  sub.getFakeData();
  return utils.makeElementFromClass(ElmslnStudioSubmissions, {
    comments: sub.comments,
    assignments: sub.assignments,
    students: sub.students,
    submissions: sub.submissions,
    activites: sub.activites,
    activty: sub.activty
  });
};
export const SubmissionView = () => {
  let sub = new ElmslnStudioSubmissionView();
  sub.getFakeData();
  return utils.makeElementFromClass(ElmslnStudioSubmissionView, {
    firstName: sub.firstName,
    lastName: sub.lastName,
    image: sub.image,
    project: sub.propject,
    submissions: sub.submissions
  });
};
