import { configure } from "@storybook/polymer";
import { setOptions } from "@storybook/addon-options";

setOptions({
  name: "lrnwebcomponents",
  hierarchyRootSeparator: /\|/
});

function loadStories() {
  req.keys().forEach(filename => {
    if (filename.includes("node_modules")) {
      return;
    }

    return req(filename);
  });
}

configure(loadStories, module);
