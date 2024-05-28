import { html } from "lit-html";
import { withKnobs, text, boolean } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@haxtheweb/storybook-utilities/storybook-utilities.js";
import { FutureTerminalText } from "./future-terminal-text.js";
// need to account for polymer goofiness when webpack rolls this up

export default {
  title: "Other|FutureTerminalText",
  component: "future-terminal-text",
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const FutureTerminalTextStory = () => {
  return utils.makeUsageDocs(
    FutureTerminalText,
    import.meta.url,
    utils.makeElementFromClass(FutureTerminalText),
  );
};
