/**
 * Copyright 2018 Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */

/**
 * bootstrap-to-hax
 * Converts Bootstrap callses to HAX web component equivalents
 *
 *
 * @demo ./demo/index.html Course Icons
 * @demo ./demo/tables.html Tables
 * @demo ./demo/callouts.html Callouts
 * @demo ./demo/images.html Images
 * @demo ./demo/nav.html Navigation
 * @element bootstrap-to-hax
 */
export class BootstrapToHax {
  /**
   * icon conversions
   *
   * @memberof BootstrapToHax
   */
  static get courseicons() {
    return {
      assessment: "assessment",
      brainstorm: "lightbulb-outline",
      casestudy: "work",
      discussion: "question-answer",
      email: "mail",
      game: "hardware:videogame-asset",
      group: "social:group",
      handson: "pan-tool",
      image: "image:image",
      mobile: "hardware:phone-android",
      presentation: "device:dvr",
      reading: "chrome-reader-mode",
      reflection: "lightbulb-outline",
      rss: "mdi-social:rss-box",
      selfcheck: "assignment-turned-in",
      survey: "assignment",
      transcript: "receipt",
      video: "av:movie",
      webresource: "language",
      written: "create",
      yammer: "lrn:assessment",
    };
  }
  /**
   * list of headings to simplify selectors
   *
   * @readonly
   * @static
   * @memberof BootstrapToHax
   */
  static get headings() {
    return ["h1", "h2", "h3", "h4", "h5", "h6"];
  }
  /**
   * Conversion function
   *
   * @param {object} [target=document.body] node to convert
   * @memberof BootstrapToHax
   */
  convert(target = document.body) {
    this.convertIfNeeded(target, [
      { selector: ".coursework", function: "convertIcons" },
      { selector: ".graphme", function: "convertGraphmes" },
      { selector: ".tablestyle,.tablestyle2", function: "convertTablestyles" },
      { selector: ".tabbed-interface", function: "convertTabs" },
      {
        selector: ".expandable,.accordion-interface",
        function: "convertCollapses",
      },
      { selector: "figure", function: "convertFigures" },
      { selector: "img.gif-player", function: "convertGifs" },
      {
        selector:
          ".image-thumbnail, .dynamic-image-group,.wcslideplayer, .clickable-list",
        function: "convertGalleries",
      },
      {
        selector: ".newcolorbox,.colorbox,.pulltext,.yellownote,.speechbubble",
        function: "convertCards",
      },
    ]);
  }

