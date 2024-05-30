import { html } from "lit";
import {
  withKnobs,
  withWebComponentsKnobs,
  text,
  boolean,
} from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";
import { ChatAgent } from "./chat-agent.js";
// need to account for polymer goofiness when webpack rolls this up

/** 
 * Uncomment to add to Storybook
export default {
  title: 'Agent|ChatAgent',
  component: 'chat-agent',
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const ChatAgentStory = () => {
  return utils.makeElementFromClass(ChatAgent);
}; 
*/
