import { html } from "lit-html";
import { withKnobs, text, boolean } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@haxtheweb/storybook-utilities/storybook-utilities.js";
import { PageSection } from "./page-section.js";
// need to account for polymer goofiness when webpack rolls this up

export default {
  title: "Section|PageSection",
  component: "page-section",
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const PageSectionStory = () => {
  return utils.makeUsageDocs(
    PageSection,
    import.meta.url,
    utils.makeElementFromClass(PageSection),
  );
};
