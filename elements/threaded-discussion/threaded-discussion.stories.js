import { html } from "lit-element/lit-element.js";
import { ThreadedDiscussionGroup } from "@lrnwebcomponents/threaded-discussion/lib/threaded-discussion-group.js";
import { ThreadedDiscussion } from "@lrnwebcomponents/threaded-discussion/threaded-discussion.js";
import {
  withKnobs,
  withWebComponentsKnobs,
  text,
  boolean
} from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

export default {
  title: "Navigation|Collapse",
  component: "threaded-discussion-group",
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" }
  }
};
const utils = new StorybookUtilities();
export const ThreadedDiscussionGroupStory = () => {
  let props = utils.getElementProperties(
    ThreadedDiscussionGroup.properties,
    ThreadedDiscussionGroup.haxProperties
  );
  return utils.makeElementFromClass(
    ThreadedDiscussionGroup,
    {
      id: "group",
      emptyslot: [1, 2, 3]
        .map(
          i =>
            `<threaded-discussion id="Item ${i}">
          <p slot="heading">${utils.getRandomText()}</p>
          <div slot="content">${utils.getRandomTextarea()}</div>
          </threaded-discussion>`
        )
        .join("")
    },
    [
      { css: "--threaded-discussion-group-margin", title: "Collapse group's margin" },
      { css: "--threaded-discussion-margin", title: "Collapse item's margin" }
    ]
  );
};
export const ThreadedDiscussionStory = () => {
  return utils.makeElementFromClass(
    ThreadedDiscussion,
    {
      heading: `<p>${utils.getRandomText()}</p>`,
      content: utils.getRandomTextarea(),
      icon: "add"
    },
    [
      { css: "--threaded-discussion-margin" },
      { css: "--threaded-discussion-border" },
      {
        css: "--threaded-discussion-horizontal-padding",
        title: "default horizontal-padding"
      },
      { css: "--threaded-discussion-padding-left" },
      { css: "--threaded-discussion-padding-right" },
      {
        css: "--threaded-discussion-vertical-padding",
        title: "default vertical-padding"
      },
      { css: "--threaded-discussion-padding-top", title: "padding-top" },
      { css: "--threaded-discussion-padding-bottom", title: "padding-bottom" },
      {
        css: "--threaded-discussion-border-between",
        title: "vorder between heading and content"
      },
      { css: "--threaded-discussion-heading-font-weight" },
      { css: "--threaded-discussion-heading-color" },
      { css: "--threaded-discussion-heading-background-color" },
      { css: "--threaded-discussion-overflow-y" },
      { css: "--threaded-discussion-max-height" }
    ]
  );
};
