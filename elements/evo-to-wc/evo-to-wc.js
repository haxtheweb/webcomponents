/**
 * Copyright 2018 Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html } from "lit-element/lit-element.js";
import "@lrnwebcomponents/hax-iconset/lib/simple-hax-iconset.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/accent-card/accent-card.js";
import "@lrnwebcomponents/a11y-tabs/a11y-tabs.js";
import "@lrnwebcomponents/a11y-collapse/a11y-collapse.js";
import "@lrnwebcomponents/a11y-collapse/lib/a11y-collapse-group.js";
import "@lrnwebcomponents/lrndesign-gallery/lrndesign-gallery.js";
import "@lrnwebcomponents/a11y-gif-player/a11y-gif-player.js";
import "@lrnwebcomponents/a11y-figure/a11y-figure.js";

/**
 * evo-to-wc
 * Converts evolution content to web component equivalents
 *
 *
 * @demo ./demo/index.html Course Icons
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
    target.querySelectorAll(".tabbed-interface").forEach((tabs) => {
      let a11ytabs = document.createElement("a11y-tabs");
      this.replace(tabs, a11ytabs, this.tabsSlot.bind(this));
    });
    target.querySelectorAll(".expandable").forEach((expandable) => {
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
    target.querySelectorAll(".accordion-interface").forEach((accordion) => {
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

    target.querySelectorAll("figure").forEach((figure) => {
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

    target.querySelectorAll("img.gif-player").forEach((image) => {
      let player = document.createElement("a11y-gif-player"),
        src = image.src || "";
      this.setSize(image, player, "height");
      this.setSize(image, player, "width");
      player.src = src;
      player.srcWithoutAnimation = src.replace(/\.\w+$/, ".gif");
      image.parentElement.insertBefore(player, image);
      image.remove();
    });

    target.querySelectorAll(".image-thumbnail").forEach((image) => {
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

    target
      .querySelectorAll(".dynamic-image-group,.wcslideplayer")
      .forEach((group) => {
        let gallery = document.createElement("lrndesign-gallery"),
          items = group.querySelectorAll("figure");
        gallery.layout = "carousel";
        gallery.accentColor = "light-blue";
        items.forEach((item) => gallery.append(this.gallerySlot(item)));
        group.parentNode.insertBefore(gallery, group);
        group.remove();
      });
    target.querySelectorAll(".clickable-list").forEach((list) => {
      let gallery = document.createElement("lrndesign-gallery"),
        items = list.querySelectorAll("li");
      gallery.layout = "grid";
      gallery.accentColor = "light-blue";
      items.forEach((item) => gallery.append(this.gallerySlot(item)));
      list.parentNode.insertBefore(gallery, list);
      list.remove();
    });
    target.querySelectorAll(".newcolorbox").forEach((box) => {
      let card = document.createElement("accent-card");
      card.noBorder = true;
      card.flat = true;
      this.replace(box, card, this.accentCardSlot);
    });
    target.querySelectorAll(".colorbox").forEach((box) => {
      let card = document.createElement("accent-card");
      card.accentColor = "light-blue";
      this.replace(box, card, this.accentCardSlot);
    });
    target.querySelectorAll(".pulltext").forEach((box) => {
      let card = document.createElement("accent-card");
      card.accentColor = "light-blue";
      card.horizontal = true;
      this.replace(box, card, this.accentCardSlot);
    });
    target.querySelectorAll(".yellownote").forEach((box) => {
      let card = document.createElement("accent-card");
      card.accentColor = "yellow";
      card.accentBackground = true;
      card.noBorder = true;
      this.replace(box, card, this.accentCardSlot);
    });
    target.querySelectorAll(".speechbubble").forEach((box) => {
      let card = document.createElement("accent-card"),
        afterBox = box.nextElementSibling;
      card.accentColor = "light-blue";
      card.horizontal = true;
      this.replace(box, card, this.accentCardSlot);
      if (afterBox.classList.contains("speechbubble-caption")) {
        afterBox.slot = "content";
        afterBox.style.fontSize = "85%";
        afterBox.classList.remove("speechbubble-caption");
        card.append(afterBox);
        afterBox.style.textAlign = "right";
      }
    });
  }
  setSize(image, elem, type) {
    let amt = `${image[type]}`;
    if (amt) {
      if (amt.match(/\d$/)) amt = `${amt}px`;
      elem.style[type] = amt;
    }
  }
  isHeading(el) {
    return el && el.tagName && this.headings.includes(el.tagName.toLowerCase());
  }
  gallerySlot(item) {
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
  tabsSlot(tab) {
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
  accentCardSlot(child) {
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
