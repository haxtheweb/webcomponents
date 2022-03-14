import { html } from "lit";
import {
  withKnobs,
  withWebComponentsKnobs,
  text,
  boolean,
} from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";
import { RpgCharacter } from "./rpg-character.js";
// need to account for polymer goofiness when webpack rolls this up

/** 
 * Uncomment to add to Storybook
export default {
  title: 'Character|RpgCharacter',
  component: 'rpg-character',
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const RpgCharacterStory = () => {
  return utils.makeElementFromClass(RpgCharacter);
}; 
*/
