import { html } from "lit-element/lit-element.js";
import { a11yCompareImage } from "@lrnwebcomponents/a11y-compare-image/a11y-compare-image.js";
import { withKnobs, withWebComponentsKnobs } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

export default {
  title: "Media|Image Compare Slider",
  component: "a11y-compare-image",
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" }
  }
};

const utils = new StorybookUtilities();
export const a11yCompareImageStory = () => {
  return utils.makeElementFromClass(
    a11yCompareImage,
    {
      topSrc: new URL(`./demo/images/Matterhorn01.png`, import.meta.url),
      bottomSrc: new URL(`./demo/images/Matterhorn02.png`, import.meta.url),
      heading: `<h2>Image Compare Slider</h2>`,
      description: "<p>Use the slider to comapre images.</p>",
      width: "100%",
      maxWidth: "400px"
    },
    [{ css: "width" }, { css: "maxWidth" }]
  );
};
