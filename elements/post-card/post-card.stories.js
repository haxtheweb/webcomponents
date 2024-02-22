import { html } from "lit-html";
import { PostCard } from "@lrnwebcomponents/post-card/post-card.js";
import { withKnobs } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

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
