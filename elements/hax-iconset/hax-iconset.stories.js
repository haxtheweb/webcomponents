import { html } from "lit-element/lit-element.js";
import { SimpleIconsetDemo } from "@lrnwebcomponents/simple-icon/lib/simple-iconset-demo.js";
import { SimpleIconLite } from "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/hax-iconset/hax-iconset.js";
import { HaxIconsetManifest } from "@lrnwebcomponents/hax-iconset/lib/hax-iconset-manifest.js";
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
  json = new URL("./lib/iconsets.json", import.meta.url),
  href = json && json.href ? json.href : "";
export const HaxIconsetStory = () => {
  return html`<simple-iconset-demo
    .imports=${[HaxIconsetManifest]}
  ></simple-iconset-demo>`;
};
