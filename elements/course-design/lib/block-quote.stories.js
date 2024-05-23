import { withKnobs } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@haxtheweb/storybook-utilities/storybook-utilities.js";
import { BlockQuote } from "./block-quote.js";
// need to account for polymer goofiness when webpack rolls this up

export default {
  title: "Education|Course Design",
  component: BlockQuote.tag,
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const BlockQuoteStory = () =>
  utils.makeUsageDocs(
    BlockQuote,
    import.meta.url,
    utils.makeElementFromHaxDemo(BlockQuote),
  );
