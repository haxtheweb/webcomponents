import { html } from "lit-element/lit-element.js";
import { ThreadedDiscussion } from "@lrnwebcomponents/threaded-discussion/threaded-discussion.js";
import {
  withKnobs,
  withWebComponentsKnobs,
  text,
  boolean
} from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

export default {
  title: "Social|Discussion",
  component: "threaded-discussion",
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" }
  }
};
const utils = new StorybookUtilities();
export const ThreadedDiscussionStory = () => {
  return utils.makeElementFromClass(ThreadedDiscussion, {
    source: new URL(`./demo/discussion.json`, import.meta.url),
    commentIcon: "send",
    demo: true
  });
};
