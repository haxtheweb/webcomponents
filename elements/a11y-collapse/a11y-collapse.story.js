import { A11yCollapse } from "./a11y-collapse.js";
import { A11yCollapseGroup } from "./lib/a11y-collapse-group.js";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

window.StorybookUtilities.requestAvailability();

/**
 * add to the pattern library
 */
const A11yCollapsePattern = {
  of: "Pattern Library/Molecules/Layout",
  name: "Collapse",
  file: require("raw-loader!./demo/index.html"),
  replacements: []
};
const A11yCollapseGroupPattern = {
  of: "Pattern Library/Molecules/Layout",
  name: "Collapse Group",
  file: require("raw-loader!./demo/group.html"),
  replacements: []
};
window.StorybookUtilities.instance.addPattern(A11yCollapseGroupPattern);
window.StorybookUtilities.instance.addPattern(A11yCollapsePattern);

/**
 * add the live demo
 */
const A11yCollapseStory = {
  of: "Web Components/a11y-collapse",
  name: "a11y-collapse",
  props: A11yCollapse.properties,
  slots: {
    heading: { name: "heading", type: "String", value: `Click to expand me.` },
    content: {
      name: "content",
      type: "String",
      value: `Here are some details.`
    }
  },
  attr: ``,
  slotted: ``
};
const A11yCollapseGroupStory = {
  of: "Web Components/a11y-collapse",
  name: "a11y-collapse-group",
  props: A11yCollapseGroup.properties,
  slots: {
    slot: {
      name: "slot",
      type: "String",
      value: `
      <h2>Secondary Colors</h2>
      <a11y-collapse accordion>
        <p slot="heading">Purple</p>
        <div slot="content">Blue and red make purple.</div>
      </a11y-collapse>
      <a11y-collapse accordion>
        <p slot="heading">Green</p>
        <div slot="content">Blue and yellow make purple.</div>
      </a11y-collapse>
      <a11y-collapse accordion>
        <p slot="heading">Orange</p>
        <div slot="content">Yellow and red make purple.</div>
      </a11y-collapse>
    `
    }
  },
  attr: ``,
  slotted: ``
};
window.StorybookUtilities.instance.addLiveDemo(A11yCollapseStory);
window.StorybookUtilities.instance.addLiveDemo(A11yCollapseGroupStory);
