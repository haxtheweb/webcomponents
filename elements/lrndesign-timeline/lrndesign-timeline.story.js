import { LrndesignTimeline } from "./lrndesign-timeline.js";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

window.StorybookUtilities.requestAvailability();
/**
 * add to the pattern library
 */
const LrndesignTimelinePattern = {
  of: "Pattern Library/Molecules/Media",
  name: "Timeline",
  file: require("raw-loader!./demo/index.html"),
  replacements: []
};
window.StorybookUtilities.instance.addPattern(LrndesignTimelinePattern);

/**
 * add the live demo
 */
let events = [
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
  ],
  props = Object.assign(
    window.StorybookUtilities.instance.getSimpleColorsPolymer("light-blue"),
    LrndesignTimeline.properties
  );
props.title.value = `My Timeline`;
props.events.value = events;
const LrndesignTimelineStory = {
  of: "Web Components",
  name: "lrndesign-timeline",
  props: props,
  slots: {
    slot: {
      name: "slot",
      type: "String",
      value: `This is lrndesign-timeline.`
    }
  },
  attr: ``,
  slotted: ``
};
window.StorybookUtilities.instance.addLiveDemo(LrndesignTimelineStory);
