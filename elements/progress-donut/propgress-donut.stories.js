import { ProgressDonut } from "@haxtheweb/progress-donut/progress-donut.js";
import { withKnobs } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@haxtheweb/storybook-utilities/storybook-utilities.js";

export default {
  title: "System|Progress Donut",
  component: "progress-donut",
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};

const utils = new StorybookUtilities();
export const ProgressDonutStory = () => {
  return utils.makeUsageDocs(
    ProgressDonut,
    import.meta.url,
    utils.makeElementFromClass(
      ProgressDonut,
      {
        accentColor: utils.randomColor(),
        animation: 500,
        animationDelay: 500,
        desc: "You have completed 5,4,8,12,6,3,4, and 3 points of work out of 50 points.",
        complete: [5, 4, 8, 12, 6, 3, 4, 3],
        imageSrc: new URL(`./demo/images/profile1.jpg`, import.meta.url),
        width: "300px",
        total: 50,
      },
      [{ css: "width" }, { css: "maxWidth" }],
    ),
  );
};
