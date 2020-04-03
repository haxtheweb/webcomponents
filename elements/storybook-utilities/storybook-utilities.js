import { html } from "lit-element/lit-element.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import { withKnobs, withWebComponentsKnobs, text, boolean, select } from '@open-wc/demoing-storybook';

/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */

/**
 * Object to help load things in globally scoped and fire events when ready
 */
export class StorybookUtilities {
  get lorem(){
    let LoremIpsum = require("lorem-ipsum");
    return new LoremIpsum.loremIpsum({
      sentencesPerParagraph: {
        max: 8,
        min: 4
      },
      wordsPerSentence: {
        max: 16,
        min: 4
      }
    });
  }
  
  /**
   * convert camelcase to kebab (for converting properties in attributes)
   * @param {string} camel
   * @returns {string} kebab
   * @memberof StorybookUtilities
   */
  camelToKebab(camel){
    return camel.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
  }

  /**
   * colors from Simple Colors
   * @returns {array}
   * @memberof StorybookUtilities
   */
  getColors(){
    let simple = window.SimpleColorsSharedStyles.requestAvailability();
    return simple && simple.colors ? Object.keys(simple.colors): false;
  }
    
  /**
   * gets array of hax properties or properties from an element
   * @param {object} element
   * @returns {array} 
   * [
   *   {
   *     title: "User-friendly title",
   *     property: "propertyName",
   *     slot: "slotName",
   *     inputMethod: "HAXschema-compatible inputMethod",
   *     options: {"value": "select field options object"},
   *     defaultValue: "optional default value to override random value generator",
   *   }
   * ]
   * @memberof StorybookUtilities
   */
  getElementProperties(props,haxProps){
    let quick = haxProps && haxProps.settings ? haxProps.settings.quick : [],
      configure = haxProps && haxProps.settings ? haxProps.settings.configure : [],
      advanced = haxProps && haxProps.settings ? haxProps.settings.advanced : [], 
      hax = quick.concat(configure,advanced);
    return hax.length > 0 ? hax : Object.keys(props || {}).map(property=>{
      let type = props[property].type;
      return {
        property: property,
        inputMethod: type ? type.name.toLowerCase() : 'textfield'
      }
    });
  }
    
  /**
   * default value or random color from Simple Colors
   * @param {string} defaultValue
   * @returns {string}
   * @memberof StorybookUtilities
   */
  getColor(defaultValue){
    let colors = this.getColors() || [],
      index = Math.floor(Math.random() * Math.floor(colors.length)),
      color = colors.length > 0 ? colors[index] : undefined; 
    return defaultValue || color;
  };

  
  /**
   * default value or randomly true or false
   * @param {string} defaultValue
   * @returns {boolean}
   * @memberof StorybookUtilities
   */
  getBoolean = (defaultValue) => defaultValue || (Math.random() >= 0.5);
    
  /**
   * default value or random string of 1-5 words
   * @param {string} defaultValue
   * @returns {string}
   * @memberof StorybookUtilities
   */
  getTextField = (defaultValue) => defaultValue || 'Testing 123';// this.lorem.generateWords(Math.floor(Math.random() * Math.floor(5))+1);
    
  /**
   * default value or random string of 1-5 sentences
   * @param {string} defaultValue
   * @returns {string}
   * @memberof StorybookUtilities
   */
  getTextArea = (defaultValue) => defaultValue || 'Testing 123. This is a test.';//this.lorem.generateSentences(Math.floor(Math.random() * Math.floor(5))+1);
    
