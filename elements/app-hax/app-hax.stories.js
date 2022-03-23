import { html } from "lit";
import {
  withKnobs,
  withWebComponentsKnobs,
  text,
  boolean,
} from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";
import { AppHax } from "./app-hax.js";
// need to account for polymer goofiness when webpack rolls this up

/** 
 * Uncomment to add to Storybook
export default {
  title: 'Hax|AppHax',
  component: 'app-hax',
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const AppHaxStory = () => {
  return utils.makeElementFromClass(AppHax);
}; 
*/
