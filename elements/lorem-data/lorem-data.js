import { LitElement, html, css } from "lit";
import { LoremDataBehaviors } from "./lib/lorem-data-behaviors.js";
/**
 * `lorem-data`
 * a threaded discussions component
 * 
### Styling

`<lorem-data>` provides the following custom properties
for styling:

Custom property | Description | Default
----------------|-------------|----------
`--lorem-data-FontSize` | default font-size | 14px
 *
 * @element lorem-data
 * @demo ./demo/index.html demo
 */

class LoremData extends LoremDataBehaviors(LitElement) {
  static get styles() {
    return [
      css`
        label {
          font-size: 80%;
          font-family: sans-serif;
        }
        textarea {
          width: 100%;
          height: 200px;
        }
      `,
    ];
  }

  static get tag() {
    return "lorem-data";
  }

  static get properties() {
    return {
      schemas: {
        type: Object,
      },
    };
  }

  constructor() {
    super();
    this.schemas = {};
  }

  render() {
    return html`
      <button @click="${this.saveAll}">Save All</button>
      ${Object.keys(this.schemas || []).map(
        (key) => html`
          <p>
            <label>
              <a href="${this.saveDataUrl(this.schemas[key])}" download="${key}"
                >${key}:
              </a>
              <br />
              <textarea>${this.getJson(this.schemas[key])}</textarea>
            </label>
          </p>
        `
      )}
      <button @click="${this.saveAll}">Save All</button>
    `;
  }
  /**
   * downloads all generated schema JSON files
   *
   * @memberof LoremData
   */
  saveAll() {
    if (
      this.shadowRoot &&
      this.shadowRoot.querySelectorAll("a") &&
      confirm(`Save the following: ${Object.keys(this.schemas).join(", ")}?`)
    ) {
      this.shadowRoot.querySelectorAll("a").forEach((a) => a.click());
    }
  }

  /**
   * converts generated schema to JSON
   *
   * @memberof LoremData
   * @param {object} schema
   * @returns {string}
   */
  getJson(schema) {
    return JSON.stringify(this.randomType(schema));
  }
  /**
   * genertates a url to download schema JSON
   *
   * @param {object} schema
   * @returns {string}
   * @memberof LoremData
   */
  saveDataUrl(schema) {
    let json = this.getJson(schema),
      blob = new Blob([json], { type: "octet/stream" });
    return window.URL.createObjectURL(blob);
  }
  get data() {
    let data = {};
    Object.keys(this.schemas || []).forEach(
      (key) => (data[key] = this.randomType(this.schemas[key]))
    );
    return data;
  }
  /**
   * colors from Simple Colors
   * @returns {array} color names
   * @memberof LoremData
   */
  get colors() {
    let simple = window.SimpleColorsSharedStyles.requestAvailability();
    return simple && simple.colors ? Object.keys(simple.colors) : false;
  }

