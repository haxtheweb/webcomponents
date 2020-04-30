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
  salesData = [
    ["Quarter", "Quarter 1", "Quarter 2", "Quarter 3", "Quarter 4"],
    ["Northeast", 5, 4, 3, 7],
    ["Midaltantic", 3, 2, 9, 5],
    ["Southeast", 1, 5, 8, 4],
    ["Midwest", 2, 3, 4, 6],
    ["West", 4, 1, 2, 1]
  ],
  pieData = [["Banana", "Apple", "Pumpkin"], [20, 15, 40]],
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
export const ChartistRenderBarStory = () => {
  let knobs = utils.getKnobs(props, {
      data: salesData,
      chartTitle: "Sales by Quarter",
      chartDesc:
        "Sales for Northeast, Midatlantic, Southeast, Midwest, and West by Quarter.",
      scale: "ct-double-octave",
      type: "bar"
    }),
    bar = utils.makeElement("chartist-render", knobs);
  return bar;
};
export const ChartistRenderLineStory = () => {
  let knobs = utils.getKnobs(props, {
      data: salesData,
      chartTitle: "Sales by Quarter",
      chartDesc:
        "Sales for Northeast, Midatlantic, Southeast, Midwest, and West by Quarter.",
      scale: "ct-double-octave",
      type: "line"
    }),
    line = utils.makeElement("chartist-render", knobs);
  return line;
};
export const ChartistRenderPieStory = () => {
  let knobs = utils.getKnobs(props, {
      data: pieData,
      chartTitle: "Favorite Donuts",
      chartDesc: "A pie chart of favorite pie.",
      scale: "ct-square",
      type: "pie"
    }),
    donut = utils.makeElement("chartist-render", knobs);
  donut.style.maxWidth = "300px";
  return donut;
};
export const ChartistRenderDonutStory = () => {
  let donutData = [["Boston Cream", "Chocolate", "Glazed"], [10, 24, 28]],
    knobs = utils.getKnobs(props, {
      data: donutData,
      chartTitle: "Favorite Pie",
      chartDesc: "A pie chart of favorite pie.",
      scale: "ct-square",
      type: "pie",
      options: { donut: true }
    }),
    pie = utils.makeElement("chartist-render", knobs);
  pie.style.maxWidth = "300px";
  return pie;
};
export const ChartistWithSlots = () => {
  let table = document.createElement("table");
  table.innerHTML = `
  <tr><th scope="col">Banana</th><th scope="col">Apple</th><th scope="col">Pumpkin</th></tr></thead>
  <tbody><tr><td>20</td><td>15</td><td>40</td></tr></tbody>`;
  let propsSlots = [
      { slot: "heading", inputMethod: "string", name: "heading" },
      { slot: "desc", inputMethod: "textarea", name: "desc" },
      { slot: "", inputMethod: "textarea", name: "" },
      ...props.filter(
        prop => !["chartTitle", "chartDesc", "data"].includes(prop.name)
      )
    ],
    knobs = utils.getKnobs(propsSlots, {
      data: pieData,
      heading: "Favorite Pie",
      desc: "A pie chart of favorite pie.",
      scale: "ct-square",
      type: "pie",
      emptyslot: `<table>${table.innerHTML}</table>`
    }),
    pie = utils.makeElement("chartist-render", knobs);
  pie.style.maxWidth = "300px";
  pie.appendChild(table);
  return pie;
};
