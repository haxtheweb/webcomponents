import { html } from "lit-html";
import { RichTextEditor } from "@haxtheweb/rich-text-editor/rich-text-editor.js";
import { RichTextEditorToolbar } from "@haxtheweb/rich-text-editor/lib/toolbars/rich-text-editor-toolbar.js";
import { RichTextEditorToolbarFull } from "@haxtheweb/rich-text-editor/lib/toolbars/rich-text-editor-toolbar-full.js";
import { RichTextEditorToolbarMini } from "@haxtheweb/rich-text-editor/lib/toolbars/rich-text-editor-toolbar-mini.js";
import { withKnobs } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@haxtheweb/storybook-utilities/storybook-utilities.js";

export default {
  title: "Forms|Rich Text",
  component: "rich-text-editor",
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel", escapeHTML: false },
  },
};

const utils = new StorybookUtilities();
const emptyslot = `
<p>Click to edit me!</p>
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
`;
const toolbars = [
  "rich-text-editor-toolbar",
  "rich-text-editor-toolbar-full",
  "rich-text-editor-toolbar-mini",
];
export const RichTextEditorStory = () => {
  let props = utils.getElementProperties(RichTextEditor.properties);
  props.forEach((prop) => {
    if (prop.property === "type") {
      prop.inputMethod = "select";
      prop.itemsList = toolbars;
    }
  });
  return utils.makeElement(
    RichTextEditor,
    utils.getKnobs([...props, { slot: "", title: "Content" }], {
      emptyslot: emptyslot,
      type: utils.randomOption(toolbars),
    }),
  );
};
const configs = [
  [
    {
      label: "History",
      type: "button-group",
      buttons: [
        {
          command: "undo",
          icon: "undo",
          label: "Undo",
          shortcutKeys: "ctrl+z",
          type: "rich-text-editor-button",
        },
        {
          command: "redo",
          icon: "redo",
          label: "Redo",
          shortcutKeys: "ctrl+shift+z",
          type: "rich-text-editor-button",
        },
      ],
    },
    {
      label: "Basic Inline Operations",
      type: "button-group",
      buttons: [
        {
          label: "Format",
          type: "rich-text-editor-heading-picker",
        },
        {
          command: "bold",
          icon: "editor:format-bold",
          label: "Bold",
          shortcutKeys: "ctrl+b",
          toggles: true,
          type: "rich-text-editor-button",
        },
        {
          command: "italic",
          icon: "editor:format-italic",
          label: "Italics",
          shortcutKeys: "ctrl+i",
          toggles: true,
          type: "rich-text-editor-button",
        },
        {
          command: "removeFormat",
          icon: "editor:format-clear",
          label: "Erase Format",
          type: "rich-text-editor-button",
        },
      ],
    },
    {
      label: "Links",
      type: "button-group",
      buttons: [
        {
          icon: "link",
          label: "Link",
          shortcutKeys: "ctrl+k",
          type: "rich-text-editor-link",
        },
      ],
    },
    {
      label: "Clipboard Operations",
      type: "button-group",
      buttons: [
        {
          command: "cut",
          icon: "content-cut",
          label: "Cut",
          shortcutKeys: "ctrl+x",
          type: "rich-text-editor-button",
        },
        {
          command: "copy",
          icon: "content-copy",
          label: "Copy",
          shortcutKeys: "ctrl+c",
          type: "rich-text-editor-button",
        },
        {
          command: "paste",
          icon: "content-paste",
          label: "Paste",
          shortcutKeys: "ctrl+v",
          type: "rich-text-editor-button",
        },
      ],
    },
    {
      collapsedUntil: "md",
      label: "Subscript and Superscript",
      type: "button-group",
      buttons: [
        {
          command: "subscript",
          icon: "mdextra:subscript",
          label: "Subscript",
          toggles: true,
          type: "rich-text-editor-button",
        },
        {
          command: "superscript",
          icon: "mdextra:superscript",
          label: "Superscript",
          toggles: true,
          type: "rich-text-editor-button",
        },
      ],
    },
    {
      collapsedUntil: "sm",
      icon: "editor:functions",
      label: "Insert Symbol",
      symbolTypes: ["symbols"],
      type: "rich-text-editor-symbol-picker",
    },
    {
      collapsedUntil: "sm",
      label: "Lists and Indents",
      type: "button-group",
      buttons: [
        {
          command: "insertOrderedList",
          icon: "editor:format-list-numbered",
          label: "Ordered List",
          toggles: true,
          type: "rich-text-editor-button",
        },
        {
          command: "insertUnorderedList",
          icon: "editor:format-list-bulleted",
          label: "Unordered List",
          toggles: true,
          type: "rich-text-editor-button",
        },
        {
          collapsedUntil: "lg",
          command: "formatBlock",
          commandVal: "blockquote",
          label: "Blockquote",
          icon: "editor:format-quote",
          shortcutKeys: "ctrl+'",
          type: "rich-text-editor-button",
        },
        {
          command: "indent",
          icon: "editor:format-indent-increase",
          event: "text-indent",
          label: "Increase Indent",
          shortcutKeys: "ctrl+]",
          type: "rich-text-editor-button",
        },
        {
          command: "outdent",
          event: "text-outdent",
          icon: "editor:format-indent-decrease",
          label: "Decrease Indent",
          shortcutKeys: "ctrl+[",
          type: "rich-text-editor-button",
        },
      ],
    },
  ],
  [
    {
      label: "History",
      type: "button-group",
      buttons: [
        {
          command: "undo",
          icon: "undo",
          label: "Undo",
          type: "rich-text-editor-button",
        },
        {
          command: "redo",
          icon: "redo",
          label: "Redo",
          type: "rich-text-editor-button",
        },
      ],
    },
    {
      label: "Basic Inline Operations",
      type: "button-group",
      buttons: [
        {
          label: "Heading",
          blocks: [
            { label: "Paragraph", tag: "p" },
            { label: "Page Title", tag: "h1" },
            { label: "Article Title", tag: "h2" },
            { label: "Article Heading", tag: "h3" },
            { label: "Section Heading", tag: "h4" },
            { label: "Section Subheading", tag: "h5" },
          ],
          type: "rich-text-editor-heading-picker",
        },
        {
          command: "bold",
          icon: "editor:format-bold",
          label: "Bold",
          toggles: true,
          type: "rich-text-editor-button",
        },
        {
          command: "italic",
          icon: "editor:format-italic",
          label: "Italics",
          toggles: true,
          type: "rich-text-editor-button",
        },
        {
          command: "removeFormat",
          icon: "editor:format-clear",
          label: "Erase Format",
          type: "rich-text-editor-button",
        },
      ],
    },
    {
      label: "Links",
      type: "button-group",
      buttons: [{ type: "rich-text-editor-link" }],
    },
    {
      label: "Clipboard Operations",
      collapsedUntil: "md",
      type: "button-group",
      buttons: [
        {
          command: "cut",
          icon: "content-cut",
          label: "Cut",
          type: "rich-text-editor-button",
        },
        {
          command: "copy",
          icon: "content-copy",
          label: "Copy",
          type: "rich-text-editor-button",
        },
        {
          command: "paste",
          icon: "content-paste",
          label: "Paste",
          type: "rich-text-editor-button",
        },
      ],
    },
    {
      collapsedUntil: "sm",
      label: "Insertions",
      type: "button-group",
      buttons: [
        {
          type: "rich-text-editor-image",
        },
        {
          collapsedUntil: "xl",
          icon: "editor:functions",
          label: "Insert Symbol",
          type: "rich-text-editor-symbol-picker",
        },
        {
          collapsedUntil: "xl",
          icon: "image:tag-faces",
          label: "Insert Emoji",
          type: "rich-text-editor-emoji-picker",
        },
      ],
    },
    {
      collapsedUntil: "lg",
      label: "Lists and Indents",
      type: "button-group",
      buttons: [
        {
          command: "insertOrderedList",
          icon: "editor:format-list-numbered",
          label: "Ordered List",
          toggles: true,
          type: "rich-text-editor-button",
        },
        {
          command: "insertUnorderedList",
          icon: "editor:format-list-bulleted",
          label: "Unordered List",
          toggles: true,
          type: "rich-text-editor-button",
        },
        {
          collapsedUntil: "lg",
          command: "formatBlock",
          commandVal: "<blockquote>",
          label: "Blockquote",
          icon: "editor:format-quote",
          type: "rich-text-editor-button",
        },
        {
          label: "Increase Indent",
          icon: "editor:format-indent-increase",
          event: "text-indent",
          command: "indent",
          type: "rich-text-editor-button",
        },
        {
          label: "Decrease Indent",
          icon: "editor:format-indent-decrease",
          event: "text-outdent",
          command: "outdent",
          type: "rich-text-editor-button",
        },
      ],
    },
  ],
];
const hasImage = (config) => {
  return (
    (config || []).filter((group) => {
      return (
        (group.buttons || []).filter((button) => {
          return (button.type = "rich-text-editor-image");
        }).length > 0
      );
    }).length > 0
  );
};
const editor = (id, config) =>
  `<rich-text-editor toolbar="${id}">${emptyslot}${
    !hasImage(config)
      ? ``
      : `<p><img src="//placekitten.com/200/200" width="50px"></p>\n`
  }</rich-text-editor>`;
