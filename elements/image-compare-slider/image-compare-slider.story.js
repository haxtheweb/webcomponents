import { ImageCompareSlider } from "./image-compare-slider.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";
import image1 from "./demo/images/Matterhorn01.png";
import image2 from "./demo/images/Matterhorn02.png";

window.StorybookUtilities.requestAvailability();
/**
 * add to the pattern library
 */
const ImageCompareSliderPattern = {
  "of": "Pattern Library/Molecules/Media", 
  "name": 'Image Compare',
  "file": require("raw-loader!./demo/index.html"),
  "replacements": [
    {"find": "\.\/images\/Matterhorn01.png", "replace": image1 },
    {"find": "\.\/images\/Matterhorn02.png", "replace": image2 }
  ]
}
window.StorybookUtilities.instance.addPattern(ImageCompareSliderPattern);

/**
 * add the live demo
 */
const ImageCompareSliderProps = ImageCompareSlider.properties;
ImageCompareSliderProps.topSrc.value = image1;
ImageCompareSliderProps.bottomSrc.value = image2;
ImageCompareSliderProps.style = {"type":"String", "value": `width: 400px;`};

const ImageCompareSliderStory = {
  "of": "image-compare-slider",
  "name": "image-compare-slider",
  "props":  ImageCompareSliderProps,
  "slots": {}, 
  "attr": ``,
  "slotted": ``
};
window.StorybookUtilities.instance.addLiveDemo(ImageCompareSliderStory);