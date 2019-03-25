import { configure } from "@storybook/polymer";
import { setOptions } from "@storybook/addon-options";

setOptions({
  name: "lrnwebcomponents",
  hierarchyRootSeparator: /\|/
});

const req = require.context("../elements", true, /\.story\.js$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
