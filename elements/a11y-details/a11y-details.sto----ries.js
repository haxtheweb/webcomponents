import { html } from "lit-element/lit-element.js";
import { A11yDetails } from "@lrnwebcomponents/a11y-details/a11y-details.js";
import { withKnobs, withWebComponentsKnobs } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

export default {
  title: "Navigation|Details",
  component: "a11y-details",
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" }
  }
};
const utils = new StorybookUtilities();
export const A11yDetailsStory = () => utils.makeElementFromHaxDemo(A11yDetails);