const rawProps = (toolbarProps) => {
  delete toolbarProps.canceled;
  delete toolbarProps.controls;
  delete toolbarProps.target;
  delete toolbarProps.responsiveSize;
  delete toolbarProps.savedSelection;
  delete toolbarProps.range;
  let props = utils.getElementProperties(toolbarProps);
  props.forEach((prop) => {
    if (prop.property === "moreIcon") prop.inputMethod = "iconpicker";
  });
  return props;
};
export const RichTextEditorToolbarStory = () => {
  let props = rawProps(RichTextEditorToolbar.properties);
  let knobs = utils.getKnobs(props, {
    config: utils.randomOption(configs),
    id: "my-toolbar",
  });
  return utils.getDemo(
    `${utils.makeElement(RichTextEditorToolbar, knobs, true)}${editor(
      knobs.props.id.knob,
      knobs.props.config ? knobs.props.config.knob : [],
    )}`,
  );
};
export const RichTextEditorToolbarFullStory = () => {
  let props = rawProps(RichTextEditorToolbarFull.properties);
  let knobs = utils.getKnobs(props, {
    config: utils.randomOption(configs),
    id: "my-full-toolbar",
  });
  return utils.getDemo(
    `${utils.makeElement(RichTextEditorToolbarFull, knobs, true)}${editor(
      knobs.props.id.knob,
      knobs.props.config ? knobs.props.config.knob : [],
    )}`,
  );
};
export const RichTextEditorToolbarMiniStory = () => {
  let props = rawProps(RichTextEditorToolbarMini.properties);
  let config = [
    {
      label: "Basic Inline Operations",
      type: "button-group",
      buttons: [
        {
          command: "bold",
          icon: "editor:format-bold",
          label: "Bold",
          toggles: true,
          type: "rich-text-editor-button",
        },
        {
          command: "italic",
          icon: "editor:format-italic",
          label: "Italics",
          toggles: true,
          type: "rich-text-editor-button",
        },
        {
          collapsedUntil: "md",
          command: "removeFormat",
          icon: "editor:format-clear",
          label: "Erase Format",
          type: "rich-text-editor-button",
        },
      ],
    },
    {
      label: "Links",
      type: "button-group",
      buttons: [
        {
          command: "link",
          icon: "link",
          label: "Link",
          toggledCommand: "unlink",
          toggledIcon: "mdextra:unlink",
          toggledLabel: "Unink",
          toggles: true,
          type: "rich-text-editor-link",
        },
      ],
    },
    {
      collapsedUntil: "md",
      label: "Subscript and Superscript",
      type: "button-group",
      buttons: [
        {
          command: "subscript",
          icon: "mdextra:subscript",
          label: "Subscript",
          toggles: true,
          type: "rich-text-editor-button",
        },
        {
          command: "superscript",
          icon: "mdextra:superscript",
          label: "Superscript",
          toggles: true,
          type: "rich-text-editor-button",
        },
      ],
    },
    {
      collapsedUntil: "sm",
      label: "Lists and Indents",
      type: "button-group",
      buttons: [
        {
          command: "insertOrderedList",
          icon: "editor:format-list-numbered",
          label: "Ordered List",
          toggles: true,
          type: "rich-text-editor-button",
        },
        {
          command: "insertUnorderedList",
          icon: "editor:format-list-bulleted",
          label: "Unordered List",
          toggles: true,
          type: "rich-text-editor-button",
        },
      ],
    },
  ];
  let knobs = utils.getKnobs(props, {
    config: config,
    id: "my-mini-toolbar",
  });
  return utils.getDemo(`${utils.makeElement(
    RichTextEditorToolbarMini,
    knobs,
    true,
  )}
<figure style="max-width: 300px; border: 1px solid black;">
  <img src="//placekitten.com/300/300">
  <figcaption style="padding: 10px;">
    <rich-text-editor type="rich-text-editor-toolbar-mini">
      Click to edit inline with rich-text-editor-toolbar-mini
    </rich-text-editor>
  </figcaption>
</figure>`);
};
