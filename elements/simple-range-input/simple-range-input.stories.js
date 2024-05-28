import { SimpleRangeInput } from "./simple-range-input.js";
import { withKnobs } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@haxtheweb/storybook-utilities/storybook-utilities.js";

export default {
  title: "Forms|Simple Range",
  component: SimpleRangeInput.tag,
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const RangeInput = () => {
  return utils.makeUsageDocs(
    SimpleRangeInput,
    import.meta.url,
    utils.makeElementFromClass(SimpleRangeInput, {
      "accent-color": "orange",
      dark: true,
      value: 16,
      max: 20,
      min: 4,
      label: "coolness factor",
      step: 4,
    }),
  );
};
