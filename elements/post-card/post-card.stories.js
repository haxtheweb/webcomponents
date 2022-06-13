import { html } from "lit-html";
import { PostCard } from "@lrnwebcomponents/post-card/post-card.js";
import { withKnobs } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

export default {
  title: "Card|Post Card",
  component: "post-card",
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};

const utils = new StorybookUtilities();
export const PostCardStory = () => {
  return utils.makeElementFromClass(PostCard, {
    photoSrc: "https://images.onwardstate.com/uploads/2019/10/IMG_9180.jpg",
    stampSrc:
      "https://www.bestcleaners.com/wp-content/uploads/2017/06/AmericanFlag.jpg",
    to: "Billy",
    from: "Mandy",
    postMarkLocations: "Philly",
    message: "Have you seen Grim recently?",
  });
};
