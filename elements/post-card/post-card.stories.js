import { html } from "lit-html";
import { PostCard } from "@haxtheweb/post-card/post-card.js";
import { withKnobs } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@haxtheweb/storybook-utilities/storybook-utilities.js";

export default {
  title: "Cards|Post Card",
  component: "post-card",
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};

const utils = new StorybookUtilities();
export const PostCardStory = () => {
  return utils.makeUsageDocs(
    PostCard,
    import.meta.url,
    utils.makeElementFromHaxDemo(PostCard),
  );
};
