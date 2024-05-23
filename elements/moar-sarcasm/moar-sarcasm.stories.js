import { MoarSarcasm } from "./moar-sarcasm.js";
import { withKnobs } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@haxtheweb/storybook-utilities/storybook-utilities.js";

export default {
  title: "Other|Sarcasm",
  component: MoarSarcasm.tag,
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const ProgressiveEnhancement = () => {
  return utils.makeUsageDocs(
    MoarSarcasm,
    import.meta.url,
    utils.makeElementFromClass(MoarSarcasm, {
      emptyslot: "whatever you want to say is really importanter here!",
    }),
  );
};

export const AttributeDriven = () => {
  return utils.makeElementFromClass(MoarSarcasm, {
    say: "Just use the platform",
  });
};
