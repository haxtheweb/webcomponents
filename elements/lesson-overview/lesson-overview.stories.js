import { html } from "lit-html";
import { withKnobs, text, boolean } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@haxtheweb/storybook-utilities/storybook-utilities.js";
import { LessonOverview } from "./lesson-overview.js";
import "./lib/lesson-highlight.js";
// need to account for polymer goofiness when webpack rolls this up

export default {
  title: "Microservices|LessonOverview",
  component: "lesson-overview",
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
setTimeout(() => {
  if (document.querySelector("#loadstatsbutton")) {
    document
      .querySelector("#loadstatsbutton")
      .addEventListener("click", (e) => {
        document.querySelector("#target").ancestor =
          document.querySelector("#ancestor").value;
        document
          .querySelector("#target")
          .getSmartData(document.querySelector("#text").value);
      });
  }
}, 1000);

const utils = new StorybookUtilities();
export const LessonOverviewStory = () => {
  return utils.makeUsageDocs(
    LessonOverview,
    import.meta.url,
    utils.getDemo(`
    <input type="textfield" id="text" value="https://oer.hax.psu.edu/bto108/sites/edtechjoker/" size="50" />
    <input type="textfield" id="ancestor" value="mlid-4599" size="50" />
    <button id="loadstatsbutton">Load stats</button>
    <lesson-overview id="target">
      <lesson-highlight smart="objectives"></lesson-highlight>
      <lesson-highlight smart="pages"></lesson-highlight>
      <lesson-highlight smart="readTime"></lesson-highlight>
      <lesson-highlight smart="selfChecks"></lesson-highlight>
      <lesson-highlight smart="video"></lesson-highlight>
    </lesson-overview>
    `),
  ).innerHTML;
};
