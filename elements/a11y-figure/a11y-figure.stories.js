import { A11yFigure } from "@haxtheweb/a11y-figure/a11y-figure.js";
import { withKnobs } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@haxtheweb/storybook-utilities/storybook-utilities.js";

export default {
  title: "Media|Figure",
  component: "a11y-figure",
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const A11yFigureStory = () =>
  utils.makeUsageDocs(
    A11yFigure,
    import.meta.url,
    utils.makeElementFromHaxDemo(A11yFigure),
  );
