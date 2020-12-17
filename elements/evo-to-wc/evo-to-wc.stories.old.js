import { html } from "lit-element/lit-element.js";
import { EvoToWcGroup } from "@lrnwebcomponents/evo-to-wc/lib/evo-to-wc-group.js";
import { EvoToWc } from "@lrnwebcomponents/evo-to-wc/evo-to-wc.js";
import {
  withKnobs,
  withWebComponentsKnobs,
  text,
  boolean,
} from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

export default {
  title: "Navigation|Collapse",
  component: "evo-to-wc-group",
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const EvoToWcGroupStory = () => {
  let props = utils.getElementProperties(
    EvoToWcGroup.properties,
    EvoToWcGroup.haxProperties
  );
  return utils.makeElementFromClass(
    EvoToWcGroup,
    {
      id: "group",
      emptyslot: [1, 2, 3]
        .map(
          (i) =>
            `<evo-to-wc id="Item ${i}">
          <p slot="heading">${utils.randomPhrase(1, 5)}</p>
          <div slot="content">${utils.randomParagraph(2, 7)}</div>
          </evo-to-wc>`
        )
        .join(""),
    },
    [
      {
        css: "--evo-to-wc-group-margin",
        title: "Collapse group's margin",
      },
      { css: "--evo-to-wc-margin", title: "Collapse item's margin" },
    ]
  );
};
export const EvoToWcStory = () => {
  return utils.makeElementFromClass(
    EvoToWc,
    {
      heading: `<p>${utils.randomPhrase(1, 5)}</p>`,
      content: utils.randomParagraph(2, 7),
      icon: "add",
    },
    [
      { css: "--evo-to-wc-margin" },
      { css: "--evo-to-wc-border" },
      {
        css: "--evo-to-wc-horizontal-padding",
        title: "default horizontal-padding",
      },
      { css: "--evo-to-wc-padding-left" },
      { css: "--evo-to-wc-padding-right" },
      {
        css: "--evo-to-wc-vertical-padding",
        title: "default vertical-padding",
      },
      { css: "--evo-to-wc-padding-top", title: "padding-top" },
      { css: "--evo-to-wc-padding-bottom", title: "padding-bottom" },
      {
        css: "--evo-to-wc-border-between",
        title: "vorder between heading and content",
      },
      { css: "--evo-to-wc-heading-font-weight" },
      { css: "--evo-to-wc-heading-color" },
      { css: "--evo-to-wc-heading-background-color" },
      { css: "--evo-to-wc-overflow-y" },
      { css: "--evo-to-wc-max-height" },
    ]
  );
};
