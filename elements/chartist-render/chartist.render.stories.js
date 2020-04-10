import { html } from "lit-element/lit-element.js";
import { ChartistRender } from "@lrnwebcomponents/chartist-render/chartist-render.js";
import {
  withKnobs,
  withWebComponentsKnobs,
  text,
  select,
  boolean
} from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors";

export default {
  title: "Charts|Chartist",
  component: "chartist-render",
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
    knobs: {
      escapeHTML: false
    }
  }
};

const utils = new StorybookUtilities(),
  scale = {
    "ct-square": "ct-square (1:1)",
    "ct-minor-second": "ct-minor-second  (15:16)",
    "ct-major-second": "ct-major-second  (8:9)",
    "ct-minor-third": "ct-minor-third  (5:6)",
    "ct-major-third": "ct-major-third  (4:5)",
    "ct-perfect-fourth": "ct-perfect-fourth  (3:4)",
    "ct-perfect-fifth": "ct-perfect-fifth  (2:3)",
    "ct-minor-sixth": "ct-minor-sixth  (5:8)",
    "ct-golden-section": "ct-golden-section  (1:1.618)",
    "ct-major-sixth": "ct-major-sixth  (3:5)",
    "ct-minor-seventh": "ct-minor-seventh  (9:16)",
    "ct-major-seventh": "ct-major-seventh  (8:15)",
    "ct-octave": "ct-octave  (1:2)",
    "ct-major-tenth": "ct-major-tenth  (2:5)",
    "ct-major-eleventh": "ct-major-eleventh  (3:8)",
    "ct-major-twelfth": "ct-major-twelfth  (1:3)",
    "ct-double-octave": "ct-double-octave  (1:4`)"
  },
  props = utils.getElementProperties(ChartistRender.properties);

props.forEach(prop => {
  if (prop.property === "dataSource") prop.inputMethod = "haxupload";
  if (prop.property === "scale") {
    prop.inputMethod = "select";
    prop.options = Object.keys(scale);
  }
  if (prop.property === "type") {
    prop.inputMethod = "select";
    prop.options = ["bar", "pie", "line"];
  }
  if (prop.property === "chartData") prop.property = "delete";
});
export const ChartistRenderPieStory = () => {
  let pie = {
      labels: ["Bananas", "Apples", "Grapes"],
      series: [20, 15, 40]
    },
    knobs = utils.getKnobs(props, {
      data: pie,
      scale: "ct-square",
      type: "pie"
    });
  delete knobs.props.delete;
  console.log("ChartistRenderPieStory", props, knobs);
  //props.push({slot:"",inputMethod: "textarea"});
  return utils.makeElement("chartist-render", knobs);
};
