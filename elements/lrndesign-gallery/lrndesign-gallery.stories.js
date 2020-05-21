import { html } from "lit-element/lit-element.js";
import { LrndesignGallery } from "@lrnwebcomponents/lrndesign-gallery/lrndesign-gallery.js";
import { withKnobs, withWebComponentsKnobs } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

export default {
  title: "Media|Gallery",
  component: "lrndesign-gallery",
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel", escapeHTML: false }
  }
};

const utils = new StorybookUtilities();
let options = [
    {
      slot: "",
      title: "Gallery Figures",
      inputMethod: "code-editor"
    },
    { css: "maxWidth" },
    { css: "--lrndesign-gallery-color", title: "text color" },
    { css: "--lrndesign-gallery-background-color", title: "background color" },
    { css: "--lrndesign-gallery-border-color", title: "subtle border color" },
    { css: "--lrndesign-gallery-focus-color", title: "accent color" },
    {
      css: "--lrndesign-gallery-thumbnail-outline",
      title: "thumbnail outline color"
    },
    {
      css: "--lrndesign-gallery-dialog-color",
      title: "zoom dialog text color"
    },
    {
      css: "--lrndesign-gallery-dialog-background-color",
      title: "zoom dialog background-color"
    },
    {
      css: "--lrndesign-gallery-dialog-titlebar-color",
      title: "zoom dialog title bar text color"
    },
    {
      css: "--lrndesign-gallery-dialog-titlebar-background-color",
      title: "zoom dialog title bar background-color"
    },
    {
      css: "--lrndesign-gallery-dialog-header-color",
      title: "zoom dialog header bar text color"
    },
    {
      css: "--lrndesign-gallery-dialog-header-background-color",
      title: "zoom dialog header bar background-color"
    },
    {
      css: "--lrndesign-gallery-carousel-next-bg",
      title: "gradient on carousel next button"
    },
    {
      css: "--lrndesign-gallery-carousel-prev-bg",
      title: "gradient on carousel prev button"
    }
  ],
  sources = [
    [
      {
        title: "Bird",
        details: utils.getRandomTextarea(),
        alt: "A bird with bright blue feathers.",
        src: new URL(`demo/images/bird.jpg`, import.meta.url),
        large: new URL(`demo/images/bird.jpg`, import.meta.url),
        thumbnail: new URL(`demo/images/thumbnails/bird.jpg`, import.meta.url)
      },
      {
        title: "Cat",
        alt: "A tabby cat's face.",
        details: utils.getRandomTextarea(),
        src: new URL(`demo/images/cat.jpeg`, import.meta.url),
        large: new URL(`demo/images/cat.jpeg`, import.meta.url),
        thumbnail: new URL(`demo/images/thumbnails/cat.jpeg`, import.meta.url)
      },
      {
        title: "Dog",
        alt: "A dog tilting its head.",
        details: utils.getRandomTextarea(),
        src: new URL(`demo/images/dog.jpg`, import.meta.url),
        large: new URL(`demo/images/dog.jpg`, import.meta.url),
        thumbnail: new URL(`demo/images/thumbnails/dog.jpg`, import.meta.url)
      },
      {
        title: "Fish",
        alt: "A bright red-orange fish",
        details: utils.getRandomTextarea(),
        src: new URL(`demo/images/fish.jpg`, import.meta.url),
        large: new URL(`demo/images/fish.jpg`, import.meta.url),
        thumbnail: new URL(`demo/images/thumbnails/fish.jpg`, import.meta.url)
      }
    ],
    [
      {
        title: "Atari",
        details: utils.getRandomTextarea(),
        src: new URL(`demo/images/atari.jpg`, import.meta.url),
        large: new URL(`demo/images/atari.jpg`, import.meta.url),
        thumbnail: new URL(`demo/images/thumbnails/atari.jpg`, import.meta.url)
      },
      {
        title: "Nintendo",
        details: utils.getRandomTextarea(),
        src: new URL(`demo/images/nintendo.png`, import.meta.url),
        large: new URL(`demo/images/nintendo.png`, import.meta.url),
        thumbnail: new URL(
          `demo/images/thumbnails/nintendo.png`,
          import.meta.url
        )
      },
      {
        title: "PS4",
        details: utils.getRandomTextarea(),
        src: new URL(`demo/images/ps4.jpg`, import.meta.url),
        large: new URL(`demo/images/ps4.jpg`, import.meta.url),
        thumbnail: new URL(`demo/images/thumbnails/ps4.jpg`, import.meta.url)
      },
      {
        title: "Sega",
        details: utils.getRandomTextarea(),
        src: new URL(`demo/images/sega.jpg`, import.meta.url),
        large: new URL(`demo/images/sega.jpg`, import.meta.url),
        thumbnail: new URL(`demo/images/thumbnails/sega.jpg`, import.meta.url)
      },
      {
        title: "XBox",
        details: utils.getRandomTextarea(),
        src: new URL(`demo/images/xbox.png`, import.meta.url),
        large: new URL(`demo/images/xbox.png`, import.meta.url),
        thumbnail: new URL(`demo/images/thumbnails/xbox.png`, import.meta.url)
      }
    ],
    [
      {
        title: "Apple",
        details: utils.getRandomTextarea(),
        src: new URL(`demo/images/apple.jpg`, import.meta.url),
        large: new URL(`demo/images/apple.jpg`, import.meta.url),
        thumbnail: new URL(`demo/images/thumbnails/apple.jpg`, import.meta.url)
      },
      {
        title: "Banana",
        details: utils.getRandomTextarea(),
        src: new URL(`demo/images/banana.jpg`, import.meta.url),
        large: new URL(`demo/images/banana.jpg`, import.meta.url),
        thumbnail: new URL(`demo/images/thumbnails/banana.jpg`, import.meta.url)
      },
      {
        title: "Carrot",
        details: utils.getRandomTextarea(),
        src: new URL(`demo/images/carrot.jpeg`, import.meta.url),
        large: new URL(`demo/images/carrot.jpeg`, import.meta.url),
        thumbnail: new URL(
          `demo/images/thumbnails/carrot.jpeg`,
          import.meta.url
        )
      }
    ]
  ];
