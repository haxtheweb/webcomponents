import { html } from "lit-html";
import { withKnobs, text, boolean } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";
import { EventBadge } from "./event-badge.js";
// need to account for polymer goofiness when webpack rolls this up

export default {
  title: "Other|Event badge",
  component: "event-badge",
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const EventBadgeStory = () =>
  utils.makeUsageDocs(
    EventBadge,
    import.meta.url,
    utils.makeElementFromHaxDemo(EventBadge)
  );
