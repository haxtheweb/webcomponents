import { html } from "lit-html";
import { withKnobs, text, boolean } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@haxtheweb/storybook-utilities/storybook-utilities.js";
import { MediaImage } from "./media-image.js";
// need to account for polymer goofiness when webpack rolls this up

export default {
  title: "Media|MediaImage",
  component: "media-image",
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const MediaImageStory = () => {
  return utils.makeUsageDocs(
    MediaImage,
    import.meta.url,
    utils.makeElementFromHaxDemo(MediaImage),
  );
};
