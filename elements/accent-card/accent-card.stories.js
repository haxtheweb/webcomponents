import { html } from "lit-element/lit-element.js";
import { AccentCard } from "@lrnwebcomponents/accent-card/accent-card.js";
import { withKnobs, withWebComponentsKnobs, text, boolean, select } from '@open-wc/demoing-storybook';
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";

const utils = new StorybookUtilities();
export default {
  title: "Card",
  component: "accent-card",
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: { 
    options: { selectedPanel: 'storybookjs/knobs/panel' } 
  },
  stories: ['AccentCardStory']
};

export const AccentCardStory = () => {
  const props = utils.getElementProperties(AccentCard.properties,AccentCard.haxProperties);
  const k = getKnobs(props);
  let accentColor = k.props.accentColor.type;//select(k.accentColor.label,k.accentColor.options,k.accentColor.defaultValue,"Properties");
  const content = '';//text(k.content.label,"I am content.","Slots");
  return utils.makeElement('accent-card',k);
  /*return html`
  <accent-card accent-color="${accentColor}">
    ${utils.getSlots(k.slots)}
  </accent-card>`*/
  };