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
      lessonAudioCount: "{count} Audio",
      lessonImagesCount: "{count} Images",
      lessonObjectivesCount: "{count} Objectives",
      lessonObjectivesSubtitle: "Goals for you as you learn",
      lessonDataTablesCount: "{count} Data tables",
      lessonPagesCount: "{count} Pages",
      lessonLearningObjectivesCount: "{count} learning objectives",
      lessonImagesLowerCount: "{count} images",
      lessonDataTablesLowerCount: "{count} data tables",
      lessonApproxReading: "Approx. {time} of reading",
      lessonReadingEstimate: "This is just an estimate of words to read",
      lessonInteractiveItemsCount: "{count} Interactive items",
      lessonSelfChecksSubtitle: "Self checks and interactive widgets to learn by applying knowledge",
      lessonVideosCount: "{count} Videos",
      lessonVideoLength: "{time} of video",
      lessonValueOfKey: "{value} of {key}",
    };
    this.registerLocalization({
      context: this,
      namespace: "haxcms",
      localesPath: new URL("../../../locales/", import.meta.url).href,
    });
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
    let params = {
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
        let base = "";
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
            item.title = this.t.lessonAudioCount.replace("{count}", () => value);
            item.icon = "av:music-video";
            break;
          case "images":
            item.title = this.t.lessonImagesCount.replace("{count}", () => value);
            item.icon = "image:image";
            break;
          case "objectives":
            item.title = this.t.lessonObjectivesCount.replace("{count}", () => value);
            item.subtitle = this.t.lessonObjectivesSubtitle;
            item.icon = "editor:format-list-numbered";
            break;
          case "dataTables":
            item.title = this.t.lessonDataTablesCount.replace("{count}", () => value);
            item.icon = "image:grid-on";
            break;
          case "pages": {
            let items = [];
            item.title = this.t.lessonPagesCount.replace("{count}", () => value);
            if (data.objectives) {
              items.push(
                this.t.lessonLearningObjectivesCount.replace(
                  "{count}",
                  () => data.objectives,
                ),
              );
            }
            if (data.images) {
              items.push(
                this.t.lessonImagesLowerCount.replace("{count}", () => data.images),
              );
            }
            if (data.dataTables) {
              items.push(
                this.t.lessonDataTablesLowerCount.replace(
                  "{count}",
                  () => data.dataTables,
                ),
              );
            }
            item.subtitle = items.join(", ");
            item.icon = "editor:insert-drive-file";
            break;
}
          case "readTime": {
            let readVal = [];
            let hours = Math.floor(value / 60);
            let minutes = Math.floor(value - hours * 60);
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
            item.title = this.t.lessonApproxReading.replace(
              "{time}",
              () => (readVal.join(", ")),
            );
            item.subtitle = this.t.lessonReadingEstimate;
            item.icon = "communication:import-contacts";
            break;
}
          case "selfChecks":
            item.title = this.t.lessonInteractiveItemsCount.replace(
              "{count}",
              () => value,
            );
            item.subtitle = this.t.lessonSelfChecksSubtitle;
            item.icon = "hardware:videogame-asset";
            break;
          case "video":
            item.title = this.t.lessonVideosCount.replace("{count}", () => value);
            if (data.videoLength) {
              item.subtitle = this.t.lessonVideoLength.replace(
                "{time}",
                () => (toHHMMSS(data.videoLength)),
              );
            }
            item.icon = "av:play-circle-outline";
            break;
          case "videoLength":
            item.title = this.t.lessonVideoLength.replace(
              "{time}",
              () => (toHHMMSS(value)),
            );
            item.icon = "av:play-circle-outline";
            break;
          default:
            item.title = this.t.lessonValueOfKey
              .replace("{value}", () => value)
              .replace("{key}", () => key);
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
globalThis.customElements.define(LessonOverview.tag, LessonOverview);
export { LessonOverview };

// convert seconds back into full time stamp
function toHHMMSS(seconds) {
  let out = "";
  let snum = parseInt(seconds, 10);
  let hours = Math.floor(snum / 3600);
  let minutes = Math.floor((snum - hours * 3600) / 60);

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
