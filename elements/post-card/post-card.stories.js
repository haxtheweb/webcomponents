/*import { html } from "lit";

import "./post-card.js";

export default {
  title: "Post Card",
  component: "post-card",
  argTypes: {
    location: { control: "text" },
    photoSrc: { control: "file" },
    stampSrc: { control: "file" },
    to: { control: "text" },
    from: { control: "text" },
    message: { control: "text" },
    slot: { control: "text" },
  },
};

function PostCardTemplate({
  location,
  photoSrc,
  stampSrc,
  to,
  from,
  message,
  slot,
}) {
  return html`<post-card
    post-mark-locations="${location}"
    photoSrc="${photoSrc}"
    stampSrc="${stampSrc}"
    to="${to}"
    from="${from}"
    message="${message}"
  >
    ${slot}
  </post-card>`;
}
export const BlankCard = PostCardTemplate.bind({});
export const ExampleCard = PostCardTemplate.bind({});
ExampleCard.args = {
  photoSrc: "https://images.onwardstate.com/uploads/2019/10/IMG_9180.jpg",
  stampSrc:
    "https://www.bestcleaners.com/wp-content/uploads/2017/06/AmericanFlag.jpg",
  to: "Billy",
  from: "Mandy",
  location: "Philly",
  message: "Have you seen Grim recently?",
};
*/
