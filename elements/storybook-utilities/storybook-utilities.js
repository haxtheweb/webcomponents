import { html } from 'lit-html';
import "@haxtheweb/deduping-fix/deduping-fix.js";
import "@haxtheweb/utils/lib/demo-snippet.js";
import { LoremDataBehaviors } from "../lorem-data/lib/lorem-data-behaviors.js";

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
  Description,
} from "@open-wc/demoing-storybook";

/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
let containerdules = import.meta.url.match(/node_modules/)
  ? new URL("../../", import.meta.url)
  : new URL("../../node_modules/", import.meta.url);

globalThis.WCGlobalBasePath = containerdules;
class StorybookFunctions {
  constructor() {}
}
/**
 * Object to help load things in globally scoped and fire events when ready
 */
export class StorybookUtilities extends LoremDataBehaviors(StorybookFunctions) {
  galleryData(importUrl = import.meta.url) {
    return {
      options: [
        {
          slot: "",
          title: "Gallery Figures",
          inputMethod: "code-editor",
        },
        { css: "maxWidth" },
        { css: "--lrndesign-gallery-color", title: "text color" },
        {
          css: "--lrndesign-gallery-background-color",
          title: "background color",
        },
        {
          css: "--lrndesign-gallery-border-color",
          title: "subtle border color",
        },
        { css: "--lrndesign-gallery-focus-color", title: "accent color" },
        {
          css: "--lrndesign-gallery-thumbnail-outline",
          title: "thumbnail outline color",
        },
        {
          css: "--lrndesign-gallery-dialog-color",
          title: "zoom dialog text color",
        },
        {
          css: "--lrndesign-gallery-dialog-background-color",
          title: "zoom dialog background-color",
        },
        {
          css: "--lrndesign-gallery-dialog-border-color",
          title: "zoom dialog border-color",
        },
        {
          css: "--lrndesign-gallery-dialog-toggled-background-color",
          title: "zoom dialog background-color for toggled items",
        },
        {
          css: "--lrndesign-gallery-carousel-next-bg",
          title: "gradient on carousel next button",
        },
        {
          css: "--lrndesign-gallery-carousel-prev-bg",
          title: "gradient on carousel prev button",
        },
      ],
      sources: [
        [
          {
            title: "Bird",
            details: this.randomParagraph(2, 7),
            alt: "A bird with bright blue feathers.",
            src: new URL(`demo/images/bird.jpg`, importUrl),
            large: new URL(`demo/images/bird.jpg`, importUrl),
            thumbnail: new URL(`demo/images/thumbnails/bird.jpg`, importUrl),
          },
          {
            title: "Cat",
            alt: "A tabby cat's face.",
            details: this.randomParagraph(2, 7),
            src: new URL(`demo/images/cat.jpeg`, importUrl),
            large: new URL(`demo/images/cat.jpeg`, importUrl),
            thumbnail: new URL(`demo/images/thumbnails/cat.jpeg`, importUrl),
          },
          {
            title: "Dog",
            alt: "A dog tilting its head.",
            details: this.randomParagraph(2, 7),
            src: new URL(`demo/images/dog.jpg`, importUrl),
            large: new URL(`demo/images/dog.jpg`, importUrl),
            thumbnail: new URL(`demo/images/thumbnails/dog.jpg`, importUrl),
          },
          {
            title: "Fish",
            alt: "A bright red-orange fish",
            details: this.randomParagraph(2, 7),
            src: new URL(`demo/images/fish.jpg`, importUrl),
            large: new URL(`demo/images/fish.jpg`, importUrl),
            thumbnail: new URL(`demo/images/thumbnails/fish.jpg`, importUrl),
          },
        ],
        [
          {
            title: "Atari",
            details: this.randomParagraph(2, 7),
            src: new URL(`demo/images/atari.jpg`, importUrl),
            large: new URL(`demo/images/atari.jpg`, importUrl),
            thumbnail: new URL(`demo/images/thumbnails/atari.jpg`, importUrl),
          },
          {
            title: "Nintendo",
            details: this.randomParagraph(2, 7),
            src: new URL(`demo/images/nintendo.png`, importUrl),
            large: new URL(`demo/images/nintendo.png`, importUrl),
            thumbnail: new URL(
              `demo/images/thumbnails/nintendo.png`,
              importUrl
            ),
          },
          {
            title: "PS4",
            details: this.randomParagraph(2, 7),
            src: new URL(`demo/images/ps4.jpg`, importUrl),
            large: new URL(`demo/images/ps4.jpg`, importUrl),
            thumbnail: new URL(`demo/images/thumbnails/ps4.jpg`, importUrl),
          },
          {
            title: "Sega",
            details: this.randomParagraph(2, 7),
            src: new URL(`demo/images/sega.jpg`, importUrl),
            large: new URL(`demo/images/sega.jpg`, importUrl),
            thumbnail: new URL(`demo/images/thumbnails/sega.jpg`, importUrl),
          },
          {
            title: "XBox",
            details: this.randomParagraph(2, 7),
            src: new URL(`demo/images/xbox.png`, importUrl),
            large: new URL(`demo/images/xbox.png`, importUrl),
            thumbnail: new URL(`demo/images/thumbnails/xbox.png`, importUrl),
          },
        ],
        [
          {
            title: "Apple",
            details: this.randomParagraph(2, 7),
            src: new URL(`demo/images/apple.jpg`, importUrl),
            large: new URL(`demo/images/apple.jpg`, importUrl),
            thumbnail: new URL(`demo/images/thumbnails/apple.jpg`, importUrl),
          },
          {
            title: "Banana",
            details: this.randomParagraph(2, 7),
            src: new URL(`demo/images/banana.jpg`, importUrl),
            large: new URL(`demo/images/banana.jpg`, importUrl),
            thumbnail: new URL(`demo/images/thumbnails/banana.jpg`, importUrl),
          },
          {
            title: "Carrot",
            details: this.randomParagraph(2, 7),
            src: new URL(`demo/images/carrot.jpeg`, importUrl),
            large: new URL(`demo/images/carrot.jpeg`, importUrl),
            thumbnail: new URL(`demo/images/thumbnails/carrot.jpeg`, importUrl),
          },
        ],
      ],
    };
  }
  /**
   * gets a HAX property by property or slot name
   *
   * @param {object} el custom element
   * @param {string} title property or slot name
   * @returns {object} HAX property object
   * @memberof StorybookUtilities
   */
  async getHaxField(el, title) {
    var hProps = el.haxProperties;
    if (el.tag && JSON.parse(globalThis.localStorage.getItem(`${el.tag}-props`))) {
      hProps = JSON.parse(globalThis.localStorage.getItem(`${el.tag}-props`));
    }
    else if (el.tag && typeof hProps == 'string') {
      setTimeout( async () => {
        globalThis.localStorage.setItem(`${el.tag}-props`, JSON.stringify(await fetch(hProps).then((e) => e.json())))        
      }, 0);    }
    let settings =
      hProps && hProps.settings
          ? hProps.settings
          : undefined,
      quick = settings && settings.quick ? settings.quick : [],
      configure = settings && settings.configure ? settings.configure : [],
      advanced = settings && settings.advanced ? settings.advanced : [],
      all = [...configure, ...advanced, ...quick],
      filter = all.filter(
        (prop) => prop.property === title || prop.slot === title
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
    props.forEach((prop) => {
      let id = prop.property || prop.slot;
      switch (prop.inputMethod) {
        case "array":
          obj[id] = this.getRandomArray(undefined, prop.properties);
          break;
        case "boolean":
          obj[id] = this.randomBool();
          break;
        case "color":
          obj[id] = this.randomHex();
          break;
        case "colorpicker":
          obj[id] = this.randomColor();
          break;
        case "fieldset":
          obj[id] = this.getRandomObject(prop.properties);
          break;
        case "fileupload":
          obj[id] = this.randomImage();
          break;
        case "haxupload":
          obj[id] = this.randomImage();
          break;
        case "iconpicker":
          obj[id] = this.randomIcon();
          break;
        case "number":
          obj[id] = this.randomNumber(prop.min, prop.max, prop.step);
          break;
        case "object":
          obj[id] = this.getRandomObject(prop.properties);
          break;
        case "select":
          obj[id] = this.randomOption(
            prop.options
              ? Object.keys(prop.options)
              : prop.itemsList || Object.keys(prop.options)
          );
          break;
        case "slider":
          obj[id] = this.randomNumber(prop.min, prop.max, prop.step);
          break;
        case "tabs":
          obj[id] = prop.properties.map(
            (tab) =>
              (tabs[tab.property || tab.slot] = this.getRandomObject(
                tab.properties
              ))
          );
          break;
        case "textarea":
          obj[id] = this.randomParagraph(2, 7);
          break;
        default:
          switch (prop.format) {
            case "simple-fields":
              obj[id] = this.getRandomObject(prop.properties);
              break;
            default:
              obj[id] = this.randomSentence(1, 5);
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
      ctr = this.randomNumber(2, 5);
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
      hax = (quick || []).concat(configure || [], advanced || []);
    return hax.length > 0
      ? hax
      : Object.keys(props || {}).map((property) => {
          let type = props[property].type;
          return {
            property: property,
            inputMethod: !type
              ? "textfield"
              : type.name
              ? type.name.toLowerCase()
              : type.toLowerCase(),
          };
        });
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
    if (!properties.emptyslot && defaults.emptyslot) {
      properties.push({
        inputMethod: "textfield",
        name: "emptyslot",
        slot: ""
      });
    }
    (properties || []).forEach((field) => {
      if (!!field) {
        field.name =
          field.property || field.attribute || field.slot || field.css;
        if (!field.name && field.hasOwnProperty("slot"))
          field.name = "emptyslot";
        if (
          field.name.indexOf("__") === -1 &&
          !exclusions.includes(field.name)
        ) {
          let knob = this.getKnob(field, defaults[field.name]);
          knobs[knob.group][field.name] = knob;
        }
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
        css: "CSS",
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
      colors = this.colors,
      knob;
    if (!options && field.itemsList) {
      options = {};
      field.itemsList.forEach((item) => (options[item] = item));
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
      let icons = this.icons;
      icons.unshift("");
      knob = select(
        label,
        icons || ["", "star", "check", "history"],
        val,
        groupName[group]
      );
    } else if (method === "colorpicker" && colors) {
      let options = {};
      colors.forEach((color) => (options[color] = color));
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
      group: group,
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
      let div = globalThis.document.createElement("div"),
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
   *  properties: [
   *    {
   *      "attribute": "attributeName",
   *      "method": inputMethod,
   *      "knob": knobType(label,[options],defaultValue,"properties")
   *    }
   *  ],
   *  slots: [
   *    {
   *      "attribute": "attributeName",
   *      "method": inputMethod,
   *      "knob": knobType(label,[options],defaultValue,"slots")
   *    }
   *  ]
   * }
   * @returns {object} element
   * @memberof StorybookUtilities
   */
  makeElement(el, knobs, noDemo = false) {
    let demo = globalThis.document.createElement("demo-snippet"),
      template = globalThis.document.createElement("template"),
      tag = typeof el === "string" ? el : el.tag,
      attrs = `${this._getDemoAttributes(knobs.props)}${this._getDemoAttributes(
        knobs.attr
      )}`,
      demoCSS =
        Object.keys(knobs.css || {}).length === 0
          ? ``
          : this._getDemoCss(knobs.css),
      styles = demoCSS == "" ? "" : ` style="${demoCSS}"`,
      child;

    if (!tag) {
      let t = new el();
      tag = t.tagName ? t.tagName.toLowerCase() : "div";
      t.remove();
    }

    child = `<${tag}${attrs}${styles}>${this._getDemoSlots(
      knobs.slots
    )}\n</${tag}>`;
    if (noDemo) {
      return child;
    } else {
      return this.getDemo(child);
    }
  }
  /**
   * 
   * @param { Object } el - element class
   * @param { String } path - import.meta.url or equivalent path to the file referenced
   * @param { Object } demo - HTMLElement assumed demo of the element in question
   * @param { String } packageName - manual dev setting only for extreme edge cases
   * @returns 
   */
  makeUsageDocs(el, path, demo, packageName = null) {
    const url = new URL(path);
    let entryFile = el.tag;
    let importPath = url.pathname.replace('/storybook/', '/').replace('/elements/','@haxtheweb/').replace('.stories.js','.js');
    packageName = packageName || `${importPath.split('/')[0]}/${importPath.split('/')[1]}`;
    var description = globalThis.localStorage.getItem(`${entryFile}-description`);
    setTimeout( async () => {
      // pull from the custom-elements json file since our tooling rebuilds this
      const d = await fetch(`${url.pathname}/../custom-elements.json`.replace('/lib/','/')).then((e) => e.json()).then(async (d) => {
        let allD = '';
        if (d.tags) {
          await d.tags.forEach((item) => {
            // ignore source versions
            if (!item.path || !item.path.startsWith('./src/')) {
              allD += item.name + "\n" + (item.path ? item.path + "\n" : '') + (item.description ? item.description + "\n" : '') + "\n";
            }
          })
        }
        return allD;
      })
      globalThis.localStorage.setItem(`${entryFile}-description`, d);
    }, 0);
    const div = globalThis.document.createElement('div');
    div.style.padding = "20px";
    div.innerHTML = `
    <h2>${entryFile} Demo</h2>
    <div style="border:1px solid grey;">
      ${demo.outerHTML}
    </div>
    <style>
    code-sample {
      --code-sample-font-size: 20px;
      --code-sample-line-height: 1.8;
      margin: 4px 0;
    }
    summary {
      font-size: 20px;
      margin-top: 10px;
    }
    </style>
    <details>
      <summary>API details</summary>
      <pre>${description || 'Reload to view'}</pre>
    </details>
    <h3>Install in your project</h3>
    <ul>
      <li>
        <code-sample copy-clipboard-button>
          <template preserve-content="preserve-content">npm install --save ${packageName}</template>
        </code-sample>
      </li>
      <li>
        <code-sample copy-clipboard-button>
          <template preserve-content="preserve-content">yarn add ${packageName}</template>
        </code-sample>
      </li>
      <li>
        <code-sample copy-clipboard-button>
          <template preserve-content="preserve-content">pnpm add ${packageName}</template>
        </code-sample>
      </li>
    </ul>
    <h3>Import into your code</h3>
    <code-sample copy-clipboard-button type="javascript">
      <template preserve-content="preserve-content">import "${importPath}";</template>
    </code-sample>
    <h3>Additional links</h3>
    <ul>
      <li><a target="_blank" href="https://www.npmjs.com/package/${packageName}">NPM Project page</a></li>
      <li><a target="_blank" href="https://github.com/haxtheweb/webcomponents/tree/master/elements/${entryFile}/">GitHub source code</a></li>
    </ul>`;
    return div;

  }
  /**
   * @param {string} el
   * @param {string} before
   */
  getDemo(el, before = "") {
    let demo = globalThis.document.createElement("demo-snippet"),
      template = globalThis.document.createElement("template");
    template.innerHTML += el;
    demo.innerHTML += before;
    demo.appendChild(template);
    globalThis.document.querySelector("body").style.margin = "0";
    demo.style.margin = "0px";
    demo.style.boxShadow = "none";
    demo.style.borderBottom = "1px solid #e0e0e0";
    demo.style.padding = "0";
    return demo;
  }

  /**
   * makes an element based on a random haxProperties demo
   * @param {object} el custom element class
   * @param {array} additons additional knobs
   * @param {array} exclusions knobs to exclude
   * @returns {object} element
   * @memberof StorybookUtilities camelToKebab(camel)
   */
  makeElementFromHaxDemo(
    el,
    defaults = {},
    additions = [],
    exclusions = [],
    index,
    container = false
  ) {
    var hProps = el.haxProperties;
    if (el.tag && JSON.parse(globalThis.localStorage.getItem(`${el.tag}-props`))) {
      hProps = JSON.parse(globalThis.localStorage.getItem(`${el.tag}-props`));
      setTimeout( async () => {
        globalThis.localStorage.setItem(`${el.tag}-props`, JSON.stringify(await fetch(el.haxProperties).then((e) => e.json())))        
      }, 0);
    }
    else if (el.tag && typeof hProps === 'string') {
      setTimeout( async () => {
        globalThis.localStorage.setItem(`${el.tag}-props`, JSON.stringify(await fetch(hProps).then((e) => e.json())))
      }, 0);
    }
    let demoschema =
    hProps && hProps.demoSchema
          ? hProps.demoSchema
          : undefined,
      demo =
        demoschema && index && demoschema[index]
          ? demoschema[index]
          : demoschema && demoschema.length > 0
          ? this.randomOption(hProps.demoSchema)
          : {},
      props = demo.properties,
      styles =
        demo.properties && demo.properties.style
          ? demo.properties.style.replace(/;$/, "").split(/;/)
          : [],
      content = globalThis.document.createElement("div");
      // map props to attr equivalent; even if it's not there story will just ignore it
      if (props && Object.keys(props).length > 0) {
        Object.entries(props).forEach(prop => {
          props[this.camelToKebab(prop[0]).trim()] = prop[1];
        });
      }
      if (styles.length > 0) delete demo.properties.style;
    styles.forEach((style) => {
      let parts = style.split(/:/),
        camel = this.kebabToCamel(parts[0]).trim();
      props[camel] = parts[1].trim();
      if (additions.filter((addition) => addition.css === camel))
        additions.push({ css: camel });
    });
    content.innerHTML = demo.content || "";
    Object.keys(content.children || {}).forEach((child) => {
      let node = content.children[child];
      if (node.slot) {
        props[node.slot] = node.outerHTML;
      } else {
        props["emptyslot"] = `${props["emptyslot"] || ""}${node.outerHTML}`;
      }
    });
    Object.keys(defaults || {}).forEach(
      (item) => (props[item] = defaults[item])
    );
    return this.makeElementFromClass(
      el,
      props,
      additions,
      exclusions,
      container
    );
  }

  _getDemoCss(obj) {
    return Object.keys(obj || {})
      .map((prop) => {
        return !obj[prop].knob
          ? ``
          : `${prop.indexOf("--") < 0 ? this.camelToKebab(prop) : prop}:${
              obj[prop].knob
            };`;
      })
      .join("");
  }

  _getDemoSlots(obj) {
    return Object.keys(obj || {})
      .map((slot) => {
        return !obj[slot].knob
          ? ``
          : `\n\t` +
              obj[slot].knob
                .replace(/&lt;/gi, "<")
                .replace(/&gt;/gi, ">")
                .replace(/&quot;/gi, '"')
                .replace(/&amp;/gi, "&");
      })
      .join("");
  }
  _getDemoAttributes(obj) {
    return Object.keys(obj || {})
      .map((key) => {
        let knob = obj[key];
        return !knob.knob ||
          (knob.method === "haxupload" && knob.knob.length < 1)
          ? ``
          : (knob.method === "object" && knob.knob !== {}) ||
            (knob.method === "array" && knob.knob !== [])
          ? ` ${this.camelToKebab(key)}='${JSON.stringify(knob.knob)}'`
          : knob.method === "boolean"
          ? ` ${this.camelToKebab(key)}`
          : knob.method === "haxupload" && Array.isArray(knob.knob)
          ? ` ${this.camelToKebab(key)}="${knob.knob[0]}"`
          : ` ${this.camelToKebab(key)}="${knob.knob}"`;
      })
      .join("");
  }

  /**
   * makes an element based on its class
   * @param {object} el custom element class
   * @param {object} defaults default values for knobs
   * @param {array} additons additional knobs
   * @param {array} exclusions knobs to exclude
   * @returns {object} element
   * @memberof StorybookUtilities camelToKebab(camel)
   */
  makeElementFromClass(
    el,
    defaults = {},
    additions = [],
    exclusions = [],
    container = false
  ) {
    let props = this.getElementProperties(el.properties || el.observedAttributes ? el.observedAttributes.reduce((accumulator, value) => {
      return {...accumulator, [value]: ''};
    }, {}) : {}, el.haxProperties),
      knobs = this.getKnobs([...props, ...additions], defaults, exclusions);
    return this.makeElement(el, knobs, container);
  }
}

// register global bridge on window if needed
globalThis.StorybookUtilities = globalThis.StorybookUtilities || {};

globalThis.StorybookUtilities.requestAvailability = () => {
  if (!globalThis.StorybookUtilities.instance) {
    globalThis.StorybookUtilities.instance = new StorybookUtilities();
  }
};
