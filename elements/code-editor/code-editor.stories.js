import { html } from "lit-html";
import { CodeEditor } from "@lrnwebcomponents/code-editor/code-editor.js";
import "@lrnwebcomponents/code-editor/lib/monaco-element/monaco-element.js";
import "@lrnwebcomponents/code-editor/lib/code-pen-button.js";
import { withKnobs, text, boolean } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

export default {
  title: "Developer|Code editor",
  component: "code-editor",
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const CodeEditorStory = () =>
  utils.makeUsageDocs(
    CodeEditor,
    import.meta.url,
    utils.makeElementFromHaxDemo(CodeEditor)
  );
