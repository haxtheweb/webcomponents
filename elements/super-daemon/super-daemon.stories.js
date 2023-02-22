import { html } from "lit-html";
import { withKnobs, text, boolean } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";
import { SuperDaemon } from "./super-daemon.js";
// need to account for polymer goofiness when webpack rolls this up

export default {
  title: "Daemon|SuperDaemon",
  component: "super-daemon",
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const SuperDaemonStory = () => {
  return utils.makeUsageDocs(
    SuperDaemon,
    import.meta.url,
    utils.makeElementFromClass(SuperDaemon)
  );
};
