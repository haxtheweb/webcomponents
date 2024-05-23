import { SimpleProgress } from "./simple-progress.js";
import { withKnobs } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@haxtheweb/storybook-utilities/storybook-utilities.js";

export default {
  title: "System|Progress bar",
  component: SimpleProgress.tag,
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const ProcessingBar = () => {
  return utils.makeUsageDocs(
    SimpleProgress,
    import.meta.url,
    utils.makeElementFromClass(SimpleProgress),
  );
};

export const DisabledAfterOne = () => {
  return utils.makeUsageDocs(
    SimpleProgress,
    import.meta.url,
    utils.makeElementFromClass(SimpleProgress, {
      disabled: "disabled",
    }),
  );
};
