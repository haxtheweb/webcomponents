import { html } from "lit-element/lit-element.js";
import { LrndesignPaperstack } from "@lrnwebcomponents/lrndesign-paperstack/lrndesign-paperstack.js";
import {
  withKnobs,
  withWebComponentsKnobs,
  select,
  number,
  boolean,
  text,
} from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

export default {
  title: "Layout|Callouts",
  component: "lrndesign-paperstack",
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();

export const LrndesignPaperstackStory = () => {
  let props = utils.getElementProperties(
    LrndesignPaperstack.properties,
    LrndesignPaperstack.haxProperties
  );
  return utils.makeElementFromClass(
    LrndesignPaperstack,
    {
      icon: utils.randomIcon(),
      accentColor: utils.randomColor(),
      dark: utils.randomBool(),
      title: utils.randomSentence(1, 5),
      emptyslot: utils.randomParagraph(3, 7),
    },
    [
      { css: "--lrndesign-paperstack-font-family", title: "Font Family" },
      { css: "--lrndesign-paperstack-font-size", title: "Font Size" },
      {
        css: "--lrndesign-paperstack-heading-font-family",
        title: "Heading Font Family",
      },
      {
        css: "--lrndesign-paperstack-heading-font-size",
        title: "Heading Font Size",
      },
      { css: "--lrndesign-paperstack-icon-size", title: "Icon Size" },
      { css: "-lrndesign-paperstack-icon-padding", title: "Icon Padding" },
      { css: "--lrndesign-paperstack-accent", title: "Override Accent Color" },
      { css: "--lrndesign-paperstack-border", title: "Override Border Color" },
      {
        css: "--lrndesign-paperstack-bg",
        title: "Override Background Color for Front Page",
      },
      {
        css: "--lrndesign-paperstack-faded-bg",
        title: "Override Background Color for Pages",
      },
      {
        css: "--lrndesign-paperstack-shadow",
        title: "Override Box Shadow Color",
      },
      { slot: "", title: "Content" },
    ]
  );
};
