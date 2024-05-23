import { html } from "lit-html";
import { CodeEditor } from "@haxtheweb/code-editor/code-editor.js";
import "@haxtheweb/code-editor/lib/monaco-element/monaco-element.js";
import "@haxtheweb/code-editor/lib/code-pen-button.js";
import { withKnobs, text, boolean } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@haxtheweb/storybook-utilities/storybook-utilities.js";

export default {
  title: "Other|Code editor",
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
    utils.makeElementFromHaxDemo(CodeEditor),
  );
