import { html } from "lit-html";
import { withKnobs } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";
import { PersonTestimonial } from "./person-testimonial.js";

export default {
  title: "Cards|Person Testimonial",
  component: "person-testimonial",
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};

const utils = new StorybookUtilities();
export const PersonTestimonialStory = () => {
  return utils.makeUsageDocs(
    PersonTestimonial,
    import.meta.url,
    utils.makeElementFromHaxDemo(PersonTestimonial)
  );
};
