import { ImgPanZoom } from "./img-pan-zoom.js";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";
//import * as openseadragon from "./lib/openseadragon/build/openseadragon/openseadragon.min.js";
import * as image from "./demo/HAXCmsworkflow.jpg";

window.StorybookUtilities.requestAvailability();
/**
 * add to the pattern library
 */
const ImgPanZoomPattern = {
  of: "Pattern Library/Atoms/Media",
  name: "Pan and Zoom",
  file: require("raw-loader!./demo/index.html"),
  replacements: [
    {
      find: "HAXCmsworkflow.jpg",
      replace: image
    }
  ]
};
window.StorybookUtilities.instance.addPattern(ImgPanZoomPattern);

/**
 * add the live demo
 */
const props = ImgPanZoom.properties;
props.src.value = image;

const ImgPanZoomStory = {
  of: "Web Components",
  name: "img-pan-zoom",
  props: props,
  slots: {},
  attr: ``,
  slotted: ``
};
window.StorybookUtilities.instance.addLiveDemo(ImgPanZoomStory);
