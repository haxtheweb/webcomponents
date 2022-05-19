import { html } from 'lit-html';
import {
  withKnobs,
  text,
  boolean,
} from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";
import { RpgCharacter } from "./rpg-character.js";
// need to account for polymer goofiness when webpack rolls this up

export default {
  title: 'Character|RpgCharacter',
  component: 'rpg-character',
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const RpgCharacterStory = () => {
  return utils.makeElementFromClass(RpgCharacter);
};