  /**
   * gets knobs object from properties array
   * @param {array} properties
   * [
   *   {
   *     title: "User-friendly title",
   *     property: "propertyName",
   *     slot: "slotName",
   *     inputMethod: "HAXschema-compatible inputMethod",
   *     options: {"value": "select field options object"},
   *     defaultValue: "optional default value to override random value generator",
   *   }
   * ]
   * @returns {object}
   * {
   *  properties: {
   *    { 
   *      "attribute": "attributeName"
   *      "type": knobType(label,[options],defaultValue,"properties")
   *    }
   *  },
   *  slots: {
   *    { 
   *      "attribute": "attributeName"
   *      "type": knobType(label,[options],defaultValue,"slots")
   *    }
   *  }
   * }
   * @memberof StorybookUtilities
   */
  getKnobs(properties){
    let knobs = {props:{},slots:{}};
    (properties||[]).forEach(field=>{
      let title = field.title,
        name = field.property || field.slot,
        attribute = this.camelToKebab(name),
        label = title && name ? `${title} (${name})` : (title || name),
        group = field.property ? 'props' : field.slot ? 'slots' : 'vars',
        method = field.inputMethod, 
        options = field.options,
        defaultValue = field.defaultValue,
        colors = this.getColors(),
        type;
      if(method === "select" && options){
        type = select(label,options,undefined,group);
      } else if(method === "colorpicker" && colors){
        let options = {};
        colors.forEach(color=>options[color]=color);
        type = select(label,options,this.getColor(defaultValue),group);
      } else if(method === "boolean"){
        type = boolean(label,this.getBoolean(defaultValue),group);
      } else if(method === "haxupload"){
        type = text(label,'',group);
      } else if(method === "object"){
        type = undefined;
      } else if(method === "array"){
        type = undefined;
      } else if(method === "textarea"){
        type = text(label,this.getTextArea(defaultValue),group);
      } else {
        type = text(label,this.getTextField(defaultValue),group);
      }
      knobs[group][name] = {"attribute": attribute,"type": type, "method": method};
    });
    return knobs;
  }

  /**
   * makes an element based on knobs object
   * @param {string} tag element's tag
   * @param {object} knobs 
   * {
   *  properties: {
   *    { 
   *      "attribute": "attributeName"
   *      "type": knobType(label,[options],defaultValue,"properties")
   *    }
   *  },
   *  slots: {
   *    { 
   *      "attribute": "attributeName"
   *      "type": knobType(label,[options],defaultValue,"slots")
   *    }
   *  }
   * }
   * @returns {object} element
   * @memberof StorybookUtilities
   */
  makeElement(tag,knobs){
    let el = document.createElement(tag);
    Object.keys(knobs.props || {}).forEach(prop=>{
      let knob = knobs.props[prop],attr = knob.attribute, val = knob.type;
      if(knob.method !=="object" && knob.method !=="array") el[prop] = val;
    });
    Object.keys(knobs.slots||{}).map(slot=>{
      let div = document.createElement('div');
      div.slot = knobs.slots[slot].attribute;
      div.innerHTML = knobs.slots[slot].type;
      el.appendChild(div);
    });
    return el;
  };

  /**
   * makes an element based on its class
   * @param {object} custom element class
   * @returns {object} element
   * @memberof StorybookUtilities
   */
  makeElementFromClass(el){
    let tag = el.tag, 
      props = this.getElementProperties(el.properties,el.haxProperties),
      knobs = this.getKnobs(props);
    return this.makeElement(tag,knobs);
  }

  /**
   * gets slots template
   *
   * @param {object} slots
   * @returns {object} html template
   * @memberof StorybookUtilities
   */
  getSlots(slots){
    return html`${Object.keys(slots||{}).map(slot=>html`<div slot=${slots[slot].attribute}>${slots[slot].type}</div>`)}`;
  }

  /**
   * prevents the element's load of an unpacked location from failing
   * and loads a packed path specificed by thye story.js file
   * @param {*} name of the resource (should match the name the element is using to load)
   * @param {*} location of the resource, eg., require("file-loader!./path/to/file.js")
   * /
  addGlobalScript(name, location) {
    window.ESGlobalBridge.requestAvailability();
    if (!window.ESGlobalBridge.webpack) window.ESGlobalBridge.webpack = {};
    window.ESGlobalBridge.webpack[name] = true;
    window.ESGlobalBridge.instance.load(name, location, true);
  }*/
}

// register global bridge on window if needed
window.StorybookUtilities = window.StorybookUtilities || {};

window.StorybookUtilities.requestAvailability = () => {
  if (!window.StorybookUtilities.instance) {
    window.StorybookUtilities.instance = new StorybookUtilities();
  }
};
