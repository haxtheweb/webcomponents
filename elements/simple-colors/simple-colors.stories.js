import { withKnobs } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@haxtheweb/storybook-utilities/storybook-utilities.js";
import { SimpleColors } from "@haxtheweb/simple-colors/simple-colors.js";
import { SimpleColorsPicker } from "@haxtheweb/simple-colors/lib/simple-colors-picker.js";
import "@haxtheweb/simple-colors/lib/demo/simple-colors-swatches.js";

export default {
  title: "System|Simple Colors",
  component: "simple-colors",
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};

const utils = new StorybookUtilities();
export const SimpleColorsStory = () => {
  let props = [
      {
        property: "accentColor",
        title: "Accent Color",
        inputMethod: "colorpicker",
      },
      { property: "dark", title: "Invert Colors", inputMethod: "boolean" },
    ],
    knobs = utils.getKnobs(props, { accentColor: utils.randomColor() });
  return utils.makeUsageDocs(
    SimpleColors,
    import.meta.url,
    utils.getDemo(
      `<style>
      div {
        padding: 20px;
        margin: 0 0 15px;
      }
      button {
        color: var(--simple-colors-default-theme-grey-1);
        border-radius: 3px;
        padding: 3px 5px;
        font-size: 110%;
        cursor: pointer;
      }
      #box {
        background-color: var(--simple-colors-default-theme-grey-1);
        border: 1px solid var(--simple-colors-default-theme-grey-2);
        display: block;
        margin: 0 15px;
        padding: 20px;
      }
      #box {
        color: var(--simple-colors-default-theme-grey-12);
        background-color: var(--simple-colors-default-theme-accent-1);
        border: 4px solid var(--simple-colors-default-theme-accent-3);
      }
      simple-colors-picker-demo[dark] #box {
        background-color: var(--simple-colors-default-theme-grey-1);
        border: 4px solid var(--simple-colors-default-theme-accent-6);
      }
      .button {
        background-color: var(--simple-colors-default-theme-accent-7);
        border: 2px solid var(--simple-colors-default-theme-accent-8);
      }
      .button:hover {
        background-color: var(--simple-colors-default-theme-accent-8);
      }
      .confirm {
        background-color: var(--simple-colors-default-theme-blue-7);
        border: 2px solid var(--simple-colors-default-theme-blue-8);
      }
      .confirm:hover {
        background-color: var(--simple-colors-default-theme-blue-8);
      }
      .delete {
        background-color: var(--simple-colors-default-theme-red-7);
        border: 2px solid var(--simple-colors-default-theme-red-8);
      }
      .delete:hover {
        background-color: var(--simple-colors-default-theme-red-8);
      }
    </style>
    <simple-colors id="simplecolors" accent-color="${
      knobs.props.accentColor.knob
    }"${knobs.props.dark.knob ? "dark " : ""}>
      <div id="box">
        <p>Use the knobs to change my colors!</p>
        <button class="button">Button</button>
        <button class="confirm">Save</button>
        <button class="delete">Delete</button>
      </div>
    </simple-colors>`,
      `<p>
      Simple-colors is a method for managing colors. It includes a 
      custom element, and CSS variables declared in shared styles.
    </p>
    <p>
      With simple colors, you can easily create a dark mode version of 
      your interfaces, and/or swap accent colors on the fly.
    </p>`,
    ),
  );
};

export const AllTheSimpleColors = () => {
  return document.createElement("simple-colors-swatches");
};

export const SimpleColorsPickerStory = () => {
  let rawProps = SimpleColorsPicker.properties;
  delete rawProps.accentColor;
  delete rawProps.dark;
  let knobs = utils.getKnobs(utils.getElementProperties(rawProps), {
    label: 'Select a color from "simple-colors"',
  });
  return utils.makeElement(SimpleColorsPicker, knobs);
};
