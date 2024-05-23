import { IframeLoader } from "./iframe-loader.js";
import { withKnobs } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@haxtheweb/storybook-utilities/storybook-utilities.js";

export default {
  title: "Other|Iframe",
  component: IframeLoader.tag,
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const IframeLoadingIndicator = () => {
  return utils.makeUsageDocs(
    IframeLoader,
    import.meta.url,
    utils.makeElementFromClass(IframeLoader, {
      emptyslot: `<iframe
        width="100%"
        height="600px"
        frameborder="0"
        allowfullscreen="true"
        webkitallowfullscreen="true"
        mozallowfullscreen="true"
        src="https://haxtheweb.org"></iframe>`,
    }),
  );
};
