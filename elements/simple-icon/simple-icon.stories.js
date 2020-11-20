import { html } from "lit-element/lit-element.js";
import { SimpleIconsetDemo } from "@lrnwebcomponents/simple-icon/lib/simple-iconset-demo.js";
import { SimpleIcon } from "@lrnwebcomponents/simple-icon/simple-icon.js";
import { SimpleIconLite } from "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";
import { SimpleIconButton } from "@lrnwebcomponents/simple-icon/lib/simple-icon-button.js";
import { SimpleIconButtonLite } from "@lrnwebcomponents/simple-icon/lib/simple-icon-button-lite.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import {
  withKnobs,
  withWebComponentsKnobs,
  select,
  number,
  boolean,
  text,
} from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

export default {
  title: "Media|Icons",
  component: "simple-icons",
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities(),
  accent = () => {
    return `accent-color="${select(
      "accentColor",
      utils.getColors(),
      utils.getRandomColor(),
      "Properties"
    )}"`;
  },
  contrast = () => {
    return `contrast="${number(
      "contrast",
      this.getRandomNumber(0, 1, 2, 3, 4),
      "Properties"
    )}"`;
  },
  dark = () => {
    return `dark="${bool("dark", utils.getRandomBool(), "Properties")}"`;
  },
  icon = () => {
    return `icon="${select(
      "icon",
      window.getStorybookIcons,
      utils.getRandomIcon(),
      "Properties"
    )}"`;
  };
export const SimpleIconsetStory = () => {
  return utils.getDemo(
    `<iconset-demo></iconset-demo>`,
    `<p>The following is a full list of icons.</p>`
  );
};

export const SimpleIconLiteStory = () => {
  return utils.getDemo(
    `<simple-icon-lite ${icon}></simple-icon-lite>`,
    `<p>The following is a demo of how to use a lite icon.</p>`
  );
};

export const SimpleIconButtonLiteStory = () => {
  return utils.getDemo(
    `<simple-icon-button-lite ${icon}></simple-icon-button-lite>`,
    `<p>The following is a demo of how to use a lite icon button.</p>`
  );
};

export const SimpleIconStory = () => {
  return utils.getDemo(
    `<simple-icon 
      accent="${accent}"  contrast="${contrast}"  dark="${dark}"  icon="${icon}">
    </simple-icon>`,
    `<p>The following is a demo of how to use an icon.</p>`
  );
};

export const SimpleIconButtonStory = () => {
  return utils.getDemo(
    `<simple-icon-button 
      accent="${accent}"  contrast="${contrast}"  dark="${dark}"  icon="${icon}">
    </simple-icon-button>`,
    `<p>The following is a demo of how to use an icon button.</p>`
  );
};
