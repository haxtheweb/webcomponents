import { SimpleBlogCard } from "./simple-blog-card.js";
import { withKnobs } from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@haxtheweb/storybook-utilities/storybook-utilities.js";

export default {
  title: "Cards|Blog post",
  component: SimpleBlogCard.tag,
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const BasicBlogPost = () => {
  return utils.makeUsageDocs(
    SimpleBlogCard,
    import.meta.url,
    utils.makeElementFromClass(SimpleBlogCard, {
      empotyslot: `There is a buzz around the word Bitcoin in recent times and people think that bitcoin is blockchain and blockchain is
        bitcoin. Here I am…`,
      title: "Blockchain a buzz around Bitcoin",
      size: "small",
      link: "https://hackernoon.com/blockchain-a-buzz-around-bitcoin-9672ca2f17c6?source=collection_home---4------0---------------------",
      image:
        "https://cdn-images-1.medium.com/max/800/1*Ht8CKXqCx2TfH6t-FO2kUA.jpeg",
      author: "Shriram Untawale",
      date: "2014-04-01T16:30:00-08:00",
      readtime: "5",
      authorimage:
        "https://cdn-images-1.medium.com/fit/c/72/72/1*S-yMO7jfYkgmFwA9840zyw.jpeg",
      authorlink: "https://hackernoon.com/@adv.mkuntawale",
    }),
  );
};
