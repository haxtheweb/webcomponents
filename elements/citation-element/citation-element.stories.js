import { withKnobs } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@haxtheweb/storybook-utilities/storybook-utilities.js";
import { CitationElement } from "./citation-element.js";
// need to account for polymer goofiness when webpack rolls this up

export default {
  title: "Education|Citation",
  component: "citation-element",
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const BasicCitationElement = () =>
  utils.makeUsageDocs(
    CitationElement,
    import.meta.url,
    utils.makeElementFromHaxDemo(CitationElement),
  );
