import { withKnobs } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@haxtheweb/storybook-utilities/storybook-utilities.js";
import { RpgCharacter } from "./rpg-character.js";
// need to account for polymer goofiness when webpack rolls this up

export default {
  title: "System|RPG Character",
  component: "rpg-character",
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const RpgCharacterStory = () =>
  utils.makeUsageDocs(
    RpgCharacter,
    import.meta.url,
    utils.makeElementFromHaxDemo(RpgCharacter),
  );
