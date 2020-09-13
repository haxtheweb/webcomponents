import { html } from "lit-element/lit-element.js";
import { A11yFigure } from "@lrnwebcomponents/a11y-figure/a11y-figure.js";
import { withKnobs, withWebComponentsKnobs } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

export default {
  title: "Media|Figure",
  component: "a11y-figure",
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();

export const A11yFigureStory = () =>
  utils.makeElementFromClass(
    A11yFigure,
    {
      openText: `Show Description`,
      closeText: `Hide Description`,
      maxWidth: "500px",
      emptyslot: `<figure>
        <img src="//placekitten.com/400/300" alt="random kitten">
        <figcaption>
          <h4>Random Kitten</h4>
          <details>
            <summary>Image Description</summary>
            Aenean eget nisl volutpat, molestie purus eget, bibendum metus. 
            Pellentesque magna velit, tincidunt quis pharetra id, gravida 
            placerat erat. Maecenas id dui pretium risus pulvinar feugiat 
            vel nec leo. Praesent non congue tellus. Suspendisse ac tincidunt 
            purus. Donec eu dui a metus vehicula bibendum sed nec tortor. 
            Nunc convallis justo sed nibh consectetur, at pharetra nulla 
            accumsan.
          </details>
        </figcaption>
      </figure>`,
    },
    [
      {
        slot: "",
        title: "Unnamed Slot",
        description: "<figure> element",
        inputMethod: "code-editor",
      },
      { css: "--a11y-figure-summary-fontSize" },
      { css: "--a11y-figure-summary-color" },
      { css: "--a11y-figure-summary-backgroundColor" },
      { css: "--a11y-figure-summary-borderColor" },
      { css: "--a11y-figure-summary-borderWidth" },
      { css: "--a11y-figure-summary-borderStyle" },
      { css: "--a11y-figure-summary-borderRadius" },
      { css: "--a11y-figure-summary-padding" },
      { css: "--a11y-figure-summary-focus-color" },
      { css: "--a11y-figure-summary-focus-backgroundColor" },
      { css: "--a11y-figure-summary-focus-borderColor" },
      { css: "--a11y-figure-summary-focus-borderWidth" },
      { css: "--a11y-figure-summary-focus-borderStyle" },
      { css: "--a11y-figure-summary-focus-borderRadius" },
      { css: "--a11y-figure-fontSize" },
      { css: "--a11y-figure-color" },
      { css: "--a11y-figure-backgroundColor" },
      { css: "--a11y-figure-borderColor" },
      { css: "--a11y-figure-borderWidth" },
      { css: "--a11y-figure-borderStyle" },
      { css: "--a11y-figure-borderRadius" },
      { css: "--a11y-figure-padding" },
      { css: "--a11y-figure-maxHeight" },
      { css: "maxWidth" },
    ],
    ["summary", "details", "figcaption", "imgSrc", "imgAlt"]
  );

export const A11yFigureHaxGizmo = () =>
  utils.makeElementFromHaxDemo(A11yFigure);