  filterQuery(records, filter) {
    return records.filter(record, (index) => filter(record, index));
  }
  /**
   * gets date x days from start date
   * @param {date} start starting date
   * @param {number} days number of weeks
   * @returns {date}
   */
  addDays(start = new Date(), amt = 0) {
    return new Date(Date.parse(start) + amt * 86400000);
  }
  /**
   * gets date x days from start date
   * @param {date} start starting date
   * @param {number} days number of weeks
   * @returns {date}
   */
  addHours(start = new Date(), amt = 0) {
    return new Date(Date.parse(start) + amt * 3600000);
  }
  /**
   * gets date x days from start date
   * @param {date} start starting date
   * @param {number} days number of weeks
   * @returns {date}
   */
  addMinutes(start = new Date(), amt = 0) {
    return new Date(Date.parse(start) + amt * 60000);
  }
  /**
   * gets date x days from start date
   * @param {date} start starting date
   * @param {number} days number of weeks
   * @returns {date}
   */
  addSeconds(start = new Date(), amt = 0) {
    return new Date(Date.parse(start) + amt * 1000);
  }
  /**
   * gets date x weeks from start date
   * @param {date} start starting date
   * @param {number} weeks number of weeks
   * @returns {date}
   */
  addWeeks(start = new Date(), amt = 0) {
    return new Date(Date.parse(start) + amt * 604800000);
  }
  /**
   * gets date x years from start date
   * @param {date} start starting date
   * @param {number} years number of years
   * @returns {date}
   */
  addYears(start = new Date(), amt = 0) {
    return new Date(Date.parse(start) + amt * 31536000000);
  }
  /**
   * gets formatted date
   * @param {object} date
   * @param {format} long (Weekday, Month, Day, Year), short (Month, Day), or default (Month, Day, Year)
   * @returns {string} date as string
   */
  dateFormat(d, format) {
    if (typeof d === "string") d = new Date(d);
    return !d
      ? ""
      : format === "long"
      ? d.toLocaleDateString(undefined, {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : format === "short"
      ? d.toLocaleDateString(undefined, { month: "long", day: "numeric" })
      : d.toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
  }

  /**
   * draws x-y items from shuffled array
   * @param {array} arr array
   * @param {number} min minimum number of items
   * @param {number} max max number of items
   * @returns {array} shuffled array of x items
   */
  draw(arr = [], min = 0, max = min) {
    let range = max - min,
      rand = Math.random() * range,
      offset = Math.floor(rand),
      len = min + offset,
      slice = Math.max(0, len);
    return this.shuffle(arr).slice(0, slice);
  }
  /**
   * generates an array based on a schema and nim/max number of items
   *
   * @param {object} [children={}] schema each generated array item should follow
   * @param {number} [min=1] minimum number of array items
   * @param {number} [max=4] maximum number of array items
   * @returns {array}
   * @memberof LoremData
   */
  randomArray(children = {}, min = 1, max = 4) {
    let arr = [];
    for (let i = this.randomNumber(min, max, 1); i > 0; i--) {
      arr.push(this.randomType(children));
    }
    return arr;
  }
  /**
   * generates a string representing a random aspect ratio
   *
   * @param {number} [minwidth=200] minimum aspect height
   * @param {number} [maxwidth=1000] minimum aspect width
   * @param {number} [minheight=200] maximum aspect height
   * @param {number} [maxheight=1000] maximum aspect width
   * @returns {string}
   * @memberof LoremData
   */
  randomAspect(
    minwidth = 200,
    maxwidth = 1000,
    minheight = 200,
    maxheight = 1000
  ) {
    let w = this.randomNumber(minwidth, maxwidth, 1),
      h = this.randomNumber(minheight, maxheight, 1);
    return `${w}/${h}`;
  }

  /**
   * randomly true or false
   * @returns {boolean}
   */
  randomBool() {
    return Math.random() >= 0.5;
  }

  /**
   * random color from Simple Colors
   * @returns {string}
   */
  randomColor() {
    return this.randomOption(this.colors);
  }

  /**
   * random color from Simple Colors
   * @returns {string}
   */
  randomDate(start = Date.now(), units = "years", min = -3, max = 3) {
    let amt =
      units === "milliseconds"
        ? this.randomNumber(min, max)
        : units === "seconds"
        ? this.randomNumber(min * 1000, max * 1000)
        : units === "minutes"
        ? this.randomNumber(min * 60000, max * 60000)
        : units === "hours"
        ? this.randomNumber(min * 3600000, max * 3600000)
        : units === "days"
        ? this.randomNumber(min * 86400000, max * 86400000)
        : units === "weeks"
        ? this.randomNumber(min * 604800000, max * 604800000)
        : this.randomNumber(min * 31536000000, max * 31536000000);
    return start + amt;
  }

  /**
   * random color as hex code
   * @returns {string}
   */
  randomHex() {
    return `#${[0, 0, 0]
      .map((i) => this.randomNumber(i, 255).toString(16))
      .map((i) => (i.length < 2 ? `0${i}` : `${i}`))
      .join("")}`;
  }
  /**
   * gets a random icon for an iconpicker
   *
   * @param {boolean} [includeNull=false] include a 50/50 change of no icon?
   * @returns string
   */
  randomIcon(includeNull = false) {
    let random = this.randomOption(this.icons);
    return includeNull ? this.randomOption([...random, ""]) : random;
  }
  /**
   * generates URL for random image from placeimg.com
   *
   * @param {string} aspect aspect ration as w/h
   * @param {string} filter optional 'greyscale' or 'sepia' filter
   * @param {string} [topic="any"] optional topic image, as in 'places'
   * @returns {string}
   * @memberof LoremData
   */
  randomPlaceImg(aspect, filter, topic = "any") {
    filter =
      filter ||
      this.randomWeightedOption([
        { value: "", weight: 12 },
        { value: "greyscale", weight: 4 },
        { value: "sepia", weight: 1 },
      ]);
    aspect = aspect || this.randomAspect();
    return `//placeimg.com/${aspect}/${topic}${
      filter === "greyscale" ? "/greyscale" : filter === "sepia" ? "/sepia" : ""
    }`;
  }

  /**
   * generates URL for random image from picsum.photos
   *
   * @param {string} aspect aspect ration as w/h
   * @param {boolean} greyscale whether image should be greyscale
   * @param {number} [blur=0] level of blurring filter to apply
   * @param {string} id specific image identifier
   * @returns {string}
   * @memberof LoremData
   */
  randomPicsum(aspect, greyscale, blur = 0, id) {
    let params =
      greyscale ||
      this.randomWeightedOption([
        { value: false, weight: 3 },
        { value: true, weight: 1 },
      ])
        ? ["greyscale"]
        : [];
    if (blur > 0) params.push(`blur=${blur}`);
    aspect = aspect || this.randomAspect();
    return `https://picsum.photos/${id > -1 ? `id/${id}` : ``}/${aspect}/${
      params.length == 0 ? "" : `?${params.join("&")}`
    }`;
  }

  /**
   * generates URL for random image from placekitten.com
   *
   * @param {string} aspect aspect ration as w/h
   * @param {boolean} greyscale whether image should be greyscale
   * @returns {string}
   * @memberof LoremData
   */
  randomKitten(aspect, greyscale) {
    if (typeof greyscale === typeof undefined)
      greyscale = this.randomWeightedOption([
        { value: false, weight: 3 },
        { value: true, weight: 1 },
      ]);
    aspect = aspect || this.randomAspect();
    return `//placekitten.com${greyscale ? "/g" : ""}/${aspect}`;
  }

  /**
   *
   * generates URL for random image from loremflickr.com
   * @param {string} aspect aspect ration as w/h
   * @param {*} [searchTerms=[]] array of search terms for finding image
   * @param {boolean} [searchAll=false] whether results must meet all search terms
   * @param {*} [multiple=-1] gives image a unique URL so that image isn't cached everywhere
   * @returns {string}
   * @memberof LoremData
   */
  randomFlickr(aspect, searchTerms = [], searchAll = false, multiple = -1) {
    aspect = aspect || this.randomAspect();
    return `https://loremflickr.com/${aspect}${
      searchTerms.length === 0
        ? ``
        : `/${searchTerms.join(",")}${searchAll ? `/all` : ""}`
    }${multiple > -1 ? `?random=${multiple}` : ""}`;
  }
  /**
   * selects a url from an image generator based on params and the generator APIs
   *
   * @param {string} aspect aspect ration as w/h
   * @param {boolean} greyscale whether image should be greyscale
   * @param {string} [topic="any"] optional topic image, as in 'places'
   * @param {*} [multiple=-1] gives image a unique URL so that image isn't cached everywhere
   * @returns {string}
   * @memberof LoremData
   */
  randomImage(aspect, greyscale, topic, multiple) {
    return topic && ["man", "woman", "person"].includes(topic)
      ? this.randomProfileImage(aspect, topic)
      : typeof multiple === typeof undefined
      ? this.randomPlaceImg(aspect, greyscale, topic)
      : topic === "any"
      ? this.randomPicsum(aspect, greyscale, undefined, multiple)
      : this.randomFlickr(aspect, [topic], false, multiple);
  }
  /**
   * generates object with randome image src, alt, and longdesc
   *
   * @param {string} aspect aspect ration as w/h
   * @param {boolean} greyscale whether image should be greyscale
   * @param {string} [topic="any"] optional topic image, as in 'places'
   * @param {*} [multiple=-1] gives image a unique URL so that image isn't cached everywhere
   * @returns {string}
   * @memberof LoremData
   */
  randomImageData(aspect, greyscale, topic, multiple) {
    return {
      src: this.randomImage(aspect, greyscale, topic, multiple),
      alt: `Random ${topic ? `${topic} ` : ""}image${
        !multiple ? `` : ` #${multiple}`
      }`,
      longdesc: `This is a long description for image${
        !multiple ? `` : ` #${multiple}`
      }. ${this.randomParagraph(1, 5)}`,
    };
  }
  /**
   * generates a random profile image
   *
   * @param {string} aspect aspect ration as w/h
   * @param {string} topic "man", "woman", etc
   * @param {*} [multiple=-1] gives image a unique URL so that image isn't cached everywhere
   * @returns {string}
   * @memberof LoremData
   */
  randomProfileImage(aspect, topic, multiple) {
    let aspects = aspect.split("/"),
      area = parseInt(aspects[0]) * parseInt(aspects[1]),
      size = area < 250 ? "thumb/" : area < 640 ? "med/" : "",
      random = Math.random() < 0.5 ? "men" : "women",
      person = topic === "man" ? "men" : topic === "woman" ? "women" : random;
    return `https://randomuser.me/api/portraits/${size}${person}/${
      multiple || this.randomNumber(1, 90)
    }.jpg`;
  }

  /**
   * generates random link data
   * @returns {object} link as { url, text, type }
   * */
  randomLink(type, min = 1, max = 4) {
    let w = this.draw(this.words, min, max),
      file = type || this.randomOption(["url", "pdf"]),
      base = this.randomOption(this.words),
      extension = file !== "url" ? `.${file}` : "",
      url = `http://${base}.com/${w.join("/")}${extension}`,
      text = w.length > 0 ? w.join(" ") : base;
    return {
      url: url,
      text: text,
      type: file,
    };
  }

  /**
   * random number within a range
   * @param {number} min lowest value
   * @param {number} max highest value
   * @param {number} step
   * @returns {number}
   */
  randomNumber(min = 0, max = 100 + min, step = 1) {
    return (
      min + Math.floor(Math.random() * Math.floor((max - min) / step)) * step
    );
  }
  /**
   * generates a random data object based oin a schema for that object
   *
   * @param {object} [schema={}] schema for object data
   * @returns {object}
   * @memberof LoremData
   */
  randomObject(schema = {}) {
    let obj = {};
    Object.keys(schema).forEach(
      (key) => (obj[key] = this.randomType(schema[key]))
    );
    return obj;
  }

  /**
   * random option from and array of options
   * @param {array} options
   * @returns {*}
   */
  randomOption(options = []) {
    return options.length > 0
      ? options[Math.floor(Math.random() * Math.floor(options.length))]
      : undefined;
  }
  /**
   * generates a random paragraph
   *
   * @param {number} [min=3] minimum number of sentences
   * @param {number} [max=7] maximum number of sentences
   * @param {number} wordMinPerSent minimum number of words per sentence
   * @param {number} wordMaxPerSent maximum number of words per sentence
   * @returns {string}
   * @memberof LoremData
   */
  randomParagraph(min = 3, max = 7, wordMinPerSent, wordMaxPerSent) {
    let paragraph = [];
    for (let i = this.randomNumber(min, max); i > 0; i--) {
      paragraph.push(this.randomSentence(wordMinPerSent, wordMaxPerSent));
    }
    return `${paragraph.join(" ")}`;
  }

  /**
   * generates a random paragraph
   *
   * @param {number} [min=3] minimum number of words
   * @param {number} [max=15] maximum number of words
   * @returns {string}
   * @memberof LoremData
   */
  randomSentence(min = 3, max = 15) {
    let sentence = [],
      punctuation = this.randomWeightedOption([
        { value: ".", weight: 10 },
        { value: "?", weight: 3 },
        { value: "!", weight: 1 },
      ]);
    for (let i = this.randomNumber(min, max); i > 0; i--) {
      sentence.push(this.randomWord());
    }
    if (sentence[0]) sentence[0] = this.titleCase(sentence[0]);
    return `${sentence.join(" ")}${punctuation}`;
  }

  /**
   * generates random data based on schema
   *
   * @param {object} schema
   * @returns
   * @memberof LoremData
   */
  randomType(schema) {
    let val;
    if (schema.type)
      switch (schema.type) {
        case "array":
          val = this.randomArray(schema.children, schema.min, schema.max);
          break;
        case "boolean":
          val = this.randomBool();
          break;
        case "color":
          val = this.randomColor();
          break;
        case "data":
          return schema.data;
          break;
        case "date":
          val = this.randomDate(
            schema.start,
            schema.units,
            schema.min,
            schema.max
          );
          break;
        case "hex":
          val = this.randomHex();
          break;
        case "icon":
          val = this.randomIcon(schema.includeNull);
          break;
        case "image":
          val = this.randomImage(
            schema.aspect || this.randomAspect(),
            schema.greyscale,
            schema.topic,
            schema.multiple
          );
          break;
        case "imageData":
          val = this.randomImageData(
            schema.aspect,
            schema.greyscale,
            schema.topic,
            schema.multiple
          );
          break;
        case "letter":
          val = this.randomOption("abcdefghijklmnopqrstuvwxyz");
          break;
        case "link":
          val = this.randomLink(
            schema.filetype,
            schema.minPath,
            schema.maxPath
          );
          break;
        case "number":
          val = this.randomNumber(schema.min, schema.max, schema.step);
          break;
        case "object":
          val = this.randomObject(schema.schema);
          break;
        case "option":
          return schema.weightedOptions
            ? this.randomWeightedOption(schema.weightedOptions)
            : this.randomOption(schema.options);
          break;
        case "paragraph":
          val = this.randomParagraph(
            schema.min,
            schema.max,
            schema.wordMinPerSent,
            schema.wordMaxPerSent
          );
          break;
        case "sentence":
          val = this.randomSentence(schema.min, schema.max);
          break;
        case "word":
          val = this.randomWord();
          break;
        default:
          val = this.randomWord();
          break;
      }
    return val;
  }
  /**
   * given array of objects with weight and value, selects random value based on its weight
   *
   * @param {array} [arr=[]] array of objects with weight and value, eg. [{value: true, weight: 80%},{value: false, weight: 20%}]
   * @returns
   * @memberof LoremData
   */
  randomWeightedOption(arr = []) {
    return this.randomOption(
      arr
        .map((item) => {
          let arr2 = [];
          for (let i = 0; i < item.weight; i++) {
            arr2.push(item.value);
          }
          return arr2;
        })
        .flat()
    );
  }
  /**
   * returns a random word
   *
   * @returns
   * @memberof LoremData
   */
  randomWord() {
    return this.randomOption(this.words);
  }

  /**
   * gets shuffled array
   * @param {array} arr array
   * @returns {arr} shuffled array
   */
  shuffle(arr = []) {
    return arr.sort((a, b) => Math.random() - Math.random());
  }

  /**
   * sorts array by most recent (or by oldest)
   * @param {array} arr array
   * @param {boolean} sort by most recent? (default is true)
   * @returns {arr} sorted array
   */
  sortDates(arr, oldest = false) {
    return arr.sort((a, b) => {
      let aa = typeof a.date === "string" ? Date.parse(a.date) : a.date,
        bb = typeof b.date === "string" ? Date.parse(b.date) : b.date;
      return !oldest ? bb - aa : aa - bb;
    });
  }
  /**
   * converts text to title case
   *
   * @param {string} str
   * @returns {string}
   * @memberof LoremData
   */
  titleCase(str) {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.replace(word[0], word[0].toUpperCase()))
      .join(" ");
  }

  updated(changedProperties) {
    if (super.updated) super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {});
  }
}
customElements.define(LoremData.tag, LoremData);
export { LoremData };
