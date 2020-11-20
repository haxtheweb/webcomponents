import { html } from "lit-element/lit-element.js";
import { A11yMediaPlayer } from "@lrnwebcomponents/a11y-media-player/a11y-media-player.js";
import { withKnobs, withWebComponentsKnobs } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";
import "@lrnwebcomponents/simple-search/simple-search.js";
import "@polymer/paper-slider/paper-slider.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-icons/av-icons.js";
import "@polymer/paper-toast/paper-toast.js";
import "@lrnwebcomponents/simple-fields/lib/simple-fields-field.js";
import "@lrnwebcomponents/simple-tooltip/simple-tooltip.js";
import "@lrnwebcomponents/a11y-media-player/lib/a11y-media-play-button.js";
import "@lrnwebcomponents/absolute-position-behavior/absolute-position-behavior.js";

export default {
  title: "Media|Youtube",
  component: "a11y-media-player",
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel", escapeHTML: false },
  },
};
const utils = new StorybookUtilities(),
  fields = [
    {
      property: "accentColor",
      title: "Accent color",
      inputMethod: "colorpicker",
    },
    {
      property: "dark",
      title: "Dark theme",
      inputMethod: "boolean",
    },
    {
      property: "mediaTitle",
      title: "Title",
      inputMethod: "textfield",
    },
    {
      property: "youtubeId",
      title: "YoutubeId",
      inputMethod: "textfield",
    },
    {
      property: "track",
      title: "Closed captions",
      inputMethod: "haxupload",
    },
    {
      property: "thumbnailSrc",
      title: "Thumbnail image",
      inputMethod: "haxupload",
    },
    {
      property: "linkable",
      title: "Share Link",
      inputMethod: "boolean",
    },
    {
      property: "disableSearch",
      title: "Disable Transcript Search",
      inputMethod: "boolean",
    },
    {
      property: "disableInteractive",
      title: "Disable Interactive Transcript",
      inputMethod: "boolean",
    },
    {
      property: "hideTimestamps",
      title: "Remove Transcript Timestamps",
      inputMethod: "boolean",
    },
    {
      property: "crossorigin",
      title: "Crossorigin",
      inputMethod: "select",
      options: {
        "": "",
        anonymous: "anonymous",
        "use-credentials": "use-credentials",
      },
    },
    {
      property: "darkTranscript",
      title: "Dark theme for transcript",
      inputMethod: "boolean",
    },
    {
      property: "disableInteractive",
      title: "Disable Interactive",
      inputMethod: "boolean",
    },
    {
      property: "hideTimestamps",
      title: "Hide timestamps",
      inputMethod: "boolean",
    },
    {
      property: "hideTranscript",
      title: "Hide Transcript",
      inputMethod: "boolean",
    },
    {
      property: "lang",
      title: "Language",
      inputMethod: "textfield",
    },
    {
      property: "linkable",
      title: "Include a share link?",
      inputMethod: "boolean",
    },
    {
      property: "stickyCorner",
      title: "Sticky Corner",
      inputMethod: "select",
      options: {
        none: "none/off",
        "top-left": "top-left",
        "top-right": "top-right",
        "bottom-left": "bottom-left",
        "bottom-right": "bottom-right",
      },
    },
    {
      property: "preload",
      title: "Preload source(s).",
      inputMethod: "select",
      options: {
        preload: "Preload all media",
        metadata: "Preload media metadata only",
        none: "Don't preload anything",
      },
    },
    {
      property: "tracks",
      title: "Track list",
      inputMethod: "array",
    },
    {
      property: "height",
      title: "Height",
      inputMethod: "textfield",
    },
    {
      property: "width",
      title: "width",
      inputMethod: "textfield",
    },
    {
      slot: "",
      title: "<iframe>",
      inputMethod: "code-editor",
    },
  ],
  defaults = {
    accentColor: utils.randomColor(),
    dark: utils.randomBool(),
    linkable: utils.randomBool(),
    stickyCorner: utils.randomOption([
      "none",
      "top-left",
      "top-right",
      "bottom-left",
      "bottom-right",
    ]),
  };

export const A11yMediaPlayerYoutubeStory = () => {
  return utils.makeElement(
    A11yMediaPlayer,
    utils.getKnobs(fields, {
      ...defaults,
      tracks: [
        {
          label: "English",
          kind: "subtitles",
          srclang: "en",
          src: new URL(`demo/samples/bueller.vtt`, import.meta.url),
        },
      ],
      poster: new URL(`demo/samples/bueller.jpg`, import.meta.url),
      standalone: utils.randomBool(),
      disableInteractive: utils.randomBool(),
      disableSearch: utils.randomBool(),
      hideTimestamps: utils.randomBool(),
      youtubeId: "NP0mQeLWCCo",
      emptyslot: `<iframe width="560" height="315" src="https://www.youtube.com/embed/NP0mQeLWCCo" allowfullscreen></iframe>`,
    })
  );
};
