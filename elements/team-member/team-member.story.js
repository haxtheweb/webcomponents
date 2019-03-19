import { TeamMember } from "./team-member.js";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

window.StorybookUtilities.requestAvailability();

/**
 * add to the pattern library
 * /
const TeamMemberPattern = {
  "of": "Pattern Library/Molecules/Layout", 
  "name": 'Team Member',
  "file": require("raw-loader!./demo/index.html"),
  "replacements": []
};
window.StorybookUtilities.instance.addPattern(TeamMemberPattern);

/**
 * add the live demo
 */
const TeamMemberStory = {
  "of": "team-member",
  "name": "team-member",
  "props": TeamMember.properties, 
  "slots": {}, 
  "attr": ``,
  "slotted": ``
}
window.StorybookUtilities.instance.addLiveDemo(TeamMemberStory);