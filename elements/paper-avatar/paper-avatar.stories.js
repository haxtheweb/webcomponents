import { html } from "lit-element/lit-element.js";
import { PaperAvatar } from "@lrnwebcomponents/paper-avatar/paper-avatar.js";
import * as md5 from "@lrnwebcomponents/paper-avatar/lib/md5.min.js";
import {
  withKnobs,
  withWebComponentsKnobs,
  text,
  boolean
} from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

export default {
  title: "Media|Avatar",
  component: "paper-avatar",
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel", escapeHTML: false }
  }
};
const utils = new StorybookUtilities();
export const PaperAvatarStory = () => {
  let props = [
      {
        property: "icon",
        title: "Icon",
        inputMethod: "iconpicker"
      },
      {
        property: "src",
        title: "Image Source",
        inputMethod: "haxupload"
      },
      {
        property: "label",
        title: "Label for initials for jdenticon",
        inputMethod: "textfield"
      },
      {
        property: "twoChars",
        title: "Two-character initials",
        inputMethod: "boolean"
      },
      {
        property: "colors",
        title: "Array of possible background colors",
        inputMethod: "array"
      },
      {
        property: "jdenticon",
        title: "Unique icon design based on label",
        inputMethod: "boolean"
      },
      {
        css: "--paper-avatar-width",
        title: "Size",
        inputMethod: "textfield"
      },
      {
        css: "--paper-avatar-text-color",
        title: "Text Color",
        inputMethod: "textfield"
      },
      {
        css: "--paper-avatar-color",
        title: "Background Color",
        inputMethod: "textfield"
      }
    ],
    knobs = utils.getKnobs(props, {
      label: "Your Name Here",
      colors: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(color => utils.getRandomHex())
    }),
    avatar = utils.makeElement("paper-avatar", knobs);
  return avatar;
};
