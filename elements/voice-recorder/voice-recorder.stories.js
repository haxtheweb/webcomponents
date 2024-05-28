import { withKnobs, text, boolean } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@haxtheweb/storybook-utilities/storybook-utilities.js";
import { VoiceRecorder } from "./voice-recorder.js";

export default {
  title: "Media|Audio Record",
  component: VoiceRecorder.tag,
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const VoiceRecorderInput = () => {
  return utils.makeUsageDocs(
    VoiceRecorder,
    import.meta.url,
    utils.makeElementFromClass(VoiceRecorder),
  );
};
