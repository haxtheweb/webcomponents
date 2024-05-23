import { TwitterEmbed } from "./twitter-embed.js";
import { withKnobs } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@haxtheweb/storybook-utilities/storybook-utilities.js";

export default {
  title: "Media|Twitter Embed",
  component: TwitterEmbed.tag,
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const SimpleSearch = () => {
  return utils.makeUsageDocs(
    TwitterEmbed,
    import.meta.url,
    utils.makeElementFromHaxDemo(TwitterEmbed),
  );
};
