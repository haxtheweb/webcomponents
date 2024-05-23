import { html } from "lit-html";
import { SimpleIconsetDemo } from "@haxtheweb/simple-icon/lib/simple-iconset-demo.js";
import { SimpleIconLite } from "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/hax-iconset/hax-iconset.js";
import { HaxIconsetManifest } from "@haxtheweb/hax-iconset/lib/hax-iconset-manifest.js";
import {
  withKnobs,
  select,
  number,
  boolean,
  text,
} from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@haxtheweb/storybook-utilities/storybook-utilities.js";

export default {
  title: "Media|Icons",
  component: "simple-icons",
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const HaxIconsetStory = () => {
  return utils.makeElementFromClass(
    SimpleIconsetDemo,
    { imports: [HaxIconsetManifest] },
    [],
    ["exclude", "include", "iconsets"],
  );
};
