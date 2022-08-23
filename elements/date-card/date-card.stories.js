import { withKnobs } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";
import { DateCard } from "./date-card.js";
// need to account for polymer goofiness when webpack rolls this up

export default {
  title: "Card|Date",
  component: "date-card",
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const BasicDateCard = () => {
  return utils.makeElementFromHaxDemo(DateCard);
};