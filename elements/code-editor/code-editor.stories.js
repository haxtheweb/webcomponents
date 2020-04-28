import { html } from "lit-element/lit-element.js";
import { CodeEditor } from "@lrnwebcomponents/code-editor/code-editor.js";
import "@lrnwebcomponents/code-editor/lib/monaco-element/monaco-element.js";
import "@lrnwebcomponents/code-editor/lib/code-pen-button.js";
import {
  withKnobs,
  withWebComponentsKnobs,
  text,
  boolean
} from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

export default {
  title: "Forms|Markup",
  component: "code-editor",
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" }
  }
};
const utils = new StorybookUtilities();
export const CodeEditorStory = () => {
  let template = document.createElement("template");
  template.innerHTML = '<p>Things and stuff</p>'; 
  
  let editor = utils.makeElementFromClass(CodeEditor, {
    id: "code",
    language: "html",
    "": template
  });
return editor;
};