import { HtmlBlock } from "./html-block.js";
import { withKnobs } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

export default {
  title: "Developer|HTML BLock",
  component: HtmlBlock.tag,
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const HtmlBlockForHAX = () => {
  return utils.makeUsageDocs(
    HtmlBlock,
    import.meta.url,
    utils.makeElementFromClass(HtmlBlock, {
      emptyslot: "<p>whatever you want, it's just a bridge for HAX</p>"
    })
  );
};
