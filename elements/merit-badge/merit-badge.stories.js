import { html } from 'lit-html';
import {
  withKnobs,
  text,
  boolean,
} from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";
import { MeritBadge } from "./merit-badge.js";
// need to account for polymer goofiness when webpack rolls this up

export default {
  title: 'Badge|MeritBadge',
  component: 'merit-badge',
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const MeritBadgeStory = () => {
  return utils.makeUsageDocs(
    MeritBadge,
    import.meta.url, utils.makeElementFromClass(MeritBadge)
  );
};