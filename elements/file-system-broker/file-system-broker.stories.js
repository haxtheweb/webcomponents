import { html } from "lit-element/lit-element.js";
import {
  withKnobs,
  withWebComponentsKnobs,
  text,
  boolean,
} from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";
import { FileSystemBroker } from "./file-system-broker.js";
// need to account for polymer goofiness when webpack rolls this up

export default {
  title: "System|FileSystemBroker",
  component: "file-system-broker",
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const FileSystemBrokerStory = () => {
  return utils.makeElementFromClass(FileSystemBroker);
};
