import { html } from "lit-html";
import { withKnobs, text, boolean } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@haxtheweb/storybook-utilities/storybook-utilities.js";
import { EnhancedText } from "./enhanced-text.js";
// need to account for polymer goofiness when webpack rolls this up

export default {
  title: "Microservices|Micro-frontend: Text",
  component: "enhanced-text",
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const haxCmsGlossary = () => {
  return utils.makeElementFromClass(EnhancedText, {
    emptyslot:
      "<p>Cool bill paragraph, with design in the title somewhere in which you know I drank a lot of coffee in order to get here.</p>",
    wikipedia: 1,
    "haxcms-site-location": "https://oer.hax.psu.edu/bto108/sites/edtechjoker/",
    "haxcms-glossary": 1,
    auto: 1,
    "haxcms-mark-all": 1,
  });
};

export const VideText = () => {
  return utils.makeElementFromClass(EnhancedText, {
    emptyslot:
      "This is a whole bunch of text to apply the 'vide' approach which is based on 'bionic reading', a way of highlighting text in order to enhance reading.",
    auto: 1,
    vide: 1,
  });
};
