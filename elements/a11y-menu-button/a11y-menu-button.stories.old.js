import { html } from "lit-element/lit-element.js";
import { A11yCollapseGroup } from "@lrnwebcomponents/a11y-menu-button/lib/a11y-menu-button-group.js";
import { A11yCollapse } from "@lrnwebcomponents/a11y-menu-button/a11y-menu-button.js";
import {
  withKnobs,
  withWebComponentsKnobs,
  text,
  boolean,
} from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

export default {
  title: "Navigation|Collapse",
  component: "a11y-menu-button-group",
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const A11yCollapseGroupStory = () => {
  let props = utils.getElementProperties(
    A11yCollapseGroup.properties,
    A11yCollapseGroup.haxProperties
  );
  return utils.makeElementFromClass(
    A11yCollapseGroup,
    {
      id: "group",
      emptyslot: [1, 2, 3]
        .map(
          (i) =>
            `<a11y-menu-button id="Item ${i}">
          <p slot="heading">${utils.randomPhrase(1, 5)}</p>
          <div slot="content">${utils.randomParagraph(2, 7)}</div>
          </a11y-menu-button>`
        )
        .join(""),
    },
    [
      {
        css: "--a11y-menu-button-group-margin",
        title: "Collapse group's margin",
      },
      { css: "--a11y-menu-button-margin", title: "Collapse item's margin" },
    ]
  );
};
export const A11yCollapseStory = () => {
  return utils.makeElementFromClass(
    A11yCollapse,
    {
      heading: `<p>${utils.randomPhrase(1, 5)}</p>`,
      content: utils.randomParagraph(2, 7),
      icon: "add",
    },
    [
      { css: "--a11y-menu-button-margin" },
      { css: "--a11y-menu-button-border" },
      {
        css: "--a11y-menu-button-horizontal-padding",
        title: "default horizontal-padding",
      },
      { css: "--a11y-menu-button-padding-left" },
      { css: "--a11y-menu-button-padding-right" },
      {
        css: "--a11y-menu-button-vertical-padding",
        title: "default vertical-padding",
      },
      { css: "--a11y-menu-button-padding-top", title: "padding-top" },
      { css: "--a11y-menu-button-padding-bottom", title: "padding-bottom" },
      {
        css: "--a11y-menu-button-border-between",
        title: "vorder between heading and content",
      },
      { css: "--a11y-menu-button-heading-font-weight" },
      { css: "--a11y-menu-button-heading-color" },
      { css: "--a11y-menu-button-heading-background-color" },
      { css: "--a11y-menu-button-overflow-y" },
      { css: "--a11y-menu-button-max-height" },
    ]
  );
};
