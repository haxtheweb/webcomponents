import { HexagonLoader } from "@lrnwebcomponents/hexagon-loader/hexagon-loader.js";
import { withKnobs } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

export default {
  title: "System|Loading hexagons",
  component: "hexagon-loader",
  decorators: [withKnobs],
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
      itemCount: 37,
      size: "small",
      color: 'blue'
    });
  return utils.makeUsageDocs(HexagonLoader, import.meta.url, utils.makeElement("hexagon-loader", knobs));
};
