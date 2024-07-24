import { css, html, LitElement } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import {
  DDDDataAttributes,
  DDDPulseEffect,
} from "@haxtheweb/d-d-d/lib/DDDStyles.js";
import "@haxtheweb/video-player/video-player.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/hax-iconset/lib/simple-hax-iconset.js";
import "@haxtheweb/simple-modal/simple-modal.js";
import "@haxtheweb/simple-cta/simple-cta.js";

class LecturePlayer extends DDDSuper(LitElement) {
  static get styles() {
    return [
      super.styles,
      DDDDataAttributes,
      DDDPulseEffect,
      css`
        :host {
          font-family: var(--ddd-font-primary, sans-serif);
        }

        @media (max-width: 1200px) {
          .videoSection {
            grid-template-columns: 1fr;
          }
        }
        lecture-player {
          width: 100%;
          height: 100%;
        }
      `,
    ];
  }

  constructor() {
    super();
    this.associatedNodes = new Object();
    this.videoPlayer = this.querySelector("video-player").outerHTML;
    this.videoInterval = null;
    this.activeIndex = null;
    console.log(globalThis.location.hash);
    if (globalThis.location.hash) {
      var id = globalThis.location.hash.split("--")[0];
      var timestamp =
        globalThis.location.hash.split("--")[1] ||
        this.associatedNodes["slide-1"];
      console.log(id, timestamp);
      setTimeout(() => {
        this.showModal();
        console.log("show modal");
        let activeSlide = null;
        let associatedNodesValues = Object.values(this.associatedNodes);
        console.log(associatedNodesValues.length);
        for (let i = 0; i < associatedNodesValues.length; i++) {
          let currentTimestamp = associatedNodesValues[i];
          console.log(currentTimestamp);
          let nextTimestamp =
            i <= associatedNodesValues.length - 1
              ? associatedNodesValues[i + 1]
              : Infinity;

          if (timestamp >= currentTimestamp && timestamp < nextTimestamp) {
            console.log(
              "found current slide" +
                currentTimestamp +
                " " +
                nextTimestamp +
                " " +
                timestamp,
            );
            activeSlide = Object.keys(this.associatedNodes)[i];
            console.log(activeSlide);
            setTimeout(() => {
              this.activeIndex = activeSlide;
            }, 3000);
            break;
          }
          if (
            i == associatedNodesValues.length - 1 &&
            this.activeIndex === null
          ) {
            console.log("last slide");
            this.activeIndex = Object.keys(this.associatedNodes)[0];
            break;
          }
          //@TODO: Find the current slide based on timestamp & set it
        }
      }, 2000);
    }
    globalThis.addEventListener("hashChange", () => {
      var [id, timestamp] = globalThis.location.hash.split("--");
      if (id === "#lecture-player-video" && !timestamp) {
        console.log("no timestamp");
        this.showModal();
        setTimeout(() => {
          this.activeIndex = "slide-1";
        }, 1000);
      }
    });
  }

  static get properties() {
    return {
      activeIndex: { type: String, reflect: true },
      source: { type: String, reflect: true },
      associatedNodes: { type: Object, reflect: true },
      open: { type: Boolean, reflect: true },
    };
  }

