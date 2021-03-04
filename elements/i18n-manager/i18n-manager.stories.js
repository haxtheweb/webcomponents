import { html } from "lit-element/lit-element.js";
import {
  withKnobs,
  withWebComponentsKnobs,
  text,
  boolean,
} from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";
import { I18NManager } from "./i18n-manager.js";
// need to account for polymer goofiness when webpack rolls this up

export default {
  title: "18|I18NManager",
  component: "i18n-manager",
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const I18NManagerStory = () => {
  return utils.makeElementFromClass(I18NManager);
};
