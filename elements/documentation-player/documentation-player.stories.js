import { html } from "lit-html";
import { withKnobs, text, boolean } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";
import { DocumentationPlayer } from "./documentation-player.js";
// need to account for polymer goofiness when webpack rolls this up

export default {
  title: "Player|DocumentationPlayer",
  component: "documentation-player",
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const DocumentationPlayerStory = () => {
  return utils.makeUsageDocs(
    DocumentationPlayer,
    import.meta.url,
    utils.makeElementFromClass(DocumentationPlayer)
  );
};
