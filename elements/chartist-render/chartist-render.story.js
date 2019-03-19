import { ChartistRender } from './chartist-render.js';
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

window.StorybookUtilities.requestAvailability();

/**
 * add the live demo
 */
let props = ChartistRender.properties;
props.data.value = { 
  "labels": ["Bananas", "Apples", "Grapes"], 
  "series": [20, 15, 40]
};
props.chartTitle.value =`A pie chart of favorite foods`;
props.type.type = "select";
props.type.options = ["bar", "line", "pie"];
props.type.value = "pie";
props.scale.type = "select";
props.scale.options = [
  "ct-square",
  "ct-minor",
  "ct-major",
  "ct-minor",
  "ct-major",
  "ct-perfect",
  "ct-perfect",
  "ct-minor",
  "ct-golden",
  "ct-major",
  "ct-minor",
  "ct-major",
  "ct-octave",
  "ct-major",
  "ct-major",
  "ct-major",
  "ct-double"
];
props.scale.value = "ct-square";
const ChartistRenderStory = {
  "of": "chartist-render",
  "name": "chartist-render",
  "props":  props,
  "slots": {}, 
  "attr": ``,
  "slotted": ``
};
window.StorybookUtilities.instance.addLiveDemo(ChartistRenderStory);