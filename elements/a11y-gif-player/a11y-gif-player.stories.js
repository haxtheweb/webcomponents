import { html } from "lit-element/lit-element.js";
import { A11yGifPlayer } from "@lrnwebcomponents/a11y-gif-player/a11y-gif-player.js";
import { withKnobs, withWebComponentsKnobs } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

export default {
  title: "Media|GIF",
  component: "a11y-gif-player",
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" }
  }
};

export const A11yGifPlayerStory = () => {
  const utils = new StorybookUtilities();
  let gif = utils.makeElementFromClass(A11yGifPlayer, {
    alt: "It's Always Sunny in Philadelphia Pepe Silvia Meme with GIFs" ,
    src: "https://media0.giphy.com/media/zHaPZZvl6cVHi/giphy.gif",
    srcWithoutAnimation: "https://media0.giphy.com/media/zHaPZZvl6cVHi/480w_s.jpg"
  });
  gif.style.maxWidth = '200px';
  return gif;
};
