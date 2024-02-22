import { H5PElement } from "./h5p-element.js";
import { withKnobs } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

export default {
  title: "Education|H5P",
  component: H5PElement.tag,
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const EmbedMode = () => {
  return utils.makeUsageDocs(
    H5PElement,
    import.meta.url,
    utils.makeElementFromClass(H5PElement, {
      emptyslot: `<iframe
        width="100%"
        height="auto"
        src="https://media.ed.science.psu.edu/entity_iframe/node/4272"
        frameborder="0"
        class="entity_iframe entity_iframe_node"
        id="entity_iframe_node_2653"
        allowfullscreen="true"
        webkitallowfullscreen="true"
        mozallowfullscreen="true"
      ></iframe>`,
    }),
  );
};
