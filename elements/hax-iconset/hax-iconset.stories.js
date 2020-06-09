import { html } from "lit-element/lit-element.js";
import "@polymer/iron-icon/iron-icon.js";
import "@lrnwebcomponents/hax-iconset/hax-iconset.js";
import {
  withKnobs,
  withWebComponentsKnobs,
  select
} from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

export default {
  title: "Icons|Hax",
  component: "hax-iconset",
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" }
  }
};
const utils = new StorybookUtilities();
export const HaxIconsetStory = () => {
  let iconset = document.createElement("iconset-demo");
  iconset.includeSets = "hax";
  return iconset;
};
export const HaxIconsetDemo = () => {
  let iconset = document.createElement("iconset-demo");
  iconset.includeSets = "hax";
  iconset.hidden = "hidden";
  document.body.appendChild(iconset);
  let list = iconset && iconset.__iconList ? iconset.__iconList : [{name: "icons", icons: ["star", "check", "history"]}],
    icons = list[0].icons,
    knob = select("icon",icons,utils.getRandomOption(icons),"Properties"),
    icon = document.createElement('iron-icon');
    icon.setAttribute("icon",knob);
  return icon;
};