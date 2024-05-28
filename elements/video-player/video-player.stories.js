import { VideoPlayer } from "./video-player.js";
import { withKnobs } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@haxtheweb/storybook-utilities/storybook-utilities.js";

export default {
  title: "Media|Video",
  component: VideoPlayer.tag,
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const BasicVideoPlayer = () => {
  return utils.makeUsageDocs(
    VideoPlayer,
    import.meta.url,
    utils.makeElementFromHaxDemo(VideoPlayer),
  );
};
