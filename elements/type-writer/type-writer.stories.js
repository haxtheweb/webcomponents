import { TypeWriter } from "./type-writer.js";
import { withKnobs } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

export default {
  title: "Extra|Type Writer",
  component: TypeWriter.tag,
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const TypeWriterText = () => {
  return utils.makeUsageDocs(
    TypeWriter,
    import.meta.url,
    utils.makeElementFromClass(TypeWriter, {
      delay: 100,
      text: "This is how it goes when we type everything out like so",
      speed: 100,
      "cursor-duration": 100,
    })
  );
};
