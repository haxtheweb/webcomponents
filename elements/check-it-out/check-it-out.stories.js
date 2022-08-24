import { html } from "lit-html";
import { withKnobs, text, boolean } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";
import { CheckItOut } from "./check-it-out.js";
// need to account for polymer goofiness when webpack rolls this up

export default {
  title: "Education|Check It Out",
  component: "check-it-out",
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const CheckItOutStory = () =>
  utils.makeUsageDocs(
    CheckItOut,
    import.meta.url,
    utils.makeElementFromHaxDemo(CheckItOut)
  );
