import { html } from "lit-element/lit-element.js";
import { withKnobs, withWebComponentsKnobs } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";
import { RelativeHeading } from "@lrnwebcomponents/relative-heading/relative-heading.js";
import { RelativeHeadingLite } from "@lrnwebcomponents/relative-heading/lib/relative-heading-lite.js";

export default {
  title: "Headings|Relative Headings",
  component: "relative-heading",
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" }
  }
};

const utils = new StorybookUtilities();
const parents = ["", "lorem", "praesent", "suspendisse"];
const parent = {
  property: "parent",
  title: "parent relative-heading's id",
  inputMethod: "select",
  options: parents
};
const props = [
  parent,
  {
    property: "disableLink",
    title: "Disable Link to Heading",
    inputMethod: "boolean"
  },
  {
    property: "linkAlignRight",
    title: "Align Link to Right",
    inputMethod: "boolean"
  }
];
const knobs = propData =>
  utils.getKnobs(propData, { parent: utils.getRandomOption(parents) });
export const RelativeHeadingLiteStory = () => {
  return utils.getDemo(
    `<relative-heading id="lorem">
  <h1>Lorem ipsum dolor</h1>
</relative-heading>

<relative-heading id="praesent" parent="lorem">
  <h2>Praesent ultrices</h2>
</relative-heading>

<relative-heading id="suspendisse" parent="praesent">
  <h3>Suspendisse</h3>
</relative-heading>

<relative-heading id="changeme" parent="${knobs([parent]).props.parent.knob}">
  <h2>Change me!!!!</h2>
</relative-heading>

<relative-heading id="sollicitudin" parent="changeme">
  <h3>Sollicitudin</h3>
</relative-heading>          

<relative-heading id="volutpat" parent="sollicitudin">
  <h4>In et volutpat</h4>
</relative-heading>
<style>h1,h2,h3,h4,h5,h6 { margin: 0.3rem 0 }</style>   
    `,
    `<p>Use the knobs to alter the fourth heading (Change me!!!!):</p>`
  );
};

export const RelativeHeadingStory = () => {
  return utils.getDemo(
    `<relative-heading-lite id="lorem">
  <h1>Lorem ipsum dolor</h1>
</relative-heading-lite>

<relative-heading-lite id="praesent" parent="lorem">
  <h2>Praesent ultrices</h2>
</relative-heading-lite>

<relative-heading-lite id="suspendisse" parent="praesent">
  <h3>Suspendisse</h3>
</relative-heading-lite>

<relative-heading-lite id="changeme" parent="${knobs(props).props.parent.knob}"${
      knobs(props).props.disableLink.knob ? " disable-link" : ""
    }${knobs(props).props.linkAlignRight.knob ? " link-align-right" : ""}>
  <h2>Change me!!!!</h2>
</relative-heading-lite>

<relative-heading-lite id="sollicitudin" parent="changeme">
  <h3>Sollicitudin</h3>
</relative-heading>          

<relative-heading-lite id="volutpat" parent="sollicitudin">
  <h4>In et volutpat</h4>
</relative-heading-lite>
<style>h1,h2,h3,h4,h5,h6 { margin: 0.3rem 0 }</style>     
    `,
    `<p>Use the knobs to alter the fourth heading (Change me!!!!):</p>`
  );
};
