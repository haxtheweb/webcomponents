import { withKnobs } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";
import { CodeSample } from "./code-sample.js";
// need to account for polymer goofiness when webpack rolls this up

export default {
  title: "Developer|Code Sample",
  component: "code-sample",
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const BasicCodeSample = () =>
  utils.makeUsageDocs(
    CodeSample,
    import.meta.url,
    utils.makeElementFromHaxDemo(CodeSample)
  );
