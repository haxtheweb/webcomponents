import { withKnobs } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@haxtheweb/storybook-utilities/storybook-utilities.js";
import { WorksheetDownload } from "./worksheet-download.js";
// need to account for polymer goofiness when webpack rolls this up

export default {
  title: "Education|Course Design",
  component: WorksheetDownload.tag,
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const WorksheetDownloadStory = () =>
  utils.makeUsageDocs(
    WorksheetDownload,
    import.meta.url,
    utils.makeElementFromHaxDemo(WorksheetDownload),
  );
