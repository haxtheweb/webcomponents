import { html } from "lit-html";
import { withKnobs, text, boolean } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";
import { LrnVocab as sbClass } from "./lrn-vocab.js";
// need to account for polymer goofiness when webpack rolls this up

export default {
  title: `Other|${sbClass.tag}`,
  component: sbClass.tag,
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const DefaultStory = () => {
  return utils.makeUsageDocs(
    sbClass,
    import.meta.url,
    utils.makeElementFromHaxDemo(sbClass),
  );
};