  /**
   * runs conversion function on each matching element
   *
   * @param {object} target node to convert
   * @param {array} [conversions=[]] matching objects to convert
   * @memberof BootstrapToHax
   */
  convertIfNeeded(target, conversions = []) {
    conversions.forEach((conversion) => {
      let nodes = target.querySelectorAll(conversion.selector);
      if (nodes.length > 0) this[conversion.function](nodes, target);
    });
  }
  /**
   * Converts Evo .accordion-interface to a11y-collapse-group
   *
   * @param {array} [accordions = []] array of accordions
   * @memberof BootstrapToHax
   */
  convertAccordions(accordions = []) {
    import("@lrnwebcomponents/a11y-collapse/lib/a11y-collapse-group.js");

    accordions.forEach((accordion) => {
      let group = document.createElement("a11y-collapse-group"),
        children = [...accordion.childNodes],
        collapse;
      group.radio = true;
      group.headingButton = true;
      children.forEach((child) => {
        if (this.isHeading(child)) {
          collapse = document.createElement("a11y-collapse");
          child.slot = "heading";
          collapse.headingButton = true;
          collapse.append(child);
          group.append(collapse);
        } else if (collapse) {
          collapse.append(child);
        }
      });
      accordion.parentElement.insertBefore(group, accordion);
      accordion.remove();
    });
  }
  /**
   * Conversions to accent-card
   *
   * @param {object} target node to convert
   * @memberof BootstrapToHax
   */
  convertCards(target) {
    import("@lrnwebcomponents/accent-card/accent-card.js");

    this.convertIfNeeded(target, [
      { selector: ".newcolorbox", function: "convertNewcolorboxes" },
      { selector: ".colorbox", function: "convertColorboxes" },
      { selector: ".pulltext", function: "convertPulltexts" },
      { selector: ".yellownote", function: "convertYellownotes" },
      { selector: ".speechbubble", function: "convertSpeechbubbles" },
    ]);
  }
  /**
   * Converts Evo carousels to lrndesign-gallery carousels
   *
   * @param {array} [carousels=[]]
   * @memberof BootstrapToHax
   */
  convertCarousels(carousels = []) {
    carousels.forEach((group) => {
      let gallery = document.createElement("lrndesign-gallery"),
        items = group.querySelectorAll("figure");
      gallery.layout = "carousel";
      gallery.accentColor = "light-blue";
      items.forEach((item) => gallery.append(this.slotGallery(item)));
      group.parentNode.insertBefore(gallery, group);
      group.remove();
    });
  }
  /**
   * Converts Evo expandables and accordions to a11y-collapse
   *
   * @param {object} target node to convert
   * @memberof BootstrapToHax
   */
  convertCollapses(target) {
    import("@lrnwebcomponents/a11y-collapse/a11y-collapse.js");
    this.convertIfNeeded(target, [
      { selector: ".expandable", function: "convertExpandables" },
      { selector: ".accordion-interface", function: "convertAccordions" },
    ]);
  }
  /**
   * Converts Evo .colorbox to accent-card
   *
   * @param {array} [cards=[]] array of colorboxes
   * @memberof BootstrapToHax
   */
  convertColorboxes(cards = []) {
    cards.forEach((box) => {
      let card = document.createElement("accent-card");
      card.accentColor = "light-blue";
      this.replace(box, card, this.slotAccentCard);
    });
  }
  /**
   * Converts Evo .expandable to a11y-collapse
   *
   * @param {*} [expandables=[]] array fo expandables
   * @memberof BootstrapToHax
   */
  convertExpandables(expandables = []) {
    expandables.forEach((expandable) => {
      let collapse = document.createElement("a11y-collapse"),
        collapseable = expandable.querySelector(".collapseable"),
        content = collapseable
          ? [...expandable.querySelector(".collapseable").childNodes]
          : [],
        expandcollapse = expandable.querySelector(".expandcollapse"),
        heading = document.createElement("span"),
        nodes = expandcollapse ? [...expandcollapse.childNodes] : [];
      nodes.forEach((node) => heading.append(node));
      expandcollapse.parentNode.insertBefore(heading, expandcollapse);
      while (heading.parentNode && heading.parentNode !== expandable) {
        heading = heading.parentNode;
      }
      heading.slot = "heading";
      collapse.headingButton = true;
      collapse.append(heading);
      content.forEach((node) => collapse.append(node));
      expandable.parentNode.insertBefore(collapse, expandable);
      expandable.remove();
    });
  }
  /**
   * Converts Evo figure and .image-info to a11y-figure
   *
   * @param {*} [figures=[]] array of figures
   * @memberof BootstrapToHax
   */
  convertFigures(figures = []) {
    import("@lrnwebcomponents/a11y-figure/a11y-figure.js");

    figures.forEach((figure) => {
      let figcaption = figure.querySelector("figcaption"),
        a11y = document.createElement("a11y-figure"),
        image = figure.querySelector("img"),
        nodes,
        details,
        summary;
      if (figcaption && figure.classList.contains("image-info")) {
        nodes = [...figcaption.childNodes];
        this.setSize(image, a11y);
        details = document.createElement("details");
        summary = document.createElement("summary");
        summary.innerHTML = "info";
        details.append(summary);
        nodes.forEach((node) => details.append(node));
        figcaption.append(details);
      }
      figure.parentElement.insertBefore(a11y, figure);
      a11y.append(figure);
    });
  }
  /**
   * Converts Evo .gif-player into a11y-gif-player
   *
   * @param {*} [gifs=[]] array of gif players
   * @memberof BootstrapToHax
   */
  convertGifs(gifs = []) {
    import("@lrnwebcomponents/a11y-gif-player/a11y-gif-player.js");

    gifs.forEach((image) => {
      let player = document.createElement("a11y-gif-player"),
        src = image.src || "";
      this.setSize(image, player);
      this.setSize(image, player, "height");
      player.src = src;
      player.srcWithoutAnimation = src.replace(/\.\w+$/, ".gif");
      image.parentElement.insertBefore(player, image);
      image.remove();
    });
  }
  /**
   * Conversions to lrndesign-gallery
   *
   * @param {object} target node to convert
   * @memberof BootstrapToHax
   */
  convertGalleries(target) {
    import("@lrnwebcomponents/lrndesign-gallery/lrndesign-gallery.js");
    this.convertIfNeeded(target, [
      { selector: ".image-thumbnail", function: "convertThumbnails" },
      {
        selector: ".dynamic-image-group,.wcslideplayer",
        function: "convertCarousels",
      },
      { selector: ".clickable-list", function: "convertImageLists" },
    ]);
  }
  /**
   * Converts Evo .graphme to lrndesign-charts
   *
   * @param {*} [graphmes=[]] array of graphmes
   * @memberof BootstrapToHax
   */
  convertGraphmes(graphmes = []) {
    import("@lrnwebcomponents/lrndesign-chart/lib/lrndesign-bar.js");
    import("@lrnwebcomponents/lrndesign-chart/lib/lrndesign-line.js");
    import("@lrnwebcomponents/lrndesign-chart/lib/lrndesign-pie.js");

    graphmes.forEach((graphme) => {
      ["bar", "line", "pie"].forEach((type) => this.insertChart(graphme, type));
      if (!graphme.classList.contains("showtable")) graphme.remove();
      graphme.classList.remove("graphme");
    });
  }
  /**
   * Converts Evo .courseicon to simple-icon-lite
   *
   * @param {object} target node to convert
   * @memberof BootstrapToHax
   */
  convertIcons(target) {
    import("@lrnwebcomponents/hax-iconset/lib/simple-hax-iconset.js");
    import("@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js");
    import("@lrnwebcomponents/simple-icon/lib/simple-icons.js");

    Object.keys(this.courseicons).forEach((key) => {
      target.querySelectorAll(`.coursework.${key}`).forEach((evoicon) => {
        let child = evoicon.firstElementChild,
          icon = document.createElement("simple-icon-lite");
        icon.icon = this.courseicons[key];
        icon.style.marginRight = "0.25em";
        child.insertBefore(icon, child.firstChild);
        evoicon.classList.remove("coursework");
        evoicon.classList.remove(key);
      });
    });
  }
  /**
   * Converts Evo .clickable-list to .lrndesign-gallery
   *
   * @param {*} [lists=[]]
   * @memberof BootstrapToHax
   */
  convertImageLists(lists = []) {
    lists.forEach((list) => {
      let gallery = document.createElement("lrndesign-gallery"),
        items = list.querySelectorAll("li");
      gallery.layout = "grid";
      gallery.accentColor = "light-blue";
      items.forEach((item) => gallery.append(this.slotGallery(item)));
      list.parentNode.insertBefore(gallery, list);
      list.remove();
    });
  }

