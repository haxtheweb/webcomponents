import { html } from "lit-element/lit-element.js";
import { AccentCard } from "@lrnwebcomponents/accent-card/accent-card.js";
import { withKnobs, withWebComponentsKnobs, text, boolean, select } from '@open-wc/demoing-storybook';

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
  let simple = window.SimpleColorsSharedStyles.requestAvailability(), 
    colors = simple && simple.colors ? Object.keys(simple.colors): false,
    el = document.createElement('accent-card'),
    knobs = {props:{},slots:{},vars:{}};
  if(AccentCard.haxProperties) {
    Object.keys(AccentCard.haxProperties.settings || {}).forEach(setting=>{
      let settings = AccentCard.haxProperties.settings[setting];
      Object.keys(settings || {}).forEach(field=>{
        let title = settings[field].title,
          name = settings[field].property || settings[field].slot,
          attribute = name.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase(),
          label = title && name ? `${title} (${name})` : (title || name),
          group = settings[field].property ? 'props' : settings[field].slot ? 'slots' : 'vars',
          method = settings[field].inputMethod, 
          options = settings[field].options,
          type;
        if(method === "select" && options){
          type = select(label,options,undefined,group);
        } else if(method === "colorpicker" && colors){
          type = select(label,simple && colors ? Object.keys(simple.colors): [],'grey',group);
        } else if(method === "boolean"){
          type = boolean(label,false,group);
        } else if(method === "haxupload"){
          type = text(label,'',group);
        } else {
          type = text(label,title,group);
        }
        knobs[group][name] = {"attribute": attribute,"type": type};
      });
    });
  }
  
  Object.keys(knobs.props || {}).forEach(prop=>el.setAttribute(knobs.props[prop].attribute,knobs.props[prop].type));
  Object.keys(knobs.slots || {}).forEach(slot=>{
    let div = document.createElement('div');
    div.slot = knobs.slots[slot].attribute;
    div.innerHTML = knobs.slots[slot].type;
    el.appendChild(div);
  });
  return el;
}