import { html } from "lit-element/lit-element.js";
import { AccentCard } from "@lrnwebcomponents/accent-card/accent-card.js";
import { withKnobs, withWebComponentsKnobs } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

export default {
  title: "Card|Accent Card",
  component: "accent-card",
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" }
  }
};

export const AccentCardStory = () => {
  const utils = new StorybookUtilities();
  return utils.makeElementFromClass(AccentCard, {
    heading: utils.getRandomText(),
    content: utils.getRandomTextarea(),
    color: utils.getRandomColor(),
    imageSrc: utils.getRandomImage(),
    maxWidth: "600px"
  },[],[
    {
      css: "--accent-card-image-width",
      title: "Width of horizontal image",
      inputMethod: "textfield"
    },
    {
      css: "--accent-card-image-height",
      title: "Height of vertical image",
      inputMethod: "textfield"
    },
    {
      css: "--accent-card-padding",
      title: "Default padding unit",
      inputMethod: "textfield"
    },
    {
      css: "--accent-card-footer-border-color",
      title: "Footer border color",
      inputMethod: "textfield"
    },
    {
      css: "--accent-card-box-shadow",
      title: "Card box-shadow",
      inputMethod: "textfield"
    },
    {
      css: "--accent-card-padding-top",
      title: "Card padding-top ",
      inputMethod: "textfield"
    },
    {
      css: "--accent-card-padding-left",
      title: "Card padding-left",
      inputMethod: "textfield"
    },
    {
      css: "--accent-card-padding-right",
      title: "Card padding-right",
      inputMethod: "textfield"
    },
    {
      css: "--accent-card-padding-bottom",
      title: "Card padding-bottom",
      inputMethod: "textfield"
    },
    {
      css: "--accent-card-heading-padding-top",
      title: "Heading padding-top",
      inputMethod: "textfield"
    },
    {
      css: "--accent-card-heading-padding-left",
      title: "Heading padding-left",
      inputMethod: "textfield"
    },
    {
      css: "--accent-card-heading-padding-right",
      title: "Heading padding-right",
      inputMethod: "textfield"
    },
    {
      css: "--accent-card-heading-padding-bottom",
      title: "Heading padding-bottom",
      inputMethod: "textfield"
    },
    {
      css: "--accent-card-subheading-padding-top",
      title: "Subeading padding-top",
      inputMethod: "textfield"
    },
    {
      css: "--accent-card-subheading-padding-left",
      title: "Subeading padding-left",
      inputMethod: "textfield"
    },
    {
      css: "--accent-card-subheading-padding-right",
      title: "Subeading padding-right",
      inputMethod: "textfield"
    },
    {
      css: "--accent-card-subheading-padding-bottom",
      title: "Subeading padding-bottom",
      inputMethod: "textfield"
    },
    {
      css: "--accent-card-content-padding-top",
      title: "Content padding-top",
      inputMethod: "textfield"
    },
    {
      css: "--accent-card-content-padding-left",
      title: "Content padding-left",
      inputMethod: "textfield"
    },
    {
      css: "--accent-card-content-padding-right",
      title: "Content padding-right",
      inputMethod: "textfield"
    },
    {
      css: "--accent-card-content-padding-bottom",
      title: "Content padding-bottom",
      inputMethod: "textfield"
    },
    {
      css: "--accent-card-footer-padding-top",
      title: "Footer padding-top",
      inputMethod: "textfield"
    },
    {
      css: "--accent-card-footer-padding-left",
      title: "Footer padding-left",
      inputMethod: "textfield"
    },
    {
      css: "--accent-card-footer-padding-right",
      title: "Footer padding-right",
      inputMethod: "textfield"
    },
    {
      css: "--accent-card-footer-padding-bottom",
      title: "Footer padding-bottom",
      inputMethod: "textfield"
    },
    {
      css: "--accent-card-color",
      title: "Card text color",
      inputMethod: "textfield"
    },
    {
      css: "--accent-card-background-color",
      title: "Card background color",
      inputMethod: "textfield"
    },
    {
      css: "--accent-card-border-color",
      title: "Card background color",
      inputMethod: "textfield"
    },
    {
      css: "--accent-card-border-color",
      title: "Card heading text color",
      inputMethod: "textfield"
    },
    {
      css: "width",
      inputMethod: "textfield"
    },
    {
      css: "maxWidth",
      inputMethod: "textfield"
    }
  ]);
};
