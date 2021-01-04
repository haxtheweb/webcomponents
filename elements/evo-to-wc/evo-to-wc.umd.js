/**
 * Copyright 2018 Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html } from "lit-element/lit-element.js";
import "@lrnwebcomponents/editable-table/editable-table.js";

/**
 * evo-to-wc
 * Converts evolution content to web component equivalents
 *
 *
 * @demo ./demo/index.html Course Icons
 * @demo ./demo/tables.html Tables
 * @demo ./demo/callouts.html Callouts
 * @demo ./demo/images.html Images
 * @demo ./demo/nav.html Navigation
 * @element evo-to-wc
 */
export class EvoToWc {
  get courseicons() {
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
  get headings() {
    return ["h1", "h2", "h3", "h4", "h5", "h6"];
  }
  constructor() {}

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

  convertIfNeeded(target, conversions = []) {
    conversions.forEach((conversion) => {
      let nodes = target.querySelectorAll(conversion.selector);
      if (nodes.length > 0) this[conversion.function](nodes, target);
    });
  }
  convertAccordions(accordions) {
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
  convertCards(cards, target) {
    import("@lrnwebcomponents/accent-card/accent-card.js");

    this.convertIfNeeded(target, [
      { selector: ".newcolorbox", function: "convertNewcolorboxes" },
      { selector: ".colorbox", function: "convertColorboxes" },
      { selector: ".pulltext", function: "convertPulltexts" },
      { selector: ".yellownote", function: "convertYellownotes" },
      { selector: ".speechbubble", function: "convertSpeechbubbles" },
    ]);
  }
  convertCarousels(carousels) {
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
  convertCollapses(collapses, target) {
    import("@lrnwebcomponents/a11y-collapse/a11y-collapse.js");
    this.convertIfNeeded(target, [
      { selector: ".expandable", function: "convertExpandables" },
      { selector: ".accordion-interface", function: "convertAccordions" },
    ]);
  }
  convertColorboxes(cards) {
    cards.forEach((box) => {
      let card = document.createElement("accent-card");
      card.accentColor = "light-blue";
      this.replace(box, card, this.slotAccentCard);
    });
  }

  convertExpandables(expandables) {
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
  convertFigures(figures) {
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
        this.setSize(image, a11y, "width");
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
  convertGifs(gifs) {
    import("@lrnwebcomponents/a11y-gif-player/a11y-gif-player.js");

    gifs.forEach((image) => {
      let player = document.createElement("a11y-gif-player"),
        src = image.src || "";
      this.setSize(image, player, "height");
      this.setSize(image, player, "width");
      player.src = src;
      player.srcWithoutAnimation = src.replace(/\.\w+$/, ".gif");
      image.parentElement.insertBefore(player, image);
      image.remove();
    });
  }

  convertGalleries(gallery, target) {
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

  convertGraphmes(graphmes) {
    import("@lrnwebcomponents/lrndesign-chart/lib/lrndesign-bar.js");
    import("@lrnwebcomponents/lrndesign-chart/lib/lrndesign-line.js");
    import("@lrnwebcomponents/lrndesign-chart/lib/lrndesign-pie.js");

    graphmes.forEach((graphme) => {
      ["bar", "line", "pie"].forEach((type) => this.slotChart(type, graphme));
      if (!graphme.classList.contains("showtable")) graphme.remove();
    });
  }
  convertIcons(icons, target) {
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

  convertImageLists(lists) {
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

  convertNewcolorboxes(cards) {
    cards.forEach((box) => {
      let card = document.createElement("accent-card");
      card.noBorder = true;
      card.flat = true;
      this.replace(box, card, this.slotAccentCard);
    });
  }

  convertPulltexts(cards) {
    cards.forEach((box) => {
      let card = document.createElement("accent-card");
      card.accentColor = "light-blue";
      card.horizontal = true;
      this.replace(box, card, this.slotAccentCard);
    });
  }

  convertSpeechbubbles(cards) {
    cards.forEach((box) => {
      let card = document.createElement("accent-card"),
        afterBox = box.nextElementSibling;
      card.accentColor = "light-blue";
      card.horizontal = true;
      this.replace(box, card, this.slotAccentCard);
      if (afterBox.classList.contains("speechbubble-caption")) {
        afterBox.slot = "content";
        afterBox.style.fontSize = "85%";
        afterBox.classList.remove("speechbubble-caption");
        card.append(afterBox);
        afterBox.style.textAlign = "right";
      }
    });
  }

  convertTabs(tabbed) {
    import("@lrnwebcomponents/a11y-tabs/a11y-tabs.js");

    tabbed.forEach((tabs) => {
      let a11ytabs = document.createElement("a11y-tabs");
      this.replace(tabs, a11ytabs, this.slotTabs.bind(this));
    });
  }

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
  convertYellownotes(cards) {
    cards.forEach((box) => {
      let card = document.createElement("accent-card");
      card.accentColor = "yellow";
      card.accentBackground = true;
      card.noBorder = true;
      this.replace(box, card, this.slotAccentCard);
    });
  }

  isHeading(el) {
    return el && el.tagName && this.headings.includes(el.tagName.toLowerCase());
  }

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

  setSize(image, elem, type) {
    let amt = `${image[type]}`;
    if (amt) {
      if (amt.match(/\d$/)) amt = `${amt}px`;
      elem.style[type] = amt;
    }
  }

  slotAccentCard(child) {
    if (child && child.tagName) {
      if (this.isHeading(child)) {
        child.slot = "heading";
      } else {
        child.slot = "content";
      }
    } else {
      let span = document.createElement("span");
      span.append(child);
      span.slot = "content";
      child = span;
    }
    return child;
  }

  slotChart(type, table) {
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
window.EvoToWc = window.EvoToWc || {};

window.EvoToWc.requestAvailability = () => {
  if (!window.EvoToWc.instance) {
    window.EvoToWc.instance = new EvoToWc();
  }
  return window.EvoToWc.instance;
};
export const EvoToWcConverter = window.EvoToWc.requestAvailability();
