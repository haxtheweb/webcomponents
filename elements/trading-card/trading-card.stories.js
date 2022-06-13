import { html } from "lit-html";
import { withKnobs, text, boolean } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";
import { TradingCard } from "./trading-card.js";
// need to account for polymer goofiness when webpack rolls this up

export default {
  title: "Card|TradingCard",
  component: "trading-card",
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const TradingCardStory = () => {
  return utils.makeElementFromClass(TradingCard);
};
