import { html } from 'lit-html';
import {
  withKnobs,
  text,
  boolean,
} from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";
import { PageBreak } from "./page-break.js";
// need to account for polymer goofiness when webpack rolls this up

export default {
  title: 'Break|PageBreak',
  component: 'page-break',
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const PageBreakStory = () => {
  return utils.makeElementFromClass(PageBreak);
};