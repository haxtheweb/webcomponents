import { html } from "lit-element/lit-element.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import {
  withKnobs,
  text,
  button,
  number,
  select,
  date,
  object,
  color,
  array,
  boolean,
  radios,
  files,
  optionsKnob,
} from "@open-wc/demoing-storybook";

/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */

/**
 * Object to help load things in globally scoped and fire events when ready
 */
export class StorybookUtilities {
  get lorem() {
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
  camelToKebab(camel) {
    return camel.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2").toLowerCase();
  }

  /**
   * colors from Simple Colors
   * @returns {array}
   * @memberof StorybookUtilities
   */
  getColors() {
    let simple = window.SimpleColorsSharedStyles.requestAvailability();
    return simple && simple.colors ? Object.keys(simple.colors) : false;
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
  getElementProperties(props, haxProps) {
    let quick = haxProps && haxProps.settings ? haxProps.settings.quick : [],
      configure =
        haxProps && haxProps.settings ? haxProps.settings.configure : [],
      advanced =
        haxProps && haxProps.settings ? haxProps.settings.advanced : [],
      hax = quick.concat(configure, advanced);
    return hax.length > 0
      ? hax
      : Object.keys(props || {}).map(property => {
          let type = props[property].type;
          return {
            property: property,
            inputMethod: type ? type.name.toLowerCase() : "textfield"
          };
        });
  }

  /**
   * default value or random color from Simple Colors
   * @param {string} defaultValue
   * @returns {string}
   * @memberof StorybookUtilities
   */
  getRandomColor = () => this.getRandomOption(this.getColors());

  /**
   * default value or random color from Simple Colors
   * @param {string} defaultValue
   * @returns {string}
   * @memberof StorybookUtilities
   */
  getRandomHex= () => `#${[0,0,0].map(i=>this.getRandomNumber(i,255).toString(16)).map(i=>i.length < 2 ? `0${i}`: `${i}`).join('')}`;

  /**
   * default value or random color from Simple Colors
   * @param {string} defaultValue
   * @returns {string}
   * @memberof StorybookUtilities
   */
  getRandomImage = () => this.getRandomOption([
    "//picsum.photos/1200/900",
    "//picsum.photos/900/900",
    "//picsum.photos/1200/800",
    "//picsum.photos/800/1600",
    "//picsum.photos/400/1200"
  ]);

  /**
   * default value or randomly true or false
   * @param {string} defaultValue
   * @returns {boolean}
   * @memberof StorybookUtilities
   */
  getRandomOption = (options=[]) => options.length > 0 ? options[Math.floor(Math.random() * Math.floor(options.length))] : undefined;

  /**
   * default value or randomly true or false
   * @param {string} defaultValue
   * @returns {boolean}
   * @memberof StorybookUtilities
   */
  getRandomBool = () => Math.random() >= 0.5;

  /**
   * default value or randomly true or false
   * @param {string} defaultValue
   * @returns {boolean}
   * @memberof StorybookUtilities
   */
  getRandomNumber = (min=0,max=100+min,step=1) => min + Math.floor((Math.random() * Math.floor((max-min)/step))) * step;

  /**
   * default value or random string of 1-5 words
   * @param {string} defaultValue
   * @returns {string}
   * @memberof StorybookUtilities
   */
  getRandomText = () =>this.getRandomOption([
    "I regret nothing",
    "I see your value now.",
    "Never listen to Pierce.",
    "Cool cool cool.",
    "Movie reference",
    "Pop Pop!",
    "Six seasons and a movie!",
    "Umm.. Bitter much?",
    "Consider yourself Chang'd!",
    "Put it in a letter, Jane Austen!",
    "That was a game. This is paintball.",
    "This is definitely the darkest timeline.",
    "I need help reacting to something.",
    "Frankly, my dear, I don't give a dean!",
    "I give this year a \"D\", for delightful!"
  ]); // this.lorem.generateWords(Math.floor(Math.random() * Math.floor(5))+1);

  /**
   * default value or random string of 1-5 sentences
   * @param {string} defaultValue
   * @returns {string}
   * @memberof StorybookUtilities
   */
  getRandomTextarea = () =>this.getRandomOption([
    "Sometimes I think I lost something really important to me, and then it turns out I already ate it.",
    "Your last blow-off class taught me to live in the moment which I will always regret and never do again.",
    "Do you understand what a conspiracy is? When you conspire with everyone you come across, you're not really conspiring with anyone. You're just doing random crap.",
    "I painted a tunnel on the side of the library. When it dries, I'm going for it.",
    "We'll definitely be back next year. If not, it'll be because an asteroid has destroyed all human civilization. And that's canon.",
    "Sometimes the hardest prisons to break out of, are the ones without locks.",
    "When you really know who you are and what you like about yourself, changing for other people isn't such a big deal.",
    "Look at me. It's clear to you that I am awesome, but I can never admit that, because that would make me an ass.",
    "Let's do what people do. Let's get a house we can't afford and a dog that makes us angry.",
    "I discovered at a very early age that if I talked long enough, I could make anything right or wrong. So either I'm god, or thruth is relative. Either way: Booyah.",
    "The funny thing about being smart, is that you can get through most of life without ever having to do any work."
  ]);//this.lorem.generateSentences(Math.floor(Math.random() * Math.floor(5))+1);

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
   * @see https://github.com/storybookjs/storybook/tree/master/addons/knobs 
   * @memberof StorybookUtilities
   */
  getKnobs(properties,defaults={}) {
    let knobs = { props: {}, slots: {} };
    (properties || []).forEach(field => {
      let title = field.title,
        name = field.property || field.slot,
        attribute = this.camelToKebab(name),
        label = title && name ? `${title} (${name})` : title || name,
        group = field.property ? "props" : field.slot ? "slots" : "vars",
        method = field.inputMethod,
        options = field.options,
        val = defaults[name],
        colors = this.getColors(),
        type;
      if (options) {
        if (method === "select") {
          type = select(label,options,val,group);
        } else if (method === "radio" && options) {
          type = radio(label,options,val,group);
        } else if (method === "options" && options) {
          type = option(label,options,val,{display:"multi-select"} ,group);
        }
      } else if (method === "colorpicker" && colors) {
        let options = {};
        colors.forEach(color => (options[color] = color));
        type = select(label,options,val,group);
      } else if (method === "boolean") {
        type = boolean(label,val,group);
      } else if (method === "haxupload") {
        type = files(label,".pdf,.docx,xlsx,.pptx,.png,.jpg,.jpeg,.gif,.mp4,.mp3,.vtt",val, group);
      } else if (method === "datepicker") {
        type = date(label, val,group);
      } else if (method === "number") {
        type = number(label,val,{},group);
      } else if (method === "range") { //todo
        type = number(label,val,{range:true,min:60,max:90,step:1},group);
      } else if (method === "color") {
        type = color(label,val,group);
      } else if (method === "object") {
        type = object(label,val || {}, group);
      } else if (method === "array") {
        type = array(label,val || [],',',group);
      } else if (method === "textarea") {
        type = text(label,val||'',group);
      } else {
        type = text(label,val||'',group);
      }
      knobs[group][name] = { attribute: attribute, type: type, method: method };
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
  makeElement(tag, knobs) {
    let el = document.createElement(tag);
    Object.keys(knobs.props || {}).forEach(prop => {
      let knob = knobs.props[prop],
        attr = knob.attribute,
        val = knob.type;
      if (knob.method !== "object" && knob.method !== "array") el[prop] = val;
    });
    Object.keys(knobs.slots || {}).map(slot => {
      let div = document.createElement("div");
      div.slot = knobs.slots[slot].attribute;
      div.innerHTML = knobs.slots[slot].type;
      el.appendChild(div);
    });
    return el;
  }

  /**
   * makes an element based on its class
   * @param {object} custom element class
   * @returns {object} element
   * @memberof StorybookUtilities
   */
  makeElementFromClass(el,defaults={}) {
    let tag = el.tag,
      props = this.getElementProperties(el.properties, el.haxProperties),
      knobs = this.getKnobs(props,defaults);
    return this.makeElement(tag, knobs);
  }

  /**
   * gets slots template
   *
   * @param {object} slots
   * @returns {object} html template
   * @memberof StorybookUtilities
   */
  getSlots(slots) {
    return html`
      ${Object.keys(slots || {}).map(
        slot =>
          html`
            <div slot=${slots[slot].attribute}>${slots[slot].type}</div>
          `
      )}
    `;
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
