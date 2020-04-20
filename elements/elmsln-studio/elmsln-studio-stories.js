import { html } from "lit-element/lit-element.js";
import { ElmslnStudio } from "@lrnwebcomponents/elmsln-studio/elmsln-studio.js";
import { ElmslnStudioDashboard } from "@lrnwebcomponents/elmsln-studio/lib/elmsln-studio-dashboard.js";
import { withKnobs, withWebComponentsKnobs } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

export default {
  title: "Apps|Studio",
  component: "elmsln-studio-dashboard",
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" }
  }
};

export const ElmslnStudioDashboardStory = () => {
  const utils = new StorybookUtilities();
  return utils.makeElementFromClass(ElmslnStudioDashboard);
};
console.log('ElmslnStudioDashboard',ElmslnStudioDashboard,ElmslnStudioDashboardStory);
