import { ChartistRender } from "./chartist-render.js";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

window.StorybookUtilities.requestAvailability();
import * as chartistLib from "./lib/chartist/dist/chartist.min.js";

/**
 * add the live demo
 */
const props = ChartistRender.properties;
props.data.value = {
  labels: ["Bananas", "Apples", "Grapes"],
  series: [20, 15, 40]
};
props.chartTitle.value = `A pie chart of favorite foods`;
props.type.type = "select";
props.type.options = ["bar", "line", "pie"];
props.type.value = "pie";
props.scale.type = "select";
props.scale.options = [
  "ct-square",
  "ct-minor-second",
  "ct-major-second",
  "ct-minor-third",
  "ct-major-third",
  "ct-perfect-fourth",
  "ct-perfect-fifth",
  "ct-minor-sixth",
  "ct-golden-section",
  "ct-major-sixth",
  "ct-minor-seventh",
  "ct-major-seventh",
  "ct-octave",
  "ct-major-tenth",
  "ct-major-eleventh",
  "ct-major-twelfth",
  "ct-double-octave"
];
props.scale.value = "ct-major-twelfth";
const ChartistRenderStory = {
  of: "Web Components",
  name: "chartist-render",
  props: props,
  slots: {},
  attr: ` style="width: 100%; max-width: 500px;"`,
  slotted: ``
};
window.StorybookUtilities.instance.addLiveDemo(ChartistRenderStory);
