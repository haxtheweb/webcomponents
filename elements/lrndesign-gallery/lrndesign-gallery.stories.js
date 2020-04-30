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
let sources = [
  {
    title: "The entanglement",
    details:
      "Photograph shows four kittens wearing clothes playing with a ball of twine.",
    src: "//tile.loc.gov/storage-services/service/pnp/ds/04000/04034r.jpg",
    thumbnail:
      "//tile.loc.gov/storage-services/service/pnp/ds/04000/04034_150px.jpg",
    large: "//tile.loc.gov/storage-services/service/pnp/ds/04000/04034v.jpg"
  },
  {
    title: "The Black Cat, December",
    details:
      'Poster shows a black cat wearing a collar with a "5 cents" charm as the cover illustration for The Black Cat for December.',
    src: "//tile.loc.gov/storage-services/service/pnp/ppmsca/43500/43507r.jpg",
    thumbnail:
      "//tile.loc.gov/storage-services/service/pnp/ppmsca/43500/43507_150px.jpg",
    large: "//tile.loc.gov/storage-services/service/pnp/ppmsca/43500/43507v.jpg"
  },
  {
    title: "Harper's May / Edward Penfield.",
    details: "Woman holding two cats.",
    sizing: "contain",
    src:
      "//tile.loc.gov/storage-services/service/pnp/cph/3g00000/3g03000/3g03000/3g03063r.jpg",
    thumbnail:
      "//tile.loc.gov/storage-services/service/pnp/cph/3g00000/3g03000/3g03000/3g03063_150px.jpg",
    large:
      "//tile.loc.gov/storage-services/service/pnp/cph/3g00000/3g03000/3g03000/3g03063v.jpg"
  },
  {
    title: "Brünnhilde",
    details: "Photograph shows cat dressed in Viking helmet and shield.",
    sizing: "contain",
    src: "//tile.loc.gov/storage-services/service/pnp/ppmsca/51500/51533r.jpg",
    thumbnail:
      "//tile.loc.gov/storage-services/service/pnp/ppmsca/51500/51533_150px.jpg",
    large: "//tile.loc.gov/storage-services/service/pnp/ppmsca/51500/51533v.jpg"
  }
];
export const LrndesignGalleryCarousel = () => {
  let carousel = utils.makeElementFromClass(LrndesignGallery, {
    accentColor: utils.getRandomColor(),
    galleryTitle: utils.getRandomText(),
    description: utils.getRandomTextarea(),
    sources: sources,
    imageSrc: utils.getRandomImage()
  });
  carousel.style.maxWidth = "800px";
  return carousel;
};

export const LrndesignGalleryGrid = () => {
  let grid = utils.makeElementFromClass(LrndesignGallery, {
    accentColor: utils.getRandomColor(),
    grid: true,
    galleryTitle: utils.getRandomText(),
    description: utils.getRandomTextarea(),
    sources: sources,
    imageSrc: utils.getRandomImage()
  });
  grid.style.maxWidth = "800px";
  return grid;
};
