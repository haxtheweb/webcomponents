import { html } from "lit-html";
import { AccentCard } from "@haxtheweb/accent-card/accent-card.js";
import { withKnobs } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@haxtheweb/storybook-utilities/storybook-utilities.js";

export default {
  title: "Cards|Accent card",
  component: "accent-card",
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const AccentCardStory = () => {
  let defaultData = utils.randomOption([
    {
      accentColor: "red",
      dark: true,
      horizontal: true,
      imageSrc: new URL(`demo/images/image1.jpg`, import.meta.url),
    },
    {
      accentColor: "red",
      accentHeading: true,
      imageSrc: new URL(`demo/images/image5.jpg`, import.meta.url),
    },
    {
      accentColor: "pink",
      dark: true,
      horizontal: true,
      imageValign: "top",
      imageSrc: new URL(`demo/images/image3.jpg`, import.meta.url),
    },
    {
      accentColor: "light-blue",
      imageSrc: new URL(`demo/images/image6.jpg`, import.meta.url),
    },
    {
      accentColor: "green",
      horizontal: true,
      imageSrc: new URL(`demo/images/image7.jpg`, import.meta.url),
    },
  ]);
  return utils.makeElementFromClass(
    AccentCard,
    {
      ...defaultData,
      heading: utils.randomPhrase(1, 5, true, utils.randomBool()),
      content: utils.randomParagraph(2, 7),
      maxWidth: "600px",
    },
    [
      { css: "--accent-card-image-width", title: "Width of horizontal image" },
      { css: "--accent-card-image-height", title: "Height of vertical image" },
      { css: "--accent-card-padding", title: "Default padding unit" },
      {
        css: "--accent-card-footer-border-color",
        title: "Footer border color",
      },
      { css: "--accent-card-box-shadow", title: "Card box-shadow" },
      { css: "--accent-card-padding-top", title: "Card padding-top " },
      { css: "--accent-card-padding-left", title: "Card padding-left" },
      { css: "--accent-card-padding-right", title: "Card padding-right" },
      { css: "--accent-card-padding-bottom", title: "Card padding-bottom" },
      {
        css: "--accent-card-heading-padding-top",
        title: "Heading padding-top",
      },
      {
        css: "--accent-card-heading-padding-left",
        title: "Heading padding-left",
      },
      {
        css: "--accent-card-heading-padding-right",
        title: "Heading padding-right",
      },
      {
        css: "--accent-card-heading-padding-bottom",
        title: "Heading padding-bottom",
      },
      {
        css: "--accent-card-subheading-padding-top",
        title: "Subeading padding-top",
      },
      {
        css: "--accent-card-subheading-padding-left",
        title: "Subeading padding-left",
      },
      {
        css: "--accent-card-subheading-padding-right",
        title: "Subeading padding-right",
      },
      {
        css: "--accent-card-subheading-padding-bottom",
        title: "Subeading padding-bottom",
      },
      {
        css: "--accent-card-content-padding-top",
        title: "Content padding-top",
      },
      {
        css: "--accent-card-content-padding-left",
        title: "Content padding-left",
      },
      {
        css: "--accent-card-content-padding-right",
        title: "Content padding-right",
      },
      {
        css: "--accent-card-content-padding-bottom",
        title: "Content padding-bottom",
      },
      { css: "--accent-card-footer-padding-top", title: "Footer padding-top" },
      {
        css: "--accent-card-footer-padding-left",
        title: "Footer padding-left",
      },
      {
        css: "--accent-card-footer-padding-right",
        title: "Footer padding-right",
      },
      {
        css: "--accent-card-footer-padding-bottom",
        title: "Footer padding-bottom",
      },
      { css: "--accent-card-color", title: "Card text color" },
      { css: "--accent-card-background-color", title: "Card background color" },
      { css: "--accent-card-border-color", title: "Card background color" },
      { css: "--accent-card-border-color", title: "Card heading text color" },
      { css: "width" },
      { css: "maxWidth" },
    ],
  );
};
export const AccentCardHaxStory = () =>
  utils.makeUsageDocs(
    AccentCard,
    import.meta.url,
    utils.makeElementFromHaxDemo(AccentCard),
  );
