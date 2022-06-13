import { html } from "lit-html";
import { ImageCompareSlider } from "@lrnwebcomponents/image-compare-slider/image-compare-slider.js";
import { withKnobs } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

export default {
  title: "Media|Image Compare",
  component: "image-compare-slider",
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};

const utils = new StorybookUtilities();
let images = [
  new URL(`./demo/images/Matterhorn01.png`, import.meta.url),
  new URL(`./demo/images/Matterhorn02.png`, import.meta.url),
];
export const ImageCompareSliderStory = () => {
  return utils.makeElementFromHaxDemo(ImageCompareSlider, {
    bottomSrc: images[0],
    topSrc: images[1],
  });
};
