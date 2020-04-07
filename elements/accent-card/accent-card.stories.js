import { html } from "lit-element/lit-element.js";
import { AccentCard } from "@lrnwebcomponents/accent-card/accent-card.js";
import { withKnobs, withWebComponentsKnobs } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

export default {
  title: "Card|Accent Card",
  component: "accent-card",
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" }
  }
};

export const AccentCardStory = () => {
  const utils = new StorybookUtilities();
  return utils.makeElementFromClass(AccentCard, {
    heading: utils.getRandomText(),
    content: utils.getRandomTextarea(),
    color: utils.getRandomColor(),
    imageSrc: utils.getRandomImage()
  });
};
