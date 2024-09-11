import { html } from "lit";
import {
  withKnobs,
  withWebComponentsKnobs,
  text,
  boolean,
} from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@haxtheweb/storybook-utilities/storybook-utilities.js";
import { LaTex } from "./la-tex.js";
// need to account for polymer goofiness when webpack rolls this up

/** 
 * Uncomment to add to Storybook
export default {
  title: 'Tex|LaTex',
  component: 'la-tex',
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const LaTexStory = () => {
  return utils.makeElementFromClass(LaTex);
}; 
*/
