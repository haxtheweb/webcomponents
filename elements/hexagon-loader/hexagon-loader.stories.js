import { html } from "lit-element/lit-element.js";
import { HexagonLoader } from "@lrnwebcomponents/hexagon-loader/hexagon-loader.js";
import { Hexagon } from "@lrnwebcomponents/hexagon-loader/lib/hex-a-gon.js";
import { withKnobs, withWebComponentsKnobs } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

export default {
  title: "Animations|Hexagon Loader",
  component: "hexagon-loader",
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel", escapeHTML: false },
  },
};
const utils = new StorybookUtilities();

export const HexagonLoaderStory = () => {
  let options = {};
  for (let i = 1; i < 38; i++) {
    options[i] = i;
  }
  let props = utils.getElementProperties(
      {},
      {
        settings: {
          configure: [
            {
              property: "loading",
              title: "Display Loader",
              inputMethod: "boolean",
            },
            {
              property: "itemCount",
              title: "Number of Hexagons",
              inputMethod: "select",
              options: options,
            },
            {
              property: "size",
              title: "Size",
              inputMethod: "select",
              options: {
                "": "",
                small: "small",
                large: "large",
                epic: "epic",
              },
            },
            {
              property: "color",
              title: "Hexagon Color",
            },
          ],
        },
      }
    ),
    knobs = utils.getKnobs(props, {
      loading: true,
      itemCount: utils.randomNumber(1, 37),
      size: utils.randomOption([
        undefined,
        undefined,
        undefined,
        "small",
        "large",
        "epic",
      ]),
    });
  return utils.makeElement("hexagon-loader", knobs);
};

export const HexagonStory = () => {
  return utils.makeElementFromClass(Hexagon);
};
