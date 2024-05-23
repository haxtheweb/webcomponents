import { UserAction } from "./user-action.js";
import { withKnobs } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@haxtheweb/storybook-utilities/storybook-utilities.js";

export default {
  title: "Other|User action",
  component: UserAction.tag,
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const trackingBeacon = () => {
  return utils.makeUsageDocs(
    UserAction,
    import.meta.url,
    utils.makeElementFromClass(UserAction, {
      track: "click",
      every: true,
      demo: true,
      emptyslot: "<button>Clicking me issues an xAPI statement</button>",
    }),
  );
};
