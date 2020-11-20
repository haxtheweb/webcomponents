import { html } from "lit-element/lit-element.js";
import { ImgPanZoom } from "@lrnwebcomponents/img-pan-zoom/img-pan-zoom.js";
import { ImgViewModal } from "@lrnwebcomponents/img-view-modal/img-view-modal.js";
import { ImgViewViewer } from "@lrnwebcomponents/img-view-modal/lib/img-view-viewer.js";
import { withKnobs, withWebComponentsKnobs } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

export default {
  title: "Media|Image View Modal",
  component: "img-view-modal",
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
const figures = [
    "Blue grey cat on red background.",
    "Metal bowl filled with red apples.",
    "Lighthouse in greyscale.",
    "Blue grey tabby looking at camera.",
    "Red cherries on a white dish.",
    "Beach with sunbathers.",
    "String lights on a tree against dark night sky.",
    "Empty beach with a heart drawn in the sand.",
  ].map((item, i) => {
    return {
      src: new URL(`demo/images/image${i + 1}.jpg`, import.meta.url),
      info: item,
    };
  }),
  toolbars = {
    top: {
      id: "top",
      type: "toolbar-group",
      contents: [
        "prevbutton",
        "navigatorbutton",
        "fullscreenbutton",
        "navXofY",
        "kbdbutton",
        "infobutton",
        "nextbutton",
      ],
    },
    bottom: {
      id: "bottom",
      type: "toolbar-group",
      contents: [
        "flipbutton",
        "rotategroup",
        "zoomgroup",
        "homebutton",
        "pangroup",
      ],
    },
  },
  settings = {
    figures: figures,
    infoToggled: false,
    kbdToggled: false,
    toolbars: toolbars,
  },
  exclusions = ["src", "sources"];
export const ImgViewViewerStory = () => {
  return utils.makeElementFromClass(
    ImgViewViewer,
    {
      figures: figures,
      infoToggled: false,
      kbdToggled: false,
      toolbars: toolbars,
      "--img-view-viewer-height": "90vh",
    },
    [
      { title: "viewer height", css: "--img-view-viewer-height" },
      { title: "background color", css: "--img-view-viewer-backgroundColor" },
      { title: "text color", css: "--img-view-viewer-color" },
      { title: "border color", css: "--img-view-viewer-borderColor" },
      {
        title: "background color (toggled buttons)",
        css: "--img-view-modal-viewer-backgroundColor",
      },
    ]
  );
};
export const ImgViewModalStory = () => {
  return utils.makeElementFromClass(
    ImgViewModal,
    {
      figures: figures,
      infoToggled: false,
      kbdToggled: false,
      toolbars: toolbars,
      title: utils.randomSentence(1, 5),
      emptyslot: `<button>Open Viewer</button>`,
    },
    [
      { title: "Modal button", slot: "" },
      { title: "modal width", css: "--img-view-modal-width" },
      { title: "modal height", css: "--img-view-modal-height" },
      { title: "background color", css: "--img-view-modal-backgroundColor" },
      { title: "text color", css: "--img-view-modal-color" },
      { title: "border color", css: "--img-view-modal-borderColor" },
      {
        title: "background color (toggled buttons)",
        css: "--img-view-modal-toggled-backgroundColor",
      },
    ],
    ["modal"]
  );
};
