import { html } from "lit-html";
import { A11yGifPlayer } from "@lrnwebcomponents/a11y-gif-player/a11y-gif-player.js";
import { withKnobs } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

export default {
  title: "Media|GIF",
  component: "a11y-gif-player",
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};

const utils = new StorybookUtilities();
export const A11yGifPlayerStory = () => {
  return utils.makeUsageDocs(
    A11yGifPlayer,
    import.meta.url,
    utils.makeElementFromHaxDemo(A11yGifPlayer)
  );
};