  /**
   * Converts Evo .newcolorbox to accent-card
   *
   * @param {array} [cards=[]] array of newcolorboxes
   * @memberof BootstrapToHax
   */
  convertNewcolorboxes(cards = []) {
    cards.forEach((box) => {
      let card = document.createElement("accent-card");
      card.noBorder = true;
      card.flat = true;
      this.replace(box, card, this.slotAccentCard);
    });
  }

  /**
   * Converts Evo .pulltext to accent-card
   *
   * @param {array} [cards=[]] array of pulltexts
   * @memberof BootstrapToHax
   */
  convertPulltexts(cards = []) {
    cards.forEach((box) => {
      let card = document.createElement("accent-card");
      card.accentColor = "light-blue";
      card.horizontal = true;
      this.replace(box, card, this.slotAccentCard);
    });
  }

  /**
   * Converts Evo .speechbubble to accent-card
   *
   * @param {array} [cards=[]] array of speechbubbles
   */
  convertSpeechbubbles(cards = []) {
    cards.forEach((box) => {
      let card = document.createElement("accent-card"),
        afterBox = box.nextElementSibling;
      card.accentColor = "light-blue";
      card.horizontal = true;
      this.replace(box, card, this.slotAccentCard);
      if (afterBox.classList.contains("speechbubble-caption")) {
        afterBox.slot = "footer";
        afterBox.style.fontSize = "85%";
        afterBox.classList.remove("speechbubble-caption");
        card.append(afterBox);
        afterBox.style.textAlign = "right";
      }
    });
  }

