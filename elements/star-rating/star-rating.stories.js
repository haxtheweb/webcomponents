import { withKnobs } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";
import { StarRating } from "./star-rating.js";

export default {
  title: "System|Star Rating",
  component: "star-rating",
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const StarRatingStory = () => utils.makeUsageDocs(StarRating, import.meta.url, utils.makeElementFromClass(StarRating));
