import { ImgPanZoom } from "./img-pan-zoom.js";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";
import * as image from "./demo/HAXCmsworkflow.jpg"

//require("file-loader!./lib/openseadragon/build/openseadragon/openseadragon.js");
window.StorybookUtilities.requestAvailability();
window.StorybookUtilities.instance.addGlobalScript(
  'openseadragon',
  require("file-loader!./lib/openseadragon/build/openseadragon/openseadragon.js")
);
/**
 * add to the pattern library 
 */
const Pattern = {
  "of": "Pattern Library/Atoms/Media",       //Pattern library path
  "name": "Pan and Zoom",   
  "file": require("raw-loader!./demo/index.html"),
  "replacements": [
    {
      "find": 'HAXCmsworkflow.jpg',
      "replace": image
    }
  ]
};
window.StorybookUtilities.instance.addPattern(Pattern);

/**
 * add the live demo
 */
/*const Story = {
  "of": "Web Components",                   //component folder
  "name": "a11y-collapse",                  //component tag
  "props": A11yCollapse.properties,         //component properties that will become knobs
  "slots": {                                //slots that will become knobs
    "heading":                              
      {
        "name": "heading",                  //slot name
        "type": "String",                   //slot type
        "value": `Click to expand me.`      //slot content
      }
  }, 
  "attr": ``,                               //attributes that won't become knobs
  "slotted": ``                             //slots that won't become knobs
}
window.StorybookUtilities.instance.addLiveDemo(Story);*/