import { html } from "lit-element/lit-element.js";
import { A11yTabs } from "@lrnwebcomponents/a11y-tabs/a11y-tabs.js";
import { A11yTab } from "@lrnwebcomponents/a11y-tabs/lib/a11y-tab.js";
import {
  withKnobs,
  withWebComponentsKnobs,
  text,
  boolean
} from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

export default {
  title: "Navigation|Tabs",
  component: "a11y-tabs",
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" }
  }
};
const utils = new StorybookUtilities();
export const A11yTabsStory = () => {
  let tabs = utils.makeElementFromClass(A11yTabs, {
    id: "tabs"
  });
  [ "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"].forEach(tab => {
    let el = document.createElement("a11y-tab");
    el.label = tab;
    el.id = tab.toLowerCase();
    el.innerHTML = utils.getRandomTextarea();
    tabs.appendChild(el);
  });
  return tabs;
};

export const A11yTabStory = () => {
  return html`
    <p>Use the knobs below to customize the first tab.</p>
    <a11y-tabs layout-breakpoint="-1">
      <a11y-tab
        ?disabled="${boolean("Disabled (disabled)", false, "property")}"
        flag="${text("Flag (flag)", "", "property")}"
        flag-icon="${text("Flag Icon (flagIcon)", "", "property")}"
        ?hidden="${boolean("Hidden (hidden)", false, "property")}"
        icon="${text("Icon (icon)", "icon", "property")}"
        id="${text("ID (id)", "monday", "property")}"
        label="${text("Label (label)", "Monday", "property")}"
      >
        ${text('Tab Content (slot="")', utils.getRandomTextarea(), "slot")}
      </a11y-tab>
      ${["Before", "During", "After"].map(
        tab => html`
          <a11y-tab id="${tab.toLowerCase()}" label="${tab}">
            ${utils.getRandomTextarea()}
          </a11y-tab>
        `
      )}
    </a11y-tabs>
  `;
};
