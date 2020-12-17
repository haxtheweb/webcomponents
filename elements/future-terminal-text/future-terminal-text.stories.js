import { html } from "lit-element/lit-element.js";
import {
  withKnobs,
  withWebComponentsKnobs,
  text,
  boolean,
} from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";
import { FutureTerminalText } from "./future-terminal-text.js";
// need to account for polymer goofiness when webpack rolls this up

export default {
  title: "Terminal|FutureTerminalText",
  component: "future-terminal-text",
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const FutureTerminalTextStory = () => {
  return utils.makeElementFromClass(FutureTerminalText);
};
