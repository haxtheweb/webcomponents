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
export const LrndesignBarStory = () => {
  return utils.makeElementFromClass(
    LrndesignBar,
    {
      accentColor: utils.randomColor(),
      dark: utils.randomBool(),
      showTable: utils.randomBool(),
      axisXTitle: "Quarter",
      axisYTitle: "Sales",
      scale: "ct-octave",
      heading: `<h3>Sales by Quarter</h3>`,
      desc: `<p>A bar graph of sales by quarter. Each series is a salesperson.</p>`,
      emptyslot: `
    <table>
      <caption>Sales by Quarter (table)</caption>
      <thead>
        <tr>
          <th scope="col">Quarter 1</th>
          <th scope="col">Quarter 2</th>
          <th scope="col">Quarter 3</th>
          <th scope="col">Quarter 4</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>5</td><td>4</td><td>3</td><td>7</td></tr>
        <tr><td>3</td><td>2</td><td>9</td><td>5</td></tr>
        <tr><td>1</td><td>5</td><td>8</td><td>4</td></tr>
        <tr><td>2</td><td>3</td><td>4</td><td>6</td></tr>
        <tr><td>4</td><td>1</td><td>2</td><td>1</td></tr>
      </tbody>
    </table>`,
    },
    [
      { slot: "heading", title: "Chart Heading" },
      { slot: "desc", title: "Chart Description" },
      { property: "showTable", title: "Show Table", inputMethod: "boolean" },
    ]
  );
};
export const LrndesignLineStory = () => {
  return utils.makeElementFromClass(
    LrndesignLine,
    {
      accentColor: utils.randomColor(),
      dark: utils.randomBool(),
      showTable: utils.randomBool(),
      scale: "ct-octave",
      heading: `<h3>Sales by Quarter (chart)</h3>`,
      desc: `<p>A bar graph of sales by quarter. Each series is a salesperson.</p>`,
      emptyslot: `<table>
        <caption>Sales by Quarter (table)</caption>
        <thead>
          <tr>
            <th scope="row">Quarter</th>
            <th scope="col">Q1 2018</th>
            <th scope="col">Q2 2018</th>
            <th scope="col">Q3 2018</th>
            <th scope="col">Q4 2018</th>
            <th scope="col">Q1 2019</th>
            <th scope="col">Q2 2019</th>
            <th scope="col">Q3 2019</th>
            <th scope="col">Q4 2019</th>
          </tr>
        </thead>
        <tbody>
          <tr><th scope="row">Northeast</th><td>5</td><td>4</td><td>3</td><td>7</td><td>8</td><td>11</td><td>9</td><td>5</td></tr>
          <tr><th scope="row">Southeast</th><td>3</td><td>2</td><td>9</td><td>5</td><td>6</td><td>4</td><td>8</td><td>4</td></tr>
          <tr><th scope="row">Midatlantic</th><td>1</td><td>5</td><td>8</td><td>4</td><td>7</td><td>6</td><td>8</td><td>5</td></tr>
          <tr><th scope="row">Midwest</th><td>2</td><td>3</td><td>4</td><td>6</td><td>4</td><td>2</td><td>4</td><td>3</td></tr>
          <tr><th scope="row">West</th><td>4</td><td>1</td><td>2</td><td>1</td><td>0</td><td>null</td><td>3</td><td>0</td></tr>
        </tbody>
      </table>`,
    },
    [
      { slot: "heading", title: "Chart Heading" },
      { slot: "desc", title: "Chart Description" },
      { property: "showTable", title: "Show Table", inputMethod: "boolean" },
    ]
  );
};
export const LrndesignPieStory = () => {
  return utils.makeElementFromClass(
    LrndesignPie,
    {
      accentColor: utils.randomColor(),
      dark: utils.randomBool(),
      showTable: utils.randomBool(),
      chartPadding: 5,
      heading: `<h3>A pie chart of favorite pies</h3>`,
      emptyslot: `
    <table>
      <thead>
        <tr>
          <th scope="col">Key Lime</th><th scope="col">Lemon Merangue</th><th scope="col">Apple</th><th scope="col">Pumpkin</th><th scope="col">Cherry</th><th scope="col">Pecan</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>23</td><td>15</td><td>40</td><td>30</td><td>12</td><td>20</td></tr>
      </tbody>
    </table>`,
    },
    [
      { slot: "heading", title: "Chart Heading" },
      { slot: "desc", title: "Chart Description" },
      { property: "showTable", title: "Show Table", inputMethod: "boolean" },
      { css: "width" },
      { css: "maxWidth" },
    ]
  );
};
export const LrndesignDonutStory = () => {
  return utils.makeElementFromClass(
    LrndesignPie,
    {
      accentColor: utils.randomColor(),
      dark: utils.randomBool(),
      showTable: utils.randomBool(),
      donut: true,
      maxWidth: "300px",
      chartPadding: 5,
      heading: `<h3>A donut chart of favorite donuts</h3>`,
      emptyslot: `
      <table>
        <thead>
          <tr>
            <th scope="col">Boston Cream</th><th scope="col">Glazed</th><th scope="col">Jelly Filled</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>20</td><td>15</td><td>40</td></tr>
        </tbody>
      </table>`,
    },
    [
      { slot: "heading", title: "Chart Heading" },
      { slot: "desc", title: "Chart Description" },
      { property: "showTable", title: "Show Table", inputMethod: "boolean" },
      { css: "width" },
      { css: "maxWidth" },
    ]
  );
};
