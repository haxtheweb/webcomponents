import { LrndesignPie } from "./lib/lrndesign-pie.js";
import { LrndesignLine } from "./lib/lrndesign-line.js";
import { LrndesignBar } from "./lib/lrndesign-bar.js";
import { LrndesignChartBehaviors } from "./lib/lrndesign-chart-behaviors.js";
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
    {"find": "line.csv", "replace": LineCSV }
  ]
}
window.StorybookUtilities.instance.addPattern(LrndesignBarPattern);
window.StorybookUtilities.instance.addPattern(LrndesignPiePattern);
window.StorybookUtilities.instance.addPattern(LrndesignLinePattern);

/**
 * add the live demo
 */
let getAllKnobs = (props,csv)=>{
  let allKnobs = Object.assign( 
    window.StorybookUtilities.instance.getSimpleColors(''),  
    LrndesignChartBehaviors.properties, 
    props 
  );
  allKnobs.dataSource.value = csv;
  allKnobs.scale.type = "select";
  allKnobs.scale.value = "ct-major-twelfth";
  allKnobs.scale.options = [
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
  ]
  delete allKnobs.rawData;
  return allKnobs;
}
const pieProps = getAllKnobs( LrndesignPie.properties, PieCSV ), 
  barProps =  getAllKnobs( LrndesignBar.properties, BarCSV ),
  lineProps =  getAllKnobs( LrndesignLine.properties, LineCSV );
const LrndesignPieStory = {
  "of": "Web Components/lrndesign-chart",
  "name": "lrndesign-pie",
  "props":  pieProps,
  "slots": {}, 
  "attr": ``,
  "slotted": ``
};
const LrndesignBarStory = {
  "of": "Web Components/lrndesign-chart",
  "name": "lrndesign-bar",
  "props":  barProps,
  "slots": {}, 
  "attr": ``,
  "slotted": ``
};
const LrndesignLineStory = {
  "of": "Web Components/lrndesign-chart",
  "name": "lrndesign-line",
  "props":  lineProps,
  "slots": {}, 
  "attr": ``,
  "slotted": ``
};
window.StorybookUtilities.instance.addLiveDemo(LrndesignPieStory);
window.StorybookUtilities.instance.addLiveDemo(LrndesignBarStory);
window.StorybookUtilities.instance.addLiveDemo(LrndesignLineStory);