  firstUpdated() {
    const lectureAnchors = this.querySelectorAll("[data-lecture-slide]");
    console.log(lectureAnchors);
    const anchorsArray = Array.from(lectureAnchors);
    anchorsArray.sort((a, b) => {
      const timeA = parseInt(a.getAttribute("data-value"), 10);
      const timeB = parseInt(b.getAttribute("data-value"), 10);
      return timeA - timeB;
    });
    anchorsArray.forEach((anchor, index) => {
      anchor.id = `slide-${index + 1}`;
      this.associatedNodes[anchor.id] = anchor.getAttribute("data-value");
      console.log(anchor.id, anchor.getAttribute("data-value"));
      anchor.addEventListener("click", () => {
        this.activeIndex = anchor.id;
      });
    });
    this.setJumbotronAttributes();
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      if (
        propName === "activeIndex" &&
        oldValue !== this.activeIndex &&
        this.activeIndex
      ) {
        if (this.linked) {
          this.linked = false;
          return;
        }
        if (!document.querySelector("video-player").playing) {
          this.play;
        }
        console.log("activeIndex changed to:", this.activeIndex);
        console.log(document.querySelector("#" + this.activeIndex));
        this.seek(this.associatedNodes[this.activeIndex]);
        this.updateJumbotron();
        this.updatePlaylist();
        this.checkDisabledButtons();
      }
    });
  }

  setJumbotronAttributes() {
    console.log("setJumbotronAttributes");
    this.querySelectorAll("[data-lecture-slide]").forEach((anchor) => {
      let header = this.querySelector(
        `#${anchor.getAttribute("data-associatedID")}`,
      );
      console.log(header);
      anchor.setAttribute("data-lecture-heading", header.textContent);
      anchor.setAttribute(
        "data-lecture-content",
        this.getNextSiblingHTML(header),
      );
      // Scrub the ids from the lecture-anchor elements in the content
      let contentElement = globalThis.document.createElement("div");
      contentElement.innerHTML = anchor.getAttribute("data-lecture-content");
      contentElement.querySelectorAll("[data-lecture-slide]").forEach((el) => {
        el.removeAttribute("id");
        el.classList.add("no-pointer-events");
      });
      anchor.setAttribute("data-lecture-content", contentElement.innerHTML);
    });
  }

  getNextSiblingHTML(element) {
    console.log(element);
    let siblingHTML = "";
    let nextSibling = element.nextSibling;
    console.log(nextSibling.nextSibling);
    let stopIDs = [];
    Object.keys(this.associatedNodes).forEach((key) => {
      console.log(key);
      stopIDs.push(key);
      stopIDs.push(
        this.querySelector(`#${key}`).getAttribute("data-associatedID"),
      );
    });
    stopIDs = stopIDs.filter(
      (item) =>
        item !== element.id &&
        item !==
          globalThis.document.querySelector(
            `[data-associatedID="${element.id}"]`,
          ).id,
    );
    console.log(stopIDs);
    while (nextSibling) {
      if (
        nextSibling &&
        nextSibling.nodeType === Node.ELEMENT_NODE &&
        nextSibling.id &&
        stopIDs.includes(nextSibling.id)
      ) {
        console.log("broke chain at " + nextSibling.id);
        break;
      }
      console.log(nextSibling);
      siblingHTML += nextSibling.outerHTML || "";
      nextSibling = nextSibling.nextSibling;
    }

    return siblingHTML;
  }

  addPrevNextListeners() {
    console.log("addPrevNextListeners");
    const prevSlideBtn = globalThis.document.querySelector("#prevSlideBtn");
    const nextSlideBtn = globalThis.document.querySelector("#nextSlideBtn");
    prevSlideBtn.addEventListener("click", () => {
      const prevSlide =
        this.activeIndex.split("-")[1] > 1
          ? this.activeIndex.split("-")[1] - 1
          : null;
      if (prevSlide) {
        this.activeIndex = "slide-" + prevSlide;
      }
    });
    nextSlideBtn.addEventListener("click", () => {
      const anchorsWithId = globalThis.document.querySelectorAll(
        "[data-lecture-slide][id]",
      ).length;
      console.log(anchorsWithId);
      console.log(this.activeIndex.split("-")[1]);
      console.log(parseInt(this.activeIndex.split("-")[1]) + 1);
      console.log(parseInt(this.activeIndex.split("-")[1]) + 1 < anchorsWithId);
      const nextSlide =
        this.activeIndex.split("-")[1] < anchorsWithId
          ? parseInt(this.activeIndex.split("-")[1]) + 1
          : null;
      if (nextSlide) {
        this.activeIndex = "slide-" + nextSlide;
      } else {
        this.endVideo();
      }
    });
  }

  updateJumbotron() {
    console.log("updateJumbotron");
    const jumbotron = globalThis.document.querySelector(".jumbotron");
    console.log(jumbotron);
    jumbotron ? (jumbotron.innerHTML = "") : "";
    console.log(this.activeIndex);
    const activeAnchor = globalThis.document.querySelector(
      `#${this.activeIndex}`,
    );
    console.log(activeAnchor);
    if (activeAnchor) {
      const jumbotronHeading = globalThis.document.createElement("h2");
      jumbotronHeading.id = "jumbotron-heading";
      jumbotronHeading.innerText = activeAnchor.getAttribute(
        "data-lecture-heading",
      );
      jumbotron.appendChild(jumbotronHeading);
      const jumbotronContent = globalThis.document.createElement("div");
      jumbotronContent.id = "jumbotron-desc";
      jumbotronContent.innerHTML = activeAnchor.getAttribute(
        "data-lecture-content",
      );
      jumbotron.appendChild(jumbotronContent);
    }
  }

  updatePlaylist() {
    console.log("updatePlaylist");
    const valueList = globalThis.document.querySelector(".valueList");
    if (!valueList) {
      console.error("ValueList element not found");
      return;
    }
    valueList.innerHTML = ""; // Clear previous buttons

    Object.keys(this.associatedNodes).forEach((key) => {
      console.log(key, this.associatedNodes[key]);
      const timestamp = this.associatedNodes[key];
      const slideAnchor = globalThis.document.querySelector(`#${key}`);
      const valueBtn = globalThis.document.createElement("button");
      valueBtn.classList.add("valueBtn");
      valueBtn.textContent = slideAnchor
        ? slideAnchor.getAttribute("data-lecture-heading")
        : "Missing Title";
      valueBtn.addEventListener("click", () => {
        this.activeIndex = key;
      });
      if (key === this.activeIndex) {
        valueBtn.classList.add("active");
      }
      valueList.appendChild(valueBtn);
    });

    // Auto-scroll to active button
    const activeBtn = valueList.querySelector(".active");
    if (activeBtn) {
      valueList.scrollTo({
        left: activeBtn.offsetLeft - 125,
        behavior: "smooth",
      });
    }
  }

  seek(timestamp) {
    console.log("seek to timestamp: ", timestamp);
    if (this.open) {
      setTimeout(() => {
        globalThis.document
          .querySelector("#lecture-player-video")
          .seek(timestamp);
        globalThis.document.querySelector("#lecture-player-video").play();
        console.log(timestamp);
      }, 3000);
    } else {
      console.log("seeking to video player");
      this.querySelector("video-player").play();
      this.querySelector("video-player").seek(timestamp);
    }
  }

  play() {
    globalThis.document.querySelector("video-player");
    if (document.querySelector("video-player")) {
      globalThis.document.querySelector("video-player").play();
    } else {
      this.querySelector("video-player").play();
    }
  }

  checkDisabledButtons() {
    console.log("checkDisabledButtons");
    const prevSlideBtn = globalThis.document.querySelector("#prevSlideBtn");
    const activeIndex = parseInt(this.activeIndex.split("-")[1]);
    if (activeIndex === 1) {
      prevSlideBtn.setAttribute("disabled", "true");
    } else {
      prevSlideBtn.removeAttribute("disabled");
    }
    if (
      activeIndex !==
      globalThis.document.querySelectorAll("[data-lecture-slide]").length
    ) {
      globalThis.document
        .querySelector("#nextSlideBtn")
        .removeAttribute("disabled");
    }
  }

  endVideo() {
    console.log("endVideo");
    globalThis.document.querySelector("#lecture-player-video").pause();
    globalThis.document
      .querySelector("#nextSlideBtn")
      .setAttribute("disabled", "true");
    let endBtnDiv = globalThis.document.createElement("div");
    endBtnDiv.setAttribute("data-primary", "11");
    endBtnDiv.innerHTML = `<simple-cta class="endBtn" data-pulse data-primary="11">Close Lecture Player</simple-cta>`;
    endBtnDiv.classList.add("endBtnContainer");
    globalThis.document.querySelector(".jumbotron").appendChild(endBtnDiv);
    globalThis.document
      .querySelector(".endBtn")
      .addEventListener("click", () => {
        globalThis.document.querySelector("simple-modal").close();
        this.open = false;
      });
    let jumbotron = globalThis.document.querySelector(".jumbotron");
    jumbotron.scrollTop = jumbotron.scrollHeight + 500;
  }

  showModal() {
    let videoSectionColumns = "1fr 1fr";
    console.log("showModal");
    let c = globalThis.document.createElement("div");
    c.classList.add("modal-content");
    c.innerHTML = `
    <style>
      simple-modal{
        --simple-modal-width: 95%;
        --simple-modal-height: 95%;
        font-family: var(--ddd-font-primary, sans-serif);
      }

      .modal-content{
        display: grid;
        grid-template-rows: 1.5fr auto;
        height: fit-content;
        gap: var(--ddd-spacing-6);
        padding: var(--ddd-spacing-4);
      }

      video-player{
        max-width: 100%;
        max-height: 100%;
      }

      .videoSection{
        display: grid;
        grid-template-columns: 1fr 1fr;
        max-width: 100%;
        height: 100%;
        gap: var(--ddd-spacing-4);
        height: 68vh;
      }

      .videoSection.small{
        grid-template-columns: .7fr 1.3fr;
      }

      .videoSection.large{
        grid-template-columns: 1.3fr .7fr;
        height: 100%;
        max-height: none;
      }

      .playlist{
        display: grid;
        grid-template-columns: .5fr 5fr .5fr;
        gap: var(--ddd-spacing-2);
        max-width: 100%;
        height: fit-content;
      }

      .overflow-ellipsis{
        max-width: 200px;
        display: inline-block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        word-wrap: break-word;
        word-break: break-word;
      }

      .valueList {
        display: flex; /* Use flexbox to layout items in a row */
        flex-wrap: nowrap; /* Prevent wrapping of items */
        border: var(--ddd-border-xs);
        border-color: var(--ddd-theme-default-coalyGray, black);
        background: #bab8b8;
        overflow-x: auto; /* Enable horizontal scrolling */
        overflow-y: hidden; /* Hide vertical overflow */
      }
      
      .valueBtn {
        flex-shrink: 0; /* Prevent buttons from shrinking */
        background: white;
        border: none;
        border-right: 1px solid black; /* Keep the border-right */
        cursor: pointer;
        font-size: 24px;
        padding: 16px; /* Add padding to space out the buttons */
        height: 75px;
        width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-family: var(--ddd-font-primary, sans-serif);
      }

      .valueBtn:not(:last-child){
        border-right: 1px solid black;
      }

      .jumbotron{
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: start;
        height: 100%;
        overflow-y: auto;
        overflow-x: show;
      }

      #jumbotron-heading{
        padding: 8px;
        width: calc(100% - 16px);
        margin: 8px 0;
      }

      #jumbotron-desc{
        padding: 8px;
        width: calc(100% - 32px);
      }

      .value-navigation-button{
        background: white;
        cursor: pointer;
        padding: 4px;
        height: fit-content;
        margin: auto;
      }
      
      .valueBtn.active{
        background: #dfedf5;
      }

      .endBtnContainer{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100%;
        margin: 64px auto;
      }

      .lecture-control.active, .lecture-control:focus, .lecture-control:hover, .lecture-control:active{
        color: var(--ddd-theme-default-beaverBlue, black);
      }

      .no-pointer-events{
        pointer-events: none;
      }
      .lecture-mode-controls {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: var(--ddd-spacing-3);
        padding: var(--ddd-spacing-2);
        top: var(--ddd-spacing-2);
        right: var(--ddd-spacing-20);
      }
      .lecture-mode-controls simple-icon-button-lite {
        cursor: pointer;
        --simple-icon-height: var(--ddd-icon-xs);
        --simple-icon-width: var(--ddd-icon-xs);
      }
      @media (max-width: 1200px) {
        .videoSection {
          display: flex;
          flex-direction: column;
        }
      }
    </style>
      <div class="videoSection normal">
          ${this.videoPlayer}
        <div class="jumbotron"></div>
        <div class="lecture-mode-controls">
        <simple-icon-button-lite class="lecture-control" id="lecture-size-small" icon="image:photo-size-select-large"></simple-icon-button-lite>
        <simple-icon-button-lite class="lecture-control" id="lecture-size-normal" icon="image:switch-video"></simple-icon-button-lite>
        <simple-icon-button-lite class="lecture-control" id="lecture-size-large" icon="image:photo-size-select-actual"></simple-icon-button-lite>
      </div>
      </div>
      <div class="playlist">
        <button class="value-navigation-button" id="prevSlideBtn"><simple-icon-lite icon="lrn:arrow-left"></simple-icon-lite></button>
        <div class="valueList">
        </div>
        <button class="value-navigation-button" id="nextSlideBtn"><simple-icon-lite icon="lrn:arrow-right"></simple-icon-lite></button>
      </div>
    `;
    this.querySelector("video-player").setAttribute("hidden", true);
    const evnt = new CustomEvent("simple-modal-show", {
      bubbles: true,
      cancelable: true,
      detail: {
        elements: { content: c },
      },
    });
    this.open = true;
    dispatchEvent(evnt);
    setTimeout(() => {
      document
        .querySelector("#lecture-size-large")
        .addEventListener("click", (e) => {
          globalThis.document
            .querySelectorAll(".lecture-control")
            .forEach((control) => {
              control.classList.remove("active");
            });
          e.target.classList.toggle("active");
          globalThis.document
            .querySelector(".videoSection")
            .classList.add("large");
          globalThis.document
            .querySelector(".videoSection")
            .classList.remove("small");
          globalThis.document
            .querySelector(".videoSection")
            .classList.remove("normal");
        });
      document
        .querySelector("#lecture-size-normal")
        .addEventListener("click", (e) => {
          globalThis.document
            .querySelectorAll(".lecture-control")
            .forEach((control) => {
              control.classList.remove("active");
            });
          e.target.classList.toggle("active");
          globalThis.document
            .querySelector(".videoSection")
            .classList.add("normal");
          globalThis.document
            .querySelector(".videoSection")
            .classList.remove("small");
          globalThis.document
            .querySelector(".videoSection")
            .classList.remove("large");
        });
      document
        .querySelector("#lecture-size-small")
        .addEventListener("click", (e) => {
          globalThis.document
            .querySelectorAll(".lecture-control")
            .forEach((control) => {
              control.classList.remove("active");
            });
          e.target.classList.toggle("active");
          globalThis.document
            .querySelector(".videoSection")
            .classList.add("small");
          globalThis.document
            .querySelector(".videoSection")
            .classList.remove("normal");
          globalThis.document
            .querySelector(".videoSection")
            .classList.remove("large");
        });
      document
        .querySelector("simple-modal .modal-content .videoSection video-player")
        .setAttribute("id", "lecture-player-video");
      globalThis.addEventListener("simple-modal-closed", () => {
        this.querySelector("video-player").removeAttribute("hidden");
        this.open = false;
      });
    }, 3000);
  }

  render() {
    return html`
      <simple-cta id="lectureActivation">Open Lecture Player</simple-cta>
      ${!this.open ? html`<slot></slot>` : html``}
    `;
  }
}

globalThis.customElements.define("lecture-player", LecturePlayer);
