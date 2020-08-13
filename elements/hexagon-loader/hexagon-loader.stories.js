import { html } from "lit-element/lit-element.js";
import {
  HexagonLoader,
  Hexagon
} from "@lrnwebcomponents/hexagon-loader/hexagon-loader.js";
import { withKnobs, withWebComponentsKnobs } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

export default {
  title: "Animations|Hexagon Loader",
  component: "hexagon-loader",
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel", escapeHTML: false }
  }
};
const utils = new StorybookUtilities();

export const Studio = () => {
  return utils.makeElementFromClass(
    HexagonLoader,
    {
      loading: true,
      itemCount: utils.getRandomNumber(1, 37),
      size: utils.getRandomOption([
        undefined,
        undefined,
        undefined,
        "small",
        "large",
        "epic"
      ]),
      border: "1px solid #eee",
      "border-radius": "3px"
    },
    [
      { css: "--hexagon-color" },
      { css: "border" },
      { css: "background-color" },
      { css: "border-radius" }
    ],
    ["items"]
  );
};
