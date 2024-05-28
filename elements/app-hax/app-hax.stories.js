import { html } from "lit-html";
import { withKnobs, text, boolean } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@haxtheweb/storybook-utilities/storybook-utilities.js";
import { AppHax } from "./app-hax.js";
// need to account for polymer goofiness when webpack rolls this up

export default {
  title: "Hax|Site Creation",
  component: "app-hax",
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const AppHaxStory = () =>
  utils.makeUsageDocs(
    AppHax,
    import.meta.url,
    utils.makeElementFromHaxDemo(AppHax),
  );