export const LrndesignGalleryCarousel = () => {
  return utils.makeElementFromClass(
    LrndesignGallery,
    {
      accentColor: utils.getRandomColor(),
      title: utils.getRandomText(),
      description: utils.getRandomTextarea(),
      sources: utils.getRandomOption(sources),
      imagesrc: utils.getRandomImage(),
      maxWidth: "800px"
    },
    options
  );
};

export const LrndesignGalleryGrid = () => {
  return utils.makeElementFromClass(
    LrndesignGallery,
    {
      accentColor: utils.getRandomColor(),
      layout: "grid",
      sources: utils.getRandomOption(sources),
      imagesrc: utils.getRandomImage(),
      maxWidth: "800px"
    },
    options
  );
};

export const LrndesignGalleryMasonry = () => {
  return utils.makeElementFromClass(
    LrndesignGallery,
    {
      accentColor: utils.getRandomColor(),
      layout: "masonry",
      sources: sources.flat(),
      imagesrc: utils.getRandomImage(),
      maxWidth: "800px"
    },
    options
  );
};

export const LrndesignGalleryWithJustOneFigure = () => {
  return utils.makeElementFromClass(
    LrndesignGallery,
    {
      accentColor: utils.getRandomColor(),
      sources: [utils.getRandomOption(utils.getRandomOption(sources))],
      imagesrc: utils.getRandomImage(),
      maxWidth: "800px"
    },
    options
  );
};

export const LrndesignGalleryWithSlots = () => {
  return utils.makeElementFromClass(
    LrndesignGallery,
    {
      accentColor: utils.getRandomColor(),
      imagesrc: utils.getRandomImage(),
      maxWidth: "800px",
      emptyslot: utils
        .getRandomOption(sources)
        .map(
          source =>
            `<figure>
        <img srcset="${source.thumbnail || source.src} 480w, ${source.src} 800w"
        sizes="(max-width: 600px) 480px, 800px"
        src="${source.src || source.large}"
        alt="${source.alt}">
        <figcaption>
          ${source.title ? `<h3>${source.title}</h3>` : ""}
          ${source.details ? `<p>${source.details}</p>` : ""}
        </figcaption>
      </figure>
      `
        )
        .join("")
    },
    options
  );
};
