import { html } from "lit-element/lit-element.js";
import { A11yTabs } from "@lrnwebcomponents/a11y-tabs/a11y-tabs.js";
import { A11yTab } from "@lrnwebcomponents/a11y-tabs/lib/a11y-tab.js";
import {
  withKnobs,
  withWebComponentsKnobs,
  text,
  boolean,
} from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

export default {
  title: "Navigation|Tabs",
  component: "a11y-tabs",
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const A11yTabsStory = () => {
  return utils.makeElementFromClass(
    A11yTabs,
    {
      id: "tabs",
      emptyslot: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ]
        .map(
          (day) =>
            `<a11y-tab id="${day.toLowerCase()}" 
          label="${day}" 
          icon="${utils.randomIcon()}">
          <p>${utils.randomParagraph(2, 7)}</p>
          <p>${utils.randomParagraph(2, 7)}</p>
          <p>${utils.randomParagraph(2, 7)}</p>
          <p>${utils.randomParagraph(2, 7)}</p>
          <p>${utils.randomParagraph(2, 7)}</p>
        </a11y-tab>`
        )
        .join(""),
    },
    [
      { css: "--a11y-tabs-font-family" },
      { css: "--a11y-tabs-font-size" },
      { css: "--a11y-tabs-color" },
      { css: "--a11y-tabs-focus-color" },
      { css: "--a11y-tabs-background" },
      { css: "--a11y-tabs-faded-background" },
      { css: "--a11y-tabs-horizontal-background" },
      { css: "--a11y-tabs-horizontal-sticky-background" },
      { css: "--a11y-tabs-vertical-background" },
      { css: "--a11y-tabs-border-color" },
      { css: "--a11y-tabs-border-radius" },
      { css: "--a11y-tabs-horizontal-border-radius" },
      { css: "--a11y-tabs-vertical-border-radius" },
      { css: "--a11y-tabs-margin" },
      { css: "--a11y-tabs-tab-font-family", title: "tab button font-family" },
      { css: "--a11y-tabs-tab-font-size", title: "tab button font-size" },
      { css: "--a11y-tabs-tab-height" },
      {
        css: "--a11y-tabs-button-padding",
        title: "default tab button padding for horizontal and vertical",
      },
      { css: "--a11y-tabs-button-horizontal-padding" },
      { css: "--a11y-tabs-button-vertical-padding" },
      {
        css: "--a11y-tabs-content-background",
        title: "tab content background-color",
      },
      {
        css: "--a11y-tabs-content-padding",
        title: "tab content padding for horizontal and vertical",
      },
      { css: "--a11y-tabs-width" },
      { css: "--a11y-tabs-height" },
      { css: "--a11y-tabs-overflow-x" },
      { css: "--a11y-tabs-overflow-y" },
      {
        css: "--a11y-tabs-justify-tabs",
        title: "default justification for horizontal and vertical",
      },
      { css: "--a11y-tabs-horizontal-justify-tabs" },
      { css: "--a11y-tabs-vertical-justify-tabs" },
      { css: "--a11y-tabs-wrap" },
    ]
  );
};

export const A11yTabStory = () => {
  let tabs = `<a11y-tabs layout=breakpoint="-1">`;
  tabs += ["Before", "During"]
    .map(
      (tab) =>
        `
  <a11y-tab id="${tab.toLowerCase()}" label="${tab}" disabled icon="${utils.randomIcon()}">${utils.randomParagraph(
          2,
          7
        )}</a11y-tab>`
    )
    .join("");

  tabs += `
  <!-- tab code-->
  ${utils.makeElementFromClass(
    A11yTab,
    {
      id: "after",
      label: "After",
      icon: utils.randomIcon(),
      emptyslot: utils.randomParagraph(2, 7),
    },
    [],
    [],
    true
  )}
  <!-- end tab code-->\n</a11y-tabs>`;
  return utils.getDemo(
    tabs,
    `<p>Use the knobs below to customize the first tab.</p>`
  );
};
