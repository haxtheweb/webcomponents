import { html } from "lit-element/lit-element.js";
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
    options: { selectedPanel: "storybookjs/knobs/panel" }
  }
};

const utils = new StorybookUtilities();

  export const LrndesignPieStory = () => {
    return utils.makeElementFromClass(LrndesignPie);
  };

  export const LrndesignBarStory = () => {
    return utils.makeElementFromClass(LrndesignBar);
  };

  export const LrndesignLineStory = () => {
    return utils.makeElementFromClass(LrndesignLine);
  };
