import { html } from "lit-html";
import { withKnobs, text, boolean } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";
import { FlashCard } from "./flash-card.js";
// need to account for polymer goofiness when webpack rolls this up

export default {
  title: "Education|FlashCard",
  component: "flash-card",
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const FlashCardStory = () => {
  return utils.makeUsageDocs(
    FlashCard,
    import.meta.url,
    utils.makeElementFromHaxDemo(FlashCard)
  );
};