  /**
   * Converts Evo .tabbed-interface to a11y-tabs
   *
   * @param {array} [tabbed=[]] array of tabbed interfaces
   * @memberof BootstrapToHax
   */
  convertTabs(tabbed = []) {
    import("@lrnwebcomponents/a11y-tabs/a11y-tabs.js");

    tabbed.forEach((tabs) => {
      let a11ytabs = document.createElement("a11y-tabs");
      this.replace(tabs, a11ytabs, this.slotTabs.bind(this));
    });
  }

  /**
   * Converts Evo .tablestyle to editable-table
   *
   * @param {array} [tabbed=[]] array of tables
   * @memberof BootstrapToHax
   */
  convertTablestyles(tablestyles) {
    import("@lrnwebcomponents/editable-table/editable-table.js");

    tablestyles.forEach((table) => {
      let editable = document.createElement("editable-table");
      editable.bordered =
        table.classList.contains("dottedrows") ||
        table.classList.contains("dottedcols") ||
        table.classList.contains("linedrows") ||
        table.classList.contains("linedcols");
      editable.columnStriped = table.classList.contains("alternatecols");
      editable.striped =
        !editable.columnStriped && table.classList.contains("alternaterows");
      table.parentElement.insertBefore(editable, table);
      editable.append(table);
      editable.loadSlottedTable();
    });
  }

  /**
   * Converts Evo .image-thumbnail to lrndesign-gallery
   *
   * @param {array} [images=[]] array of images
   * @memberof BootstrapToHax
   */
  convertThumbnails(images) {
    images.forEach((image) => {
      let gallery = document.createElement("lrndesign-gallery"),
        src = image.src,
        thumb = src.match("_thumb.") ? src : undefined,
        large = thumb ? thumb.replace(/_thumb\./, "_full.") : undefined;
      (gallery.innerHTML = `<figure><img src="${src}" ${
        thumb ? `` : ""
      }></figure>`),
        (parent = image.parentElement);
      gallery.layout = "masonry";
      gallery.accentColor = "light-blue";
      gallery.sources = [
        {
          alt: image.alt || "",
          details: "",
          src: src,
          thumbnail: thumb,
          large: large,
          sizing: "contain",
          title: image.alt || "",
        },
      ];
      gallery.style.display = "inline-block";
      gallery.style.width = "50%";
      gallery.style.minWidth = "400px";
      gallery.style.maxWidth = "800px";
      image.parentNode.insertBefore(gallery, image);
      image.remove();
      if (parent && parent.tagName.toLowerCase() == "figure") {
        parent.style.display = "flex";
        parent.style.flexDirection = "column";
        parent.style.alignItems = "stretch";
      }
    });
  }

