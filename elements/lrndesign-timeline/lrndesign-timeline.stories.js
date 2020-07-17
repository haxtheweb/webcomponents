import { html } from "lit-element/lit-element.js";
import { LrndesignTimeline } from "@lrnwebcomponents/lrndesign-timeline/lrndesign-timeline.js";
import { withKnobs, withWebComponentsKnobs } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

export default {
  title: "Media|Timeline",
  component: "lrndesign-timeline",
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel", escapeHTML: false }
  }
};

export const LrndesignTimelineStory = () => {
  const utils = new StorybookUtilities();
  return utils.makeElementFromClass(LrndesignTimeline, {
    accentColor: "blue",
    timelineTitle: "Penn State University",
    emptyslot: `
    <p>This is lrndesign-timeline</p>
    <section>
      <img 
        class="media"
        alt="Profile illustration of, James Pollock, Governor of Pennsylvania 1855-1858."
        src="https://upload.wikimedia.org/wikipedia/commons/5/56/James_Pollock_Pennsylvania_Governor.jpg">
      <h3>1855 - Charter</h3>
      <p>
        Charter now in effect signed by Governor Pollock, February 22; 
        first Board of Trustees president, Judge Frederick Watts of Carlisle. 
        Site in Centre County selected from nine offered throughout state; 
        200 acres donated by James Irvin with $10,000 pledge from citizens 
        of Centre and Huntingdon counties.
      </p>
    </section>
    <section>
      <img 
        class="media"
        alt="Black and white photo original Old Main in an empty field."
        src="https://libraries.psu.edu/sites/default/files/migrated/1287768717666.jpg">
      <h3>"1856 - Construction of Old Main</h3>
      <p>
        Construction of Old Main (the &amp;quot;College Building&amp;quot;) begun; 
        supervised by William G. Waring, who was appointed superintendent to open 
        the school and plan farm, orchards and nursery.
      </p>
    </section>
    <section>
      <h3>1874 - The Pennsylvania State College</h3>
      <p>School renamed The Pennsylvania State College.</p>
    </section>
    <section>
      <h3>1953 - The Pennsylvania State University</h3>
      <p>The Pennsylvania State University became official name.</p>
    </section>`
  });
};
export const LrndesignTimelineHaxGizmo = () => {
  const utils = new StorybookUtilities();
  return utils.makeElementFromClass(LrndesignTimeline, {
    accentColor: "blue",
    timelineTitle: "Penn State University",
    dark: true,
    events: [
      {
        heading: "1855 - Charter",
        details:
          "Charter now in effect signed by Governor Pollock, February 22; first Board of Trustees president, Judge Frederick Watts of Carlisle. Site in Centre County selected from nine offered throughout state; 200 acres donated by James Irvin with $10,000 pledge from citizens of Centre and Huntingdon counties.",
        imagealt:
          "Propfile illustration of, James Pollock, Governor of Pennsylvania 1855-1858.",
        imagesrc:
          "https://upload.wikimedia.org/wikipedia/commons/5/56/James_Pollock_Pennsylvania_Governor.jpg"
      },
      {
        heading: "1856 - Construction of Old Main",
        details:
          "Construction of Old Main (the &amp;quot;College Building&amp;quot;) begun; supervised by William G. Waring, who was appointed superintendent to open the school and plan farm, orchards and nursery.",
        imagealt: "Black and white photo original Old Main in an empty field.",
        imagesrc:
          "https://libraries.psu.edu/sites/default/files/migrated/1287768717666.jpg"
      },
      {
        heading: "1874 - The Pennsylvania State College ",
        details: "School renamed The Pennsylvania State College. "
      },
      {
        heading: "1953 - The Pennsylvania State University",
        details: "The Pennsylvania State University became official name."
      }
    ]
  });
};
