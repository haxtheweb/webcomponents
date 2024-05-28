import { html } from "lit-html";
import { withKnobs, text, boolean } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@haxtheweb/storybook-utilities/storybook-utilities.js";
import { RetroCard } from "./retro-card.js";
// need to account for polymer goofiness when webpack rolls this up

export default {
  title: "Cards|Retro Design",
  component: "retro-card",
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const BasicRetroCard = () => {
  return utils.makeUsageDocs(
    RetroCard,
    import.meta.url,
    utils.makeElementFromHaxDemo(RetroCard),
  );
};
