import { html } from "lit-element/lit-element.js";
import { ImageCompareSlider } from "@lrnwebcomponents/image-compare-slider/image-compare-slider.js";
import { withKnobs, withWebComponentsKnobs } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

export default {
  title: "Media|Image Compare Slider",
  component: "image-compare-slider",
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" }
  }
};

const utils = new StorybookUtilities();
export const ImageCompareSliderStory = () => {
  return utils.makeElementFromHaxDemo(ImageCompareSlider);
};
