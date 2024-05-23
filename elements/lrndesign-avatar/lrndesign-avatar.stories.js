import { html } from "lit-html";
import { LrndesignAvatar } from "@haxtheweb/lrndesign-avatar/lrndesign-avatar.js";
import * as md5 from "@haxtheweb/paper-avatar/lib/md5.min.js";
//import * as jdenticon from "@haxtheweb/paper-avatar/lib/jdenticon-1.4.0.min.js";
import { withKnobs, text, boolean } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@haxtheweb/storybook-utilities/storybook-utilities.js";

export default {
  title: "Media|Avatar",
  component: "lrndesign-avatar",
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel", escapeHTML: false },
  },
};
const utils = new StorybookUtilities();
export const LrndesignAvatarStory = () => {
  return utils.makeElementFromClass(
    LrndesignAvatar,
    {
      label: "Your Name Here",
    },
    [
      {
        css: "--lrndesign-avatar-width",
        title: "Size",
        inputMethod: "textfield",
      },
    ],
  );
};
