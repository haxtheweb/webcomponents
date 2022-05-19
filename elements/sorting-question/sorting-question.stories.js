import { html } from 'lit-html';
import {
  withKnobs,
  text,
  boolean,
} from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";
import { SortingQuestion } from "./sorting-question.js";
// need to account for polymer goofiness when webpack rolls this up

export default {
  title: 'Question|SortingQuestion',
  component: 'sorting-question',
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const SortingQuestionStory = () => {
  return utils.makeElementFromClass(SortingQuestion);
}; 
