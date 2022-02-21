import { html } from "lit";
import {
  withKnobs,
  withWebComponentsKnobs,
  text,
  boolean,
} from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";
import { PromiseProgress } from "./promise-progress.js";
// need to account for polymer goofiness when webpack rolls this up

/** 
 * Uncomment to add to Storybook
export default {
  title: 'Progress|PromiseProgress',
  component: 'promise-progress',
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const PromiseProgressStory = () => {
  return utils.makeElementFromClass(PromiseProgress);
}; 
*/
