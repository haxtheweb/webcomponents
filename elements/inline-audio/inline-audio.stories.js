import { html } from "lit-html";
import { withKnobs, text, boolean } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";
import { InlineAudio } from "./inline-audio.js";
// need to account for polymer goofiness when webpack rolls this up

export default {
  title: "Audio|InlineAudio",
  component: "inline-audio",
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const InlineAudioStory = () => {
  return utils.makeUsageDocs(
    InlineAudio,
    import.meta.url,
    utils.makeElementFromHaxDemo(InlineAudio)
  );
};
