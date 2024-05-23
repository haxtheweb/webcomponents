import { html } from "lit-html";
import { withKnobs, text, boolean } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@haxtheweb/storybook-utilities/storybook-utilities.js";
import { LicenseElement as sbClass } from "./license-element.js";
// need to account for polymer goofiness when webpack rolls this up

export default {
  title: `Education|License`,
  component: sbClass.tag,
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const LicenseElementStory = () => {
  return utils.makeUsageDocs(
    sbClass,
    import.meta.url,
    utils.makeElementFromHaxDemo(sbClass),
  );
};
