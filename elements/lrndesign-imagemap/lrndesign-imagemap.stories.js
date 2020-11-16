import { html } from "lit-element/lit-element.js";
import { LrndesignImagemap } from "@lrnwebcomponents/lrndesign-imagemap/lrndesign-imagemap.js";
import {
  text,
  withKnobs,
  withWebComponentsKnobs,
} from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

export default {
  title: "Media|Image Map",
  component: "lrndesign-imagemap",
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel", escapeHTML: false },
  },
};
const utils = new StorybookUtilities(),
  defaults = {
    id: "demo1",
    label: "Junk Food Calories",
    src: new URL("demo/images/fastfood.svg", import.meta.url),
  },
  fields = [
    {
      property: "id",
      title: "Unique ID",
      inputMethod: "textfield",
    },
    {
      property: "label",
      title: "Title",
      inputMethod: "textfield",
    },
    {
      property: "src",
      title: "SVG File",
      inputMethod: "haxupload",
    },
    {
      property: "parent",
      title: "Parent Heading ID",
      inputMethod: "textfield",
    },
    {
      slot: "",
      title: "hotspots",
      inputMethod: "code-editor",
    },
    {
      css: "--lrndesign-imagemap-popover-maxWidth",
      title: "maxWidth of Popover",
      inputMethod: "textfield",
    },
    {
      css: "--lrndesign-imagemap-popover-maxHeight",
      title: "maxHeight of Popover",
      inputMethod: "textfield",
    },
  ];

export const LrndesignImagemapStory = () => {
  let css = `
  /* edit these styles */
  #demo1 .hotspot { 
    fill: rgba(0,0,0,0.5); 
  }
    
  #demo1 .hotspot.focus,
  #demo1 .hotspot:hover {
    fill: rgba(0,255,255,0.25);
    outline: none;
  }

  #demo1 .hotspot.selected { 
    fill:transparent; 
  }
  `,
    styles = `<!-- Use knobs to styles -->\n<style>${text(
      "hotspot CSS",
      css,
      "style"
    )}</style>\n`,
    map = utils.makeElement(
      LrndesignImagemap,
      utils.getKnobs(fields, {
        ...defaults,
        emptyslot: `
      <div slot="desc">
      <p>A fast food meal with a double cheeseburger, large fries, and a 12-ounce cola.
        <span class="screen-only">Click on the hotspots to learn more.</span>
      </p>
    </div>
    <lrndesign-imagemap-hotspot hotspot-id="burger" position="left" label="Double Cheeseburger">
      The double cheeseburger is 459 calories.
    </lrndesign-imagemap-hotspot>
    <lrndesign-imagemap-hotspot hotspot-id="fries" label="Large French Fries">
      The large order of french fries is 480 calories.
    </lrndesign-imagemap-hotspot>
    <lrndesign-imagemap-hotspot hotspot-id="cola" label="12-Ounce Cola">
      The 12-ounce is 138 calories.
    </lrndesign-imagemap-hotspot>`,
      }),
      true
    ),
    demo = utils.getDemo(styles + map);
  return demo;
};
