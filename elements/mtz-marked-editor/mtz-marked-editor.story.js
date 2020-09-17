import { MtzMarkedEditor } from "./mtz-marked-editor.js";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

window.StorybookUtilities.requestAvailability();

/**
 * add to the pattern library
 */
const Pattern = {
  of: "Pattern Library/Atoms/Forms", //Pattern library path
  name: "MtzMarkedEditor", //Pattern name
  file: require("raw-loader!./demo/index.html"),
  replacements: [],
};
window.StorybookUtilities.instance.addPattern(Pattern);

/**
 * add the live demo
 */
/*const Story = {
  "of": "Web Components",                   //component folder
  "name": "mtz-marked-editor",                  //component tag
  "props": MtzMarkedEditor.properties,         //component properties that will become knobs
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
