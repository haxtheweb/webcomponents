import { LitElement, html, css } from "lit-element/lit-element.js";
//import { LoremDataBehaviors } from "./lib/lorem-data-behaviors.js"
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
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import { SimpleIconsetDemo } from "@lrnwebcomponents/simple-icon/lib/simple-iconset-demo.js";
import { SimpleIcon } from "@lrnwebcomponents/simple-icon/simple-icon.js";
import { SimpleIconLite } from "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";
import { SimpleIconsData } from "@lrnwebcomponents/simple-icon/lib/iconsets.js";
import { HaxIconsetData } from "@lrnwebcomponents/hax-iconset/lib/iconset.js";

export const LoremDataBehaviors = function (SuperClass) {
  return class extends SuperClass {
    static get properties() {
      return {
        __demo: {
          type: Object,
        },
      };
    }
    constructor() {
      super();
    }
    get colors() {
      let simple = window.SimpleColorsSharedStyles.requestAvailability();
      return simple && simple.colors ? Object.keys(simple.colors) : false;
    }
    get icons() {
      return [...SimpleIconsData, ...HaxIconsetData]
        .map((iconset) =>
          iconset.icons.map((icon) =>
            iconset.name == "icons" ? icon : `${iconset.name}:${icon}`
          )
        )
        .flat();
    }
    get text() {
      return "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed consectetur at erat eu egestas. Cras porta volutpat vestibulum. Vestibulum eu quam fermentum, lobortis purus at, mattis massa. Sed eget velit rhoncus, ultricies metus eu, tincidunt justo. Ut sit amet congue justo, ac auctor mi. Etiam ut urna laoreet eros sodales commodo. Sed laoreet tortor ligula, vitae condimentum mi sagittis vitae. Nullam volutpat sodales ipsum vel dictum. Aenean dapibus arcu sit amet tellus placerat scelerisque sed nec dui. Maecenas laoreet maximus magna, quis consectetur massa tristique ut. Nunc rutrum elit in tincidunt commodo. Donec nec varius velit. Duis ut arcu pulvinar, venenatis felis pellentesque, egestas ante. Etiam urna dui, vestibulum at diam eget, mattis gravida ipsum. Nulla auctor, neque a ultricies laoreet, nulla diam laoreet nisl, nec rutrum ex lorem a purus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Suspendisse gravida ante eu nisi viverra, ac porta risus laoreet. Nunc a justo vel nisl accumsan placerat eu eu libero. Donec non augue sit amet nisl pulvinar bibendum vulputate sit amet metus. Maecenas vel condimentum nulla, at elementum neque. Fusce ac dictum augue. Suspendisse potenti. Nullam eros dui, vehicula et imperdiet vel, vestibulum vel tortor. Nullam ac nunc ante. Pellentesque condimentum nec dui sed varius. Donec porttitor leo id lectus faucibus, in fermentum purus lacinia. Pellentesque vel tellus ut lectus tincidunt pharetra. Quisque elementum elit mattis mi dignissim, eleifend eleifend risus faucibus. Nullam interdum pulvinar tempor. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Etiam semper, diam sit amet condimentum interdum, dolor risus ultrices dui, et egestas ex magna at odio. Aliquam sed vulputate turpis. Integer suscipit laoreet lectus, in lobortis sapien. Ut aliquam, dui ac efficitur ullamcorper, sapien augue euismod sapien, eget consectetur odio lectus ac elit. Pellentesque varius metus vel placerat rutrum. Duis placerat diam ut tortor vestibulum, eu ultrices risus gravida. Ut vel auctor dolor. Donec sit amet ornare ipsum, nec pulvinar neque. Pellentesque sagittis orci bibendum, laoreet elit eget, vulputate ante. Donec accumsan in elit sed sollicitudin. Fusce pellentesque velit est, id vestibulum orci consectetur ac. In libero odio, vehicula non felis eu, scelerisque rhoncus arcu. Phasellus id tristique justo. Sed scelerisque quam velit, at porta leo accumsan in. Vestibulum non enim lacinia odio venenatis vehicula. Quisque ultrices augue nulla. Sed tempus porta ipsum, eu rhoncus ligula feugiat ac. Aenean et sollicitudin sem, a pharetra mi. Sed convallis velit in est molestie interdum. Fusce bibendum volutpat sapien vitae faucibus. Vivamus nec neque pellentesque, euismod elit quis, commodo est. Maecenas sed tristique augue. Phasellus facilisis fringilla sem in viverra. Sed porta in justo vitae dignissim. In cursus imperdiet elementum. Maecenas congue metus aliquam placerat semper. Mauris eu libero nunc. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nam ultrices venenatis nibh, at lacinia nisi lacinia vitae. Quisque eu est scelerisque, mattis sem eu, rhoncus dui. Nulla facilisi. Etiam in quam a tellus mattis condimentum. Nullam facilisis, dolor ac consequat malesuada, diam felis lacinia ante, volutpat ullamcorper orci lacus non orci. Suspendisse sit amet consequat elit, ut vestibulum urna. Nam id dui sem. Suspendisse elementum ac orci vel auctor. Vivamus ornare accumsan sagittis. Nullam vitae est tempor, pretium eros nec, cursus nibh. Vivamus aliquet sodales elit. Proin non semper metus. Maecenas feugiat tincidunt iaculis. Integer lectus nisi, commodo et diam at, mattis varius nisi. Integer ultrices pharetra eleifend. Sed vulputate, ipsum congue ultricies venenatis, justo leo eleifend sem, quis lacinia urna orci in dolor. Etiam condimentum hendrerit sapien, in placerat velit porttitor lobortis. Integer non pellentesque ex. Mauris vestibulum tortor turpis, sed volutpat turpis gravida dapibus. Quisque finibus, purus sit amet aliquam consequat, sem sem ultricies risus, ut dapibus lacus elit non nulla. Mauris nisl justo, consequat et mauris tempus, placerat gravida risus. Maecenas semper vitae enim eu rutrum. Curabitur eget viverra nisl. Aliquam vitae diam risus. Sed nec nisi nec tortor convallis ultricies. Pellentesque lobortis euismod magna et malesuada. Praesent eget mi eros. Ut quis imperdiet odio. Maecenas a fermentum massa, nec semper justo. Integer a massa aliquam, vulputate est a, condimentum neque. Phasellus ligula elit, feugiat eget ante a, porttitor tempus diam. Vestibulum semper ante pretium, interdum elit ac, egestas dolor. Interdum et malesuada fames ac ante ipsum primis in faucibus. Ut consequat, nisi nec scelerisque suscipit, libero lectus dictum lectus, quis molestie sem ipsum in nisi. Curabitur finibus purus nec vehicula euismod. Duis in libero hendrerit, congue lacus vel, porta turpis. Aenean volutpat dolor faucibus varius fermentum. Proin nisi neque, condimentum id venenatis ut, fermentum id velit. Etiam pretium sem eget metus congue ultricies. Phasellus laoreet tortor eu lectus consequat viverra. Nulla eget dictum nunc, eu dictum turpis. Morbi sit amet erat et leo malesuada iaculis eget in ipsum. Vivamus eleifend orci at quam dignissim, eget congue lacus faucibus. Sed porta ultrices nibh, vitae efficitur arcu facilisis blandit. Etiam vitae ligula lobortis, tincidunt est quis, eleifend leo. Vestibulum feugiat odio non nisi vehicula dictum. Nam elementum mauris sed tortor faucibus vestibulum. Maecenas nec facilisis ligula. Quisque tellus enim, venenatis sed magna vitae, vehicula auctor orci. Suspendisse fringilla urna mauris, sit amet dictum lorem iaculis ut. Morbi tempus velit a tellus sagittis viverra. Integer ornare pharetra pharetra. Nunc sit amet ex at mi commodo mollis. Sed sed mi feugiat, semper nibh at, semper nisi. Fusce dapibus, nisi et placerat vehicula, nisi nibh maximus lorem, nec porttitor tellus eros eu metus. Proin tortor magna, cursus ultrices eleifend venenatis, tincidunt ut metus. Donec felis arcu, aliquam et odio sed, accumsan mollis nibh. Nulla nisi nunc, lobortis non convallis ac, porttitor non ligula. Suspendisse hendrerit tempor ante in congue. Nunc auctor libero sit amet lobortis efficitur. Suspendisse pretium efficitur finibus. Praesent rutrum justo in magna scelerisque mollis. In tempor sodales efficitur. Suspendisse tempus sagittis quam, fermentum vehicula odio iaculis at. Duis laoreet, neque eu aliquet venenatis, magna nisl sollicitudin risus, eu pulvinar diam ex vitae mauris. Sed eget diam justo. Quisque tristique venenatis justo nec tincidunt. Proin porta nisi nec facilisis iaculis. Ut euismod vel metus eu sodales. Pellentesque quis massa in nunc interdum ornare accumsan ac sapien. Aenean condimentum, erat nec ornare viverra, massa quam vulputate metus, at ultricies metus nunc ac dolor. In lorem nibh, luctus quis consectetur quis, ultrices quis massa. Sed ut vehicula tortor, vel blandit neque. Duis ac semper neque. Cras at faucibus tortor, sed ultricies tellus. Phasellus in lacus leo. Maecenas vehicula eu massa id ullamcorper. Duis a sem felis. Nunc fringilla felis in leo pulvinar, mattis lobortis nunc sollicitudin. Sed ut tincidunt risus. Nunc a viverra libero. Etiam sed libero cursus, porttitor purus et, aliquet nisi. Praesent ac tortor libero. Mauris vestibulum enim non turpis blandit, quis varius libero ultricies. Proin non sapien pellentesque, vulputate magna eget, dictum lacus. Curabitur tincidunt vestibulum nisl, at sodales tellus volutpat id. In nisl enim, accumsan id quam vitae, congue euismod ligula. Sed dictum luctus aliquet. Fusce consectetur porttitor imperdiet. Duis pretium sem sed nisi venenatis consequat. Aenean eget sapien id massa tincidunt dignissim vitae non tortor. Maecenas ac ligula diam. Morbi vitae bibendum turpis, sed rutrum eros. Vivamus ut mi facilisis, rutrum metus porta, condimentum urna. Vestibulum semper sed tellus vitae pellentesque. Sed porttitor nisl non felis semper, laoreet vulputate ipsum tristique. Nullam luctus sit amet orci id consectetur. Sed vel augue nisl. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque neque justo, interdum varius nulla et, aliquet pharetra nibh. Maecenas quis vehicula justo. Curabitur at elit justo. Quisque pharetra sapien vel bibendum mollis. Ut elementum ut ante a ornare. Cras suscipit, neque a suscipit laoreet, libero tellus lacinia nulla, hendrerit iaculis turpis nisi sed neque. Interdum et malesuada fames ac ante ipsum primis in faucibus. Quisque quis lacus vitae nibh consectetur lobortis. Proin varius fringilla scelerisque. Aliquam ac felis ut leo interdum fermentum. Nam accumsan risus sapien, ac maximus ex tincidunt ut. Nam ultrices et metus ut cursus. Suspendisse tempor erat pharetra nisl placerat, vitae scelerisque nisi lobortis. Suspendisse quis lorem metus. Ut nec dolor magna. Sed sem metus, hendrerit eget posuere sed, efficitur vitae urna. Sed pellentesque eu augue a tristique. Donec lacinia consequat mi non sollicitudin. In scelerisque nisi at eleifend aliquet. Donec tristique dui turpis, id congue est pharetra id. Praesent pretium libero sit amet semper aliquet. Phasellus fringilla ligula id augue accumsan, ac tempor sem consequat. Proin placerat arcu quam, eget feugiat quam dapibus a. Quisque eleifend purus ac erat fringilla laoreet. Ut sem diam, iaculis a lectus vel, volutpat eleifend lorem. Vivamus mi ligula, consectetur ut maximus in, sodales nec sem. Nam ac nulla ornare, interdum lectus sed, porta elit. Pellentesque consectetur dapibus purus. Phasellus lacinia leo at libero tincidunt maximus. Nulla facilisi. Sed feugiat sem id libero lobortis, ut scelerisque odio posuere. Pellentesque id risus nec metus bibendum consectetur. Integer ac sapien eget neque sagittis viverra. Nulla bibendum erat nisl, vitae fringilla lectus cursus ut. Ut est lorem, laoreet hendrerit nulla at, accumsan convallis quam. Praesent euismod nibh ac semper semper. Donec sit amet interdum tellus. Proin ultrices nisi augue. Sed aliquam scelerisque justo eleifend rhoncus. Mauris et leo tortor. Nunc est magna, laoreet in ex ut, sodales cursus ex. Nulla congue libero et diam euismod, ut vehicula enim egestas. Aenean et magna iaculis, placerat magna quis, hendrerit metus. Ut venenatis imperdiet risus a dignissim. Praesent lobortis consequat urna eget varius. Quisque eros nisi, dictum non luctus at, mattis et lorem. Donec elementum neque id massa ultrices, nec auctor purus sollicitudin. Etiam interdum porta massa, ut consectetur tellus lobortis malesuada. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Integer non ornare ante, eu fermentum dolor. Mauris quis venenatis arcu, eu consequat elit. Phasellus maximus placerat maximus. Ut velit turpis, consequat eu lacus at, hendrerit ultricies augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Donec non velit sapien. Vivamus sit amet sem finibus, sagittis nunc non, volutpat magna. Vivamus eget dui ut metus efficitur porttitor. Pellentesque semper vitae sem in fermentum. Maecenas sed ex massa. Fusce ac augue nec est iaculis semper. Donec aliquam, neque maximus ultricies facilisis, neque dui eleifend mi, ut tristique sem mi a risus. Quisque ut lorem quis tortor maximus condimentum suscipit nec nunc. Nulla vel enim tempus, posuere augue id, imperdiet nisl. Maecenas semper libero in felis semper, pellentesque ullamcorper nisi mollis. Vestibulum tincidunt lacinia tellus ac congue. Vivamus ultrices nisi sit amet ultricies suscipit. Nulla facilisi. Proin ultricies fermentum risus, in aliquet ligula lacinia at. Aliquam pretium faucibus erat ut varius. Morbi quam urna, mollis a velit sit amet, bibendum tempus dolor. Etiam ac tempus sapien. Etiam in rutrum purus. Nunc nec fermentum metus, sed placerat justo. Ut leo sapien, pellentesque at pulvinar vitae, volutpat ac elit. Phasellus non dolor consequat, tempor leo non, dictum nibh. Suspendisse scelerisque nisl quis sagittis facilisis. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aenean libero eros, rutrum eu lorem eu, suscipit elementum justo. Cras viverra blandit dui in consectetur. Praesent erat est, molestie ut leo nec, efficitur placerat mauris. Nunc sollicitudin accumsan justo, sit amet interdum massa faucibus a. Pellentesque ac tempor odio. Fusce rutrum sagittis quam ut tincidunt. Aliquam consectetur luctus justo sit amet porttitor. Vivamus blandit porttitor massa, et ullamcorper lorem porttitor at. In tempus euismod est, ac ullamcorper mauris fermentum iaculis. Integer tincidunt sem id mauris tempus luctus. Phasellus sed egestas lacus. Curabitur luctus dolor arcu, aliquam convallis ligula dignissim sed. Phasellus scelerisque diam nec euismod finibus. Mauris feugiat, ipsum in condimentum blandit, justo orci ultrices neque, sed rutrum ligula magna ut nisl. Pellentesque tempus tincidunt turpis in mattis. Duis ut condimentum massa, ac cursus orci. Ut vel orci eget arcu bibendum mattis id sed felis. Morbi nisi risus, efficitur vel accumsan eget, feugiat sed ipsum. Vestibulum sit amet suscipit erat. Proin dignissim mauris eu varius suscipit. Sed consequat ex eros, eget fermentum enim interdum vel. Ut ullamcorper auctor est sed auctor. Donec lacinia turpis mauris, eget lacinia diam varius non. Vivamus vestibulum ullamcorper vestibulum. Cras quis quam at ex ultricies ornare vel eu.";
    }
    get words() {
      return this.text.toLowerCase().split(/\W+/);
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
     * convert camelcase to kebab (for converting properties in attributes)
     * @param {string} camel
     * @returns {string} kebab
     * @memberof StorybookUtilities
     */
    camelToKebab(camel) {
      return camel
        ? camel.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2").toLowerCase()
        : undefined;
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
     * @returns {arr} shuffled array of x items
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
     * convert camelcase to kebab (for converting properties in attributes)
     * @param {string} camel
     * @returns {string} kebab
     * @memberof StorybookUtilities
     */
    kebabToCamel(kebab) {
      return kebab
        ? kebab.replace(/-./g, (x) => x.toUpperCase()[1])
        : undefined;
    }
    randomArray(children = {}, min = 1, max = 4) {
      let arr = [];
      for (let i = this.randomNumber(min, max, 1); i > 0; i--) {
        arr.push(this.randomType(children));
      }
      return arr;
    }

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

    randomFlickr(
      aspect = this.randomAspect(),
      searchTerms = [],
      searchAll = false,
      multiple = -1
    ) {
      return `https://loremflickr.com/${aspect}${
        searchTerms.length === 0
          ? ``
          : `/${searchTerms.join(",")}${searchAll ? `/all` : ""}`
      }${multiple > -1 ? `?random=${multiple}` : ""}`;
    }

    randomImage(aspect = this.randomAspect(), greyscale, topic, multiple) {
      return topic && ["man", "woman", "person"].includes(topic)
        ? this.randomProfileImage(aspect, topic)
        : typeof multiple === typeof undefined
        ? this.randomPlaceImg(aspect, greyscale, topic)
        : topic === "any"
        ? this.randomPicsum(aspect, greyscale, undefined, multiple)
        : this.randomFlickr(aspect, [topic], false, multiple);
    }

    randomImageData(aspect = this.randomAspect(), greyscale, topic, multiple) {
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

    randomKitten(aspect = this.randomAspect(), greyscale) {
      if (typeof greyscale === typeof undefined)
        greyscale = this.randomWeightedOption([
          { value: false, weight: 3 },
          { value: true, weight: 1 },
        ]);
      return `//placekitten.com${greyscale ? "/g" : ""}/${aspect}`;
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

    randomPicsum(aspect = this.randomAspect(), greyscale, blur = 0, id) {
      let params =
        greyscale ||
        this.randomWeightedOption([
          { value: false, weight: 3 },
          { value: true, weight: 1 },
        ])
          ? ["greyscale"]
          : [];
      if (blur > 0) params.push(`blur=${blur}`);
      return `https://picsum.photos/${id > -1 ? `id/${id}` : ``}/${aspect}/${
        params.length == 0 ? "" : `?${params.join("&")}`
      }`;
    }

    randomPlaceImg(aspect = this.randomAspect(), filter, topic = "any") {
      filter =
        filter ||
        this.randomWeightedOption([
          { value: "", weight: 12 },
          { value: "greyscale", weight: 4 },
          { value: "sepia", weight: 1 },
        ]);
      return `//placeimg.com/${aspect}/${topic}${
        filter === "greyscale"
          ? "/greyscale"
          : filter === "sepia"
          ? "/sepia"
          : ""
      }`;
    }

    randomProfileImage(aspect = this.randomAspect(), topic, multiple) {
      let aspects = aspect.split("/"),
        area = parseInt(aspects[0]) * parseInt(aspects[1]),
        size = area < 250 ? "thumb/" : area < 640 ? "med/" : "",
        random = Math.random() < 0.5 ? "men" : "women",
        person = topic === "man" ? "men" : topic === "woman" ? "women" : random;
      return `https://randomuser.me/api/portraits/${size}${person}/${
        multiple || this.randomNumber(1, 90)
      }.jpg`;
    }
    randomParagraph(
      min = 3,
      max = 7,
      wordMinPerSentencce,
      wordMaxPerSentencce
    ) {
      let paragraph = [];
      for (let i = this.randomNumber(min, max); i > 0; i--) {
        paragraph.push(
          this.randomSentence(wordMinPerSentencce, wordMaxPerSentencce)
        );
      }
      return `${paragraph.join(" ")}`;
    }

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
              schema.aspect,
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
              schema.wordMinPerSentencce,
              schema.wordMaxPerSentencce
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

    titleCase(str) {
      return str
        .toLowerCase()
        .split(" ")
        .map((word) => word.replace(word[0], word[0].toUpperCase()))
        .join(" ");
    }
  };
};

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
    console.warn(this.data);
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

  saveAll() {
    if (
      this.shadowRoot &&
      this.shadowRoot.querySelectorAll("a") &&
      confirm(`Save the following: ${Object.keys(this.schemas).join(", ")}?`)
    ) {
      this.shadowRoot.querySelectorAll("a").forEach((a) => a.click());
    }
  }

  getJson(schema) {
    return JSON.stringify(this.randomType(schema));
  }

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
   * @returns {array}
   * @memberof StorybookUtilities
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
   * @returns {arr} shuffled array of x items
   */
  draw(arr = [], min = 0, max = min) {
    let range = max - min,
      rand = Math.random() * range,
      offset = Math.floor(rand),
      len = min + offset,
      slice = Math.max(0, len);
    return this.shuffle(arr).slice(0, slice);
  }
  randomArray(children = {}, min = 1, max = 4) {
    let arr = [];
    for (let i = this.randomNumber(min, max, 1); i > 0; i--) {
      arr.push(this.randomType(children));
    }
    return arr;
  }

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

  randomKitten(aspect, greyscale) {
    if (typeof greyscale === typeof undefined)
      greyscale = this.randomWeightedOption([
        { value: false, weight: 3 },
        { value: true, weight: 1 },
      ]);
    aspect = aspect || this.randomAspect();
    return `//placekitten.com${greyscale ? "/g" : ""}/${aspect}`;
  }

  randomFlickr(aspect, searchTerms = [], searchAll = false, multiple = -1) {
    aspect = aspect || this.randomAspect();
    return `https://loremflickr.com/${aspect}${
      searchTerms.length === 0
        ? ``
        : `/${searchTerms.join(",")}${searchAll ? `/all` : ""}`
    }${multiple > -1 ? `?random=${multiple}` : ""}`;
  }

  randomImage(aspect, greyscale, topic, multiple) {
    return topic && ["man", "woman", "person"].includes(topic)
      ? this.randomProfileImage(aspect, topic)
      : typeof multiple === typeof undefined
      ? this.randomPlaceImg(aspect, greyscale, topic)
      : topic === "any"
      ? this.randomPicsum(aspect, greyscale, undefined, multiple)
      : this.randomFlickr(aspect, [topic], false, multiple);
  }

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
  randomParagraph(min = 3, max = 7, wordMinPerSentencce, wordMaxPerSentencce) {
    let paragraph = [];
    for (let i = this.randomNumber(min, max); i > 0; i--) {
      paragraph.push(
        this.randomSentence(wordMinPerSentencce, wordMaxPerSentencce)
      );
    }
    return `${paragraph.join(" ")}`;
  }

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
            schema.wordMinPerSentencce,
            schema.wordMaxPerSentencce
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
window.customElements.define(LoremData.tag, LoremData);
export { LoremData };
