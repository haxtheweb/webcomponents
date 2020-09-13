import { html } from "lit-element/lit-element.js";
import { HAX } from "@lrnwebcomponents/h-a-x/h-a-x.js";
import {
  withKnobs,
  withWebComponentsKnobs,
  text,
  boolean,
} from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

export default {
  title: "Apps|HAX",
  component: "h-a-x",
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const Hax = () => {
  let html = `
    <h1>HAX the Web!</h1>
    <stop-note accent-color="yellow" icon="icons:error" title="This page is editable!">
      <p slot="message">Click the <strong>Edit Content</strong> button to edit this page.</p>
    </stop-note>
    <parallax-image 
      image-bg="//placeimg.com/1600/900/tech">
      <p slot="parallax_heading">A block editor made of web components!</p>
    </parallax-image>
    <h2>About HAX</h2>
    <p>
      HAX is a decoupled authoring experience built using web components. 
      Web components is a standard way of developers creating new HTML tags. 
      It's a layer below traditional libraries and frameworks that gives us 
      low-level property and tag capabilities that have standard life-cycles.
    </p>
    <p>
      This means that developers can fundamentally change the way HTML operates 
      while expressing it in a highly semantic tag structure.
    </p>
    <h2>Accent Card</h2>
    <accent-card accent-color="red" horizontal image-src="//placeimg.com/400/200">
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
    <lrndesign-gallery 
      id="gallery1a" 
      accent-color="blue">
      <h1 slot="title">Carousel</h1>
      <div slot="description">This is an <strong>carousel</strong> of images.</div>
      <figure>
        <img src="//placeimg.com/400/200/people" alt="Random People Picture">
        <figcaption>
          <h3>People</h3>
          <p>This gallery item is a random people picture.</p>
        </figcaption>
      </figure>
      <figure>
        <img src="//placeimg.com/400/200/animals" alt="Random Animal Picture">
        <figcaption>
          <h3>Animal</h3>
          <p>This gallery item is a random animal picture.</p>
        </figcaption>
      </figure>
      <figure>
        <img src="//placeimg.com/400/200/nature" alt="Random Nature Picture">
        <figcaption>
          <h3>Nature</h3>
          <p>This gallery item is a random nature picture.</p>
        </figcaption>
      </figure>
      <figure>
        <img src="//placeimg.com/400/200/tech" alt="Random Tech Picture">
        <figcaption>
          <h3>Tech</h3>
          <p>This gallery item is a random tech picture.</p>
        </figcaption>
      </figure>
    </lrndesign-gallery>
`,
    hax = utils.makeElementFromClass(
      HAX,
      {
        elementAlign: "right",
        offsetMargin: "45px 0px 0px 0px",
        appStore: `{\"url\": \"${new URL(
          `./demo/appstore.json`,
          import.meta.url
        )}\"}`,
        emptyslot: html,
        "--hax-base-styles-h1-font-size": "160%",
        "--hax-base-styles-h2-font-size": "150%",
        "--hax-base-styles-h3-font-size": "140%",
        "--hax-base-styles-h4-font-size": "130%",
        "--hax-base-styles-h5-font-size": "120%",
        "--hax-base-styles-h6-font-size": "110%",
      },
      [
        { property: "elementAlign", title: "Alignment of Hax-Tray" },
        { property: "offsetMargin", title: "Offset of Hax-Tray" },
        { property: "appStore", title: "Path to app-store JSON" },
        { slot: "", title: "Editable HTML Content" },
        { css: "--hax-base-styles-h1-font-size" },
        { css: "--hax-base-styles-h2-font-size" },
        { css: "--hax-base-styles-h3-font-size" },
        { css: "--hax-base-styles-h4-font-size" },
        { css: "--hax-base-styles-h5-font-size" },
        { css: "--hax-base-styles-h6-font-size" },
      ],
      [],
      true
    );
  return utils.getDemo(`<div style="max-width:1000px;margin:0 auto;">
  ${hax}
</div>`);
};
