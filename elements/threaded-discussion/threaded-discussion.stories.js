import { html } from "lit-html";
import { ThreadedDiscussion } from "@lrnwebcomponents/threaded-discussion/threaded-discussion.js";
import { withKnobs, text, boolean } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

export default {
  title: "Apps|Discussion",
  component: "threaded-discussion",
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const ThreadedDiscussionStory = () => {
  return utils.makeElementFromClass(ThreadedDiscussion, {
    source: new URL(`./demo/discussion.json`, import.meta.url),
    commentIcon: "send",
    demo: true,
  });
};
