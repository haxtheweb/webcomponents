import { html } from "lit-element/lit-element.js";
import { ChartistRender } from "@lrnwebcomponents/chartist-render/chartist-render.js";
import { LrndesignChart } from "@lrnwebcomponents/lrndesign-chart/lrndesign-chart.js";
import { LrndesignBar } from "@lrnwebcomponents/lrndesign-chart/lib/lrndesign-bar.js";
import { LrndesignLine } from "@lrnwebcomponents/lrndesign-chart/lib/lrndesign-line.js";
import { LrndesignPie } from "@lrnwebcomponents/lrndesign-chart/lib/lrndesign-pie.js";
import { withKnobs, withWebComponentsKnobs } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

export default {
  title: "Charts|Lrndesign Chart",
  component: "lrndesign-chart",
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel", escapeHTML: false },
  },
};

const utils = new StorybookUtilities();

let salesData = [
    ["Quarter", "Quarter 1", "Quarter 2", "Quarter 3", "Quarter 4"],
    ["Northeast", 5, 4, 3, 7],
    ["Midaltantic", 3, 2, 9, 5],
    ["Southeast", 1, 5, 8, 4],
    ["Midwest", 2, 3, 4, 6],
    ["West", 4, 1, 2, 1],
  ],
  pieData = [
    ["Banana", "Apple", "Pumpkin"],
    [20, 15, 40],
  ];
export const LrndesignPieStory = () => {
  console.log("LrndesignPieStory", LrndesignPie.haxProperties);
  let pie = utils.makeElementFromClass(LrndesignPie, {
    chartPadding: 5,
    emptyslot: `<table><tr><th scope="col">Banana</th><th scope="col">Apple</th><th scope="col">Pumpkin</th></tr></thead>
    <tbody><tr><td>20</td><td>15</td><td>40</td></tr></tbody></table>`,
  });
  pie.makeChart();
  return pie;
};
/*
export const LrndesignBarStory = () => {
  return utils.makeElementFromClass(LrndesignBar, {
    data: salesData
  });
};

export const LrndesignLineStory = () => {
  return utils.makeElementFromClass(LrndesignLine,{
    data: salesData
  });
};*/
