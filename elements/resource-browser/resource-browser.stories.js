import { html } from "lit-element/lit-element.js";
import {
  withKnobs,
  withWebComponentsKnobs,
  text,
  boolean,
} from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";
import { ResourceBrowser } from "./resource-browser.js";
// need to account for polymer goofiness when webpack rolls this up

export default {
  title: "Browser|ResourceBrowser",
  component: "resource-browser",
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const ResourceBrowserStory = () => {
  return utils.makeElementFromClass(ResourceBrowser);
};
