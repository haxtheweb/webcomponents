import { html } from "lit-element/lit-element.js";
import { RichTextEditor } from "@lrnwebcomponents/rich-text-editor/rich-text-editor.js";
import { RichTextEditorToolbar } from "@lrnwebcomponents/rich-text-editor/lib/toolbars/rich-text-editor-toolbar.js";
import { RichTextEditorToolbarFull } from "@lrnwebcomponents/rich-text-editor/lib/toolbars/rich-text-editor-toolbar-full.js";
import { RichTextEditorToolbarMini } from "@lrnwebcomponents/rich-text-editor/lib/toolbars/rich-text-editor-toolbar-mini.js";
import { withKnobs, withWebComponentsKnobs } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

export default {
  title: "Forms|Rick Text",
  component: "rich-text-editor",
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" }
  }
};

const utils = new StorybookUtilities();
let props = utils.getElementProperties(RichTextEditor.properties);
props.forEach(prop => {
  if (prop.property === "type") {
    prop.inputMethod = "select";
    prop.itemsList = [
      "rich-text-editor-toolbar",
      "rich-text-editor-toolbar-full",
      "rich-text-editor-toolbar-mini"
    ];
  }
});
export const RichTextEditorStory = () => {
  return utils.makeElement(
    RichTextEditor,
    utils.getKnobs([...props, { slot: "", title: "Content" }], {
      emptyslot: `
<p>
Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
In nec tincidunt tortor, at varius leo. Mauris varius 
iaculis enim in molestie. Cras semper odio id nunc 
convallis gravida. Curabitur ut dui non massa venenatis 
aliquam. Integer quis <a href="#top">turpis ut tellus</a> 
facilisis elementum. Nulla non leo dapibus, interdum ipsum 
imperdiet, pharetra nibh. Praesent cursus posuere varius. 
Sed non <i>pellentesque</i> massa. Morbi et purus id quam fermentum 
consectetur sit amet sed est. Nam convallis tellus non nisl 
tempor ornare. Duis <b>maximus</b> malesuada arcu sit amet 
placerat. Duis sollicitudin ex at dapibus porta. Pellentesque 
porta tellus at diam bibendum congue. Nam dignissim leo nec 
consectetur consequat.
</p>
        `,
      type: utils.getRandomOption([
        "rich-text-editor-toolbar",
        "rich-text-editor-toolbar-full",
        "rich-text-editor-toolbar-mini"
      ])
    })
  );
};
/*
export const SimpleSymbolPickerStory = () => {
  let props = utils.getElementProperties(SimpleSymbolPicker.properties);
  props.forEach(prop=>{
    if (prop.property === "symbolTypes") {
      prop.inputMethod = "select";
      prop.itemsList = ["symbols", "math", "characters", "greek", "misc"]
    }
  });
  return utils.makeElement(
    SimpleSymbolPicker,
    utils.getKnobs(
      [...props, ...css],
      {
        label: "Pick a symbol",
        symbolTypes: utils.getRandomOption(["symbols", "math", "characters", "greek", "misc"])
      }
    )
  );
};
export const SimpleEmojiPickerStory = () => {
  let props = utils.getElementProperties(SimpleSymbolPicker.properties);
  props.forEach(prop=>{
    if (prop.property === "emojiTypes") {
      prop.inputMethod = "select";
      prop.itemsList = [
        "emotions",
        "people",
        "nature",
        "food",
        "travel",
        "activities",
        "objects",
        "symbols",
        "flags"
      ]
    }
  });
  return utils.makeElement(
    SimpleEmojiPicker,
    utils.getKnobs(
      [...props, ...css],
      {
        label: "Pick an emoji",
        emojiTypes: utils.getRandomOption([
          "emotions",
          "people",
          "nature",
          "food",
          "travel",
          "activities",
          "objects",
          "symbols",
          "flags"
        ])
      }
    )
  );
};
*/
