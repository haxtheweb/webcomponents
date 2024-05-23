import { withKnobs } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@haxtheweb/storybook-utilities/storybook-utilities.js";
import { CodeSample } from "./code-sample.js";
// need to account for polymer goofiness when webpack rolls this up

export default {
  title: "Other|Code Sample",
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
    utils.makeElementFromHaxDemo(CodeSample),
  );
