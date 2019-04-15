import { SimplePopover } from "./simple-popover.js";
import { AbsolutePositionBehavior } from "@lrnwebcomponents/absolute-position-behavior/absolute-position-behavior.js";

import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

window.StorybookUtilities.requestAvailability();

/**
 * add to the pattern library 
 */
const SimplePopoverPattern = {
  "of": "Pattern Library/Atoms/Layout",
  "name": "Popover",
  "file": require("raw-loader!./demo/index.html"),
  "replacements": []
};
window.StorybookUtilities.instance.addPattern(SimplePopoverPattern);

/**
 * add the live demo
 */
const props = Object.assign(AbsolutePositionBehavior.properties,SimplePopover.properties);
delete props.target;
props.auto.value = true;
props.for.type = "Select";
props.for.value = "em";
props.for.options = ["em","p1","p2","strong"];
props.position.type = "Select";
props.position.options = ["top","bottom","left","right"];
const SimplePopoverStory = {
  "of": "Web Components",
  "name": "simple-popover",
  "before": `
    <div contenteditable="true">
      <p id="p1">
        Aenean eget nisl volutpat, molestie purus eget, bibendum metus. 
        Pellentesque magna velit, tincidunt quis pharetra id, gravida 
        placerat erat. <em id="em">Maecenas</em> id dui pretium risus pulvinar feugiat 
        vel nec leo. Praesent non congue tellus. Suspendisse ac tincidunt 
        purus. Donec eu dui a metus vehicula bibendum sed nec tortor. 
        Nunc convallis justo sed nibh consectetur, at pharetra nulla 
        accumsan.
      </p>
      <p id="p2">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
        Quisque porta, dolor at pharetra condimentum, elit tellus 
        scelerisque lacus, ut placerat lectus quam in massa. 
        Donec sit amet sapien vitae nibh ultricies hendrerit sit 
        amet dignissim justo. Orci varius 
        <strong id="strong">natoque</strong> penatibus et 
        magnis dis parturient montes, nascetur ridiculus mus. 
        Vivamus volutpat sem leo, sed porttitor elit convallis at. 
        Quisque vel consequat risus. Fusce auctor nibh vitae 
        leo bibendum faucibus. Etiam aliquam neque sit amet maximus 
        lacinia. Duis ut libero eget augue egestas suscipit. 
      </p>
    </div>`,
  "props": props,
  "slots": {
    "slot":                              
      {
        "name": "slot",
        "type": "String",
        "value": `I'm a popover!`
      }
  }, 
  "attr": ``,
  "slotted": ``
}
window.StorybookUtilities.instance.addLiveDemo(SimplePopoverStory);