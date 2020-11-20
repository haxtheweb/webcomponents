import { html } from "lit-element/lit-element.js";
import { SimpleIconsetDemo } from "@lrnwebcomponents/simple-icon/lib/simple-iconset-demo.js";
import { SimpleIcon } from "@lrnwebcomponents/simple-icon/simple-icon.js";
import { SimpleIconLite } from "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";
import { SimpleIconButton } from "@lrnwebcomponents/simple-icon/lib/simple-icon-button.js";
import { SimpleIconButtonLite } from "@lrnwebcomponents/simple-icon/lib/simple-icon-button-lite.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
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
  title: "Media|Icons",
  component: "simple-icons",
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities(),
  lite = [
    {
      property: "icon",
      inputMethod: "iconpicker",
    },
    {
      css: "--simple-icon-color",
      inputMethod: "text",
    },
    {
      css: "--simple-icon-width",
      inputMethod: "text",
    },
    {
      css: "--simple-icon-height",
      inputMethod: "text",
    },
  ],
  buttonlite = [
    {
      property: "autofocus",
      inputMethod: "boolean",
    },
    {
      property: "ariaLabelledby",
      inputMethod: "text",
    },
    {
      property: "controls",
      inputMethod: "text",
    },
    {
      property: "disabled",
      inputMethod: "boolean",
    },
    {
      property: "fieldName",
      inputMethod: "text",
    },
    {
      property: "form",
      inputMethod: "text",
    },
    {
      property: "label",
      inputMethod: "text",
    },
    {
      property: "type",
      inputMethod: "select",
      options: {
        button: "button",
        reset: "reset",
        submit: "submit",
      },
    },
    {
      property: "value",
      inputMethod: "text",
    },
    {
      property: "toggled",
      inputMethod: "boolean",
    },
    {
      property: "toggles",
      inputMethod: "boolean",
    },
    {
      css: "--simple-icon-button-padding",
      inputMethod: "text",
    },
    {
      css: "--simple-icon-button-focus-color",
      inputMethod: "text",
    },
    {
      css: "--simple-icon-button-toggled-color",
      inputMethod: "text",
    },
    {
      css: "--simple-icon-button-disabled-color",
      inputMethod: "text",
    },
    {
      css: "--simple-icon-button-opacity",
      inputMethod: "text",
    },
    {
      css: "--simple-icon-button-focus-opacity",
      inputMethod: "text",
    },
    {
      css: "--simple-icon-button-toggled-opacity",
      inputMethod: "text",
    },
    {
      css: "--simple-icon-button-disabled-opacity",
      inputMethod: "text",
    },
    {
      css: "--simple-icon-button-border",
      inputMethod: "text",
    },
    {
      css: "--simple-icon-button-focus-border",
      inputMethod: "text",
    },
    {
      css: "--simple-icon-button-toggled-border",
      inputMethod: "text",
    },
    {
      css: "--simple-icon-button-disabled-border",
      inputMethod: "text",
    },
    {
      css: "--simple-icon-button-background-color",
      inputMethod: "text",
    },
    {
      css: "--simple-icon-button-focus-background-color",
      inputMethod: "text",
    },
    {
      css: "--simple-icon-button-toggled-background-color",
      inputMethod: "text",
    },
    {
      css: "--simple-icon-button-disabled-background-color",
      inputMethod: "text",
    },
  ],
  props = [
    {
      property: "accentColor",
      inputMethod: "colorpicker",
    },
    {
      property: "contrast",
      inputMethod: "number",
      min: 0,
      max: 4,
    },
    {
      property: "dark",
      inputMethod: "boolean",
    },
    ...lite,
  ],
  buttonliteprops = [...lite, ...buttonlite],
  buttonprops = [...props, ...buttonlite],
  defaultslite = {
    icon: utils.randomIcon(),
  },
  defaults = {
    ...defaultslite,
    accentColor: utils.randomColor(),
    dark: false,
  };
export const SimpleIconsetStory = () => {
  return utils.getDemo(
    `<simple-iconset-demo></simple-iconset-demo>`,
    `<p>The following is a full list of simple-iconset:</p>`
  );
};

export const SimpleIconLiteStory = () => {
  return utils.makeElement(SimpleIconLite, utils.getKnobs(lite, defaultslite));
};

export const SimpleIconButtonLiteStory = () => {
  return utils.makeElement(
    SimpleIconButtonLite,
    utils.getKnobs(buttonliteprops, defaultslite)
  );
};

export const SimpleIconStory = () => {
  return utils.makeElement(SimpleIcon, utils.getKnobs(props, defaults));
};

export const SimpleIconButtonStory = () => {
  return utils.makeElement(
    SimpleIconButton,
    utils.getKnobs(buttonprops, defaults)
  );
};
