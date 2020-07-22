import { html } from "lit-element/lit-element.js";
import { WysiwygHax } from "@lrnwebcomponents/wysiwyg-hax/wysiwyg-hax.js";
import {
  withKnobs,
  withWebComponentsKnobs,
  text,
  boolean
} from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

export default {
  title: "Apps|HAX",
  component: "wysiwyg-hax",
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" }
  }
};
const utils = new StorybookUtilities();
export const HaxAsWysiwyg = () => {
  let html = `
    <h1>This is HAX</h1>
    <p>Click the <strong>Edit Content</strong> button to edit this page.</p>
    <h2>Accent Card</h2>
    <accent-card accent-color="red" accent-heading horizontal image-src="//placeimg.com/400/200">
      <div slot="heading">Accent Card</div>
      <div slot="subheading">A card with optional accent stylings.</div>
      <div slot="content">
        <p>
          This card is highly customizable. 
          There are a number of options for using <tt>accent-card</tt>. 
          See documentation for more info. 
        </p>
      </div>
    </accent-card>
    <h2>Video Player</h2>
    <a11y-media-player accent-color="yellow" dark>
      <iframe width="560" height="315" src="https://www.youtube.com/embed/NP0mQeLWCCo" allowfullscreen></iframe>
      <video><track label="English" kind="subtitles" srclang="en" src="./samples/bueller.vtt"default></video>
    </a11y-media-player>
`,
    hax = utils.makeElementFromClass(
      WysiwygHax,
      {
        fieldName: "content",
        fieldId: "content",
        openDefault: true,
        elementAlign: "right",
        syncBody: true,
        fieldClass: "coolClassName",
        appStoreConnection: `{\"url\": \"${new URL(
          `./demo/sample-store.json`,
          import.meta.url
        )}\"}`,
        emptyslot: `<template>${html}</template>`,
        "--hax-base-styles-h1-font-size": "160%",
        "--hax-base-styles-h2-font-size": "150%",
        "--hax-base-styles-h3-font-size": "140%",
        "--hax-base-styles-h4-font-size": "130%",
        "--hax-base-styles-h5-font-size": "120%",
        "--hax-base-styles-h6-font-size": "110%"
      },
      [
        { property: "appStoreConnection", title: "Path to app-store JSON" },
        { slot: "", title: "Editable HTML Content" },
        { property: "fieldId", title: "textarea  Element's id" },
        { property: "fieldName", title: "textarea  Element's name" },
        { property: "elementAlign", title: "Alignment of Hax-Tray" },
        { property: "offsetMargin", title: "Offset of Hax-Tray" },
        { property: "openDefault" },
        { property: "syncBody" },
        { css: "--hax-base-styles-h1-font-size" },
        { css: "--hax-base-styles-h2-font-size" },
        { css: "--hax-base-styles-h3-font-size" },
        { css: "--hax-base-styles-h4-font-size" },
        { css: "--hax-base-styles-h5-font-size" },
        { css: "--hax-base-styles-h6-font-size" }
      ],
      [],
      true
    );
  return utils.getDemo(
    `${hax}
<textarea id="content" name="content" hidden></textarea>`
  );
};
