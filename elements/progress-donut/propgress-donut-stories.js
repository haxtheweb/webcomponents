import { html } from "lit-element/lit-element.js";
import { ProgressDonut } from "@lrnwebcomponents/progress-donut/progress-donut.js";
import { withKnobs, withWebComponentsKnobs } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

export default {
  title: "Charts|Progress Donut",
  component: "progress-donut",
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" }
  }
};

const utils = new StorybookUtilities();
export const ProgressDonutStory = () => {
  return utils.makeElementFromClass(
    ProgressDonut,
    { 
      accentColor: utils.getRandomColor(),
      animation:500, 
      animationDelay:500, 
      desc:"You have completed 5,4,8,12,6,3,4, and 3 points of work out of 50 points.",
      complete:[5,4,8,12,6,3,4,3],
      imageSrc: new URL(`./demo/images/profile1.jpg`, import.meta.url),
      width:"300px", 
      total:50
    },
    [
      { css: "width" },
      { css: "maxWidth" }
    ]
  );
};
