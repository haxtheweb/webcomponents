import { html } from "lit-element/lit-element.js";
import "@polymer/iron-icon/iron-icon.js";
import "@lrnwebcomponents/hax-iconset/hax-iconset.js";
import {
  withKnobs,
  withWebComponentsKnobs,
  select,
  text,
} from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

export default {
  title: "Media|Icons",
  component: "hax-iconset",
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const HaxIconsetStory = () => {
  return utils.getDemo(
    `<iconset-demo include-sets="hax"></iconset-demo>`,
    `<p>The following is a full list of hax-iconset's icons.</p>`
  );
};

export const HaxIconsetDemo = () => {
  let iconset = document.createElement("iconset-demo");
  iconset.includeSets = "hax";
  iconset.hidden = "hidden";
  document.body.appendChild(iconset);

  let icons =
      iconset && iconset.__iconList
        ? iconset.__iconList
        : [{ name: "icons", icons: ["star", "check", "history"] }],
    iconlist =
      icons && icons[0] ? icons[0].icons : ["star", "check", "history"];
  return utils.getDemo(
    `<iron-icon 
      icon="${select(
        "icon",
        iconlist,
        utils.getRandomOption(iconlist),
        "Properties"
      )}"
      style="display:inline-block;width:${text(
        "width",
        "",
        "CSS"
      )};height:${text("height", "", "CSS")};">
    </iron-icon>`,
    `<p>The following is a demo of how to use a hax-iconset icon.</p>`
  );
};
