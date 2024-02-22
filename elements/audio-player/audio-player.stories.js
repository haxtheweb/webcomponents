import { html } from "lit-html";
import { withKnobs, text, boolean } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";
import { AudioPlayer } from "./audio-player.js";
// need to account for polymer goofiness when webpack rolls this up

export default {
  title: "Media|AudioPlayer",
  component: "audio-player",
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const AudioPlayerStory = () => {
  return utils.makeUsageDocs(
    AudioPlayer,
    import.meta.url,
    utils.makeElementFromHaxDemo(AudioPlayer),
  );
};
