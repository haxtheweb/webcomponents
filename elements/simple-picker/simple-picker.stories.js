import { html } from "lit-element/lit-element.js";
import { SimplePicker } from "@lrnwebcomponents/simple-picker/simple-picker.js";
import { SimpleSymbolPicker } from "@lrnwebcomponents/simple-picker/lib/simple-symbol-picker.js";
import { SimpleEmojiPicker } from "@lrnwebcomponents/simple-picker/lib/simple-emoji-picker.js";
import { withKnobs, withWebComponentsKnobs } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

export default {
  title: "Forms|Picker",
  component: "simple-picker",
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};

const utils = new StorybookUtilities();
const css = [
  {
    css: "--simple-picker-display",
    title: "default display for simple-picker",
  },
  { css: "--simple-picker-font-family", title: "Main font-family" },
  { css: "--simple-picker-font-size", title: "Main font-size" },
  { css: "--simple-picker-color", title: "Main text color" },
  {
    css: "--simple-picker-color-active",
    title: "Color of sample text when button is focused within or hovered",
  },
  { css: "--simple-picker-color-disabled", title: "Disabled text color" },
  {
    css: "--simple-picker-background-color",
    title: "Background color for button",
  },
  {
    css: "--simple-picker-background-color-disabled",
    title: "Background color for button when picker is disabled",
  },
  { css: "--simple-picker-border-radius", title: "Main border-radius" },
  { css: "--simple-picker-border-width", title: "Default border width" },
  { css: "--simple-picker-border-style", title: "Default border style" },
  { css: "--simple-picker-border-color", title: "Default border color" },
  {
    css: "--simple-picker-focus-border-width",
    title: "Border width when focused within or hovered",
  },
  {
    css: "--simple-picker-focus-border-style",
    title: "Border style when focused within or hovered",
  },
  {
    css: "--simple-picker-focus-border-color",
    title: "Border color when focused within or hovered",
  },
  {
    css: "--simple-picker-listbox-border-width",
    title: "Border width of listbox",
  },
  {
    css: "--simple-picker-listbox-border-style",
    title: "Border style of listbox",
  },
  {
    css: "--simple-picker-listbox-border-color",
    title: "Border color of listbox",
  },
  { css: "--simple-picker-label-color", title: "Label text color" },
  {
    css: "--simple-picker-float-label-color",
    title: "Floating label text color",
  },
  {
    css: "--simple-picker-float-label-active-color",
    title: "Floating label text color when picker is focused or hovered",
  },
  {
    css: "--simple-picker-icon-transform",
    title: "Rotation of arrow icon by default",
  },
  {
    css: "--simple-picker-expanded-icon-transform",
    title: "Rotation of arrow icon when picker is expanded",
  },
  {
    css: "--simple-picker-sample-color",
    title: "Sample option text color",
  },
  { css: "--simple-picker-sample-padding", title: "Sample option padding" },
  {
    css: "--simple-picker-sample-background-color",
    title: "Sample option background-color",
  },
  { css: "--simple-picker-option-size", title: "Height of option" },
  {
    css: "--simple-picker-option-selected-background-color",
    title: "Outline for currently sselected option",
  },
  {
    css: "--simple-picker-option-active-background-color",
    title: "Outline for currently active option",
  },
  {
    css: "--simple-picker-option-padding",
    title: "padding within each simple picker option",
  },
  {
    css: "--simple-picker-option-label-padding",
    title: "adding within each simple picker option's label",
  },
  {
    css: "--simple-picker-options-max-height",
    title:
      "Maximum amount of space listbox can use before scrolling. Use `unset` for now vertical scroll",
  },
  {
    css: "--simple-picker-options-border-width",
    title: "Border width of listbox",
  },
  {
    css: "--simple-picker-options-border-style",
    title: "Border style of listbox",
  },
  {
    css: "--simple-picker-options-border-color",
    title: "Border color of listbox",
  },
  {
    css: "--simple-picker-options-background-color",
    title: "Background color for listbox",
  },
];
export const SimplePickerStory = () => {
  return utils.makeElementFromClass(
    SimplePicker,
    {
      label: "Pick a font-family",
      options: [
        [{ alt: "-- none --", value: null }],
        [
          {
            alt: "sans-serif",
            style: "font-family: sans-serif",
            value: "sans-serif",
          },
        ],
        [{ alt: "serif", style: "font-family: serif", value: "serif" }],
        [
          {
            alt: "monospace",
            selected: true,
            style: "font-family: monospace",
            value: "monospace",
          },
        ],
        [{ alt: "cursive", style: "font-family: cursive", value: "cursive" }],
      ],
    },
    css,
    []
  );
};
export const SimpleSymbolPickerStory = () => {
  let props = utils.getElementProperties(SimpleSymbolPicker.properties);
  props.forEach((prop) => {
    if (prop.property === "symbolTypes") {
      prop.inputMethod = "select";
      prop.itemsList = ["symbols", "math", "characters", "greek", "misc"];
    }
  });
  return utils.makeElement(
    SimpleSymbolPicker,
    utils.getKnobs([...props, ...css], {
      label: "Pick a symbol",
      symbolTypes: utils.randomOption([
        "symbols",
        "math",
        "characters",
        "greek",
        "misc",
      ]),
    })
  );
};
export const SimpleEmojiPickerStory = () => {
  let props = utils.getElementProperties(SimpleSymbolPicker.properties);
  props.forEach((prop) => {
    if (prop.property === "emojiTypes") {
      prop.inputMethod = "select";
      prop.itemsList = [
        "emotions",
        "people",
        "nature",
        "food",
        "travel",
        "activities",
        "objects",
        "symbols",
        "flags",
      ];
    }
  });
  return utils.makeElement(
    SimpleEmojiPicker,
    utils.getKnobs([...props, ...css], {
      label: "Pick an emoji",
      emojiTypes: utils.randomOption([
        "emotions",
        "people",
        "nature",
        "food",
        "travel",
        "activities",
        "objects",
        "symbols",
        "flags",
      ]),
    })
  );
};
