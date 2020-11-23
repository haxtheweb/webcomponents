import { html } from "lit-element/lit-element.js";
import { LrndesignGallery } from "@lrnwebcomponents/lrndesign-gallery/lrndesign-gallery.js";
import { withKnobs, withWebComponentsKnobs } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

export default {
  title: "Media|Figure",
  component: "lrndesign-gallery",
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel", escapeHTML: false },
  },
};

const utils = new StorybookUtilities();
const gallery = utils.galleryData(import.meta.url);

export const LrndesignGalleryCarouselFigure = () => {
  let source = utils.randomOption(utils.randomOption(gallery.sources));
  return utils.makeElementFromClass(
    LrndesignGallery,
    {
      accentColor: utils.randomColor(),
      maxWidth: "800px",
      emptyslot: `<figure>
        <img srcset="${source.thumbnail || source.src} 480w, ${source.src} 800w"
        sizes="(max-width: 600px) 480px, 800px"
        src="${source.src || source.large}"
        alt="${source.alt}">
        <figcaption>
          ${source.title ? `<h3>${source.title}</h3>` : ""}
          ${source.details ? `<p>${source.details}</p>` : ""}
        </figcaption>
      </figure>
      `,
    },
    gallery.options
  );
};
