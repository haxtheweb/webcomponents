import { html } from "lit-html";
import { withKnobs, text, boolean } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";
import { LessonOverview } from "./lesson-overview.js";
import "./lib/lesson-highlight.js";
// need to account for polymer goofiness when webpack rolls this up

export default {
  title: "Overview|LessonOverview",
  component: "lesson-overview",
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
setTimeout(() => {
  document.querySelector('#btn').addEventListener('click', (e) => {
    document.querySelector('#target').getSmartData(document.querySelector('#text').value);
  });      
}, 500);

const utils = new StorybookUtilities();
export const LessonOverviewStory = () => {
  return utils.makeUsageDocs(
    LessonOverview,
    import.meta.url,
    utils.getDemo(`
    <input type="textfield" id="text" value="https://oer.hax.psu.edu/ajh6037/sites/chem110/" size="100" />
    <button id="btn">Load stats</button>
    <lesson-overview id="target">
      <lesson-highlight smart="objectives"></lesson-highlight>
      <lesson-highlight smart="pages"></lesson-highlight>
      <lesson-highlight smart="readTime"></lesson-highlight>
      <lesson-highlight smart="selfChecks"></lesson-highlight>
      <lesson-highlight smart="video"></lesson-highlight>
    </lesson-overview>
    `)
  ).innerHTML;
};
