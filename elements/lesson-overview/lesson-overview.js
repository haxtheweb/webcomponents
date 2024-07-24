/**
 * Copyright 2022 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css, LitElement } from "lit";
import { MicroFrontendRegistry } from "@haxtheweb/micro-frontend-registry/micro-frontend-registry.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { toJS } from "mobx";
import { IntersectionObserverMixin } from "@haxtheweb/intersection-element/lib/IntersectionObserverMixin.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/hax-iconset/lib/simple-hax-iconset.js";
import { enableServices } from "@haxtheweb/micro-frontend-registry/lib/microServices.js";
enableServices(["haxcms"]);
/**
 * `lesson-overview`
 * `Clean presentation of what to expect in an upcoming lesson of instruction`
 * @demo demo/index.html
 * @element lesson-overview
 */
class LessonOverview extends I18NMixin(IntersectionObserverMixin(LitElement)) {
  /**
   * Convention we use
   */
  static get tag() {
    return "lesson-overview";
  }

  constructor() {
    super();
    this.t = this.t || {};
    this.t = {
      ...this.t,
      hour: "hour",
      hours: "hours",
      minute: "minute",
      minutes: "minutes",
    };
    this.ancestor = null;
  }

  static get styles() {
    return [
      css`
        :host {
          display: inline-flex;
        }
        div ::slotted(lesson-highlight) {
          margin: 8px;
        }
      `,
    ];
  }
  render() {
    return html`${this.elementVisible
      ? html` <div class="wrapper">
          <slot name="prefix"></slot>
          <slot></slot>
        </div>`
      : ``}`;
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "elementVisible" && this[propName]) {
        this.getSmartData();
      }
    });
  }
  // calculate smart details and update associated blocks
  async getSmartData(manualSite = null) {
    var params = {
      type: "link",
      __method: "GET",
    };
    if (this.ancestor) {
      params.ancestor = this.ancestor;
    }
    if (manualSite) {
      params.site = manualSite;
    } else {
      // assemble manifest
      const site = toJS(store.manifest);
      if (site) {
        var base = "";
        if (document.querySelector("base")) {
          base = globalThis.document.querySelector("base").href;
        }
        params.site = base;
        params.ancestor = toJS(store.activeId); // set as the active item ID
        params.cacheBuster = toJS(store.isLoggedIn); // if not logged in, false; if logged in, FORCES updated data instantly
      }
    }
    // only call if we have params
    if (params.site) {
      this.querySelectorAll(`lesson-highlight[smart]`).forEach((item) => {
        item.hidden = false;
        item.loading = true;
      });
      const response = await MicroFrontendRegistry.call(
        "@haxcms/courseStats",
        params,
      );
      if (response.status === 200) {
        this.updateSmartHighlightElements(response.data);
      } else {
        // failed, just hide them
        this.querySelectorAll(`lesson-highlight[smart]`).forEach((item) => {
          item.hidden = true;
          item.loading = false;
        });
      }
    }
  }
  // find highlight elements and set the data
  updateSmartHighlightElements(data) {
    Object.keys(data).forEach((key) => {
      // we got smart data, see if we have smart blocks that care about this
      let item = this.querySelector(`lesson-highlight[smart="${key}"]`);
      if (item) {
        item.loading = false;
        let value = data[key];
        if (value === 0) {
          item.hidden = true;
        } else {
          item.loaded = true;
        }
        // walk response details, setting things into associated smart blocks
        switch (key) {
          case "audio":
            item.title = `${value} Audio`;
            item.icon = "av:music-video";
            break;
          case "images":
            item.title = `${value} Images`;
            item.icon = "image:image";
            break;
          case "objectives":
            item.title = `${value} Objectives`;
            item.subtitle = "Goals for you as you learn";
            item.icon = "editor:format-list-numbered";
            break;
          case "dataTables":
            item.title = `${value} Data tables`;
            item.icon = "image:grid-on";
            break;
          case "pages":
            let items = [];
            item.title = `${value} Pages`;
            if (data.objectives) {
              items.push(`${data.objectives} learning objectives`);
            }
            if (data.images) {
              items.push(`${data.images} images`);
            }
            if (data.dataTables) {
              items.push(`${data.dataTables} data tables`);
            }
            item.subtitle = items.join(", ");
            item.icon = "editor:insert-drive-file";
            break;
          case "readTime":
            let readVal = [];
            var hours = Math.floor(value / 60);
            var minutes = Math.floor(value - hours * 60);
            // handle hours of reading
            if (hours === 1) {
              readVal.push(`${hours} ${this.t.hour}`);
            } else if (hours === 0) {
              // do nothing for 0
            } else {
              readVal.push(`${hours} ${this.t.hours}`);
            }
            // minutes
            if (minutes === 1) {
              readVal.push(`${minutes} ${this.t.minute}`);
            } else if (minutes === 0) {
              // do nothing for 0
            } else {
              readVal.push(`${minutes} ${this.t.minutes}`);
            }
            item.title = `Approx. ${readVal.join(", ")} of reading`;
            item.subtitle = "This is just an estimate of words to read";
            item.icon = "communication:import-contacts";
            break;
          case "selfChecks":
            item.title = `${value} Interactive items`;
            item.subtitle =
              "Self checks and interactive widgets to learn by applying knowledge";
            item.icon = "hardware:videogame-asset";
            break;
          case "video":
            item.title = `${value} Videos`;
            if (data.videoLength) {
              item.subtitle = `${toHHMMSS(data.videoLength)} of video`;
            }
            item.icon = "av:play-circle-outline";
            break;
          case "videoLength":
            item.title = `${toHHMMSS(value)} of video`;
            item.icon = "av:play-circle-outline";
            break;
          default:
            item.title = `${value} of ${key}`;
            item.icon = "hardware:videogame-asset";
            break;
        }
      }
    });
  }
  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}
customElements.define(LessonOverview.tag, LessonOverview);
export { LessonOverview };

// convert seconds back into full time stamp
function toHHMMSS(seconds) {
  var out = "";
  var snum = parseInt(seconds, 10);
  var hours = Math.floor(snum / 3600);
  var minutes = Math.floor((snum - hours * 3600) / 60);

  if (hours !== 0) {
    out += `${hours} hour`;
    if (hours !== 1) {
      out += "s";
    }
    out += ", ";
  }
  if (minutes !== 0) {
    out += `${minutes} minute`;
    if (hours !== 1) {
      out += "s";
    }
  }
  return out;
}
