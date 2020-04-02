import { html } from "lit-element/lit-element.js";
import { AccentCard } from "@lrnwebcomponents/accent-card/accent-card.js";
export default {
  title: "Card|Variations",
  component: "accent-card"
};

export const AccentCardStory = () => html`
  <accent-card><div slot="content">This is my card.</div></accent-card>
`;