  /**
   * Converts Evo .yellownote to accent-card
   *
   * @param {array} [cards=[]] array of yellow notes
   */
  convertYellownotes(cards) {
    cards.forEach((box) => {
      let card = document.createElement("accent-card");
      card.accentColor = "yellow";
      card.accentBackground = true;
      card.noBorder = true;
      this.replace(box, card, this.slotAccentCard);
    });
  }
  /**
   * Inserts an lnmdesign-chart based on table
   *
   * @param {object} table
   * @param {string} [type="bar"] chart type
   * @memberof BootstrapToHax
   */
  insertChart(table, type = "bar") {
    let newTable = document.createElement("table"),
      chart = table.classList.contains(`${type}chart`)
        ? document.createElement(`lrndesign-${type}`)
        : undefined;
    if (chart) {
      chart.scale = "ct-octave";
      [...table.childNodes].forEach((node) =>
        newTable.append(node.cloneNode(true))
      );
      chart.append(newTable);
      if (type !== "pie") chart.showGridBackground = true;
      if (type === "line") chart.fullWidth = true;
      table.parentNode.insertBefore(chart, table);
    }
  }
  /**
   * determines if a node is a heading
   *
   * @param {object} el node
   * @returns {boolean}
   * @memberof BootstrapToHax
   */
  isHeading(el) {
    return el && el.tagName && this.headings.includes(el.tagName.toLowerCase());
  }
  /**
   * replaces an Evo Element with a Hax Element
   *
   * @param {*} oldElem
   * @param {*} newElem
   * @param {*} childrenCallback
   * @returns
   * @memberof BootstrapToHax
   */
  replace(oldElem, newElem, childrenCallback) {
    oldElem.parentElement.insertBefore(newElem, oldElem);
    let children = [...oldElem.childNodes];
    children.forEach((child) => {
      //console.log(newElem,children,child);
      child = childrenCallback ? childrenCallback(child) : child;
      if (child) newElem.append(child);
    });
    oldElem.remove();
    return newElem;
  }
  /**
   * sets size of one element based on image size
   *
   * @param {object} image
   * @param {object} elem
   * @param {string} type "width" or "height"
   * @memberof BootstrapToHax
   */
  setSize(image, elem, type = "width") {
    let amt = `${image[type]}`;
    if (amt) {
      if (amt.match(/\d$/)) amt = `${amt}px`;
      elem.style[type] = amt;
    }
  }
  /**
   * gets a slot on an accent card node
   *
   * @param {object} node
   * @returns {object}
   * @memberof BootstrapToHax
   */
  slotAccentCard(node) {
    if (node && node.tagName) {
      if (this.isHeading(node)) {
        node.slot = "heading";
      } else {
        node.slot = "content";
      }
    } else {
      let span = document.createElement("span");
      span.append(node);
      span.slot = "content";
      node = span;
    }
    return node;
  }
  /**
   * gets slotted figure to lrndesign-gallery
   *
   * @param {object} item node containing an image
   * @returns {object}
   * @memberof BootstrapToHax
   */
  slotGallery(item) {
    let figure = document.createElement("figure"),
      figcaption = document.createElement("figcaption"),
      img =
        item.firstElementChild.querySelector("img") ||
        item.querySelector("img"),
      siblings = item.querySelector("figcaption")
        ? [...item.querySelector("figcaption").childNodes]
        : [...item.childNodes],
      heading = item.querySelector(this.headings.join());
    if (img) {
      img.removeAttribute("width");
      img.removeAttribute("height");
      figure.append(img);
    }
    if (!heading) {
      heading = document.createElement("h3");
      if (img) heading.innerHTML = img.alt;
    }
    figcaption.append(heading);
    siblings.forEach((sibling) => {
      if (sibling != item.firstElementChild) {
        figcaption.append(sibling);
      }
    });
    figure.append(figcaption);
    return figure;
  }
  /**
   * gets a tab for a11y-tabs
   *
   * @param {object} tab
   * @returns {object}
   * @memberof BootstrapToHax
   */
  slotTabs(tab) {
    if (tab && tab.tagName) {
      let a11ytab = document.createElement("a11y-tab");
      a11ytab.id = tab.id;
      if (tab.firstElementChild) {
        tab.firstElementChild.slot = "label";
        a11ytab.append(tab.firstElementChild);
      } else if (tab.firstChild) {
        let span = document.createElement("span");
        span.slot = "label";
        span.append(tab);
        a11ytab.append(span);
      } else {
        a11ytab.label = a11ytab.id;
      }
      this.replace(tab, a11ytab);
      return a11ytab;
    }
    return false;
  }
}
// register global bridge on window if needed
window.BootstrapToHax = window.BootstrapToHax || {};

window.BootstrapToHax.requestAvailability = () => {
  if (!window.BootstrapToHax.instance) {
    window.BootstrapToHax.instance = new BootstrapToHax();
  }
  this.dispatchEvent(
    new CustomEvent("register-hax-converter", {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: window.BootstrapToHax.instance.convert,
    })
  );

  return window.BootstrapToHax.instance;
};
export const BootstrapToHaxConverter = window.BootstrapToHax.requestAvailability();
