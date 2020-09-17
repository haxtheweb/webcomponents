import { SimpleTooltip } from "./simple-tooltip.js";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

window.StorybookUtilities.requestAvailability();

const SimpleTooltipPattern = {
  of: "Pattern Library/Molecules/Tooltip",
  name: "Simple Tooltip",
  file: require("raw-loader!./demo/index.html"),
  replacements: [],
};
window.StorybookUtilities.instance.addPattern(SimpleTooltipPattern);

const SimpleTooltipStory = {
  of: "Web Components",
  name: "simple-tooltip",
  props: SimpleTooltip.properties,
  before: `<div id="tooltip">Look at my tooltip</div>`,
  slots: {
    slot: {
      name: "slot",
      type: "String",
      value: `This is a tooltip`,
    },
  },
  attr: ``,
  slotted: ``,
};
window.StorybookUtilities.instance.addLiveDemo(SimpleTooltipStory);
