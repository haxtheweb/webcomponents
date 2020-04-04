import { html } from "lit-element/lit-element.js";
import { A11yCollapseGroup } from "@lrnwebcomponents/a11y-collapse/lib/a11y-collapse-group.js";
import { A11yCollapse } from "@lrnwebcomponents/a11y-collapse/a11y-collapse.js";
import {
  withKnobs,
  withWebComponentsKnobs,
  text,
  boolean
} from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

export default {
  title: "Navigation|Collapse",
  component: "a11y-collapse-group",
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" }
  }
};
const utils = new StorybookUtilities();
export const A11yCollapseGroupStory = () => {
  let group = utils.makeElementFromClass(A11yCollapseGroup, {
    id: "group"
  });
  [1,2,3].forEach(i => {
    let el = document.createElement("a11y-collapse"),
      p = document.createElement("p"),
      div = document.createElement("div");
    el.id = `Item ${i}`;
    p.slot = "heading";
    div.slot = "content";
    p.innerHTML = utils.getRandomText();
    div.innerHTML = utils.getRandomTextarea();
    el.appendChild(p);
    el.appendChild(div);
    group.appendChild(el);
  });
  return group;
};

export const A11yCollapseStory = () => {
  return utils.makeElementFromClass(A11yCollapse, {
    heading: utils.getRandomText(),
    content: utils.getRandomTextarea(),
    icon: 'add'
  });
};
