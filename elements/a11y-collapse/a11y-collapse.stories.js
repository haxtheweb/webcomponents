import { html } from "lit-html";
import { A11yCollapseGroup } from "@haxtheweb/a11y-collapse/lib/a11y-collapse-group.js";
import { A11yCollapse } from "@haxtheweb/a11y-collapse/a11y-collapse.js";
import { withKnobs, text, boolean } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@haxtheweb/storybook-utilities/storybook-utilities.js";

export default {
  title: "Navigation|Collapse",
  component: "a11y-collapse-group",
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const A11yCollapseGroupStory = () => {
  let props = utils.getElementProperties(
    A11yCollapseGroup.properties,
    A11yCollapseGroup.haxProperties,
  );
  return utils.makeElementFromClass(
    A11yCollapseGroup,
    {
      id: "group",
      emptyslot: [1, 2, 3]
        .map(
          (i) =>
            `<a11y-collapse id="Item ${i}">
          <p slot="heading">${utils.randomPhrase(1, 5)}</p>
          <div slot="content">${utils.randomParagraph(2, 7)}</div>
          </a11y-collapse>`,
        )
        .join(""),
    },
    [
      { css: "--a11y-collapse-group-margin", title: "Collapse group's margin" },
      { css: "--a11y-collapse-margin", title: "Collapse item's margin" },
    ],
  );
};
export const a11yCollapse = () => {
  return utils.makeElementFromClass(
    A11yCollapse,
    {
      heading: `<p>${utils.randomPhrase(1, 5)}</p>`,
      content: utils.randomParagraph(2, 7),
      icon: "add",
    },
    [
      { css: "--a11y-collapse-margin" },
      { css: "--a11y-collapse-border" },
      {
        css: "--a11y-collapse-horizontal-padding",
        title: "default horizontal-padding",
      },
      { css: "--a11y-collapse-padding-left" },
      { css: "--a11y-collapse-padding-right" },
      {
        css: "--a11y-collapse-vertical-padding",
        title: "default vertical-padding",
      },
      { css: "--a11y-collapse-padding-top", title: "padding-top" },
      { css: "--a11y-collapse-padding-bottom", title: "padding-bottom" },
      {
        css: "--a11y-collapse-border-between",
        title: "vorder between heading and content",
      },
      { css: "--a11y-collapse-heading-font-weight" },
      { css: "--a11y-collapse-heading-color" },
      { css: "--a11y-collapse-heading-background-color" },
      { css: "--a11y-collapse-overflow-y" },
      { css: "--a11y-collapse-max-height" },
    ],
  );
};
