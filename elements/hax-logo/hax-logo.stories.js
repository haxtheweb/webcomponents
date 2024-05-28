import { HaxLogo } from "./hax-logo.js";
import { withKnobs } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@haxtheweb/storybook-utilities/storybook-utilities.js";

export default {
  title: "HAX|Logo",
  component: HaxLogo.tag,
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const HaxTheWeb = () => {
  return utils.makeUsageDocs(
    HaxLogo,
    import.meta.url,
    utils.makeElementFromClass(HaxLogo, {
      emptyslot: `<span slot="pre">The</span>
  <span slot="post">of complacency</span>`,
    }),
  );
};
