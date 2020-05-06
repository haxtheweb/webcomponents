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
    options: { selectedPanel: "storybookjs/knobs/panel", escapeHTML: false }
  }
};

const utils = new StorybookUtilities();
let scale = {
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
  styles = [
    {css: "maxWidth"},
    { css: "--chartist-bg-padding", title: "padding inside chartist-render" },
    { css: "--chartist-bg-margin", title: "margin chartist chartist-render" },
    { css: "--chartist-text-color", title: "default label color for charts" },
    { css: "--chartist-bg-color", title: "default label color for charts" },
    { css: "--chartist-text-color", title: "default label color for charts" },
    { css: "--chartist-color-a", title: "background color for 1st series" },
    { css: "--chartist-color-label-a", title: "color for 1st series label" },
    { css: "--chartist-color-b", title: "background color for 2nd series" },
    { css: "--chartist-color-label-b", title: "color for 2nd series label" },
    { css: "--chartist-color-c", title: "background color for 3rd series" },
    { css: "--chartist-color-label-c", title: "color for 3rd series label" },
    { css: "--chartist-color-d", title: "background color for 4th series" },
    { css: "--chartist-color-label-d", title: "color for 4th series label" },
    { css: "--chartist-color-e", title: "background color for 5th series" },
    { css: "--chartist-color-label-e", title: "color for 5th series label" },
    { css: "--chartist-color-f", title: "background color for 6th series" },
    { css: "--chartist-color-label-f", title: "color for 6th series label" },
    { css: "--chartist-color-g", title: "background color for 7th series" },
    { css: "--chartist-color-label-g", title: "color for 7th series label" },
    { css: "--chartist-color-h", title: "background color for 8th series" },
    { css: "--chartist-color-label-h", title: "color for 8th series label" },
    { css: "--chartist-color-i", title: "background color for 9th series" },
    { css: "--chartist-color-label-i", title: "color for 9th series label" },
    { css: "--chartist-color-j", title: "background color for 10th series" },
    { css: "--chartist-color-label-j", title: "color for 10th series label" },
    { css: "--chartist-color-k", title: "background color for 11th series" },
    { css: "--chartist-color-label-k", title: "color for 11th series label" },
    { css: "--chartist-color-l", title: "background color for 12th series" },
    { css: "--chartist-color-label-l", title: "color for 12th series label" },
    { css: "--chartist-color-m", title: "background color for 13th series" },
    { css: "--chartist-color-label-m", title: "color for 13th series label" },
    { css: "--chartist-color-n", title: "background color for 14th series" },
    { css: "--chartist-color-label-n", title: "color for 15th series label" },
    { css: "--chartist-color-0", title: "background color for 15th series" },
    { css: "--chartist-color-label-o", title: "color for 15th series label" },
  ],
  barData = new URL(`demo/bar.csv`, import.meta.url),
  donutData =  new URL(`demo/donut.csv`, import.meta.url),
  lineData = new URL(`demo/line.csv`, import.meta.url),
  pieData = new URL(`demo/pie.csv`, import.meta.url),
  props = utils
    .getElementProperties(ChartistRender.properties)
    .filter(prop => prop.property !== "chartData");

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
});
props = [...props,...styles];
export const ChartistRenderBarStory = () => {
  return utils.makeElement("chartist-render", utils.getKnobs(props, {
      dataSource: barData,
      chartTitle: "Sales by Quarter",
      chartDesc:
        "Sales for Northeast, Midatlantic, Southeast, Midwest, and West by Quarter.",
      scale: "ct-double-octave",
      type: "bar",
      maxWidth: '600px'
    }));
};
export const ChartistRenderLineStory = () => {
  return utils.makeElement("chartist-render", utils.getKnobs(props, {
      dataSource: lineData,
      chartTitle: "Sales by Quarter",
      chartDesc:
        "Sales for Northeast, Midatlantic, Southeast, Midwest, and West by Quarter.",
      scale: "ct-double-octave",
      type: "line",
      maxWidth: '600px'
    }));
};
export const ChartistRenderPieStory = () => {
  return utils.makeElement("chartist-render", utils.getKnobs(props, {
      dataSource: pieData,
      chartTitle: "Favorite Pie",
      chartDesc: "A pie chart of favorite pies.",
      scale: "ct-square",
      type: "pie",
      maxWidth: '300px'
    }));
};
export const ChartistRenderDonutStory = () => {
  return utils.makeElement("chartist-render", utils.getKnobs(props, {
      dataSource: donutData,
      chartTitle: "Favorite Donuts",
      chartDesc: "A donut chart of favorite donuts.",
      scale: "ct-square",
      type: "pie",
      options: { donut: true },
      maxWidth: '300px'
    }));
};
export const ChartistWithSlots = () => {
  return utils.makeElement("chartist-render", utils.getKnobs([
      { slot: "heading", inputMethod: "string", name: "heading" },
      { slot: "desc", inputMethod: "textarea", name: "desc" },
      { slot: "", inputMethod: "textarea", name: "" },
      ...props.filter(
        prop => !["chartTitle", "chartDesc", "data"].includes(prop.name)
      )
    ],{
      dataSource: pieData,
      heading: "Favorite Pie",
      desc: "A pie chart of favorite pie.",
      scale: "ct-square",
      type: "pie",
      emptyslot: '<table><thead><tr><th scope="col">Banana</th><th scope="col">Apple</th><th scope="col">Pumpkin</th></tr></thead><tbody><tr><td>20</td><td>15</td><td>40</td></tr></tbody></table>',
      maxWidth: '300px'
    }));
};
