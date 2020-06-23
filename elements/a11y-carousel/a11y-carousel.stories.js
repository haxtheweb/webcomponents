import { html } from "lit-element/lit-element.js";
import { a11yCarousel } from "@lrnwebcomponents/a11y-carousel/a11y-carousel.js";
import { a11yCarouselButton } from "@lrnwebcomponents/a11y-carousel/lib/a11y-carousel-button.js";
import { withKnobs, withWebComponentsKnobs } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

export default {
  title: "Media|Image Compare Slider",
  component: "a11y-carousel",
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" }
  }
};
const utils = new StorybookUtilities();
export const a11yCarouselStory = () => {
  return utils.makeElementFromClass(
    a11yCarousel,
    {
      noPrevNext: true,
      noButtons: false,
      emptyslot: `
        <figure id="figure-1">
          <img src="//placekitten.com/400/200" alt="Random Kitten, 400 X 200"/>
          <figcaption>Item 1</figcaption>
        </figure>
        <figure id="figure-2">
          <img src="//placekitten.com/300/100" alt="Random Kitten, 300 X 100"/>
          <figcaption>Item 2</figcaption>
        </figure>
        <figure id="figure-3">
          <img src="//placekitten.com/400/300" alt="Random Kitten, 400 X 300"/>
          <figcaption>Item 3</figcaption>
        </figure>`,
      width: "100%",
      maxWidth: "400px"
    },
    [
      { title: "Content", slot: "" },
      { title: "Above Carousel", slot: "above" },
      { title: "Below Carousel", slot: "below" },
      { css: "width" },
      { css: "maxWidth" }
    ]
  );
};

export const a11yCarouselButtonStory = () => {
  let div = document.createElement("div"),
    carousel = document.createElement("a11y-carousel");
  div.slot = "below";
  carousel.noButtons = false;
  carousel.innerHTML = `
    <figure id="figure-1">
      <img src="//placekitten.com/400/200" alt="Random Kitten, 400 X 200"/>
      <figcaption>Item 1 (figure id: figure-1)</figcaption>
    </figure>
    <figure id="figure-2">
      <img src="//placekitten.com/300/100" alt="Random Kitten, 300 X 100"/>
      <figcaption>Item 2 (figure id: figure-2)</figcaption>
    </figure>
    <figure id="figure-3">
      <img src="//placekitten.com/400/300" alt="Random Kitten, 400 X 300"/>
      <figcaption>Item 3 (figure id: figure-3)</figcaption>
    </figure>`;
  div.appendChild(
    utils.makeElementFromClass(a11yCarouselButton, {
      buttonType: utils.getRandomOption(["","first","next","prev","last"]),
      controls: utils.getRandomOption(["","figure-1","figure-2","figure-3"]),
      emptyslot: "Custom Button"
    })
  );
  div.innerHTML = `
    <a11y-carousel-button button-type="first" controls="figure-1">first</a11y-carousel-button>
    <a11y-carousel-button button-type="prev" controls="figure-1">prev</a11y-carousel-button>
    <a11y-carousel-button controls="figure-1">Item 1</a11y-carousel-button>
    <a11y-carousel-button controls="figure-2">Item 2</a11y-carousel-button>
    <a11y-carousel-button controls="figure-3">Item 3</a11y-carousel-button>
    <a11y-carousel-button button-type="next" controls="figure-2">next</a11y-carousel-button>
    <a11y-carousel-button button-type="last" controls="figure-3">last</a11y-carousel-button>
  `;
  carousel.appendChild(div);
  return carousel;
};