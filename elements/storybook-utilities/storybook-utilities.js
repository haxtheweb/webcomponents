import { html } from "lit-element/lit-element.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@lrnwebcomponents/deduping-fix/deduping-fix.js";
import { IconsetDemo } from "@lrnwebcomponents/iconset-demo/iconset-demo.js";
import "@polymer/iron-icons/iron-icons.js";

import {
  withKnobs,
  withWebComponentsKnobs,
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
  optionsKnob
} from "@open-wc/demoing-storybook";

/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
window.getStorybookIconset = () => {
  let iconset = document.createElement("iconset-demo");
  iconset.hidden = true;
  document.body.appendChild(iconset);
  return iconset;
};
window.StorybookIconset =
  window.StorybookIconset && window.StorybookIconset.length > 0
    ? window.StorybookIconset
    : window.getStorybookIconset();

window.getStorybookIcons = () => {
  let iconset = window.StorybookIconset,
    list = iconset && iconset.__iconList ? iconset.__iconList : [[]],
    icons = list
      .map(group => group.icons.map(icon => icon.replace(/^icons\:/, "")))
      .flat();
  return icons;
};
window.StorybookIcons = window.StorybookIcons || window.getStorybookIcons();
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
   * gets a HAX property by property or slot name
   *
   * @param {object} el custom element
   * @param {string} title property or slot name
   * @returns {object} HAX property object
   * @memberof StorybookUtilities
   */
  getHaxField(el, title) {
    let settings =
        el.haxProperties && el.haxProperties.settings
          ? el.haxProperties.settings
          : undefined,
      quick = settings && settings.quick ? settings.quick : [],
      configure = settings && settings.configure ? settings.configure : [],
      advanced = settings && settings.advanced ? settings.advanced : [],
      all = [...configure, ...advanced, ...quick],
      filter = all.filter(
        prop => prop.property === title || prop.slot === title
      );
    return filter && filter.length > 0 ? filter[0] : undefined;
  }

  /**
   * gets a random object based on properties
   * @param {object} JSON sschema properties
   * @param {array} HAX fields array
   * @returns {object}
   * @memberof StorybookUtilities
   */
  getRandomObject(props = []) {
    let obj = {};
    props.forEach(prop => {
      let id = prop.property || prop.slot;
      switch (prop.inputMethod) {
        case "array":
          obj[id] = this.getRandomArray(undefined, prop.properties);
          break;
        case "boolean":
          obj[id] = this.getRandomBool();
          break;
        case "color":
          obj[id] = this.getRandomHex();
          break;
        case "colorpicker":
          obj[id] = this.getRandomColor();
          break;
        case "fieldset":
          obj[id] = this.getRandomObject(prop.properties);
          break;
        case "fileupload":
          obj[id] = this.getRandomImage();
          break;
        case "haxupload":
          obj[id] = this.getRandomImage();
          break;
        case "iconpicker":
          obj[id] = this.getRandomIcon();
          break;
        case "number":
          obj[id] = this.getRandomNumber(prop.min, prop.max, prop.step);
          break;
        case "object":
          obj[id] = this.getRandomObject(prop.properties);
          break;
        case "select":
          obj[id] = this.getRandomOption(
            prop.options
              ? Object.keys(prop.options)
              : prop.itemsList || Object.keys(prop.options)
          );
          break;
        case "slider":
          obj[id] = this.getRandomNumber(prop.min, prop.max, prop.step);
          break;
        case "tabs":
          obj[id] = prop.properties.map(
            tab =>
              (tabs[tab.property || tab.slot] = this.getRandomObject(
                tab.properties
              ))
          );
          break;
        case "textarea":
          obj[id] = this.getRandomTextarea();
          break;
        default:
          switch (prop.format) {
            case "simple-fields":
              obj[id] = this.getRandomObject(prop.properties);
              break;
            default:
              obj[id] = this.getRandomText();
              break;
          }
      }
    });
    return obj;
  }

  /**
   * gets a random array based on properties
   * @param {object} JSON sschema properties
   * @param {array} HAX fields array
   * @returns {array}
   * @memberof StorybookUtilities
   */
  getRandomArray(properties, hax = []) {
    let arr = [],
      ctr = this.getRandomNumber(2, 5);
    for (let i = 0; i < ctr; i++) {
      arr.push(this.getRandomObject(properties, hax));
    }
    return arr;
  }

  /**
   * gets array of hax properties or properties from an element
   * @param {object} props element's properties
   * @param {object} haxProps element's haxProperties
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
    console.log(
      "getElementProperties",
      haxProps,
      hax,
      quick,
      configure,
      advanced
    );
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
   * random color from Simple Colors
   * @returns {string}
   * @memberof StorybookUtilities
   */
  getRandomColor() {
    return this.getRandomOption(this.getColors());
  }

  /**
   * random color as hex code
   * @returns {string}
   * @memberof StorybookUtilities
   */
  getRandomHex() {
    return `#${[0, 0, 0]
      .map(i => this.getRandomNumber(i, 255).toString(16))
      .map(i => (i.length < 2 ? `0${i}` : `${i}`))
      .join("")}`;
  }

  /**
   * random image url
   * @returns {string}
   * @memberof StorybookUtilities
   */
  getRandomImage() {
    return this.getRandomOption([
      "//picsum.photos/1200/900",
      "//picsum.photos/900/900",
      "//picsum.photos/1200/800",
      "//picsum.photos/800/1600",
      "//picsum.photos/400/1200",
      "//placekitten.com//1200/900",
      "//placekitten.com/900/900",
      "//placekitten.com/1200/800",
      "//placekitten.com/800/1600",
      "//placekitten.com/400/1200",
      "//loremflickr.com//1200/900",
      "//loremflickr.com/900/900",
      "//loremflickr.com/1200/800",
      "//loremflickr.com/800/1600",
      "//loremflickr.com/400/1200",
      "//placeimg.com//1200/900",
      "//placeimg.com/900/900",
      "//placeimg.com/1200/800",
      "//placeimg.com/800/1600",
      "//placeimg.com/400/1200"
    ]);
  }

  /**
   * random option from and array of options
   * @param {array} options
   * @returns {*}
   * @memberof StorybookUtilities
   */
  getRandomOption(options = []) {
    return options.length > 0
      ? options[Math.floor(Math.random() * Math.floor(options.length))]
      : undefined;
  }

  /**
   * drandomly true or false
   * @returns {boolean}
   * @memberof StorybookUtilities
   */
  getRandomBool() {
    return Math.random() >= 0.5;
  }

  /**
   * random number within a range
   * @param {number} min lowest value
   * @param {number} max highest value
   * @param {number} step
   * @returns {number}
   * @memberof StorybookUtilities
   */
  getRandomNumber(min = 0, max = 100 + min, step = 1) {
    return (
      min + Math.floor(Math.random() * Math.floor((max - min) / step)) * step
    );
  }
  /**
   * gets a random icon for an iconpicker
   *
   * @param {boolean} [includeNull=false] include a 50/50 change of no icon?
   * @returns string
   * @memberof StorybookUtilities
   */
  getRandomIcon(includeNull = false) {
    let random = this.getRandomOption(window.StorybookIcons);
    return includeNull ? this.getRandomOption([...random, ""]) : random;
  }

  /**
   * random short string of text
   * @returns {string}
   * @memberof StorybookUtilities
   */
  getRandomText() {
    return this.getRandomOption([
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
      'I give this year a "D", for delightful!'
    ]);
  }

  /**
   * random short string of text
   * @returns {string}
   * @memberof StorybookUtilities
   */
  getRandomTextarea() {
    return this.getRandomOption([
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
    ]);
  }

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
   * @param {object} defaults optional collection initial values for knobs, as { propertyName: defaultValue }
   * @param {array} exclusions optional list pf props that should not be knobs
   * @returns {object}
   * {
   *  properties: {
   *    {
   *      "attribute": "attributeName"
   *      "knob": knobType(label,[options],defaultValue,"properties")
   *    }
   *  },
   *  slots: {
   *    {
   *      "attribute": "attributeName"
   *      "knob": knobType(label,[options],defaultValue,"slots")
   *    }
   *  }
   * }
   * @see https://github.com/storybookjs/storybook/tree/master/addons/knobs
   * @memberof StorybookUtilities
   */
  getKnobs(properties, defaults = {}, exclusions = []) {
    let knobs = { props: {}, slots: {}, css: {} };
    (properties || []).forEach(field => {
      field.name = field.property || field.attribute || field.slot || field.css;
      console.log(field);
      if (!field.name && field.hasOwnProperty("slot")) field.name = "emptyslot";
      if (field.name.indexOf("__") === -1 && !exclusions.includes(field.name)) {
        let knob = this.getKnob(field, defaults[field.name]);
        console.debug(
          "getKnob:",
          knob,
          "\nfield",
          field,
          "\nfield name",
          field.name,
          "\nfdefaults",
          defaults,
          "\ndefault value",
          defaults[field.name]
        );
        knobs[knob.group][field.name] = knob;
      }
    });
    return knobs;
  }
  /**
   *
   * @param {object} field
   * {
   *   title: "User-friendly title",
   *   property: "propertyName",
   *   slot: "slotName",
   *   inputMethod: "HAXschema-compatible inputMethod",
   *   options: {"value": "select field options object"},
   *   defaultValue: "optional default value to override random value generator",
   * }
   * @param {*} defaultValue optional initial value for field
   * @returns object
   * @memberof StorybookUtilities
   */
  getKnob(field, defaultValue) {
    console.log("getKnob", field, defaultValue);
    let title = field.title,
      name = field.name,
      editedName = name === "emptyslot" ? '""' : name,
      attribute = this.camelToKebab(name),
      label = title && name ? `${title} (${editedName})` : title || editedName,
      group = field.hasOwnProperty("property")
        ? "props"
        : field.hasOwnProperty("slot")
        ? "slots"
        : field.hasOwnProperty("attribute")
        ? "attr"
        : "css",
      groupName = {
        attr: "Attributes",
        props: "Properties",
        slots: "Slots",
        css: "CSS"
      },
      method = field.inputMethod,
      options =
        field.itemsList ||
        (Array.isArray(field.options)
          ? field.options
          : Object.keys(field.options || {})),
      val =
        group === "slots" || method === "code-editor"
          ? this.updateSlot(defaultValue, field.slot)
          : defaultValue,
      colors = this.getColors(),
      knob;
    if (!options && field.itemsList) {
      options = {};
      field.itemsList.forEach(item => (options[item] = item));
    }
    if (options && options.length > 0) {
      if (method === "select") {
        knob = select(label, options, val, groupName[group]);
      } else if (method === "radio" && options) {
        knob = radios(label, options, val, groupName[group]);
      } else if (method === "options" && options) {
        knob = optionsKnob(
          label,
          options,
          val,
          { display: "multi-select" },
          groupName[group]
        );
      }
    } else if (method === "iconpicker") {
      let icons = window.StorybookIcons;
      icons.unshift("");
      knob = select(
        label,
        icons || ["", "star", "check", "history"],
        val,
        groupName[group]
      );
    } else if (method === "colorpicker" && colors) {
      let options = {};
      colors.forEach(color => (options[color] = color));
      knob = select(label, options, val, groupName[group]);
    } else if (method === "boolean") {
      knob = boolean(label, val, groupName[group]);
    } else if (method === "haxupload") {
      knob = files(
        label,
        ".pdf,.docx,xlsx,.pptx,.png,.jpg,.jpeg,.gif,.mp4,.mp3,.vtt,.csv",
        val,
        groupName[group]
      );
    } else if (method === "datepicker") {
      knob = date(label, val, groupName[group]);
    } else if (method === "number") {
      knob = number(label, val, {}, groupName[group]);
    } else if (method === "range") {
      //todo
      knob = number(
        label,
        val,
        { range: true, min: 60, max: 90, step: 1 },
        groupName[group]
      );
    } else if (method === "color") {
      knob = color(label, val, groupName[group]);
    } else if (method === "object" || method === "array") {
      knob = object(label, val, groupName[group]);
    } else if (method === "array") {
      knob = array(label, val, ",", groupName[group]);
    } else if (method === "textarea") {
      knob = text(label, val || "", groupName[group]);
    } else if (method === "code-editor") {
      knob = text(label, val || "", groupName[group]);
    } else {
      knob = text(label, val || "", groupName[group]);
    }
    return {
      attribute: attribute,
      knob: knob,
      method: method,
      group: group
    };
  }
  /**
   * makes sure slot
   *
   * @param {string} text slot's text knob
   * @param {string} slot name of slot
   * @returns string
   * @memberof StorybookUtilities
   */
  updateSlot(text, slot) {
    if (text) {
      let div = document.createElement("div"),
        inner = div.cloneNode(),
        parent = div,
        target = inner,
        html = text
          .replace(/&lt;/gi, "<")
          .replace(/&gt;/gi, ">")
          .replace(/&amp;/gi, "&");
      div.appendChild(inner);
      inner.innerHTML = html;
      if (inner.children.length === 1 || slot === "") {
        parent = inner;
        target = inner.children[0];
      }
      if (slot !== "") target.slot = slot;
      return parent.innerHTML;
    } else {
      return undefined;
    }
  }

  /**
   * makes an element based on knobs object
   * @param {string} tag element's tag
   * @param {object} knobs
   * {
   *  properties: {
   *    {
   *      "attribute": "attributeName"
   *      "knob": knobType(label,[options],defaultValue,"properties")
   *    }
   *  },
   *  slots: {
   *    {
   *      "attribute": "attributeName"
   *      "knob": knobType(label,[options],defaultValue,"slots")
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
        val =
          knob.method === "haxupload" && Array.isArray(knob.knob)
            ? knob.knob[0]
            : knob.knob;
      console.log("makeElement----", knob, knob.method, knob.knob, val);
      el[prop] = val;
    });
    Object.keys(knobs.attr || {}).forEach(attr => {
      let knob = knobs.props[attr],
        val = knob.knob;
      if (val) {
        el.setAttribute(attr, val);
      } else {
        el.removeAttribute(val);
      }
    });
    Object.keys(knobs.slots || {}).map(slot => {
      if (knobs.slots[slot].knob)
        el.innerHTML += knobs.slots[slot].knob
          .replace(/&lt;/gi, "<")
          .replace(/&gt;/gi, ">")
          .replace(/&quot;/gi, '"')
          .replace(/&amp;/gi, "&");
    });
    Object.keys(knobs.css || {}).forEach(prop => {
      console.log("css", prop, knobs);
      let knob = knobs.css[prop],
        val = knob.knob;
      if (prop.indexOf("--") === 0) {
        el.style.setProperty(prop, val);
      } else {
        el.style[prop] = val;
      }
    });
    console.debug(
      "makeElement:",
      el,
      "\nproperties",
      knobs.props,
      "\nslots",
      knobs.slots
    );
    return el;
  }

  /**
   * makes an element based on its class
   * @param {object} custom element class
   * @returns {object} element
   * @memberof StorybookUtilities camelToKebab(camel)
   */
  makeElementFromClass(el, defaults = {}, additions = [], exclusions = []) {
    let tag = el.tag || this.name.camelToKebab(el),
      props = this.getElementProperties(el.properties, el.haxProperties),
      knobs = this.getKnobs([...props, ...additions], defaults, exclusions);
    return this.makeElement(tag, knobs);
  }
}

// register global bridge on window if needed
window.StorybookUtilities = window.StorybookUtilities || {};

window.StorybookUtilities.requestAvailability = () => {
  if (!window.StorybookUtilities.instance) {
    window.StorybookUtilities.instance = new StorybookUtilities();
  }
};
