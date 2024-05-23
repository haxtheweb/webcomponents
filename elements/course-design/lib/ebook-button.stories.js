import { withKnobs } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@haxtheweb/storybook-utilities/storybook-utilities.js";
import { EbookButton } from "./ebook-button.js";
// need to account for polymer goofiness when webpack rolls this up

export default {
  title: "Education|Course Design",
  component: EbookButton.tag,
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const EbookButtonStory = () =>
  utils.makeUsageDocs(
    EbookButton,
    import.meta.url,
    utils.makeElementFromHaxDemo(EbookButton),
  );
