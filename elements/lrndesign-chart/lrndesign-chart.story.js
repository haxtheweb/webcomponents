import { LrndesignPie } from "./lib/lrndesign-pie.js";
import { LrndesignLine } from "./lib/lrndesign-line.js";
import { LrndesignBar } from "./lib/lrndesign-bar.js";
import * as BarCSV from "./demo/bar.csv";
import * as PieCSV from "./demo/pie.csv";
import * as LineCSV from "./demo/line.csv";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

window.StorybookUtilities.requestAvailability();
/**
 * add to the pattern library
 */
const LrndesignPiePattern = {
  "of": "Pattern Library/Atoms/Media", 
  "name": 'Pie Chart',
  "file": require("raw-loader!./demo/pie.html"),
  "replacements": [
    {"find": "pie.csv", "replace": PieCSV }
  ]
}
const LrndesignBarPattern = {
  "of": "Pattern Library/Atoms/Media", 
  "name": 'Bar Chart',
  "file": require("raw-loader!./demo/bar.html"),
  "replacements": [
    {"find": "bar.csv", "replace": BarCSV }
  ]
}
const LrndesignLinePattern = {
  "of": "Pattern Library/Atoms/Media", 
  "name": 'Line Chart',
  "file": require("raw-loader!./demo/line.html"),
  "replacements": [
    {"find": "bar.csv", "replace": LineCSV }
  ]
}
window.StorybookUtilities.instance.addPattern(LrndesignBarPattern);
window.StorybookUtilities.instance.addPattern(LrndesignPiePattern);
window.StorybookUtilities.instance.addPattern(LrndesignLinePattern);

/**
 * add the live demo
 */
const colorProps = window.StorybookUtilities.instance.getSimpleColors(null), 
  pieProps = Object.assign( props, LrndesignPie.properties ), 
  barProps = Object.assign( props, LrndesignBar.properties ),
  lineProps = Object.assign( props, LrndesignLine.properties );
const LrndesignPieStory = {
  "of": "lrndesign-chart",
  "name": "lrndesign-pie",
  "props":  pieProps,
  "slots": {}, 
  "attr": ``,
  "slotted": ``
};
const LrndesignBarStory = {
  "of": "lrndesign-chart",
  "name": "lrndesign-bar",
  "props":  barProps,
  "slots": {}, 
  "attr": ``,
  "slotted": ``
};
const LrndesignLineStory = {
  "of": "lrndesign-chart",
  "name": "lrndesign-line",
  "props":  lineProps,
  "slots": {}, 
  "attr": ``,
  "slotted": ``
};
window.StorybookUtilities.instance.addLiveDemo(LrndesignPieStory);
window.StorybookUtilities.instance.addLiveDemo(LrndesignBarStory);
window.StorybookUtilities.instance.addLiveDemo(LrndesignLineStory);