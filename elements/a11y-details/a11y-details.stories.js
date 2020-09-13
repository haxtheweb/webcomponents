import { html } from "lit-element/lit-element.js";
import { A11yDetails } from "@lrnwebcomponents/a11y-details/a11y-details.js";
import { withKnobs, withWebComponentsKnobs } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

export default {
  title: "Navigation|Details",
  component: "a11y-details",
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();

export const A11yDetailsStory = () =>
  utils.makeElementFromClass(
    A11yDetails,
    {
      position: "bottom",
      openText: `Show Aenean`,
      closeText: `Hide Aenean`,
      emptyslot: `<details>
        <summary>Aenean</summary>
        Aenean eget nisl volutpat, molestie purus eget, bibendum metus. 
        Pellentesque magna velit, tincidunt quis pharetra id, gravida placerat erat. 
        Maecenas id dui pretium risus pulvinar feugiat vel nec leo. 
        Praesent non congue tellus. Suspendisse ac tincidunt purus. 
        Donec eu dui a metus vehicula bibendum sed nec tortor. 
        Nunc convallis justo sed nibh consectetur, at pharetra nulla accumsan.
      </details>`,
    },
    [
      {
        slot: "",
        title: "Unnamed Slot",
        description: "<details> element",
        inputMethod: "code-editor",
      },
      { css: "--a11y-details-summary-fontSize" },
      { css: "--a11y-details-summary-color" },
      { css: "--a11y-details-summary-backgroundColor" },
      { css: "--a11y-details-summary-borderColor" },
      { css: "--a11y-details-summary-borderWidth" },
      { css: "--a11y-details-summary-borderStyle" },
      { css: "--a11y-details-summary-borderRadius" },
      { css: "--a11y-details-summary-padding" },
      { css: "--a11y-details-summary-focus-color" },
      { css: "--a11y-details-summary-focus-backgroundColor" },
      { css: "--a11y-details-summary-focus-borderColor" },
      { css: "--a11y-details-summary-focus-borderWidth" },
      { css: "--a11y-details-summary-focus-borderStyle" },
      { css: "--a11y-details-summary-focus-borderRadius" },
      { css: "--a11y-details-fontSize" },
      { css: "--a11y-details-color" },
      { css: "--a11y-details-backgroundColor" },
      { css: "--a11y-details-borderColor" },
      { css: "--a11y-details-borderWidth" },
      { css: "--a11y-details-borderStyle" },
      { css: "--a11y-details-borderRadius" },
      { css: "--a11y-details-padding" },
      { css: "--a11y-details-maxHeight" },
    ],
    ["summary", "details"]
  );

export const A11yDetailsHaxGizmo = () =>
  utils.makeElementFromHaxDemo(A11yDetails);
