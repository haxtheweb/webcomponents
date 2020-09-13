import { RelativeHeading } from "./relative-heading.js";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

window.StorybookUtilities.requestAvailability();

/**
 * add to the pattern library
 */
const RelativeHeadingPattern = {
  of: "Pattern Library/Atoms/Headings/",
  name: "Relative Heading",
  file: require("raw-loader!./demo/index.html"),
  replacements: [
    {
      find: "<select[\n.]*</select>",
      replace: "",
    },
  ],
};
window.StorybookUtilities.instance.addPattern(RelativeHeadingPattern);

/**
 * add the live demo
 */
const props = RelativeHeading.properties;
props.parentId.value = "rh3";
props.parentId.type = "Select";
props.parentId.options = ["", "rh1", "rh2", "rh3"];
props.text.value = "Sapien sit amet";
delete props.id;
const RelativeHeadingStory = {
  of: "Web Components",
  name: "relative-heading",
  before: `
    <style>
      relative-heading:before {
        content: '<h' attr(level) '/>';
        font-size: 10px;
        float: right;
      }  
      relative-heading:not(#rh4), p {
        opacity: 0.5;
      }
      #rh4 {
        background-color: #ffffcc;
      }
    </style>
    <relative-heading id="rh1" text="Lorem ipsum dolor"></relative-heading>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
    <relative-heading id="rh2" text="Praesent ultrices" parent-id="rh1"></relative-heading>
    <p>Mauris aliquam lorem justo. Praesent ultrices lorem nec est iaculis viverra dignissim eu neque. Nullam vitae nisl diam.</p>
    <relative-heading id="rh3" text="Suspendisse" parent-id="rh2"></relative-heading>
    <p>Suspendisse potenti. Nulla venenatis porta felis id feugiat. Vivamus vehicula molestie sapien hendrerit ultricies.</p> `,
  props: props,
  slots: {},
  attr: ` id="rh4"`,
  slotted: ``,
  after: `
    <p>Quisque volutpat eu sapien sit amet interdum. Proin venenatis tellus eu nisi congue aliquet. </p>
    <relative-heading id="rh5" text="Sollicitudin" parent-id="rh4"></relative-heading>          
    <p>Nullam at velit sollicitudin, porta mi quis, lacinia velit. Praesent quis mauris sem.</p> 
    <relative-heading id="rh6" text="In et volutpat" parent-id="rh5"></relative-heading>          
    <p>In et volutpat nisi. Suspendisse vel nibh eu magna posuere sollicitudin. Praesent ac ex varius, facilisis urna et, cursus tellus.</p> `,
};
window.StorybookUtilities.instance.addLiveDemo(RelativeHeadingStory);
