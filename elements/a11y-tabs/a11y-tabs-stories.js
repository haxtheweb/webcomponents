import { html } from "lit-element/lit-element.js";
import { A11yTabs } from "@lrnwebcomponents/a11y-tabs/a11y-tabs.js";
import { A11yTab } from "@lrnwebcomponents/a11y-tabs/lib/a11y-tab.js";
import {
  withKnobs,
  withWebComponentsKnobs
} from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

export default {
  title: "Tabs",
  component: "a11y-tabs",
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" }
  },
  stories: ["A11yTabsStory"]
};

export const A11yTabsStory = () => {
  const utils = new StorybookUtilities(), 
    tabs = utils.makeElementFromClass(A11yTabs,{
      "id": "tabs"
    });
  ["tab1","tab2","tab3"].map(tab=>utils.makeElementFromClass(A11yTab,{
    "id": tab,
    "label": utils.getRandomText(),
    "": utils.getRandomTextarea()
  })).forEach(tab=>tabs.appendChild(tab));
    return tabs;
};