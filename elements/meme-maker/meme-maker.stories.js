import { html } from "lit-html";
import { withKnobs, text, boolean } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";
import { MemeMaker } from "./meme-maker.js";
// need to account for polymer goofiness when webpack rolls this up

export default {
  title: "Media|Memes",
  component: "meme-maker",
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const BasicMeme = () => {
  return utils.makeUsageDocs(
    MemeMaker,
    import.meta.url,
    utils.makeElementFromHaxDemo(MemeMaker)
  );
};
