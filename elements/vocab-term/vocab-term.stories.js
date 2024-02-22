import { html } from "lit-html";
import { withKnobs, text, boolean } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";
import { VocabTerm } from "./vocab-term.js";
// need to account for polymer goofiness when webpack rolls this up

export default {
  title: "Education|Vocab Term",
  component: "vocab-term",
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const VocabTermStory = () =>
  utils.makeUsageDocs(
    VocabTerm,
    import.meta.url,
    utils.makeElementFromHaxDemo(VocabTerm),
  );
