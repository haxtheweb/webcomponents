import { AccentCard } from "./accent-card.js";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";
import image1 from "./demo/images/image1.jpg";
import image2 from "./demo/images/image2.jpg";
import image3 from "./demo/images/image3.jpg";
import image3a from "./demo/images/image3a.jpg";
import image4 from "./demo/images/image4.jpg";
import image5 from "./demo/images/image5.jpg";
import image6 from "./demo/images/image6.jpg";
import image7 from "./demo/images/image7.jpg";
import image8 from "./demo/images/image8.jpg";

window.StorybookUtilities.requestAvailability();
/**
 * add to the pattern library
 */
const images = [
  { find: "./images/image1.jpg", replace: image1 },
  { find: "./images/image2.jpg", replace: image2 },
  { find: "./images/image3.jpg", replace: image3 },
  { find: "./images/image3a.jpg", replace: image3a },
  { find: "./images/image4.jpg", replace: image4 },
  { find: "./images/image5.jpg", replace: image5 },
  { find: "./images/image6.jpg", replace: image6 },
  { find: "./images/image7.jpg", replace: image7 },
  { find: "./images/image8.jpg", replace: image8 }
];
const AccentCardPattern = {
  of: "Pattern Library/Molecules/Layout/Accent Card",
  name: "Overview",
  file: require("raw-loader!./demo/index.html"),
  replacements: images
};
const AccentCardPatternBorders = {
  of: "Pattern Library/Molecules/Layout/Accent Card",
  name: "Borders",
  file: require("raw-loader!./demo/borders.html"),
  replacements: images
};
const AccentCardPatternColors = {
  of: "Pattern Library/Molecules/Layout/Accent Card",
  name: "Colors",
  file: require("raw-loader!./demo/colors.html"),
  replacements: images
};
const AccentCardPatternImages = {
  of: "Pattern Library/Molecules/Layout/Accent Card",
  name: "Images",
  file: require("raw-loader!./demo/images.html"),
  replacements: images
};
const AccentCardPatternOrientation = {
  of: "Pattern Library/Molecules/Layout/Accent Card",
  name: "Orientation",
  file: require("raw-loader!./demo/orientation.html"),
  replacements: images
};
const AccentCardPatternVariables = {
  of: "Pattern Library/Molecules/Layout/Accent Card",
  name: "Variables",
  file: require("raw-loader!./demo/variables.html"),
  replacements: images
};
window.StorybookUtilities.instance.addPattern(AccentCardPattern);
window.StorybookUtilities.instance.addPattern(AccentCardPatternBorders);
window.StorybookUtilities.instance.addPattern(AccentCardPatternColors);
window.StorybookUtilities.instance.addPattern(AccentCardPatternImages);
window.StorybookUtilities.instance.addPattern(AccentCardPatternOrientation);
window.StorybookUtilities.instance.addPattern(AccentCardPatternVariables);

/**
 * add the live demo
 */
let props = Object.assign(
  window.StorybookUtilities.instance.getSimpleColorsPolymer("light-blue"),
  AccentCard.properties
);
props.imageSrc.value = image6;
props.imageAlign.type = "Select";
props.imageAlign.options = ["left", "center", "right"];
props.imageValign.type = "Select";
props.imageValign.options = ["top", "center", "bottom"];
const AccentCardStory = {
  of: "Web Components",
  name: "accent-card",
  props: props,
  slots: {
    heading: {
      name: "heading",
      type: "String",
      value: `Accent Card`
    },
    subheading: {
      name: "subheading",
      type: "String",
      value: `A card with optional accent stylings.`
    },
    content: {
      name: "content",
      type: "String",
      value: `<p>This card is highly customizable. There are a number of options for using accent. See documentation for more info.</p>`
    },
    footer: {
      name: "footer",
      type: "String",
      value: null
    }
  },
  attr: ``,
  slotted: ``
};
window.StorybookUtilities.instance.addLiveDemo(AccentCardStory);
