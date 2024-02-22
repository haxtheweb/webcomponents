import { html } from "lit-html";
import { withKnobs, text, boolean } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";
import { MarkTheWords } from "./mark-the-words.js";
// need to account for polymer goofiness when webpack rolls this up

export default {
  title: "Education|MarkTheWords",
  component: "mark-the-words",
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const MarkTheWordsStory = () => {
  return utils.makeUsageDocs(
    MarkTheWords,
    import.meta.url,
    utils.makeElementFromHaxDemo(MarkTheWords),
  );
};
