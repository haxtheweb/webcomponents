import { html } from "lit-element/lit-element.js";
import { SimplePicker } from "@lrnwebcomponents/simple-picker/simple-picker.js";
import { withKnobs, withWebComponentsKnobs } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

export default {
  title: "Forms|Picker",
  component: "simple-picker",
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" }
  }
};

const utils = new StorybookUtilities();
export const SimplePickerStory = () => {
  let picker = utils.makeElementFromClass(SimplePicker, {
    label: "Pick a font-family",
  },["options"]);
  picker.options = [ 
    [ {alt:"-- none --",value:null} ], 
    [ {alt:"sans-serif",style:"font-family: sans-serif",value:"sans-serif" } ],
    [ {alt:"serif",style:"font-family: serif",value:"serif" } ],
    [ {alt:"monospace","selected": true,style:"font-family: monospace",value:"monospace" } ],
    [ {alt:"cursive",style:"font-family: cursive",value:"cursive" } ]
  ];
  return picker;
};

export const SwatchPickerStory = () => {
  let picker = utils.makeElementFromClass(SimplePicker, {
    label: "Pick a color",
    hideOptionLabels: true,
    value: "Yellow"
  },["options"]);
  picker.options = [  
    [ 
      { style: "background-color: #FF00FF", value: "Purple", alt: "Purple (#FF00FF)" },
      { style: "background-color: #2222FF", value: "Blue", alt: "Blue (#2222FF)" },
      { style: "background-color: #00FF00", value: "Green", alt: "Green (#00FF00)" },
      { style: "background-color: #FFFF00", value: "Yellow", alt: "Yellow (#FFFF00)" },
      { style: "background-color: #FF8800", value: "Orange", alt: "Orange (#FF8800)" },
      { style: "background-color: #FF0000", value: "Red", alt: "Red (#FF0000)" } 
    ] 
  ];
  return picker;
};

export const IconPickerStory = () => {
  let picker = utils.makeElementFromClass(SimplePicker, {
    label: "Pick an icon",
    alignRight: true,
    hideOptionLabels: true,
    value: "search"
  },["options"]);
  picker.options = [ 
    [ 
      { alt: "none", icon: "clear", value: "clear" },
      { icon: "check", alt: "OK", value: "check" },
      { icon: "clear", alt: "Cancel", value: "clear" },
      { icon: "search", alt: "Find", value: "search" } 
    ],
    [ 
      { icon: "arrow-back", alt: "Left", value: "arrow-back" },
      { icon: "arrow-downward", alt: "Down", value: "arrow-downward" },
      { icon: "arrow-forward", alt: "Right", value: "arrow-forward" },
      { icon: "arrow-upward", alt: "Up", value: "arrow-upward" } 
    ] 
  ];
  return picker;
};
