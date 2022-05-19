import { html } from 'lit-html';
import {
  withKnobs,
  text,
  boolean,
} from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";
import { StarRating } from "./star-rating.js";
// need to account for polymer goofiness when webpack rolls this up

export default {
  title: "Widgets|StarRating",
  component: "star-rating",
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const StarRatingStory = () => {
  return utils.makeElementFromClass(StarRating);
};
