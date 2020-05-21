import { html } from "lit-element/lit-element.js";
import { LrndesignAvatar } from "@lrnwebcomponents/lrndesign-avatar/lrndesign-avatar.js";
import * as md5 from "@lrnwebcomponents/paper-avatar/lib/md5.min.js";
//import * as jdenticon from "@lrnwebcomponents/paper-avatar/lib/jdenticon-1.4.0.min.js";
import {
  withKnobs,
  withWebComponentsKnobs,
  text,
  boolean
} from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

export default {
  title: "Media|Avatar",
  component: "lrndesign-avatar",
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel", escapeHTML: false }
  }
};
const utils = new StorybookUtilities();
export const LrndesignAvatarStory = () => {
  return utils.makeElementFromClass(
    LrndesignAvatar,
    {
      label: "Your Name Here"
    },
    [
      {
        css: "--lrndesign-avatar-width",
        title: "Size",
        inputMethod: "textfield"
      }
    ]
  );
};
